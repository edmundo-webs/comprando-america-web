/*
 * Diagnóstico de estructura — reglas de resultado y guardarraíles de lenguaje.
 * Las tablas de esta suite son las de la especificación: si una regla cambia,
 * el test debe cambiar con ella a propósito, no por accidente.
 */
import { describe, it, expect } from "vitest";
import {
  type RazonId, type Respuestas, type Resultado,
  ALCANCE, BLOQUE_ESTADOS_MENCIONADOS, DERIVACION, PREGUNTAS, RESULTADO_A, RESULTADO_B, RESULTADO_C,
  alternarDecision, bloqueDe, camposDiagnostico, evaluarDiagnostico,
  mencionaEstadoDeRedes, parrafoSituacion, pasosDe,
} from "./diagnosticoEstructura";
import { REGISTRO_FUERA_DEL_ESTADO } from "./estados";

/** Caso base que cae limpio en el resultado A. */
const rutaClara: Respuestas = {
  objetivo: "operar",
  tipoOperacion: "servicios",
  etapa: "facturando",
  lugar: "texas",
  decision: ["solo-yo"],
  documentos: "ssn",
};

const resultado = (r: Respuestas) => evaluarDiagnostico(r).resultado;

/* ─── Tabla de resultados de la especificación, entera y en un solo lugar ───
   Una fila por disparador (§3.1 C · §3.2 B1-B5 · §3.3 A). Si la lógica cambia,
   aquí se ve cuál disparador dejó de estar cubierto. */
const TABLA: { id: RazonId | "A" | "C"; caso: string; r: Respuestas; espera: Resultado }[] = [
  { id: "C", caso: "investigando + explorando", espera: "C",
    r: { objetivo: "explorando", etapa: "investigando", lugar: "texas", decision: ["solo-yo"] } },
  { id: "C", caso: "investigando + sin definir dónde", espera: "C",
    r: { objetivo: "operar", tipoOperacion: "servicios", etapa: "investigando", lugar: "sin-definir", decision: ["solo-yo"] } },
  { id: "B1", caso: "socios en la decisión", espera: "B", r: { ...rutaClara, decision: ["socios"] } },
  { id: "B1", caso: "inversionistas externos", espera: "B", r: { ...rutaClara, decision: ["inversionistas"] } },
  { id: "B2", caso: "invertir con tipo distinto de renta", espera: "B",
    r: { objetivo: "invertir", tipoInversion: "resguardo", etapa: "facturando", lugar: "florida", decision: ["solo-yo"], documentos: "ssn" } },
  { id: "B3", caso: "objetivo visa", espera: "B",
    r: { objetivo: "visa", acompanamiento: "con-abogado", etapa: "facturando", lugar: "texas", decision: ["solo-yo"] } },
  { id: "B4", caso: "otro estado de EE.UU.", espera: "B", r: { ...rutaClara, lugar: "otro-estado", estadoLibre: "Nevada" } },
  { id: "B4", caso: "aún no define dónde", espera: "B", r: { ...rutaClara, lugar: "sin-definir" } },
  { id: "B4", caso: "solo digital", espera: "B", r: { ...rutaClara, lugar: "solo-digital" } },
  { id: "B5", caso: "capital sin operación", espera: "B", r: { ...rutaClara, etapa: "capital-sin-operacion" } },
  { id: "A", caso: "operar + facturando + Texas + solo yo", espera: "A", r: rutaClara },
];

describe("tabla de resultados de la especificación", () => {
  for (const { id, caso, r, espera } of TABLA) {
    it(`${id} · ${caso} → resultado ${espera}`, () => {
      const d = evaluarDiagnostico(r);
      expect(d.resultado).toBe(espera);
      if (id !== "A" && id !== "C") {
        expect(d.disparadores).toContain(id);
        expect(d.razones.map((x) => x.id)).toContain(id);
      }
      if (id === "A" || id === "C") expect(d.disparadores).toEqual(id === "A" ? [] : d.disparadores);
    });
  }

  it("los siete disparadores del spec están cubiertos por la tabla", () => {
    expect(new Set(TABLA.map((f) => f.id))).toEqual(new Set(["A", "B1", "B2", "B3", "B4", "B5", "C"]));
    /* B4 se dispara con tres respuestas distintas de P4: las tres van en la tabla. */
    expect(TABLA.filter((f) => f.id === "B4").map((f) => f.r.lugar).sort()).toEqual(["otro-estado", "sin-definir", "solo-digital"]);
  });
});

