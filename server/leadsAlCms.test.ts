/**
 * Tanda 1: todos los formularios llegan al CMS por un solo camino
 * (navegador → POST /api/leads → CMS con CMS_API_KEY) y nada se escribe en la
 * base de este sitio.
 *
 * Cada caso de FORMULARIOS reproduce lo que manda ese formulario (mismos
 * campos, mismo sourceSlug); la última prueba revisa en el código fuente que
 * cada formulario de verdad use postCrmLead con ese sourceSlug, para que el
 * caso no se quede desfasado del formulario.
 */
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import express from "express";
import type { AddressInfo } from "node:net";
import fs from "node:fs";
import path from "node:path";

process.env.CMS_API_URL = "https://cms.prueba";
process.env.CMS_API_KEY = "clave-de-prueba";
delete process.env.DATABASE_URL;

// Si algo intentara abrir la base de datos, la prueba lo detecta.
const createPool = vi.fn(() => {
  throw new Error("No se debe abrir la base de datos");
});
const createConnection = vi.fn(() => {
  throw new Error("No se debe abrir la base de datos");
});
vi.mock("mysql2/promise", () => ({ default: { createPool, createConnection }, createPool, createConnection }));

const realFetch = globalThis.fetch;
const cms = vi.fn();

let base = "";
let cerrar: () => void;
let leads: typeof import("./routes/leads");
let cmsLead: typeof import("./_core/cmsLead");

beforeAll(async () => {
  leads = await import("./routes/leads");
  cmsLead = await import("./_core/cmsLead");
  const { trackRouter } = await import("./routes/track");
  const app = express();
  app.use(express.json());
  app.use(leads.leadsRouter);
  app.use(trackRouter);
  const server = app.listen(0);
  await new Promise((r) => server.once("listening", r));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  cerrar = () => server.close();
});

afterAll(() => {
  cerrar?.();
  vi.unstubAllGlobals();
});

beforeEach(() => {
  cms.mockReset();
  cms.mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 201 }));
  vi.stubGlobal("fetch", cms);
});

