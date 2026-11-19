/**
 * Metadatos de /en-vivo/:slug para las vistas previas al compartir.
 * Ver server/_core/salaMeta.ts y server/routes/salaMeta.ts. Datos ficticios.
 */
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import express from "express";
import type { AddressInfo } from "node:net";
import fs from "node:fs";
import path from "node:path";
import {
  MAX_DESCRIPCION,
  TRANSFORMACION_OG,
  descripcionSala,
  escribirMeta,
  imagenSala,
  metaDeLaSala,
  origenDelSitio,
  recortar,
  tituloSala,
} from "./_core/salaMeta";

process.env.CMS_API_URL = "https://cms.prueba";

const realFetch = globalThis.fetch;
const red = vi.fn();
const INDEX = path.resolve(__dirname, "..", "dist", "public", "index.html");
const indexHtml = fs.readFileSync(INDEX, "utf8");
const ORIGEN = origenDelSitio(indexHtml)!;
const FLYER = "https://res.cloudinary.com/demo/image/upload/v1700000000/eventos/flyer-cumbre.png";
const RESUMEN = "Tres expertos te explican cómo comprar casas, abrir o adquirir un negocio y elegir la visa correcta para vivir e invertir en Estados Unidos, paso a paso y con casos reales de la comunidad.";

const sala = (cambios: Record<string, unknown> = {}) => ({
  slug: "casas-negocios-y-visas", title: "Casas, Negocios y Visas", kicker: "2ª Cumbre Digital", open: false,
  fase: "terminado", resumen: RESUMEN, imagen: FLYER, prueba: false, ...cambios,
});

let base = "";
let cerrar: () => void;
let olvidar: () => void;

beforeAll(async () => {
  const { salaMetaMiddleware, olvidarCacheSalaMeta } = await import("./routes/salaMeta");
  olvidar = olvidarCacheSalaMeta;
  const app = express();
  app.use(salaMetaMiddleware);
  // Igual que serveStatic: el resto de las rutas recibe el index.html tal cual.
  app.use("*", (_req, res) => res.sendFile(INDEX));
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
  red.mockReset();
  vi.stubGlobal("fetch", red);
  olvidar();
});

const cmsResponde = (s: unknown) => red.mockResolvedValue(new Response(JSON.stringify({ sala: s }), { status: 200 }));
const pedir = (ruta: string, ua = "Mozilla/5.0") => realFetch(`${base}${ruta}`, { headers: { "user-agent": ua } });
const metaDe = (html: string, clave: string) =>
  new RegExp(`<meta\\b[^>]*(?:name|property)="${clave.replace(/:/g, "\\:")}"[^>]*content="([^"]*)"`, "i").exec(html)?.[1] ?? null;
const cuenta = (html: string, re: RegExp) => (html.match(re) ?? []).length;

