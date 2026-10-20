/**
 * Boletín de /news contra el spam: campo trampa, Cloudflare Turnstile y la IP
 * del visitante para el límite por IP del CMS. Datos ficticios.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";

process.env.CMS_API_URL = "https://cms.prueba";
process.env.CMS_API_KEY = "clave-de-prueba";
delete process.env.DATABASE_URL;

const red = vi.fn();
beforeEach(() => {
  red.mockReset();
  red.mockImplementation(async (url: string) => {
    if (String(url).includes("challenges.cloudflare.com")) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }
    return new Response(JSON.stringify({ ok: true }), { status: 201 });
  });
  vi.stubGlobal("fetch", red);
  process.env.TURNSTILE_SECRET_KEY = "secreta-de-prueba";
});
afterEach(() => {
  delete process.env.TURNSTILE_SECRET_KEY;
});

const llamadasAlCms = () => red.mock.calls.filter(([url]) => String(url).startsWith("https://cms.prueba"));
const llamadasACloudflare = () => red.mock.calls.filter(([url]) => String(url).includes("challenges.cloudflare.com"));

async function suscribir(extra: Record<string, unknown>, headers: Record<string, string> = { "x-forwarded-for": "203.0.113.7, 10.0.0.1" }) {
  const { appRouter } = await import("./routers");
  const caller = appRouter.createCaller({ user: null, req: { headers } as any, res: {} as any });
  return caller.newsSubscriber.subscribe({ email: "ada@example.com", name: "Ada Prueba", categories: ["all"], ...extra } as any);
}

describe("campo trampa", () => {
  it("lleno: responde igual que un envío bueno y no llega al CMS ni a Cloudflare", async () => {
    const r = await suscribir({ website: "http://spam.example", turnstileToken: "token" });
    expect(r.success).toBe(true);
    expect(llamadasAlCms()).toHaveLength(0);
    expect(llamadasACloudflare()).toHaveLength(0);
  });

  it("el formulario lo tiene oculto, fuera de pantalla y sin tabulador", () => {
    const componente = fs.readFileSync(path.resolve(__dirname, "../client/src/components/NewsletterSignup.tsx"), "utf8");
    expect(componente).toMatch(/name="website"/);
    expect(componente).toMatch(/tabIndex=\{-1\}/);
    expect(componente).toMatch(/aria-hidden="true"/);
  });
});

describe("Cloudflare Turnstile", () => {
  it("verifica el token en el servidor con la llave secreta y la IP del visitante", async () => {
    await suscribir({ turnstileToken: "token-bueno" });
    const [url, init] = llamadasACloudflare()[0] as [string, RequestInit];
    expect(url).toBe("https://challenges.cloudflare.com/turnstile/v0/siteverify");
    const cuerpo = new URLSearchParams(String(init.body));
    expect(cuerpo.get("secret")).toBe("secreta-de-prueba");
    expect(cuerpo.get("response")).toBe("token-bueno");
    expect(cuerpo.get("remoteip")).toBe("203.0.113.7");
    expect(llamadasAlCms()).toHaveLength(1);
  });

  it("sin token o con un token rechazado: error para el visitante y nada al CMS", async () => {
    await expect(suscribir({})).rejects.toThrow("No pudimos verificar que eres una persona");
    red.mockImplementation(async (url: string) =>
      String(url).includes("challenges.cloudflare.com")
        ? new Response(JSON.stringify({ success: false, "error-codes": ["invalid-input-response"] }), { status: 200 })
        : new Response("{}", { status: 201 }));
    await expect(suscribir({ turnstileToken: "token-falso" })).rejects.toThrow("No pudimos verificar que eres una persona");
    expect(llamadasAlCms()).toHaveLength(0);
  });

  it("si Cloudflare no responde, no se deja pasar", async () => {
    red.mockImplementation(async (url: string) => {
      if (String(url).includes("challenges.cloudflare.com")) throw new Error("sin red");
      return new Response("{}", { status: 201 });
    });
    await expect(suscribir({ turnstileToken: "token" })).rejects.toThrow("No pudimos verificar");
    expect(llamadasAlCms()).toHaveLength(0);
  });

  it("mientras no haya llave secreta, no se verifica (para no tumbar el formulario antes de configurarla)", async () => {
    delete process.env.TURNSTILE_SECRET_KEY;
    await expect(suscribir({})).resolves.toMatchObject({ success: true });
    expect(llamadasACloudflare()).toHaveLength(0);
    expect(llamadasAlCms()).toHaveLength(1);
  });

  it("la llave secreta nunca va al navegador", () => {
    // El widget vive en un hook compartido (boletín y sala en vivo).
    const componente = fs.readFileSync(path.resolve(__dirname, "../client/src/components/NewsletterSignup.tsx"), "utf8");
    const hook = fs.readFileSync(path.resolve(__dirname, "../client/src/hooks/useTurnstile.ts"), "utf8");
    expect(componente + hook).not.toMatch(/TURNSTILE_SECRET_KEY/);
    expect(componente).toMatch(/useTurnstile/);
    expect(hook).toMatch(/VITE_TURNSTILE_SITE_KEY/);
  });
});

describe("IP del visitante para el límite del CMS", () => {
  it("el boletín manda clientIp (la primera de x-forwarded-for)", async () => {
    await suscribir({ turnstileToken: "token" });
    const [, init] = llamadasAlCms()[0] as [string, RequestInit];
    expect(JSON.parse(String(init.body)).clientIp).toBe("203.0.113.7");
  });

  it("los formularios de /api/leads también la mandan", async () => {
    const { leadsRouter } = await import("./routes/leads");
    const capa = (leadsRouter as any).stack.find((l: any) => l.route?.path === "/api/leads");
    const manejador = capa.route.stack[capa.route.stack.length - 1].handle;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    await manejador({ body: { name: "Ada Prueba", email: "ada@example.com", sourceSlug: "web_ca_cumbre" }, headers: { "x-forwarded-for": "198.51.100.4" } }, res);
    const alCms = llamadasAlCms();
    expect(alCms.length).toBe(1);
    expect(JSON.parse(String((alCms[0] as [string, RequestInit])[1].body)).clientIp).toBe("198.51.100.4");
  });
});
