import { describe, expect, it } from "vitest";
import { build } from "esbuild";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

// El servidor pinta el home para los buscadores (routes/search-pages.tsx) y
// con eso carga código de client/src. En Node `import.meta.env` no existe: un
// módulo que lo lea al cargarse tumba el servidor al arrancar (pasó con #178).
// Aquí se empaquetan esos módulos como lo hace el build del servidor y se
// cargan en Node de verdad, sin Vite.

const RAIZ = path.resolve(__dirname, "..");

/** Empaqueta el módulo como el build del servidor y lo corre en un `node`
 *  aparte (Vitest sí define import.meta.env; Node no). Devuelve lo que
 *  imprime `codigo`, que recibe el módulo como `m`. */
async function correrEnNode(entrada: string, codigo: string, env: Record<string, string> = {}): Promise<string> {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "srv-"));
  const modulo = path.join(dir, "m.mjs");
  await build({
    entryPoints: [path.join(RAIZ, entrada)], bundle: true, platform: "node", format: "esm",
    packages: "external", outfile: modulo, logLevel: "silent",
    alias: { "@": path.join(RAIZ, "client/src") },
  });
  const script = path.join(dir, "correr.mjs");
  fs.writeFileSync(script, `const m = await import(${JSON.stringify(modulo)});\n${codigo}\n`);
  const limpio = { ...process.env, ...env };
  if (!("VITE_CRM_API_URL" in env)) delete limpio.VITE_CRM_API_URL;
  return execFileSync(process.execPath, [script], { env: limpio, encoding: "utf8" }).trim();
}

describe("código del cliente que también carga el servidor", () => {
  it("lib/eventos y lib/portafolio cargan en Node sin import.meta.env", async () => {
    expect(await correrEnNode("client/src/lib/eventos.ts", "console.log(typeof m.cargarEventos)")).toBe("function");
    expect(await correrEnNode("client/src/lib/portafolio.ts", "console.log('ok')")).toBe("ok");
  }, 30_000);

  it("la dirección del CMS: variable o la oficial por omisión", async () => {
    expect(await correrEnNode("client/src/lib/cmsUrl.ts", "console.log(m.cmsUrl())")).toBe("https://cms.comprandoamerica.com");
    expect(await correrEnNode("client/src/lib/cmsUrl.ts", "console.log(m.cmsUrl())", { VITE_CRM_API_URL: "https://cms.ejemplo.test/" }))
      .toBe("https://cms.ejemplo.test");
  }, 30_000);

  it("ningún archivo de client/src lee import.meta.env sin acceso seguro", () => {
    const malos: string[] = [];
    const recorrer = (dir: string) => {
      for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, f.name);
        if (f.isDirectory()) recorrer(p);
        else if (/\.(ts|tsx)$/.test(f.name) && !/\.test\.ts$/.test(f.name)) {
          const src = fs.readFileSync(p, "utf8");
          // `import.meta.env.X` truena en el servidor; se usa cmsUrl() (acceso seguro).
          if (/import\.meta\.env\./.test(src)) malos.push(path.relative(RAIZ, p));
        }
      }
    };
    recorrer(path.join(RAIZ, "client/src/lib"));
    recorrer(path.join(RAIZ, "client/src/hooks"));
    expect(malos).toEqual([]);
  });
});