describe("reglas de los metadatos", () => {
  it("título: «<línea> · <título>»; en repetición «Repetición · <línea>: <título>»", () => {
    expect(tituloSala(sala())).toBe("2ª Cumbre Digital · Casas, Negocios y Visas");
    expect(tituloSala(sala({ fase: "repeticion" }))).toBe("Repetición · 2ª Cumbre Digital: Casas, Negocios y Visas");
    expect(tituloSala(sala({ kicker: null }))).toBe("Casas, Negocios y Visas");
  });

  it("descripción: el resumen en ≤ 155, cortado en palabra completa; en repetición con «Mira la grabación completa.»", () => {
    const d = descripcionSala(sala())!;
    expect(d.length).toBeLessThanOrEqual(MAX_DESCRIPCION);
    expect(d.endsWith("…")).toBe(true);
    expect(RESUMEN.startsWith(d.slice(0, -1))).toBe(true);
    expect(RESUMEN.charAt(d.length - 1)).toBe(" ");
    const r = descripcionSala(sala({ fase: "repeticion" }))!;
    expect(r.startsWith("Mira la grabación completa. Tres expertos")).toBe(true);
    expect(r.length).toBeLessThanOrEqual(MAX_DESCRIPCION);
    expect(descripcionSala(sala({ resumen: null }))).toBeNull();
    expect(descripcionSala(sala({ resumen: null, fase: "repeticion" }))).toBe("Mira la grabación completa.");
    expect(recortar("corto")).toBe("corto");
  });

  it("imagen: Cloudinary a 1200×630 sin recortar (relleno), JPG; otra liga tal cual; sin flyer, la genérica", () => {
    const i = imagenSala(FLYER, "alt")!;
    expect(i.url).toBe(`https://res.cloudinary.com/demo/image/upload/${TRANSFORMACION_OG}/v1700000000/eventos/flyer-cumbre.png`);
    expect(TRANSFORMACION_OG).toMatch(/c_pad/);
    expect(TRANSFORMACION_OG).toMatch(/w_1200,h_630/);
    expect(TRANSFORMACION_OG).toMatch(/f_jpg/);
    expect(TRANSFORMACION_OG).not.toMatch(/c_(fill|crop|thumb)/);
    expect([i.ancho, i.alto]).toEqual([1200, 630]);
    // Con transformaciones previas, la nuestra va al final de ellas.
    expect(imagenSala("https://res.cloudinary.com/demo/image/upload/e_sharpen/v1/a.jpg", "a")!.url)
      .toBe(`https://res.cloudinary.com/demo/image/upload/e_sharpen/${TRANSFORMACION_OG}/v1/a.jpg`);
    expect(imagenSala("https://ejemplo.test/flyer.jpg", "a")).toEqual({ url: "https://ejemplo.test/flyer.jpg", alt: "a" });
    expect(imagenSala(null, "a")).toBeNull();
    expect(imagenSala("http://ejemplo.test/a.jpg", "a")).toBeNull();
  });

  it("la URL limpia sale del dominio del canonical del index.html", () => {
    expect(metaDeLaSala(sala(), ORIGEN).url).toBe(`${ORIGEN}/en-vivo/casas-negocios-y-visas`);
  });

  it("escapa el HTML", () => {
    const html = escribirMeta(indexHtml, metaDeLaSala(sala({ title: 'A "B" <c>' }), ORIGEN));
    expect(html).toContain("A &quot;B&quot; &lt;c&gt;");
    expect(html).not.toContain('A "B" <c>');
  });
});

