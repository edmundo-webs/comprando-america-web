import type { NextFunction, Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { urlDelCms } from "../_core/cmsLead";
import { escribirMeta, metaDeLaSala, origenDelSitio, type SalaParaMeta } from "../_core/salaMeta";

/**
 * Metadatos de /en-vivo/:slug escritos en el HTML antes de entregarlo, para
 * las vistas previas al compartir (Facebook, WhatsApp y Twitter no ejecutan
 * JavaScript). Igual para personas y robots, sin revisar el User-Agent.
 *
 * - Lee la sala del CMS (GET /api/public/sala/:slug, público): título, línea
 *   sobre el título, fase, resumen, flyer y si es de prueba. Espera 2 s como
 *   máximo; caché en memoria de 5 min (30 s si falló).
 * - Si el CMS no responde o la sala no existe, la página sale con los
 *   metadatos genéricos de hoy (solo con noindex) y responde normal.
 * - Solo /en-vivo/<clave>. Todas las demás rutas (y /en-vivo sin clave)
 *   pasan de largo, sin cambios.
 */

const RUTA = /^\/en-vivo\/([a-z0-9-]{1,220})\/?$/;
const ESPERA_MS = 2_000;
const CACHE_OK_MS = 5 * 60_000;
const CACHE_FALLA_MS = 30_000;
const CACHE_MAX = 500;

const cache = new Map<string, { sala: SalaParaMeta | null; vence: number }>();
let plantilla: { html: string; origen: string | null } | null = null;

/** El index.html compilado (el mismo que entrega hoy el servidor). */
function leerPlantilla(): { html: string; origen: string | null } | null {
  if (plantilla) return plantilla;
  // En Render, junto al bundle (dist/index.js → dist/public); en desarrollo y pruebas, dist/public del repo.
  const archivo = [
    path.join(path.dirname(fileURLToPath(import.meta.url)), "public/index.html"),
    path.join(process.cwd(), "dist/public/index.html"),
  ].find((f) => fs.existsSync(f));
  if (!archivo) return null;
  const html = fs.readFileSync(archivo, "utf8");
  plantilla = { html, origen: origenDelSitio(html) };
  return plantilla;
}

async function salaDelCms(slug: string, ahora = Date.now()): Promise<SalaParaMeta | null> {
  const guardada = cache.get(slug);
  if (guardada && guardada.vence > ahora) return guardada.sala;
  let sala: SalaParaMeta | null = null;
  let ok = false;
  try {
    const res = await fetch(`${urlDelCms()}/api/public/sala/${slug}`, { signal: AbortSignal.timeout(ESPERA_MS) });
    if (res.ok) {
      const cuerpo = (await res.json()) as { sala?: SalaParaMeta | null };
      if (cuerpo.sala && typeof cuerpo.sala.title === "string") sala = cuerpo.sala;
      ok = true;
    } else if (res.status === 404) {
      ok = true;
    }
  } catch (err: any) {
    console.warn(`[sala-meta] El CMS no respondió para ${slug}: ${String(err?.message ?? err)}`);
  }
  if (cache.size >= CACHE_MAX) cache.clear();
  cache.set(slug, { sala, vence: ahora + (ok && sala ? CACHE_OK_MS : CACHE_FALLA_MS) });
  return sala;
}

/** Solo para las pruebas. */
export function olvidarCacheSalaMeta(): void {
  cache.clear();
  plantilla = null;
}

export async function salaMetaMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  const m = RUTA.exec(req.path);
  if (!m) return next();
  try {
    const base = leerPlantilla();
    if (!base) return next();
    const sala = await salaDelCms(m[1]!);
    const meta = sala && base.origen ? metaDeLaSala(sala, base.origen) : null;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    // Igual que el index.html de hoy: el navegador lo revalida; los metadatos se guardan 5 min aquí.
    res.setHeader("Cache-Control", "public, max-age=0");
    res.send(escribirMeta(base.html, meta));
  } catch (err: any) {
    console.error("[sala-meta] error:", err?.message ?? err);
    next();
  }
}
