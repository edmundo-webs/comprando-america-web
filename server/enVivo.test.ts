/**
 * Sala en vivo (/en-vivo): el registro pasa por este servidor (Turnstile y la
 * llave del CMS) y el CMS devuelve la ficha. Ver server/routes/enVivo.ts y
 * server/_core/cmsSala.ts.
 */
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import express from "express";
import type { AddressInfo } from "node:net";
import fs from "node:fs";
import path from "node:path";

process.env.CMS_API_URL = "https://cms.prueba";
process.env.CMS_API_KEY = "clave-de-prueba";
process.env.TURNSTILE_SECRET_KEY = "secreto-de-prueba";

const realFetch = globalThis.fetch;
const red = vi.fn();
let base = "";
let cerrar: () => void;
let cmsSala: typeof import("./_core/cmsSala");
let cmsLead: typeof import("./_core/cmsLead");

beforeAll(async () => {
  const { enVivoRouter } = await import("./routes/enVivo");
  cmsSala = await import("./_core/cmsSala");
  cmsLead = await import("./_core/cmsLead");
  const app = express();
  app.use(express.json());
  app.use(enVivoRouter);
  const server = app.listen(0);
  await new Promise((r) => server.once("listening", r));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  cerrar = () => server.close();
});
afterAll(() => {
  cerrar?.();
  vi.unstubAllGlobals();
});

const turnstileOk = () => new Response(JSON.stringify({ success: true }), { status: 200 });
const fichaOk = () => new Response(JSON.stringify({ token: "ficha-ficticia", sala: { slug: "cumbre-ficticia" }, enRevision: false }), { status: 200 });
const ocupado = () => new Response(JSON.stringify({ error: "Estamos recibiendo muchos registros, intenta en unos segundos.", retryAfter: 5 }), { status: 503, headers: { "Retry-After": "0" } });

beforeEach(() => {
  red.mockReset();
  vi.stubGlobal("fetch", red);
});

const valido = {
  slug: "cumbre-ficticia",
  name: "Ana Prueba",
  email: "ana@ejemplo.com",
  whatsapp: "+525512345678",
  privacyAccepted: true,
  marketingOptIn: false,
  turnstileToken: "token-turnstile",
};

let ipSiguiente = 0;
async function registrar(cuerpo: Record<string, unknown>) {
  return realFetch(`${base}/api/en-vivo/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": `10.1.0.${++ipSiguiente}` },
    body: JSON.stringify(cuerpo),
  });
}

describe("POST /api/en-vivo/registro", () => {
  it("sin aceptar el aviso de privacidad no entra (y no se llama al CMS)", async () => {
    const res = await registrar({ ...valido, privacyAccepted: false });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("Para entrar, acepta el aviso de privacidad.");
    expect(red).not.toHaveBeenCalled();
  });

  it("el WhatsApp va en E.164", async () => {
    expect((await registrar({ ...valido, whatsapp: "5550001111" })).status).toBe(400);
    expect(red).not.toHaveBeenCalled();
  });

  it("sin Turnstile válido no se manda al CMS", async () => {
    red.mockResolvedValueOnce(new Response(JSON.stringify({ success: false, "error-codes": ["invalid-input-response"] }), { status: 200 }));
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const res = await registrar(valido);
    spy.mockRestore();
    expect(res.status).toBe(400);
    expect(red).toHaveBeenCalledTimes(1);
    expect(String(red.mock.calls[0][0])).toContain("challenges.cloudflare.com");
  });

  it("con todo en orden, manda al CMS con la llave y la IP del visitante y devuelve la ficha", async () => {
    red.mockResolvedValueOnce(turnstileOk()).mockResolvedValueOnce(fichaOk());
    const res = await realFetch(`${base}/api/en-vivo/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "200.1.2.3" },
      body: JSON.stringify({ ...valido, marketingOptIn: true }),
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, token: "ficha-ficticia", enRevision: false });
    const [url, init] = red.mock.calls[1] as [string, RequestInit];
    expect(url).toBe("https://cms.prueba/api/public/sala/cumbre-ficticia/registro");
    expect((init.headers as Record<string, string>)["x-api-key"]).toBe("clave-de-prueba");
    const cuerpo = JSON.parse(String(init.body));
    expect(cuerpo).toMatchObject({ name: "Ana Prueba", email: "ana@ejemplo.com", whatsapp: "+525512345678", privacyAccepted: true, marketingOptIn: true, clientIp: "200.1.2.3" });
    expect(cuerpo).not.toHaveProperty("turnstileToken");
  });

  it("CMS ocupado dos veces: 503 con el aviso para la persona", async () => {
    red.mockResolvedValueOnce(turnstileOk()).mockResolvedValueOnce(ocupado()).mockResolvedValueOnce(ocupado());
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await registrar(valido);
    spy.mockRestore();
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ ok: false, ocupado: true, error: cmsLead.MENSAJE_OCUPADO });
    expect(red).toHaveBeenCalledTimes(3);
  });

  it("la sala cerrada se le explica con el mensaje del CMS", async () => {
    red.mockResolvedValueOnce(turnstileOk()).mockResolvedValueOnce(new Response(JSON.stringify({ error: "El registro a esta sala todavía no está abierto." }), { status: 409 }));
    const res = await registrar(valido);
    expect(res.status).toBe(409);
    expect((await res.json()).error).toBe("El registro a esta sala todavía no está abierto.");
  });

  it("un error interno del CMS no se le muestra tal cual", async () => {
    red.mockResolvedValueOnce(turnstileOk()).mockResolvedValueOnce(new Response("stack trace interno", { status: 500 }));
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await registrar(valido);
    spy.mockRestore();
    expect(res.status).toBe(502);
    expect((await res.json()).error).toBe("No pudimos registrarte. Intenta de nuevo.");
  });

  it("un slug raro no llega al CMS", async () => {
    expect((await registrar({ ...valido, slug: "../admin" })).status).toBe(400);
    expect(red).not.toHaveBeenCalled();
  });
});

