/*
 * Motor de Recomendación de Ruta — reglas por rama y guardarraíles de lenguaje.
 * Las tablas de esta suite son las de la especificación: si una regla cambia,
 * el test debe cambiar con ella a propósito, no por accidente.
 */
import { describe, it, expect } from "vitest";
import { recomendarRuta, ramaEfectiva, capaCCampos, type Recomendacion } from "./motorRuta";
import { type Objetivo, pasosDeRama, preguntaAplica } from "./diagnostico";

const ruta = (objetivo: Objetivo, respuestas: Record<string, string>): Recomendacion =>
  recomendarRuta({ objetivo, respuestas });

/** Todo el texto que puede llegar a la pantalla (Capas A y B). */
function textoVisible(rec: Recomendacion): string {
  return [
    rec.objetivoTexto, rec.perfil, rec.mensajeNivel, rec.parrafo, rec.hallazgo, rec.motivo,
    rec.cta.label, rec.ctaSecundario?.label ?? "",
    ...rec.rutaGeneral, ...rec.factores, ...rec.temasPendientes,
    ...rec.recursos.flatMap((r) => [r.q, r.a]),
  ].join(" ");
}

describe("rama Operar", () => {
  it("Texas + actividad definida + sin socios → Nivel 1", () => {
    const r = ruta("operar", { estado: "Texas", actividad: "si", socios: "no" });
    expect(r.routeLevel).toBe(1);
    expect(r.compraDirectaPosible).toBe(true);
    expect(r.cta.action).toBe("checkout");
  });

  it("Florida + actividad definida + con socios → Nivel 2", () => {
    const r = ruta("operar", { estado: "Florida", actividad: "si", socios: "si", sociosExtranjeros: "no" });
    expect(r.routeLevel).toBe(2);
    expect(r.hallazgo).toContain("porcentajes");
    expect(r.banderas.map((b) => b.id)).toContain("F4");
  });

  it("actividad sin definir → Nivel 3, sin importar el estado", () => {
    for (const estado of ["Texas", "Florida", "otro", "no-seguro"]) {
      const r = ruta("operar", { estado, actividad: "no" });
      expect(r.routeLevel).toBe(3);
      expect(r.varianteNivel3).toBe("definicion");
    }
  });

  it("estado fuera de alcance → Nivel 2 y no habilita compra directa", () => {
    const r = ruta("operar", { estado: "otro", actividad: "si", socios: "no" });
    expect(r.routeLevel).toBe(2);
    expect(r.compraDirectaPosible).toBe(false);
    expect(r.banderas.map((b) => b.id)).toContain("F2");
  });

  it("estado sin determinar → Nivel 2", () => {
    expect(ruta("operar", { estado: "no-seguro", actividad: "si", socios: "no" }).routeLevel).toBe(2);
  });
});

describe("rama Visa", () => {
  const casos: [Record<string, string>, number][] = [
    [{ capital: "mas", tipoVisa: "E-2", proyectoVisa: "si" }, 2],
    [{ capital: "mas", tipoVisa: "E-2", proyectoVisa: "parcial" }, 2],
    [{ capital: "mas", tipoVisa: "L-1", proyectoVisa: "si" }, 4],
    [{ capital: "menos", tipoVisa: "E-2", proyectoVisa: "si" }, 3],
    [{ capital: "no", tipoVisa: "L-1", proyectoVisa: "si" }, 3],
    [{ capital: "mas", tipoVisa: "no-seguro", proyectoVisa: "si" }, 3],
    [{ capital: "mas", tipoVisa: "E-2", proyectoVisa: "no" }, 3],
  ];

  it("aplica la tabla de capital / tipo de visa / proyecto", () => {
    for (const [respuestas, nivel] of casos) {
      expect(ruta("visa", respuestas).routeLevel, JSON.stringify(respuestas)).toBe(nivel);
    }
  });

  it("nunca llega a Nivel 1 (constituir no crea elegibilidad migratoria)", () => {
    for (const capital of ["mas", "menos", "no"]) {
      for (const tipoVisa of ["E-2", "L-1", "no-seguro"]) {
        for (const proyectoVisa of ["si", "parcial", "no"]) {
          expect(ruta("visa", { capital, tipoVisa, proyectoVisa }).routeLevel).not.toBe(1);
        }
      }
    }
  });

  it("sin proyecto → Nivel 3 con la ruta del Grupo Empresarial, no un mensaje de espera", () => {
    const r = ruta("visa", { capital: "mas", tipoVisa: "E-2", proyectoVisa: "no" });
    expect(r.varianteNivel3).toBe("grupo");
    expect(r.cta.label).toBe("Conocer el Grupo Empresarial");
    expect(r.cta.action).toBe("grupo");
    expect(r.hallazgo).toContain("Grupo Empresarial");
    expect(r.banderas.map((b) => b.id)).toContain("F12");
  });

  it("L-1 marca la empresa relacionada en el otro país", () => {
    expect(ruta("visa", { capital: "mas", tipoVisa: "L-1", proyectoVisa: "si" }).banderas.map((b) => b.id)).toContain("F7");
  });
});

