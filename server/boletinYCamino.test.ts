/**
 * Tanda 1 — boletín de /news, un solo camino de envío y el script de
 * exportación.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";

process.env.CMS_API_URL = "https://cms.prueba";
process.env.CMS_API_KEY = "clave-de-prueba";
delete process.env.DATABASE_URL;

const dbFalsa = vi.hoisted(() => ({
  createNewsSubscriber: vi.fn(),
  getNewsSubscriber: vi.fn(),
}));
vi.mock("./db", async (importOriginal) => ({ ...(await importOriginal<typeof import("./db")>()), ...dbFalsa }));

const cms = vi.fn();
beforeEach(() => {
  cms.mockReset();
  cms.mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 201 }));
  vi.stubGlobal("fetch", cms);
  dbFalsa.createNewsSubscriber.mockReset();
  dbFalsa.getNewsSubscriber.mockReset();
});

async function suscribir(email: string) {
  const { appRouter } = await import("./routers");
  const caller = appRouter.createCaller({ user: null, req: { headers: {} } as any, res: {} as any });
  return caller.newsSubscriber.subscribe({ email, name: "Ada", categories: ["visas-migracion"] });
}

describe("boletín de /news", () => {
  it("va al CMS con el token y no escribe en ca_news_subscribers", async () => {
    const r = await suscribir("Ada@Example.com");

    expect(cms).toHaveBeenCalledTimes(1);
    const [url, init] = cms.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://cms.prueba/api/public/v1/leads");
    expect((init.headers as Record<string, string>)["x-api-key"]).toBe("clave-de-prueba");
    expect(JSON.parse(String(init.body))).toMatchObject({
      email: "ada@example.com",
      name: "Ada",
      interests: ["visas-migracion"],
      formSlug: "newsletter",
      consent: true,
    });
    expect(dbFalsa.createNewsSubscriber).not.toHaveBeenCalled();
    expect(dbFalsa.getNewsSubscriber).not.toHaveBeenCalled();
  });

  it("dice la verdad: no promete un correo de verificación que nadie envía", async () => {
    const r = await suscribir("ada@example.com");
    expect(r.message).toBe("¡Gracias! Tu correo quedó registrado para recibir las noticias de Comprando América.");
    const componente = fs.readFileSync(path.resolve(__dirname, "../client/src/components/NewsletterSignup.tsx"), "utf8");
    expect(componente).not.toMatch(/Verifica tu email/i);
    expect(componente).toContain("¡Gracias! Tu correo quedó registrado para recibir las noticias de Comprando América.");
  });

  it("suscribirse dos veces no es un error para el visitante (el CMS deduplica)", async () => {
    await suscribir("ada@example.com");
    await expect(suscribir("ada@example.com")).resolves.toMatchObject({ success: true });
  });
});

describe("leads.create (versión anterior del sitio)", () => {
  it("responde sin escribir en ca_leads", async () => {
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller({ user: null, req: { headers: {} } as any, res: {} as any });
    await expect(
      caller.leads.create({ nombreCompleto: "Ada Lovelace", whatsapp: "+52 3346766178", email: "ada@example.com", fuente: "x" }),
    ).resolves.toEqual({ success: true });
    expect(cms).not.toHaveBeenCalled();
  });
});

// ── Un solo camino ────────────────────────────────────────────────────────
function archivos(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === "node_modules" ? [] : archivos(p);
    return /\.(ts|tsx)$/.test(e.name) && !/\.test\.ts$/.test(e.name) ? [p] : [];
  });
}
const raiz = path.resolve(__dirname, "..");
const cliente = archivos(path.join(raiz, "client/src"));
const servidor = archivos(path.join(raiz, "server"));
const leer = (p: string) => fs.readFileSync(p, "utf8");
const rel = (p: string) => path.relative(raiz, p);

describe("un solo camino de los leads", () => {
  it("el navegador no llama a la API de leads del CMS", () => {
    const culpables = cliente.filter((p) => /api\/public\/(v1\/)?leads/.test(leer(p))).map(rel);
    expect(culpables).toEqual([]);
  });

  it("ningún formulario usa el envío viejo a ca_leads ni guarda el diagnóstico", () => {
    const culpables = cliente.filter((p) => /trpc\.leads\.create|sendDiagnostic\(/.test(leer(p))).map(rel);
    expect(culpables).toEqual([]);
  });

  it("no hay conexión directa a la base del CRM", () => {
    const culpables = servidor.filter((p) => /process\.env\.CRM_DATABASE_URL|crm_contacts/.test(leer(p))).map(rel);
    expect(culpables).toEqual([]);
  });

  it("el servidor ya no inserta en las tablas de negocio", () => {
    const culpables = servidor
      .filter((p) => /insert\((leads|diagnosticResponses|newsSubscribers)\)|INSERT INTO ca_leads/.test(leer(p)))
      .map(rel);
    // createNewsSubscriber sigue existiendo en db.ts para las pruebas viejas,
    // pero nadie la llama (lo cubre la prueba del boletín).
    expect(culpables.filter((p) => p !== "server/db.ts")).toEqual([]);
    expect(leer(path.join(raiz, "server/db.ts"))).not.toContain("INSERT INTO ca_leads");
  });

  it("el número de WhatsApp está escrito en un solo lugar", () => {
    const culpables = cliente
      .filter((p) => !p.endsWith(path.join("lib", "whatsapp.ts")))
      .filter((p) => /wa\.me\/\d|3346766178|17862784421|14696134741/.test(leer(p)))
      .map(rel);
    expect(culpables).toEqual([]);
  });

  it("ningún formulario trae un país de teléfono elegido de antemano", () => {
    const culpables = cliente.filter((p) => /countryCode:\s*["']\+/.test(leer(p))).map(rel);
    expect(culpables).toEqual([]);
  });
});

// ── Script de exportación ────────────────────────────────────────────────
describe("exportar-leads-a-cms", () => {
  it("une duplicados por email o por teléfono E.164, sin completar códigos", async () => {
    const { agruparContactos, cuerposParaCms, e164SiYaLoEs, normalizarEmail } = await import("../scripts/exportar-leads-a-cms.mjs");

    expect(e164SiYaLoEs("+52 33 4676 6178")).toBe("+523346766178");
    expect(e164SiYaLoEs("33 4676 6178")).toBe(""); // sin código: no se adivina
    expect(normalizarEmail(" Ada@Example.COM ")).toBe("ada@example.com");

    const r = (tabla: string, nombre: string, email: string, tel: string) => ({
      tabla, fuente: "", fecha: "2026-08-01T00:00:00.000Z", nombre,
      email: normalizarEmail(email), telefonoE164: e164SiYaLoEs(tel), telefonoCrudo: tel,
    });
    const grupos = agruparContactos([
      r("ca_leads", "Ada", "ada@example.com", "+52 3346766178"),
      r("ca_diagnostic_responses", "Ada L", "otro@example.com", "+523346766178"), // mismo teléfono
      r("ca_news_subscribers", "", "ADA@example.com", ""), // mismo email
      r("ca_leads", "Grace", "grace@example.com", "5512345678"), // sin código
      r("ca_leads", "Grace 2", "grace2@example.com", "5512345678"), // mismo número sin código: NO se une
    ]);
    expect(grupos).toHaveLength(3);

    const envios = grupos.flatMap(cuerposParaCms);
    const grace = envios.find((e: any) => e.cuerpo.email === "grace@example.com");
    expect(grace.cuerpo.phone).toBe("5512345678");
    expect(grace.cuerpo.formFields).toContainEqual({ label: "Código de país del teléfono", value: "pendiente (llegó como: 5512345678)" });

    const ada = envios.filter((e: any) => e.cuerpo.email === "ada@example.com");
    expect(ada.map((e: any) => e.ruta).sort()).toEqual(["/api/public/leads", "/api/public/v1/leads"]);
    expect(ada.find((e: any) => e.ruta === "/api/public/leads").cuerpo.phone).toBe("+523346766178");
  });

  it("por omisión no envía nada y el conteo es de solo lectura", () => {
    const exportar = leer(path.join(raiz, "scripts/exportar-leads-a-cms.mjs"));
    expect(exportar).toContain('args.includes("--enviar")');
    const contar = leer(path.join(raiz, "scripts/contar-registros.mjs"));
    expect(contar).toContain("READ ONLY");
    expect(contar).not.toMatch(/\b(INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE)\b/);
  });
});