describe("estructura de preguntas", () => {
  it("ninguna pregunta ofrece como opción el estado donde se compra el servicio", () => {
    /* P4 pregunta dónde ocurre la operación —un hecho de la vida de la persona—
       y es la única que nombra estados. Ninguna pregunta ofrece elegir dónde
       constituir: esa decisión no se toma en el diagnóstico. */
    for (const p of PREGUNTAS) {
      if (p.id === "lugar") continue;
      const texto = [p.q, p.subtexto ?? "", ...p.options.flatMap((o) => [o.label, o.desc ?? ""])].join(" ");
      expect(texto).not.toMatch(/Texas|Florida/);
    }
    expect(PREGUNTAS.find((p) => p.id === "lugar")!.q).toBe("¿Dónde va a ocurrir la operación?");
  });

  it("cada rama tiene su propio largo — ninguna usa todas las preguntas", () => {
    const largo = (r: Respuestas) => pasosDe(r).length;
    expect(largo({ objetivo: "operar" })).toBe(6);
    expect(largo({ objetivo: "invertir" })).toBe(6);
    expect(largo({ objetivo: "visa" })).toBe(5);
    expect(largo({ objetivo: "explorando" })).toBe(4);
    for (const objetivo of ["operar", "invertir", "visa", "explorando"] as const) {
      expect(largo({ objetivo })).toBeLessThan(PREGUNTAS.length);
    }
  });

  it("la rama explorando salta el tipo de operación y los documentos fiscales", () => {
    expect(pasosDe({ objetivo: "explorando" }).map((p) => p.id)).toEqual([
      "objetivo", "etapa", "lugar", "decision",
    ]);
  });

  it("la rama visa no pregunta documentos fiscales", () => {
    expect(pasosDe({ objetivo: "visa" }).map((p) => p.id)).not.toContain("documentos");
  });

  it("no se pregunta residencia fiscal en ninguna rama", () => {
    const texto = PREGUNTAS.map((p) => `${p.q} ${p.subtexto ?? ""}`).join(" ").toLowerCase();
    expect(texto).not.toContain("residencia fiscal");
  });

  it("solo-yo es mutuamente excluyente con el resto", () => {
    expect(alternarDecision(["socios", "conyuge"], "solo-yo")).toEqual(["solo-yo"]);
    expect(alternarDecision(["solo-yo"], "socios")).toEqual(["socios"]);
    expect(alternarDecision(["socios"], "inversionistas")).toEqual(["socios", "inversionistas"]);
    expect(alternarDecision(["socios"], "socios")).toEqual([]);
  });
});

describe("bloques inline", () => {
  it("Wyoming, Delaware y Nevada se detectan sin acentos y sin importar mayúsculas", () => {
    for (const v of ["Wyoming", "  WYOMING ", "delaware", "Nevada", "wyoming (por privacidad)"]) {
      expect(mencionaEstadoDeRedes(v)).toBe(true);
    }
    for (const v of ["", "California", "Nueva York", undefined]) {
      expect(mencionaEstadoDeRedes(v)).toBe(false);
    }
  });

  it("el bloque de Wyoming aparece con el estado capturado, no con otro estado cualquiera", () => {
    expect(bloqueDe("lugar", { lugar: "otro-estado", estadoLibre: "Wyoming" })?.titulo).toContain("Wyoming");
    expect(bloqueDe("lugar", { lugar: "otro-estado", estadoLibre: "California" })).toBeNull();
  });

  it("el bloque del modal no tiene su propia copia del argumento de estado", () => {
    /* Una sola fuente en lib/estados.ts: la versión corta es la de este bloque. */
    expect(BLOQUE_ESTADOS_MENCIONADOS.parrafos).toBe(REGISTRO_FUERA_DEL_ESTADO.corta);
    expect(REGISTRO_FUERA_DEL_ESTADO.corta.length).toBe(4);
  });

  it("solo digital, visa sin abogado e ITIN tienen su bloque", () => {
    expect(bloqueDe("lugar", { lugar: "solo-digital" })?.titulo).toBe("Sin presencia física");
    expect(bloqueDe("acompanamiento", { acompanamiento: "sin-abogado" })).not.toBeNull();
    expect(bloqueDe("acompanamiento", { acompanamiento: "no-sabe" })).not.toBeNull();
    expect(bloqueDe("acompanamiento", { acompanamiento: "con-abogado" })).toBeNull();
    expect(bloqueDe("documentos", { documentos: "no-sabe" })?.parrafos[0]).toContain("ITIN");
    expect(bloqueDe("documentos", { documentos: "ninguno" })).toBeNull();
  });
});