describe("rama Invertir", () => {
  it("el capital por sí solo no decide: mismo monto, distintas rutas", () => {
    const sinProyecto = ruta("invertir", { capital: "mas", inversionDefinida: "no-se", participacion: "no-se" });
    const conProyecto = ruta("invertir", { capital: "mas", inversionDefinida: "especifico", participacion: "operar" });
    expect(sinProyecto.routeLevel).toBe(3);
    expect(conProyecto.routeLevel).toBe(1);
  });

  it("capital suficiente sin estrategia → Nivel 3 Ruta B", () => {
    for (const inversionDefinida of ["no-se", "poner-a-trabajar", "conocer-oportunidades"]) {
      const r = ruta("invertir", { capital: "mas", inversionDefinida, participacion: "no-se" });
      expect(r.routeLevel).toBe(3);
      expect(r.varianteNivel3).toBe("B");
      expect(r.ctaSecundario?.action).toBe("grupo");
    }
  });

  it("capital por debajo del rango sin estrategia → Nivel 3 Ruta A", () => {
    for (const capital of ["menos", "no"]) {
      const r = ruta("invertir", { capital, inversionDefinida: "no-se", participacion: "pasiva" });
      expect(r.routeLevel).toBe(3);
      expect(r.varianteNivel3).toBe("A");
      expect(r.cta.label).toBe("Preparar mi ruta");
    }
  });

  it("capital por debajo del rango CON proyecto y operación propia → Nivel 1, no un rechazo", () => {
    const r = ruta("invertir", { capital: "menos", inversionDefinida: "especifico", participacion: "operar" });
    expect(r.routeLevel).toBe(1);
  });

  it("inversión pasiva → Nivel 3 con foco en oportunidades curadas", () => {
    const r = ruta("invertir", { capital: "mas", inversionDefinida: "especifico", participacion: "pasiva" });
    expect(r.routeLevel).toBe(3);
    expect(r.varianteNivel3).toBe("grupo");
    expect(r.banderas.map((b) => b.id)).toContain("F14");
  });

  it("socio u operador de por medio → Nivel 2, y Nivel 4 si se acumulan banderas", () => {
    expect(ruta("invertir", { capital: "mas", inversionDefinida: "especifico", participacion: "socio-operador" }).routeLevel).toBe(2);
    const conVisa = recomendarRuta({
      objetivo: "invertir",
      respuestas: { capital: "mas", inversionDefinida: "especifico", participacion: "socio-operador", sociosExtranjeros: "si" },
    });
    expect(conVisa.routeLevel).toBe(4);
  });

  it("categoría definida + participación definida → Nivel 2", () => {
    expect(ruta("invertir", { capital: "mas", inversionDefinida: "categoria", participacion: "decisiones" }).routeLevel).toBe(2);
  });

  it("categoría definida pero participación sin definir → Nivel 3", () => {
    expect(ruta("invertir", { capital: "mas", inversionDefinida: "categoria", participacion: "no-se" }).routeLevel).toBe(3);
  });
});

