import { describe, expect, it } from "vitest";
import { alternarOpcion, avisoEncuesta, esLigaSegura, type EncuestaSala } from "./salaEnVivo";

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
});
