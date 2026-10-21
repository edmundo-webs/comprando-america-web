import { describe, expect, it } from "vitest";
import { SLUG_VALIDO, alternarOpcion, avisoEncuesta, esLigaSegura, salaPorSlug, type EncuestaSala,
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
    expect(avisoEncuesta(encuesta({ myVote: [0] }))).toMatch(/Gracias por votar/);
    expect(avisoEncuesta(encuesta({ open: false }))).toBe("La votación ya cerró.");
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