describe("POST /api/en-vivo/invitacion (liga personal del correo)", () => {
  const entrada = { slug: "cumbre-ficticia", invitacion: "ficha.de.la.invitacion", privacyAccepted: true, marketingOptIn: false };
  async function entrar(cuerpo: Record<string, unknown>) {
    return realFetch(`${base}/api/en-vivo/invitacion`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": `10.2.0.${++ipSiguiente}` },
      body: JSON.stringify(cuerpo),
    });
  }

  it("sin aceptar el aviso de privacidad no entra", async () => {
    const res = await entrar({ ...entrada, privacyAccepted: false });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("Para entrar, acepta el aviso de privacidad.");
    expect(red).not.toHaveBeenCalled();
  });

  it("va al CMS con la llave y la ficha de la invitación, sin Turnstile ni datos de la persona", async () => {
    red.mockResolvedValueOnce(fichaOk());
    const res = await entrar({ ...entrada, marketingOptIn: true });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, token: "ficha-ficticia", enRevision: false });
    expect(red).toHaveBeenCalledTimes(1);
    const [url, init] = red.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://cms.prueba/api/public/sala/cumbre-ficticia/invitacion");
    expect((init.headers as Record<string, string>)["x-api-key"]).toBe("clave-de-prueba");
    expect(JSON.parse(String(init.body))).toEqual({ invitacion: "ficha.de.la.invitacion", privacyAccepted: true, marketingOptIn: true });
  });

  it("una liga vencida se explica con el mensaje del CMS", async () => {
    red.mockResolvedValueOnce(new Response(JSON.stringify({ error: "Tu liga ya no es válida (el evento terminó o la liga está incompleta). Puedes registrarte aquí mismo." }), { status: 410 }));
    const res = await entrar(entrada);
    expect(res.status).toBe(410);
    expect((await res.json()).error).toMatch(/Tu liga ya no es válida/);
  });

  it("CMS ocupado dos veces: el mismo aviso", async () => {
    red.mockResolvedValueOnce(ocupado()).mockResolvedValueOnce(ocupado());
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await entrar(entrada);
    spy.mockRestore();
    expect(res.status).toBe(503);
    expect((await res.json()).error).toBe(cmsLead.MENSAJE_OCUPADO);
  });
});

describe("registrarEnSala", () => {
  it("ocupado una vez: espera lo que pide el CMS y entra al reintento", async () => {
    const fetchImpl = vi.fn().mockResolvedValueOnce(ocupado()).mockResolvedValueOnce(fichaOk());
    const esperar = vi.fn(async () => {});
    const r = await cmsSala.registrarEnSala("cumbre-ficticia", { name: "Ana" }, { fetchImpl, esperar });
    expect(r).toEqual({ ok: true, token: "ficha-ficticia", enRevision: false });
    expect(esperar).toHaveBeenCalledTimes(1);
  });

  it("registro en revisión (202): ficha de solo ver", async () => {
    const fetchImpl = vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({ token: "solo-ver", enRevision: true }), { status: 202 }));
    expect(await cmsSala.registrarEnSala("cumbre-ficticia", {}, { fetchImpl })).toEqual({ ok: true, token: "solo-ver", enRevision: true });
  });
});

describe("candados en el código", () => {
  const leer = (p: string) => fs.readFileSync(path.resolve(__dirname, "..", p), "utf8");

  it("el navegador nunca lleva la llave del CMS ni manda datos de la persona al CMS por su cuenta", () => {
    const lib = leer("client/src/lib/salaEnVivo.ts");
    expect(lib).not.toMatch(/x-api-key|CMS_API_KEY/i);
    expect(lib).toContain('fetch("/api/en-vivo/registro"');
    expect(lib).not.toMatch(/\/api\/public\/sala\/\$\{slug\}\/registro/);
  });

  it("el número de miembros nunca está en el sitio", () => {
    for (const dir of ["client/src", "server", "shared"]) {
      const archivos = fs.readdirSync(path.resolve(__dirname, "..", dir), { recursive: true }) as string[];
      for (const f of archivos.filter((a) => /\.(ts|tsx)$/.test(a) && !/\.test\.ts$/.test(a))) {
        expect(leer(path.join(dir, f)), f).not.toMatch(/3312715790|33\s?1271\s?5790/);
      }
    }
  });

  it("el WhatsApp comercial viene de VITE_WHATSAPP_COMERCIAL", () => {
    expect(leer("client/src/lib/whatsapp.ts")).toMatch(/VITE_WHATSAPP_COMERCIAL[\s\S]*export const WHATSAPP_E164 = numeroComercial\(\)/);
  });
});