describe("rama Explorando", () => {
  it("'quiero una empresa' hereda el diagnóstico de Operar", () => {
    const r = ruta("explorando", { rutaExplorando: "operar", estado: "Texas", actividad: "si", socios: "no" });
    expect(r.rama).toBe("operar");
    expect(r.routeLevel).toBe(1);
  });

  it("'poner capital a trabajar' hereda el diagnóstico de Invertir, con sus dos preguntas nuevas", () => {
    const pasos = pasosDeRama("explorando", { rutaExplorando: "invertir" }).map((p) => p.id);
    expect(pasos).toEqual(["rutaExplorando", "capital", "inversionDefinida", "participacion"]);
    expect(ramaEfectiva("explorando", { rutaExplorando: "invertir" })).toBe("invertir");
  });

  it("'sigo sin tenerlo claro' pregunta E1-E2-E3 antes del horizonte", () => {
    const pasos = pasosDeRama("explorando", { rutaExplorando: "no-seguro" }).map((p) => p.id);
    expect(pasos).toEqual(["rutaExplorando", "exploraMotivo", "exploraDuda", "exploraExpectativa"]);
  });

  it("Caso A: una intención clara reasigna a la rama correspondiente", () => {
    const respuestas = { rutaExplorando: "no-seguro", exploraMotivo: "visa", exploraDuda: "visa", exploraExpectativa: "visa" };
    expect(pasosDeRama("explorando", respuestas).map((p) => p.id)).toEqual([
      "rutaExplorando", "exploraMotivo", "exploraDuda", "exploraExpectativa", "capital", "tipoVisa", "proyectoVisa",
    ]);
    const r = ruta("explorando", { ...respuestas, capital: "mas", tipoVisa: "E-2", proyectoVisa: "no" });
    expect(r.rama).toBe("visa");
    expect(r.ramaReasignada).toBe("visa");
    expect(r.varianteNivel3).toBe("grupo");
  });

  it("Caso C: solo quiere la empresa preparada → Nivel 3", () => {
    const r = ruta("explorando", { rutaExplorando: "no-seguro", exploraMotivo: "recomendacion", exploraDuda: "necesito-llc", exploraExpectativa: "estructura-futuro" });
    expect(r.routeLevel).toBe(3);
  });

  it("Caso D: crédito o banco como beneficio automático → nunca Nivel 1, con recurso correctivo", () => {
    for (const exploraExpectativa of ["credito", "banco"]) {
      const r = ruta("explorando", { rutaExplorando: "no-seguro", exploraMotivo: "redes", exploraDuda: "credito-banca", exploraExpectativa });
      expect(r.routeLevel).toBeGreaterThan(1);
      expect(r.banderas.map((b) => b.id)).toContain("F15");
      expect(r.recursos.some((x) => x.q.includes("no resuelve"))).toBe(true);
    }
  });

  it("Caso E: sigue sin definirse → Nivel 3 genérico, sin más preguntas", () => {
    const respuestas = { rutaExplorando: "no-seguro", exploraMotivo: "redes", exploraDuda: "que-primero", exploraExpectativa: "no-se" };
    const r = ruta("explorando", respuestas);
    expect(r.routeLevel).toBe(3);
    expect(pasosDeRama("explorando", respuestas)).toHaveLength(4);
  });

  it("el camino exploratorio nunca llega a Nivel 1 sin reasignación", () => {
    for (const exploraExpectativa of ["operar", "estructura-futuro", "visa", "credito", "banco", "activos", "no-se"]) {
      const r = ruta("explorando", { rutaExplorando: "no-seguro", exploraMotivo: "redes", exploraDuda: "que-primero", exploraExpectativa });
      expect(r.routeLevel).not.toBe(1);
    }
  });
});

/* ─── Guardarraíles ───
   Ninguna pantalla puede sonar a veredicto sobre la persona, ni entregar la
   receta técnica, ni mostrar un porcentaje de viabilidad. */
