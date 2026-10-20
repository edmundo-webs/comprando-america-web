import { useEffect, useRef } from "react";

// Cloudflare Turnstile: comprueba que quien envía un formulario es una persona
// (boletín y sala en vivo). La llave del sitio es pública
// (VITE_TURNSTILE_SITE_KEY); la secreta solo la usa el servidor
// (server/_core/turnstile.ts). Sin llave del sitio, no hay widget.
// Acceso seguro a import.meta.env: los hooks también pueden cargarse en el
// servidor (SSR), donde no existe (ver lib/cmsUrl.ts).
export const TURNSTILE_SITE_KEY = (import.meta as unknown as { env?: Record<string, string | undefined> }).env?.VITE_TURNSTILE_SITE_KEY ?? "";
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
export function useTurnstile(onToken: (token: string | null) => void) {
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