describe("GET /en-vivo/:slug (HTML sin JavaScript)", () => {
  it("trae título, resumen, imagen, canonical y noindex; JSON-LD y lo demás del head como hoy", async () => {
    cmsResponde(sala());
    const res = await pedir("/en-vivo/casas-negocios-y-visas?utm_source=whatsapp&utm_campaign=seguimiento");
    expect(res.status).toBe(200);
    const html = await res.text();
    const titulo = "2ª Cumbre Digital · Casas, Negocios y Visas";
    const url = `${ORIGEN}/en-vivo/casas-negocios-y-visas`;
    expect(html).toContain(`<title>${titulo}</title>`);
    expect(cuenta(html, /<title>/g)).toBe(1);
    for (const k of ["og:title", "twitter:title"]) expect(metaDe(html, k)).toBe(titulo);
    for (const k of ["description", "og:description", "twitter:description"]) expect(metaDe(html, k)).toBe(descripcionSala(sala()));
    for (const k of ["og:image", "twitter:image"]) expect(metaDe(html, k)).toContain(`/${TRANSFORMACION_OG}/`);
    expect(metaDe(html, "og:image:width")).toBe("1200");
    expect(metaDe(html, "og:image:height")).toBe("630");
    expect(metaDe(html, "og:image:alt")).toBe(titulo);
    expect(metaDe(html, "twitter:card")).toBe("summary_large_image");
    expect(metaDe(html, "og:url")).toBe(url);
    expect(html).toContain(`<link rel="canonical" href="${url}" />`);
    expect(cuenta(html, /rel="canonical"/g)).toBe(1);
    expect(html).not.toContain("utm_");
    expect(cuenta(html, /hreflang=/g)).toBe(2);
    expect(html).toContain(`hreflang="x-default" href="${url}"`);
    expect(metaDe(html, "robots")).toBe("noindex");
    expect(cuenta(html, /name="robots"/g)).toBe(1);
    // Lo demás se queda: JSON-LD, og:site_name, og:locale, la aplicación.
    expect(cuenta(html, /application\/ld\+json/g)).toBe(cuenta(indexHtml, /application\/ld\+json/g));
    expect(metaDe(html, "og:site_name")).toBe(metaDe(indexHtml, "og:site_name"));
    expect(html).toContain('<div id="root">');
    expect(red).toHaveBeenCalledWith("https://cms.prueba/api/public/sala/casas-negocios-y-visas", expect.anything());
  });

  it("igual para facebookexternalhit, WhatsApp y Twitterbot (sin revisar el User-Agent)", async () => {
    cmsResponde(sala());
    const htmls = await Promise.all([
      "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
      "WhatsApp/2.23.20.0 A",
      "Twitterbot/1.0",
      "Mozilla/5.0",
    ].map(async (ua) => (await pedir("/en-vivo/casas-negocios-y-visas", ua)).text()));
    expect(new Set(htmls).size).toBe(1);
    expect(red).toHaveBeenCalledTimes(1); // caché en memoria
  });

  it("en repetición: «Repetición · …» y «Mira la grabación completa.»", async () => {
    cmsResponde(sala({ fase: "repeticion" }));
    const html = await (await pedir("/en-vivo/casas-negocios-y-visas")).text();
    expect(metaDe(html, "og:title")).toBe("Repetición · 2ª Cumbre Digital: Casas, Negocios y Visas");
    expect(metaDe(html, "og:description")!.startsWith("Mira la grabación completa.")).toBe(true);
  });

  it("sala de prueba: también noindex", async () => {
    cmsResponde(sala({ slug: "prueba-abc123", prueba: true }));
    const html = await (await pedir("/en-vivo/prueba-abc123")).text();
    expect(metaDe(html, "robots")).toBe("noindex");
  });

  it("sin flyer ni resumen: se quedan la imagen y la descripción genéricas", async () => {
    cmsResponde(sala({ imagen: null, resumen: null }));
    const html = await (await pedir("/en-vivo/casas-negocios-y-visas")).text();
    expect(metaDe(html, "og:image")).toBe(metaDe(indexHtml, "og:image"));
    expect(metaDe(html, "description")).toBe(metaDe(indexHtml, "description"));
    expect(cuenta(html, /property="og:image"/g)).toBe(1);
  });

  it("con el CMS caído: responde 200 con los genéricos de hoy (solo noindex)", async () => {
    red.mockRejectedValue(new Error("ECONNREFUSED"));
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const res = await pedir("/en-vivo/casas-negocios-y-visas");
    spy.mockRestore();
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain(/<title>[\s\S]*?<\/title>/.exec(indexHtml)![0]);
    expect(metaDe(html, "og:image")).toBe(metaDe(indexHtml, "og:image"));
    expect(html).not.toContain("ca-sala-meta");
    expect(metaDe(html, "robots")).toBe("noindex");
  });

  it("sala que no existe: genéricos, 200 (la página dice «Esta sala no existe»)", async () => {
    red.mockResolvedValue(new Response(JSON.stringify({ error: "Esta sala no existe." }), { status: 404 }));
    const res = await pedir("/en-vivo/no-existe");
    expect(res.status).toBe(200);
    expect(await res.text()).not.toContain("ca-sala-meta");
  });
});

describe("las demás rutas, exactamente como hoy", () => {
  it.each(["/", "/eventos", "/cumbre-digital", "/investment-week", "/en-vivo", "/en-vivo/a/b", "/news/algo"])("%s", async (ruta) => {
    const html = await (await pedir(ruta, "facebookexternalhit/1.1")).text();
    expect(html).toBe(indexHtml);
    expect(red).not.toHaveBeenCalled();
  });
});

describe("EnVivo.tsx no sobrescribe los metadatos del servidor", () => {
  it("SEOHead solo sin la marca del servidor; el noindex se conserva", () => {
    const src = fs.readFileSync(path.resolve(__dirname, "..", "client/src/pages/EnVivo.tsx"), "utf8");
    expect(src).toMatch(/\{!metaDelServidor && \(\s*<SEOHead/);
    expect(src).toContain('meta[name="ca-sala-meta"]');
    expect(src).toMatch(/meta\.content = "noindex"/);
  });
});