describe("resultado C — no conviene aún", () => {
  it("investigando + explorando", () => {
    expect(resultado({ objetivo: "explorando", etapa: "investigando", lugar: "texas", decision: ["solo-yo"] })).toBe("C");
  });

  it("investigando + sin definir dónde, en cualquier rama", () => {
    for (const objetivo of ["operar", "invertir", "visa", "explorando"] as const) {
      expect(resultado({ objetivo, etapa: "investigando", lugar: "sin-definir", decision: ["socios"] })).toBe("C");
    }
  });

  it("gana sobre los disparadores de revisión: se evalúa primero", () => {
    const d = evaluarDiagnostico({ objetivo: "visa", etapa: "investigando", lugar: "sin-definir", decision: ["inversionistas"] });
    expect(d.resultado).toBe("C");
    expect(d.razones).toEqual([]);
    expect(d.mostrarDerivacion).toBe(false);
  });

  it("investigando con lugar definido y objetivo declarado no es C", () => {
    expect(resultado({ objetivo: "operar", tipoOperacion: "servicios", etapa: "investigando", lugar: "florida", decision: ["solo-yo"] })).toBe("B");
  });
});

describe("resultado B — requiere revisión", () => {
  const casos: [string, Respuestas, string][] = [
    ["B1 socios", { ...rutaClara, decision: ["socios"] }, "B1"],
    ["B1 inversionistas", { ...rutaClara, decision: ["conyuge", "inversionistas"] }, "B1"],
    ["B2 inversión que no es renta", { objetivo: "invertir", tipoInversion: "uso-personal", etapa: "facturando", lugar: "texas", decision: ["solo-yo"] }, "B2"],
    ["B3 visa", { objetivo: "visa", acompanamiento: "con-abogado", etapa: "facturando", lugar: "texas", decision: ["solo-yo"] }, "B3"],
    ["B4 otro estado", { ...rutaClara, lugar: "otro-estado", estadoLibre: "Wyoming" }, "B4"],
    ["B4 solo digital", { ...rutaClara, lugar: "solo-digital" }, "B4"],
    ["B5 capital sin operación", { ...rutaClara, etapa: "capital-sin-operacion" }, "B5"],
  ];

  for (const [nombre, r, disparador] of casos) {
    it(nombre, () => {
      const d = evaluarDiagnostico(r);
      expect(d.resultado).toBe("B");
      expect(d.disparadores).toContain(disparador);
      expect(d.razones.length).toBeGreaterThan(0);
    });
  }

  it("la inversión para renta no dispara B2 por sí sola", () => {
    const d = evaluarDiagnostico({ objetivo: "invertir", tipoInversion: "renta", etapa: "facturando", lugar: "texas", decision: ["solo-yo"], documentos: "itin" });
    expect(d.disparadores).not.toContain("B2");
    /* Pero tampoco es ruta clara: el resultado A solo existe en la rama operar. */
    expect(d.resultado).toBe("B");
  });

  it("muestra máximo dos razones, la más específica primero", () => {
    const d = evaluarDiagnostico({
      objetivo: "visa", acompanamiento: "no-sabe", etapa: "capital-sin-operacion",
      lugar: "otro-estado", estadoLibre: "Delaware", decision: ["socios", "inversionistas"],
    });
    expect(d.disparadores).toEqual(["B1", "B3", "B4", "B5"]);
    expect(d.razones.map((x) => x.id)).toEqual(["B3", "B1"]);
  });

  it("la razón B4 se redacta según la respuesta: no dice 'el estado que mencionas' a quien no mencionó ninguno", () => {
    const mencionado = evaluarDiagnostico({ ...rutaClara, lugar: "otro-estado", estadoLibre: "Nevada" });
    expect(mencionado.razones[0].texto).toContain("El estado que mencionas");

    for (const lugar of ["sin-definir", "solo-digital"] as const) {
      const d = evaluarDiagnostico({ ...rutaClara, lugar });
      expect(d.razones[0].id).toBe("B4");
      expect(d.razones[0].texto).not.toContain("El estado que mencionas");
    }
  });

  it("el bloque de derivación solo aparece con visa u otro estado", () => {
    expect(evaluarDiagnostico({ objetivo: "visa", acompanamiento: "con-abogado", etapa: "facturando", lugar: "texas", decision: ["solo-yo"] }).mostrarDerivacion).toBe(true);
    expect(evaluarDiagnostico({ ...rutaClara, lugar: "sin-definir" }).mostrarDerivacion).toBe(true);
    expect(evaluarDiagnostico({ ...rutaClara, decision: ["socios"] }).mostrarDerivacion).toBe(false);
    expect(evaluarDiagnostico({ ...rutaClara, etapa: "capital-sin-operacion" }).mostrarDerivacion).toBe(false);
  });
});

