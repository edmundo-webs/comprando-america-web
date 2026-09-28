/**
 * Teléfonos — regla de CLAUDE.md §5: siempre con código de país.
 *
 * El país lo elige la persona en un selector separado del número; aquí nunca
 * se asume uno. El número se valida contra el país elegido y sale en E.164
 * (`+523346766178`), que es el único formato que se envía al CMS, se compara
 * para duplicados y se usa para armar ligas de WhatsApp.
 *
 * Lo usan el navegador (validar antes de enviar) y el servidor (volver a
 * validar lo que llega): la misma función en los dos lados, para que no
 * puedan discrepar.
 */
import {
  getCountries,
  getCountryCallingCode,
  isSupportedCountry,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js/max";

export type { CountryCode };

export const MENSAJE_SIN_PAIS = "Selecciona el código de tu país";

export type Telefono = { pais: string; numero: string };

export const TELEFONO_VACIO: Telefono = { pais: "", numero: "" };

export type ResultadoTelefono = { ok: true; e164: string } | { ok: false; error: string };

export interface Pais {
  codigo: CountryCode;
  nombre: string;
  prefijo: string;
  bandera: string;
}

function nombreDePais(codigo: string): string {
  try {
    return new Intl.DisplayNames(["es"], { type: "region" }).of(codigo) ?? codigo;
  } catch {
    return codigo;
  }
}

/** Bandera como emoji a partir del código ISO de dos letras. */
function banderaDe(codigo: string): string {
  return String.fromCodePoint(...codigo.toUpperCase().split("").map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

let _paises: Pais[] | null = null;

/** Todos los países que libphonenumber-js conoce, ordenados por nombre en español. */
export function listaDePaises(): Pais[] {
  if (_paises) return _paises;
  _paises = getCountries()
    .map((codigo) => ({
      codigo,
      nombre: nombreDePais(codigo),
      prefijo: `+${getCountryCallingCode(codigo)}`,
      bandera: banderaDe(codigo),
    }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  return _paises;
}

export function esPaisValido(pais: string): pais is CountryCode {
  return !!pais && isSupportedCountry(pais);
}

/**
 * Valida el número contra el país elegido y lo devuelve en E.164.
 * Sin país no hay número: no se intenta deducirlo.
 */
export function telefonoAE164(pais: string, numero: string): ResultadoTelefono {
  if (!esPaisValido(pais)) return { ok: false, error: MENSAJE_SIN_PAIS };
  const limpio = numero.trim();
  if (!limpio) return { ok: false, error: "Escribe tu número" };

  const parseado = parsePhoneNumberFromString(limpio, pais);
  const nombre = nombreDePais(pais);
  if (!parseado || !parseado.isValid()) {
    return { ok: false, error: `Revisa el número: no es válido para ${nombre}` };
  }
  // Si la persona escribió el número con "+", tiene que ser del país que eligió.
  // Se compara el código de marcación y no el país: +1 lo comparten Estados
  // Unidos, Canadá y otros.
  if (parseado.countryCallingCode !== getCountryCallingCode(pais)) {
    return { ok: false, error: `El número no corresponde al código de ${nombre}` };
  }
  return { ok: true, e164: parseado.number };
}

/** ¿Es ya un número válido en E.164? Es lo que el servidor exige para no marcarlo. */
export function esE164Valido(valor: string): boolean {
  if (!/^\+[1-9]\d{6,14}$/.test(valor)) return false;
  return parsePhoneNumberFromString(valor)?.isValid() ?? false;
}

/**
 * Para rellenar un formulario con un teléfono ya guardado. Si está en E.164 se
 * separa en país y número; si no, el número se deja tal cual y SIN país, para
 * que la persona lo elija (nunca se adivina).
 */
export function telefonoDesdeGuardado(valor: string | null | undefined): Telefono {
  const v = (valor ?? "").trim();
  if (!v) return TELEFONO_VACIO;
  if (esE164Valido(v)) {
    const p = parsePhoneNumberFromString(v);
    if (p?.country) return { pais: p.country, numero: p.formatNational() };
  }
  return { pais: "", numero: v };
}

/**
 * Para campos de teléfono opcionales: vacío es válido (sin teléfono); si hay
 * número, exige país y lo valida.
 */
export function telefonoOpcional(t: Telefono): { ok: true; e164: string } | { ok: false; error: string } {
  if (!t.numero.trim()) return { ok: true, e164: "" };
  return telefonoAE164(t.pais, t.numero);
}

/** wa.me recibe el número sin "+". */
export function digitosParaWhatsApp(e164: string): string {
  return e164.replace(/\D/g, "");
}
