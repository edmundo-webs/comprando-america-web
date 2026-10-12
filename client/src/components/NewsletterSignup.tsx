import { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Checkbox } from "./ui/checkbox";

// Cloudflare Turnstile: comprueba que quien se suscribe es una persona. La
// llave del sitio es pública (VITE_TURNSTILE_SITE_KEY); la secreta solo la usa
// el servidor (server/_core/turnstile.ts). Sin llave del sitio, no hay widget.
const TURNSTILE_SITE_KEY = (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined) ?? "";
const TURNSTILE_SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TurnstileApi = {
  render: (el: HTMLElement, opciones: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id: string) => void;
};

function cargarTurnstile(): Promise<TurnstileApi> {
  const w = window as unknown as { turnstile?: TurnstileApi };
  if (w.turnstile) return Promise.resolve(w.turnstile);
  return new Promise((resolve, reject) => {
    let script = document.getElementById("cf-turnstile") as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = "cf-turnstile";
      script.src = TURNSTILE_SCRIPT;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", () => (w.turnstile ? resolve(w.turnstile) : reject(new Error("Turnstile no cargó"))));
    script.addEventListener("error", () => reject(new Error("Turnstile no cargó")));
  });
}

/** El widget de Turnstile; avisa el token cuando la verificación pasa. */
function useTurnstile(onToken: (token: string | null) => void) {
  const contenedor = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !contenedor.current) return;
    let vivo = true;
    cargarTurnstile()
      .then((t) => {
        if (!vivo || !contenedor.current || widget.current) return;
        widget.current = t.render(contenedor.current, {
          sitekey: TURNSTILE_SITE_KEY,
          language: "es",
          callback: (token: string) => onToken(token),
          "expired-callback": () => onToken(null),
          "error-callback": () => onToken(null),
        });
      })
      .catch(() => onToken(null));
    return () => {
      vivo = false;
      const t = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
      if (t && widget.current) t.remove(widget.current);
      widget.current = null;
    };
  }, [onToken]);

  /** Cada token sirve una sola vez: después de enviar se pide uno nuevo. */
  const reiniciar = () => {
    onToken(null);
    const t = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
    if (t && widget.current) t.reset(widget.current);
  };

  return { contenedor, reiniciar };
}

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<string[]>(["all"]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  // Campo trampa: oculto para las personas; un bot que lo llena no llega al CMS.
  const [website, setWebsite] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstile = useTurnstile(setTurnstileToken);

  const subscribeMutation = trpc.newsSubscriber.subscribe.useMutation();

  const categoryOptions = [
    { id: "all", label: "Todas las categorías" },
    { id: "visas-migracion", label: "Visas y Migraciones" },
    { id: "economia-finanzas", label: "Economía y Finanzas" },
    { id: "bienes-raices", label: "Bienes Raíces" },
    { id: "llc-negocios", label: "LLC y Negocios" },
    { id: "inversiones", label: "Inversiones" },
  ];

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === "all") {
      setCategories(["all"]);
    } else {
      const newCategories = categories.filter(c => c !== "all");
      if (newCategories.includes(categoryId)) {
        setCategories(newCategories.filter(c => c !== categoryId));
      } else {
        setCategories([...newCategories, categoryId]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setError("Espera a que termine la verificación de seguridad e intenta de nuevo.");
      return;
    }

    try {
      await subscribeMutation.mutateAsync({
        email,
        name: name || undefined,
        categories: categories.length === 0 ? ["all"] : categories,
        ...(website ? { website } : {}),
        ...(turnstileToken ? { turnstileToken } : {}),
      });
      setSubmitted(true);
      setEmail("");
      setName("");
      setCategories(["all"]);
    } catch (err: any) {
      setError(err.message || "Error al suscribirse");
    } finally {
      turnstile.reiniciar();
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          ¡Suscripción exitosa!
        </h3>
        <p className="text-green-700 mb-4">
          ¡Gracias! Tu correo quedó registrado para recibir las noticias de Comprando América.
        </p>
        <Button
          variant="outline"
          onClick={() => setSubmitted(false)}
          className="text-green-600 border-green-200 hover:bg-green-50"
        >
          Suscribir otro email
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-8 border border-primary/20">
      <h2 className="text-2xl font-serif font-bold mb-2">
        Recibe Noticias Exclusivas
      </h2>
      <p className="text-foreground/70 mb-6">
        Mantente actualizado con las últimas noticias sobre inversión en Estados Unidos
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3 flex gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <Input
            type="email"
            placeholder="Tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={subscribeMutation.isPending}
          />
          <Input
            type="text"
            placeholder="Tu nombre (opcional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={subscribeMutation.isPending}
          />
        </div>

        {/* Campo trampa (honeypot): fuera de la pantalla y sin tabulador; una persona no lo ve. */}
        <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
          <label>
            No llenes este campo
            <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </label>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground/70">
            Selecciona las categorías de tu interés:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {categoryOptions.map((option) => (
              <label
                key={option.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox
                  checked={categories.includes(option.id)}
                  onCheckedChange={() => handleCategoryChange(option.id)}
                  disabled={subscribeMutation.isPending}
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {TURNSTILE_SITE_KEY && <div ref={turnstile.contenedor} className="flex justify-center" data-turnstile="" />}

        <Button
          type="submit"
          className="w-full"
          disabled={subscribeMutation.isPending || !email || (!!TURNSTILE_SITE_KEY && !turnstileToken)}
        >
          {subscribeMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Suscribiendo...
            </>
          ) : (
            "Suscribirse a Noticias"
          )}
        </Button>

        <p className="text-xs text-foreground/50 text-center">
          Recibirás un email de confirmación. Puedes desuscriberte en cualquier momento.
        </p>
      </form>
    </div>
  );
}
