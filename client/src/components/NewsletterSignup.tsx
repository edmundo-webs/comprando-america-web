import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Checkbox } from "./ui/checkbox";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<string[]>(["all"]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

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

    try {
      await subscribeMutation.mutateAsync({
        email,
        name: name || undefined,
        categories: categories.length === 0 ? ["all"] : categories,
      });
      setSubmitted(true);
      setEmail("");
      setName("");
      setCategories(["all"]);
    } catch (err: any) {
      setError(err.message || "Error al suscribirse");
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
          Verifica tu email para confirmar la suscripción y recibir noticias.
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

        <Button
          type="submit"
          className="w-full"
          disabled={subscribeMutation.isPending || !email}
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
