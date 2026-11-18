import { describe, expect, it } from "vitest";
import { SLUG_VALIDO, alternarOpcion, avisoFinal, fraseGrabacion, limpiarEvento, minutoLegible, mostrarCajaDePreguntas, avisoEncuesta, esLigaSegura, salaPorSlug, type EncuestaSala,
  pestanaActiva,
  pestanasVisibles,
  type PestanasSala,
} from "./salaEnVivo";

const encuesta = (cambios: Partial<EncuestaSala> = {}): EncuestaSala => ({
  id: 1, question: "¿Ficticia?", kind: "opcion_unica", options: ["Sí", "No"], open: true, results: null, myVote: null, ...cambios,
});

describe("sala en vivo: piezas del navegador", () => {
  it("opción única reemplaza; múltiple agrega y quita", () => {
    expect(alternarOpcion("opcion_unica", [0], 1)).toEqual([1]);
    expect(alternarOpcion("opcion_multiple", [2], 0)).toEqual([0, 2]);
    expect(alternarOpcion("opcion_multiple", [0, 2], 2)).toEqual([0]);
  });

  it("avisos de la encuesta", () => {
    expect(avisoEncuesta(encuesta())).toBeNull();
    expect(avisoEncuesta(encuesta({ myVote: [0] }))).toBe("Gracias, tu respuesta quedó registrada.");
    expect(avisoEncuesta(encuesta({ open: false }))).toBe("Esta pregunta ya cerró.");
    expect(avisoEncuesta(encuesta({ myVote: [0], results: { voters: 1, options: [] } }))).toBeNull();
  });

  it("los botones solo abren ligas https", () => {
    expect(esLigaSegura("https://wa.me/523346766178?text=Hola")).toBe(true);
    expect(esLigaSegura("javascript:alert(1)")).toBe(false);
    expect(esLigaSegura("http://inseguro.example")).toBe(false);
  });

  it("la liga directa solo acepta slugs del CMS (no pide nada con uno raro)", async () => {
    expect(SLUG_VALIDO.test("cumbre-de-prueba-a1b2c3d4")).toBe(true);
    expect(SLUG_VALIDO.test("../admin")).toBe(false);
    expect(await salaPorSlug("../admin")).toBeNull();
  });
});

describe("pestañas del panel", () => {
  const encuesta = { poll: { id: 1, question: "¿Ficticia?", kind: "opcion_unica" as const, options: ["Sí", "No"], open: true, results: null, myVote: null } };
  const tabs = (over: Partial<PestanasSala> = {}): PestanasSala => ({ first: "preguntas", encuesta, preguntas: { questions: [] }, comentarios: { paused: false }, ...over });

  it("muestra solo las encendidas, en orden", () => {
    expect(pestanasVisibles(tabs())).toEqual(["encuesta", "preguntas", "comentarios"]);
    expect(pestanasVisibles(tabs({ encuesta: null, comentarios: null }))).toEqual(["preguntas"]);
  });

  it("al entrar abre la destacada; luego respeta la que eligió la persona", () => {
    expect(pestanaActiva(tabs(), null, undefined)).toBe("preguntas");
    expect(pestanaActiva(tabs(), "comentarios", "preguntas")).toBe("comentarios");
  });

  it("si el equipo destaca otra, todos cambian a ella", () => {
    expect(pestanaActiva(tabs({ first: "encuesta" }), "comentarios", "preguntas")).toBe("encuesta");
  });

  it("si la pestaña de la persona se apaga, va a la destacada", () => {
    expect(pestanaActiva(tabs({ comentarios: null }), "comentarios", "preguntas")).toBe("preguntas");
    expect(pestanaActiva(tabs({ first: null, encuesta: null, preguntas: null, comentarios: null }), "encuesta", null)).toBe(null);
  });
});

describe("caja de preguntas", () => {
  it("sale solo si la consola la enciende; sin el dato (CMS anterior), como antes", () => {
    expect(mostrarCajaDePreguntas({ askBox: true })).toBe(true);
    expect(mostrarCajaDePreguntas({ askBox: false })).toBe(false);
    expect(mostrarCajaDePreguntas({})).toBe(true);
  });
});

describe("repetición", () => {
  it("«Mira la grabación completa…» sale de la línea sobre el título, nunca de un texto fijo", () => {
    expect(fraseGrabacion({ kicker: "2ª Cumbre Digital", title: "Casas, Negocios y Visas" })).toBe("Mira la grabación completa de la 2ª Cumbre Digital");
    expect(fraseGrabacion({ kicker: "3º Encuentro Ficticio", title: "X" })).toBe("Mira la grabación completa del 3º Encuentro Ficticio");
    expect(fraseGrabacion({ kicker: null, title: "Taller Ficticio" })).toBe("Mira la grabación completa de Taller Ficticio");
  });

  it("evento terminado: dos mensajes según si la repetición estuvo abierta", () => {
    expect(avisoFinal("terminado")?.titulo).toBe("Este evento ya terminó");
    expect(avisoFinal("grabacion_no_disponible")?.titulo).toBe("La grabación ya no está disponible");
    expect(avisoFinal("cerrada")).toBeNull();
    expect(avisoFinal(undefined)).toBeNull();
  });

  it("«Continuar donde te quedaste» en palabras", () => {
    expect(minutoLegible(1_380)).toBe("min 23");
    expect(minutoLegible(3_725)).toBe("1 h 02 min");
  });

  it("los eventos del reproductor van con números en rango", () => {
    expect(limpiarEvento({ kind: "avance", position: 12.345, duration: Number.NaN, watchedDelta: -3 })).toEqual({ kind: "avance", position: 12.3, watchedDelta: 0 });
    expect(limpiarEvento({ kind: "clic_whatsapp" })).toEqual({ kind: "clic_whatsapp" });
  });
});