describe("resultado A — ruta clara", () => {
  it("operar + facturando o identificado + Texas o Florida + decisión propia", () => {
    for (const etapa of ["facturando", "identificado"] as const) {
      for (const lugar of ["texas", "florida"] as const) {
        for (const decision of [["solo-yo"], ["conyuge"], ["profesional"], ["conyuge", "profesional"]] as const) {
          const d = evaluarDiagnostico({ ...rutaClara, etapa, lugar, decision: [...decision] });
          expect(d.resultado).toBe("A");
          expect(d.estado).toBe(lugar === "texas" ? "Texas" : "Florida");
        }
      }
    }
  });

  it("nunca por descarte: cualquier condición que falta cae en B", () => {
    const variantes: Respuestas[] = [
      { ...rutaClara, objetivo: "invertir", tipoInversion: "renta", tipoOperacion: undefined },
      { ...rutaClara, etapa: "capital-sin-operacion" },
      { ...rutaClara, etapa: "investigando" },
      { ...rutaClara, lugar: "otro-estado", estadoLibre: "California" },
      { ...rutaClara, lugar: "solo-digital" },
      { ...rutaClara, decision: ["socios"] },
      { ...rutaClara, decision: ["inversionistas"] },
      { ...rutaClara, decision: [] },
    ];
    for (const v of variantes) expect(resultado(v)).toBe("B");
  });

  it("menciona la infraestructura solo cuando no hay SSN ni ITIN", () => {
    expect(evaluarDiagnostico({ ...rutaClara, documentos: "ninguno" }).mencionaInfraestructura).toBe(true);
    for (const documentos of ["ssn", "itin", "no-sabe"] as const) {
      expect(evaluarDiagnostico({ ...rutaClara, documentos }).mencionaInfraestructura).toBe(false);
    }
  });

  it("los documentos fiscales no cambian el resultado", () => {
    for (const documentos of ["ssn", "itin", "ninguno", "no-sabe"] as const) {
      expect(resultado({ ...rutaClara, documentos })).toBe("A");
      expect(resultado({ ...rutaClara, decision: ["socios"], documentos })).toBe("B");
    }
  });
});

describe("párrafo ensamblado", () => {
  it("sigue la plantilla y omite los fragmentos vacíos", () => {
    expect(parrafoSituacion(rutaClara)).toBe(
      "Buscas prestar servicios profesionales y facturarlos desde Estados Unidos. La actividad ya existe y genera ingresos. La operación va a ocurrir en Texas.",
    );
  });

  it("solo-yo no agrega oración", () => {
    const conSoloYo = parrafoSituacion(rutaClara);
    const sinDecision = parrafoSituacion({ ...rutaClara, decision: [] });
    expect(conSoloYo).toBe(sinDecision);
  });

  it("no repite la etapa cuando el lugar ya dice lo mismo", () => {
    const p = parrafoSituacion({ objetivo: "explorando", etapa: "investigando", lugar: "sin-definir", decision: ["solo-yo"] });
    expect(p).toBe("Buscas entender qué opciones tienes antes de decidir. Todavía no está definido dónde va a ocurrir la operación.");
  });

  it("usa el estado capturado en texto libre", () => {
    expect(parrafoSituacion({ ...rutaClara, lugar: "otro-estado", estadoLibre: "Wyoming" })).toContain(
      "Mencionas Wyoming como lugar de registro.",
    );
  });

  it("nunca pasa de cuatro oraciones y prioriza a los inversionistas", () => {
    const p = parrafoSituacion({
      ...rutaClara,
      decision: ["conyuge", "socios", "inversionistas", "profesional"],
    });
    expect(p.split(". ").length).toBeLessThanOrEqual(4);
    expect(p).toContain("Hay inversionistas externos involucrados.");
  });
});

