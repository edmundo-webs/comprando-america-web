/**
 * Regla de CLAUDE.md §5: teléfonos siempre con código de país.
 */
import { describe, expect, it } from "vitest";
import {
  MENSAJE_SIN_PAIS,
  digitosParaWhatsApp,
  esE164Valido,
  listaDePaises,
  telefonoAE164,
  telefonoDesdeGuardado,
  telefonoOpcional,
} from "../shared/telefono";
import { WHATSAPP_E164, WHATSAPP_PHONE } from "../client/src/lib/whatsapp";

describe("telefonoAE164", () => {
  it("sin país no hay número: nunca se asume uno", () => {
    expect(telefonoAE164("", "33 4676 6178")).toEqual({ ok: false, error: MENSAJE_SIN_PAIS });
    expect(MENSAJE_SIN_PAIS).toBe("Selecciona el código de tu país");
  });

  it("valida contra el país elegido y devuelve E.164", () => {
    expect(telefonoAE164("MX", "33 4676 6178")).toEqual({ ok: true, e164: "+523346766178" });
    expect(telefonoAE164("US", "(713) 555-0123").ok).toBe(true);
    expect(telefonoAE164("CO", "300 123 4567")).toEqual({ ok: true, e164: "+573001234567" });
  });

  it("rechaza un número que no es válido para ese país", () => {
    const r = telefonoAE164("MX", "12345");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("México");
  });

  it("si la persona escribe +código, tiene que ser el del país elegido", () => {
    expect(telefonoAE164("CO", "+52 33 4676 6178").ok).toBe(false);
    expect(telefonoAE164("MX", "+52 33 4676 6178")).toEqual({ ok: true, e164: "+523346766178" });
  });

  it("el mismo número da resultados distintos según el país: el país lo decide la persona", () => {
    const mx = telefonoAE164("MX", "5512345678");
    const us = telefonoAE164("US", "5512345678");
    expect(mx.ok && mx.e164).toBe("+525512345678");
    expect(us.ok && us.e164).toBe("+15512345678");
  });
});

describe("telefonoOpcional", () => {
  it("vacío es válido y no manda teléfono", () => {
    expect(telefonoOpcional({ pais: "", numero: "" })).toEqual({ ok: true, e164: "" });
  });
  it("con número exige país", () => {
    expect(telefonoOpcional({ pais: "", numero: "3346766178" })).toEqual({ ok: false, error: MENSAJE_SIN_PAIS });
  });
});

describe("esE164Valido", () => {
  it("solo acepta + código de país + número válido", () => {
    expect(esE164Valido("+523346766178")).toBe(true);
    expect(esE164Valido("3346766178")).toBe(false);
    expect(esE164Valido("+52 3346766178")).toBe(false);
    expect(esE164Valido("+520000")).toBe(false);
  });
});

describe("telefonoDesdeGuardado", () => {
  it("separa un E.164 en país y número", () => {
    expect(telefonoDesdeGuardado("+523346766178")).toEqual({ pais: "MX", numero: "33 4676 6178" });
  });
  it("un número viejo sin código se deja sin país, para que la persona lo elija", () => {
    expect(telefonoDesdeGuardado("33 4676 6178")).toEqual({ pais: "", numero: "33 4676 6178" });
  });
});

describe("selector de países", () => {
  it("trae todos los países con nombre en español, bandera y código", () => {
    const paises = listaDePaises();
    expect(paises.length).toBeGreaterThan(200);
    const mx = paises.find((p) => p.codigo === "MX");
    expect(mx).toMatchObject({ nombre: "México", prefijo: "+52", bandera: "🇲🇽" });
  });
});

describe("número de WhatsApp del sitio", () => {
  it("vive en un solo lugar, en E.164, y wa.me recibe solo dígitos", () => {
    expect(WHATSAPP_E164).toBe("+523346766178");
    expect(esE164Valido(WHATSAPP_E164)).toBe(true);
    expect(WHATSAPP_PHONE).toBe("523346766178");
    expect(digitosParaWhatsApp(WHATSAPP_E164)).toBe(WHATSAPP_PHONE);
  });
});
