/**
 * Metadatos de la sala en vivo para las vistas previas al compartir
 * (Facebook, WhatsApp, Twitter/X). Reglas sin red, probadas en
 * server/salaMeta.test.ts; el middleware está en server/routes/salaMeta.ts.
 *
 * Solo para /en-vivo/:slug. Se reemplazan en el HTML el título, la
 * descripción, og:*, twitter:*, el canonical, robots y hreflang; lo demás del
 * <head> (JSON-LD, og:site_name, og:locale…) queda igual que hoy.
 *
 * Las salas NO se indexan por ahora (publicadas, de prueba y borradores):
 * robots = noindex siempre, igual que lo pone la página en el navegador.
 */

/** Lo que el CMS manda de la sala (GET /api/public/sala/:slug). */
export interface SalaParaMeta {
  slug: string;
  title: string;
  kicker: string | null;
  fase?: string;
  resumen?: string | null;
  imagen?: string | null;
  prueba?: boolean;
}

export interface MetaSala {
  titulo: string;
  /** null = se queda la descripción genérica del sitio. */
  descripcion: string | null;
  /** null = se queda la imagen genérica del sitio. */
  imagen: { url: string; ancho?: number; alto?: number; alt: string } | null;
  url: string;
}

/** Largo máximo de la descripción (lo que muestran Google y las vistas previas). */
export const MAX_DESCRIPCION = 155;

/** Corta en palabra completa, con «…» si se cortó. */
export function recortar(texto: string, max = MAX_DESCRIPCION): string {
  const limpio = texto.replace(/\s+/g, " ").trim();
  if (limpio.length <= max) return limpio;
  const corte = limpio.slice(0, max - 1);
  const espacio = corte.lastIndexOf(" ");
  const base = (espacio > max * 0.5 ? corte.slice(0, espacio) : corte).replace(/[\s,;:.\-–—]+$/, "");
  return `${base}…`;
}

const enRepeticion = (s: SalaParaMeta) => s.fase === "repeticion";

/** «<línea> · <título>»; en repetición «Repetición · <línea>: <título>». */
export function tituloSala(s: SalaParaMeta): string {
  const linea = s.kicker?.trim();
  const titulo = s.title.trim();
  if (enRepeticion(s)) return linea ? `Repetición · ${linea}: ${titulo}` : `Repetición · ${titulo}`;
  return linea ? `${linea} · ${titulo}` : titulo;
}

/** El «Resumen» del evento (≤ 155, en palabra completa); en repetición, con «Mira la grabación completa.» antes. */
export function descripcionSala(s: SalaParaMeta): string | null {
  const resumen = s.resumen?.trim() || "";
  if (enRepeticion(s)) return recortar(resumen ? `Mira la grabación completa. ${resumen}` : "Mira la grabación completa.");
  return resumen ? recortar(resumen) : null;
}

/**
 * Transformación de Cloudinary para la vista previa: 1200×630 sin recortar
 * (c_pad: si el flyer no es horizontal, se rellena con su color dominante),
 * JPG con calidad automática ligera (pesa bastante menos de 300 KB).
 */
export const TRANSFORMACION_OG = "c_pad,w_1200,h_630,b_auto:predominant,f_jpg,q_auto:eco";
const CLOUDINARY = /^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//;
/** Un segmento de transformaciones de Cloudinary («c_fill,w_800», «e_sharpen»…). */
const SEGMENTO_TRANSFORMACION = /^[a-z]{1,3}_[^/]*$/;

/**
 * La imagen de la vista previa. Un flyer de Cloudinary se transforma (la
 * nuestra va al final de las que ya traiga, antes de la versión); uno de otro
 * lado va tal cual, sin medidas; sin flyer, null (la genérica).
 */
export function imagenSala(url: string | null | undefined, alt: string): MetaSala["imagen"] {
  if (!url) return null;
  try {
    if (new URL(url).protocol !== "https:") return null;
  } catch {
    return null;
  }
  const m = CLOUDINARY.exec(url);
  if (!m) return { url, alt };
  const resto = url.slice(m[0].length).split("/");
  let i = 0;
  while (i < resto.length - 1 && SEGMENTO_TRANSFORMACION.test(resto[i]!)) i++;
  resto.splice(i, 0, TRANSFORMACION_OG);
  return { url: m[0] + resto.join("/"), ancho: 1200, alto: 630, alt };
}