describe("guardarraíles de lenguaje y de profundidad", () => {
  const escenarios: [Objetivo, Record<string, string>][] = [
    ["operar", { estado: "Texas", actividad: "si", socios: "no" }],
    ["operar", { estado: "otro", actividad: "no" }],
    ["operar", { estado: "Florida", actividad: "si", socios: "si", sociosExtranjeros: "si" }],
    ["visa", { capital: "mas", tipoVisa: "E-2", proyectoVisa: "si" }],
    ["visa", { capital: "mas", tipoVisa: "L-1", proyectoVisa: "si" }],
    ["visa", { capital: "menos", tipoVisa: "no-seguro", proyectoVisa: "no" }],
    ["invertir", { capital: "mas", inversionDefinida: "no-se", participacion: "no-se" }],
    ["invertir", { capital: "menos", inversionDefinida: "poner-a-trabajar", participacion: "pasiva" }],
    ["invertir", { capital: "mas", inversionDefinida: "especifico", participacion: "operar" }],
    ["explorando", { rutaExplorando: "no-seguro", exploraMotivo: "redes", exploraDuda: "que-primero", exploraExpectativa: "no-se" }],
    ["explorando", { rutaExplorando: "no-seguro", exploraMotivo: "historial", exploraDuda: "credito-banca", exploraExpectativa: "credito" }],
  ];

  it("nunca usa lenguaje de calificar, aprobar o rechazar", () => {
    for (const [objetivo, respuestas] of escenarios) {
      const texto = textoVisible(ruta(objetivo, respuestas)).toLowerCase();
      for (const prohibida of ["calific", "no aplicas", "aprobad", "rechaz", "descalific", "no eres apto"]) {
        expect(texto, `${objetivo} ${JSON.stringify(respuestas)} → "${prohibida}"`).not.toContain(prohibida);
      }
    }
  });

  it("nunca muestra un porcentaje de viabilidad", () => {
    for (const [objetivo, respuestas] of escenarios) {
      expect(textoVisible(ruta(objetivo, respuestas))).not.toMatch(/\d+\s?%/);
    }
  });

  it("nunca entrega la receta completa en pantalla", () => {
    for (const [objetivo, respuestas] of escenarios) {
      const texto = textoVisible(ruta(objetivo, respuestas)).toLowerCase();
      for (const receta of ["s-corp", "c-corp", "administrada por miembro", "60/40", "operating agreement con"]) {
        expect(texto, `${objetivo} → "${receta}"`).not.toContain(receta);
      }
    }
  });

  it("nunca expone las etiquetas internas de banderas al texto visible", () => {
    for (const [objetivo, respuestas] of escenarios) {
      const rec = ruta(objetivo, respuestas);
      for (const b of rec.banderas) expect(textoVisible(rec)).not.toContain(b.id);
    }
  });

  it("siempre entrega una ruta, un hallazgo y un CTA", () => {
    for (const [objetivo, respuestas] of escenarios) {
      const rec = ruta(objetivo, respuestas);
      expect([1, 2, 3, 4]).toContain(rec.routeLevel);
      expect(rec.hallazgo.length).toBeGreaterThan(0);
      expect(rec.parrafo.length).toBeGreaterThan(0);
      expect(rec.cta.label.length).toBeGreaterThan(0);
      expect(rec.rutaGeneral.length).toBeLessThanOrEqual(3);
      expect(rec.factores.length).toBeGreaterThan(0);
    }
  });

  it("la Capa C lleva nivel, banderas y guion al CRM, y solo incluye la retroalimentación cuando existe", () => {
    const rec = ruta("visa", { capital: "mas", tipoVisa: "L-1", proyectoVisa: "si" });
    const sinRetro = capaCCampos(rec).map((c) => c.label);
    expect(sinRetro).toContain("Nivel de ruta recomendada");
    expect(sinRetro).toContain("Banderas activadas");
    expect(sinRetro).toContain("Guion sugerido para la llamada");
    expect(sinRetro).toContain("Recomendación técnica del equipo");
    expect(sinRetro).not.toContain("¿La recomendación refleja su situación?");
    expect(capaCCampos(rec, "no").map((c) => c.label)).toContain("¿La recomendación refleja su situación?");
  });
});

describe("pasos por rama", () => {
  it("Invertir pregunta capital, inversión y participación", () => {
    expect(pasosDeRama("invertir").map((p) => p.id)).toEqual(["capital", "inversionDefinida", "participacion"]);
  });

  it("Visa pregunta capital, tipo de visa y proyecto", () => {
    expect(pasosDeRama("visa").map((p) => p.id)).toEqual(["capital", "tipoVisa", "proyectoVisa"]);
  });

  it("socios extranjeros solo se pregunta si declaró socios", () => {
    const pasos = pasosDeRama("operar");
    expect(pasos.filter((p) => preguntaAplica(p, { socios: "no" })).map((p) => p.id)).not.toContain("sociosExtranjeros");
    expect(pasos.filter((p) => preguntaAplica(p, { socios: "si" })).map((p) => p.id)).toContain("sociosExtranjeros");
  });
});