async function enviarFormulario(cuerpo: Record<string, unknown>, ip = String(Math.random())) {
  return realFetch(`${base}/api/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(cuerpo),
  });
}

function llamadaAlCms() {
  expect(cms).toHaveBeenCalledTimes(1);
  const [url, init] = cms.mock.calls[0] as [string, RequestInit];
  return { url, headers: init.headers as Record<string, string>, cuerpo: JSON.parse(String(init.body)) };
}

const ORIGEN = "https://comprandoamerica.com/";
const utm = { utm_source: "facebook", utm_medium: "ads", utm_campaign: null, utm_content: null };

/** `archivoSlug`: dónde está escrito el sourceSlug, si no es el mismo archivo del formulario. */
const FORMULARIOS: Array<{ nombre: string; archivo: string; archivoSlug?: string; sourceSlug: string; cuerpo: Record<string, unknown> }> = [
  {
    nombre: "GPS Estratégico — contacto (/gps)",
    archivo: "client/src/pages/GpsPage.tsx",
    sourceSlug: "web_ca_gps",
    cuerpo: { name: "Ada Lovelace", email: "ada@example.com", phone: "+523346766178", sourceSlug: "web_ca_gps", hito: "diagnostico_parcial", stage: "partial", gpsFicha: null },
  },
  {
    nombre: "GPS Estratégico — ficha completa (/gps)",
    archivo: "client/src/pages/GpsPage.tsx",
    sourceSlug: "web_ca_gps",
    cuerpo: {
      name: "Ada Lovelace", email: "ada@example.com", phone: "+523346766178", sourceSlug: "web_ca_gps",
      hito: "diagnostico_completo", stage: "complete", tags: ["perfil:x"], quizSessionId: "quiz-1",
      gpsFicha: { rutaTitulo: "Ruta patrimonial", perfil: { objetivo: "Proteger" } },
    },
  },
  {
    nombre: "Registro a la Cumbre (/ y /cumbre-digital)",
    archivo: "client/src/hooks/useRegistroCumbre.ts",
    sourceSlug: "web_ca_cumbre",
    cuerpo: { name: "Ada Lovelace", email: "ada@example.com", phone: "+573001234567", sourceSlug: "web_ca_cumbre", hito: "registro_cumbre", stage: "partial", tags: ["fuente:home-cumbre"], eventoUrl: "/cumbre-digital" },
  },
  {
    nombre: "Diagnóstico de estructura — referido (LLC)",
    archivo: "client/src/components/EstructuraFlow.tsx",
    archivoSlug: "client/src/pages/EstructuraEmpresarial.tsx",
    sourceSlug: "web_ca_llc",
    cuerpo: {
      name: "Ada Lovelace", email: "ada@example.com", phone: "+17135550123", sourceSlug: "web_ca_llc",
      hito: "referido_estado_solicitado", stage: "complete", submissionId: "sub-1",
      formFields: [{ label: "Nombre", value: "Ada Lovelace" }, { label: "WhatsApp", value: "+17135550123" }, { label: "Estado elegido", value: "No cubierto" }],
    },
  },
  {
    nombre: "Diagnóstico de estructura — llamada (inversión)",
    archivo: "client/src/components/DiagnosticoEstructura.tsx",
    archivoSlug: "client/src/pages/EstructuraInversion.tsx",
    sourceSlug: "web_ca_inversion",
    cuerpo: {
      name: "Ada Lovelace", email: "ada@example.com", phone: "", sourceSlug: "web_ca_inversion",
      hito: "llamada_diagnostico_solicitada", stage: "complete", submissionId: "sub-2",
      formFields: [{ label: "Nombre", value: "Ada Lovelace" }, { label: "Correo", value: "ada@example.com" }],
    },
  },
  {
    nombre: "GPS de /tu-ruta",
    archivo: "client/src/pages/NuevoHome.tsx",
    sourceSlug: "web_ca_tu_ruta",
    cuerpo: { name: "Ada Lovelace", email: "ada@example.com", phone: "+523346766178", sourceSlug: "web_ca_tu_ruta", hito: "tu_ruta_contacto", stage: "partial", submissionId: "sub-3" },
  },
  {
    nombre: "Solicita más información (/formacion)",
    archivo: "client/src/components/ProspectForm.tsx",
    sourceSlug: "web_ca_formacion",
    cuerpo: {
      name: "Ada Lovelace", email: "ada@example.com", phone: "+34612345678", sourceSlug: "web_ca_formacion",
      hito: "formacion_informacion", stage: "partial",
      formFields: [{ label: "Nombre", value: "Ada Lovelace" }, { label: "Teléfono", value: "+34612345678" }, { label: "País", value: "España" }],
    },
  },
];

describe("cada formulario llega al CMS", () => {
  for (const f of FORMULARIOS) {
    it(f.nombre, async () => {
      const res = await enviarFormulario({ ...f.cuerpo, sourceUrl: ORIGEN, utm });
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ ok: true, entregado: true });

      const { url, headers, cuerpo } = llamadaAlCms();
      expect(url).toBe("https://cms.prueba/api/public/leads");
      expect(headers["x-api-key"]).toBe("clave-de-prueba");
      expect(cuerpo.name).toBe("Ada Lovelace");
      expect(cuerpo.email).toBe("ada@example.com");
      expect(cuerpo.sourceSlug).toBe(f.sourceSlug);
      expect(cuerpo.sourceUrl).toBe(ORIGEN);
      if (f.cuerpo.phone) expect(cuerpo.phone).toBe(f.cuerpo.phone);
      // Llega en E.164: no se marca como pendiente.
      const campos = (cuerpo.formFields ?? []) as Array<{ label: string; value: string }>;
      expect(campos.find((c) => c.label === leads.ETIQUETA_PAIS_PENDIENTE)).toBeUndefined();
      // UTM de la visita, como datos del formulario.
      expect(campos).toContainEqual({ label: "utm_source", value: "facebook" });
      // Solo viajan los campos que la API del CMS conoce.
      expect(cuerpo).not.toHaveProperty("hito");
      expect(cuerpo).not.toHaveProperty("tags");
      expect(cuerpo).not.toHaveProperty("utm");
    });
  }

  it("la ficha del GPS llega completa, para que el equipo la vea en la nota", async () => {
    await enviarFormulario({ ...FORMULARIOS[1].cuerpo, sourceUrl: ORIGEN });
    const { cuerpo } = llamadaAlCms();
    expect(cuerpo.stage).toBe("complete");
    expect(cuerpo.quizSessionId).toBe("quiz-1");
    expect(cuerpo.gpsFicha).toEqual({ rutaTitulo: "Ruta patrimonial", perfil: { objetivo: "Proteger" } });
  });

  it("ningún envío abre la base de datos de este sitio", () => {
    expect(createPool).not.toHaveBeenCalled();
    expect(createConnection).not.toHaveBeenCalled();
  });

  it("cada formulario del código usa postCrmLead con su sourceSlug", () => {
    const leer = (archivo: string) => fs.readFileSync(path.resolve(__dirname, "..", archivo), "utf8");
    for (const f of FORMULARIOS) {
      expect(leer(f.archivo), f.archivo).toContain("postCrmLead(");
      expect(leer(f.archivoSlug ?? f.archivo), f.archivoSlug ?? f.archivo).toContain(`"${f.sourceSlug}"`);
    }
  });
});

describe("teléfono sin código de país (CLAUDE.md §5)", () => {
  it("no se rechaza ni se completa: se manda como llegó y se marca pendiente", async () => {
    const res = await enviarFormulario({ name: "Ada", email: "ada@example.com", phone: "33 4676 6178", sourceSlug: "web_ca_cumbre" });
    expect(res.status).toBe(200);
    const { cuerpo } = llamadaAlCms();
    expect(cuerpo.phone).toBe("33 4676 6178");
    expect(cuerpo.formFields).toContainEqual({
      label: "Código de país del teléfono",
      value: "pendiente (llegó como: 33 4676 6178)",
    });
  });

  it("también revisa el WhatsApp que viene dentro de los datos del formulario", async () => {
    await enviarFormulario({ name: "Ada", sourceSlug: "web_ca_llc", formFields: [{ label: "WhatsApp", value: "5551234567" }] });
    const { cuerpo } = llamadaAlCms();
    expect(cuerpo.formFields).toContainEqual({ label: "Código de país del teléfono", value: "pendiente (llegó como: 5551234567)" });
  });

  it("un formulario sin email pero con teléfono se acepta: no se inventa un email", async () => {
    await enviarFormulario({ name: "Ada", phone: "+523346766178", sourceSlug: "web_ca_gps" });
    const { cuerpo } = llamadaAlCms();
    expect(cuerpo).not.toHaveProperty("email");
    expect(cuerpo.phone).toBe("+523346766178");
  });
});

describe("POST /api/leads — protecciones", () => {
  it("sin nombre o sin forma de contacto responde 400 y no llama al CMS", async () => {
    expect((await enviarFormulario({ email: "ada@example.com" })).status).toBe(400);
    expect((await enviarFormulario({ name: "Ada" })).status).toBe(400);
    expect(cms).not.toHaveBeenCalled();
  });

  it("el campo trampa se contesta como éxito sin enviar nada al CMS", async () => {
    const res = await enviarFormulario({ name: "Bot", email: "bot@example.com", website: "http://spam" });
    expect(await res.json()).toEqual({ ok: true, entregado: true });
    expect(cms).not.toHaveBeenCalled();
  });

  it("si el CMS no responde, al visitante se le confirma igual (el servidor reintenta)", async () => {
    cms.mockRejectedValueOnce(new Error("ECONNREFUSED"));
    const res = await enviarFormulario({ name: "Ada", email: "ada@example.com", sourceSlug: "web_ca_gps" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, entregado: false });
  });

  it("limita los envíos seguidos desde una misma IP", async () => {
    let ultimo = 0;
    for (let i = 0; i < 31; i++) ultimo = (await enviarFormulario({ name: "Ada", email: "ada@example.com" }, "10.0.0.9")).status;
    expect(ultimo).toBe(429);
  });
});

describe("enviarAlCms — reintentos y registro", () => {
  const cuerpo = { name: "Ada", email: "ada@example.com" };

  it("reintenta en segundo plano un error pasajero hasta entregar", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(new Response("caído", { status: 503 }))
      .mockResolvedValueOnce(new Response("{}", { status: 201 }));
    const tareas: Array<() => void> = [];
    const r = await cmsLead.enviarAlCms("/api/public/leads", cuerpo, { fetchImpl, programar: (fn) => tareas.push(fn), esperas: [1, 1] });
    expect(r.entregado).toBe(false);
    await tareas.shift()!();
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(tareas).toHaveLength(0);
  });

  it("si nunca entra, deja el envío completo en el registro del servidor", async () => {
    const errores: string[] = [];
    const spy = vi.spyOn(console, "error").mockImplementation((...a) => void errores.push(a.join(" ")));
    const fetchImpl = vi.fn().mockResolvedValue(new Response("caído", { status: 500 }));
    const tareas: Array<() => Promise<void> | void> = [];
    await cmsLead.enviarAlCms("/api/public/leads", cuerpo, { fetchImpl, programar: (fn) => tareas.push(fn), esperas: [1, 1] });
    while (tareas.length) await tareas.shift()!();
    spy.mockRestore();
    expect(fetchImpl).toHaveBeenCalledTimes(3);
    expect(errores.join("\n")).toContain("ENVIO FALLIDO");
    expect(errores.join("\n")).toContain("ada@example.com");
  });

  it("un 400 del CMS no se reintenta (daría el mismo error) y queda en el registro", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchImpl = vi.fn().mockResolvedValue(new Response("Payload inválido", { status: 400 }));
    const programar = vi.fn();
    const r = await cmsLead.enviarAlCms("/api/public/leads", cuerpo, { fetchImpl, programar });
    expect(r).toMatchObject({ entregado: false, status: 400, reintentable: false });
    expect(programar).not.toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("/api/track/diagnostic ya no guarda", () => {
  it("responde ok sin escribir", async () => {
    const res = await realFetch(`${base}/api/track/diagnostic`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile: "explorador", nombre: "Ada", email: "ada@example.com" }),
    });
    expect(await res.json()).toEqual({ ok: true, stored: false });
    expect(createPool).not.toHaveBeenCalled();
  });
});