/** El origen del sitio, del canonical que ya trae el index.html (sin escribir el dominio en el código). */
export function origenDelSitio(html: string): string | null {
  const m = /<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i.exec(html)
    ?? /<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i.exec(html);
  if (!m) return null;
  try {
    return new URL(m[1]!).origin;
  } catch {
    return null;
  }
}

/** La URL limpia de la sala: sin UTM, sin ?i= ni nada más. */
export function urlDeLaSala(origen: string, slug: string): string {
  return `${origen.replace(/\/+$/, "")}/en-vivo/${slug}`;
}

export function metaDeLaSala(sala: SalaParaMeta, origen: string): MetaSala {
  const titulo = tituloSala(sala);
  return {
    titulo,
    descripcion: descripcionSala(sala),
    imagen: imagenSala(sala.imagen, titulo),
    url: urlDeLaSala(origen, sala.slug),
  };
}

function esc(v: string): string {
  return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** <meta name|property="clave" …>: se quita para poner el nuestro. */
function quitarMeta(html: string, claves: string[]): string {
  const lista = claves.map((c) => c.replace(/[.*+?^${}()|[\]\\:]/g, "\\$&")).join("|");
  return html.replace(new RegExp(`<meta\\b[^>]*(?:name|property)=["'](?:${lista})["'][^>]*>\\s*`, "gi"), "");
}

/** Marca de que el servidor ya escribió los metadatos de la sala (EnVivo.tsx no los sobrescribe). */
export const MARCA_META_SALA = "ca-sala-meta";

/** robots de la sala: no se indexa por ahora (publicadas, de prueba y borradores). */
export const ROBOTS_SALA = "noindex";

/**
 * Escribe en el HTML los metadatos de la sala. Con `meta` en null (el CMS no
 * respondió o la sala no existe) se quedan los genéricos de hoy; solo cambia
 * robots (noindex), como en el navegador.
 */
export function escribirMeta(html: string, meta: MetaSala | null): string {
  let out = quitarMeta(html, ["robots"]);
  let head = `<meta name="robots" content="${ROBOTS_SALA}" />`;
  if (meta) {
    const conImagen = meta.imagen !== null;
    out = out.replace(/<title>[\s\S]*?<\/title>\s*/i, "");
    out = quitarMeta(out, [
      "og:url", "og:title",
      ...(meta.descripcion ? ["description", "og:description", "twitter:description"] : []),
      ...(conImagen ? ["og:image", "og:image:width", "og:image:height", "og:image:alt", "twitter:image"] : []),
      "twitter:card", "twitter:url", "twitter:title",
    ]);
    out = out.replace(/<link\b[^>]*rel=["']canonical["'][^>]*>\s*/gi, "")
      .replace(/<link\b[^>]*hreflang=["'][^"']*["'][^>]*>\s*/gi, "");
    const t = esc(meta.titulo);
    const u = esc(meta.url);
    const partes = [
      `<meta name="${MARCA_META_SALA}" content="1" />`,
      `<title>${t}</title>`,
      `<link rel="canonical" href="${u}" />`,
      `<link rel="alternate" hreflang="es" href="${u}" />`,
      `<link rel="alternate" hreflang="x-default" href="${u}" />`,
      `<meta property="og:url" content="${u}" />`,
      `<meta property="og:title" content="${t}" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:url" content="${u}" />`,
      `<meta name="twitter:title" content="${t}" />`,
    ];
    if (meta.descripcion) {
      const d = esc(meta.descripcion);
      partes.push(`<meta name="description" content="${d}" />`, `<meta property="og:description" content="${d}" />`, `<meta name="twitter:description" content="${d}" />`);
    }
    if (meta.imagen) {
      const i = esc(meta.imagen.url);
      partes.push(`<meta property="og:image" content="${i}" />`, `<meta property="og:image:alt" content="${esc(meta.imagen.alt)}" />`, `<meta name="twitter:image" content="${i}" />`);
      if (meta.imagen.ancho && meta.imagen.alto) {
        partes.push(`<meta property="og:image:width" content="${meta.imagen.ancho}" />`, `<meta property="og:image:height" content="${meta.imagen.alto}" />`);
      }
    }
    head += partes.join("");
  }
  return out.replace("</head>", `${head}</head>`);
}