describe("guardarraíles de lenguaje", () => {
  const copyPublico = [
    RESULTADO_A.titulo, ...RESULTADO_A.decidir("Texas"), RESULTADO_A.infraestructura,
    RESULTADO_A.sigueIntro, RESULTADO_A.caminoFormacion("Texas"), RESULTADO_A.caminoLlamada, RESULTADO_A.llamada,
    RESULTADO_B.titulo, RESULTADO_B.razonesTitulo, RESULTADO_B.sigue,
    RESULTADO_C.titulo, RESULTADO_C.porQue, ...RESULTADO_C.primero, RESULTADO_C.cierre, ...RESULTADO_C.sigue,
    ALCANCE.titulo, ALCANCE.hacemos, ALCANCE.nota, ALCANCE.noHacemos,
    DERIVACION.titulo, DERIVACION.cuerpo, DERIVACION.consentimiento,
    ...PREGUNTAS.flatMap((p) => [p.q, p.subtexto ?? "", ...p.options.flatMap((o) => [o.label, o.desc ?? ""])]),
  ].join(" ");

  it("no usa 'domicilio fiscal': la dirección es comercial y para el registro", () => {
    expect(copyPublico.toLowerCase()).not.toContain("domicilio fiscal");
    expect(ALCANCE.hacemos).toContain("dirección comercial para el registro");
  });

  it("el bloque de alcance declara lo que no hacemos", () => {
    expect(ALCANCE.noHacemos).toContain("no presentamos declaraciones de impuestos");
    expect(ALCANCE.noHacemos).toContain("no llevamos procesos migratorios");
  });

  it("el resultado C no lleva ninguna llamada a formación en línea", () => {
    const pantallaC = [RESULTADO_C.titulo, RESULTADO_C.porQue, ...RESULTADO_C.primero, RESULTADO_C.cierre, ...RESULTADO_C.sigue].join(" ").toLowerCase();
    expect(pantallaC).not.toContain("formación en línea");
    expect(pantallaC).not.toContain("constituir ahora");
    expect(pantallaC).not.toContain("iniciar la formación");
  });
});

describe("registro en el CRM", () => {
  it("guarda respuestas, resultado y el estado capturado en texto libre", () => {
    const r: Respuestas = { ...rutaClara, lugar: "otro-estado", estadoLibre: "Wyoming" };
    const d = evaluarDiagnostico(r);
    const campos = camposDiagnostico(r, d, { autorizaDerivacion: false });
    const mapa = new Map(campos.map((c) => [c.label, c.value]));

    expect(mapa.get("Objetivo")).toBe("Operar");
    expect(mapa.get("Tipo de operación")).toBe("Servicios profesionales");
    expect(mapa.get("Dónde va a ocurrir la operación")).toBe("Otro estado de EE.UU.");
    expect(mapa.get("Estado mencionado")).toBe("Wyoming");
    expect(mapa.get("Resultado del diagnóstico")).toBe("B — Requiere revisión");
    expect(mapa.get("Disparadores de revisión")).toBe("B4");
    expect(mapa.get("Autoriza compartir con el abogado de migración")).toBe("No");
  });

  it("no reporta preguntas que no aplican a la rama", () => {
    const r: Respuestas = { objetivo: "explorando", etapa: "investigando", lugar: "sin-definir", decision: ["solo-yo"] };
    const labels = camposDiagnostico(r, evaluarDiagnostico(r)).map((c) => c.label);
    expect(labels).not.toContain("Tipo de operación");
    expect(labels).not.toContain("Documentos fiscales");
    expect(labels).toContain("Quién participa en la decisión");
  });
});
