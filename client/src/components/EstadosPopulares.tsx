/*
 * Sección educativa "¿Y Wyoming, Delaware o Nevada?".
 *
 * Continúa la sección "Una LLC puede ser suficiente. A veces no lo es.": mismo
 * fondo y padding reducido entre ambas, para que se lean como una secuencia —
 * la LLC no siempre es la respuesta, los estados famosos tampoco lo son.
 *
 * Es manejo de objeción, no contenido informativo, así que se responde a demanda:
 * visible queda el resumen —una respuesta completa en un párrafo— y el análisis
 * entero a un clic. Desplegada medía 1868px, que es más página de la que esta
 * objeción merece a quien no la trae.
 *
 * La expansión usa `<details>`/`<summary>` nativo, no renderizado condicional.
 * Con `useState && ...` el contenido no existiría en el DOM hasta el clic, y eso
 * cuesta el posicionamiento de "en qué estado abrir mi LLC" — tráfico que ya
 * funciona. Con `<details>` el texto está en el DOM desde el primer render,
 * cerrado pero presente e indexable. No cambiar por un toggle de React.
 *
 * Texto largo: ancho de lectura acotado y alineado a la izquierda. Nada de
 * viñetas con check — aquí no hay beneficios que enumerar, hay una creencia que
 * corregir con datos.
 *
 * El copy vive en `lib/estados.ts` (ver la nota de revisión fiscal de ese archivo).
 */
import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import { ESTADOS_POPULARES, REGISTRO_FUERA_DEL_ESTADO } from "@/lib/estados";

/* Los párrafos admiten **énfasis** puntual, nada más de markdown. */
function Parrafo({ texto }: { texto: string }) {
  return (
    <p className="text-base md:text-[17px] text-slate-600 leading-relaxed mb-4 last:mb-0">
      {texto.split(/\*\*(.+?)\*\*/g).map((fragmento, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-[#0B1F3A]">
            {fragmento}
          </strong>
        ) : (
          fragmento
        ),
      )}
    </p>
  );
}

export default function EstadosPopulares() {
  const seccionRef = useRef<HTMLElement>(null);
  const detallesRef = useRef<HTMLDetailsElement>(null);

  /* Cerrar desde el final del análisis: en móvil, quien termina de leer queda a
     1800px del encabezado y sin referencia de dónde está. */
  function cerrar() {
    const detalles = detallesRef.current;
    if (detalles) detalles.open = false;
    /* Después de cerrar, para que el scroll apunte a la altura ya colapsada. */
    requestAnimationFrame(() => seccionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  return (
    <section ref={seccionRef} className="bg-[#F5F7FA] pt-10 md:pt-12 pb-20 md:pb-28 scroll-mt-24">
      <div className="container">
        <div className="max-w-[760px] mx-auto">
          <p className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-3 font-mono">
            {ESTADOS_POPULARES.eyebrow}
          </p>
          <h2 className="text-3xl md:text-4xl text-[#0B1F3A] font-bold mb-5">
            {ESTADOS_POPULARES.titulo}
          </h2>
          {/* Resumen: responde la objeción sin obligar a leer el análisis. */}
          <p className="text-lg text-slate-600 leading-relaxed">
            {REGISTRO_FUERA_DEL_ESTADO.seccionEducativaResumen}
          </p>

          <details ref={detallesRef} className="group mt-6">
            <summary className="flex items-center gap-2 min-h-[44px] py-2 cursor-pointer list-none text-primary font-semibold [&::-webkit-details-marker]:hidden">
              <span className="group-open:hidden">Ver el análisis completo</span>
              <span className="hidden group-open:inline">Ocultar el análisis</span>
              <ChevronDown className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
            </summary>

            <div className="pt-4 md:pt-6">
              <p className="text-base md:text-[17px] text-slate-600 leading-relaxed mb-10 md:mb-12">
                {ESTADOS_POPULARES.intro}
              </p>

              {ESTADOS_POPULARES.bloques.map((bloque) => (
                <div key={bloque.titulo} className="mb-10 md:mb-12">
                  <h3 className="text-xl md:text-2xl text-[#0B1F3A] font-bold mb-3 leading-snug">
                    {bloque.titulo}
                  </h3>
                  {bloque.parrafos.map((p) => (
                    <Parrafo key={p} texto={p} />
                  ))}
                </div>
              ))}

              <button
                type="button"
                onClick={cerrar}
                className="flex items-center gap-2 min-h-[44px] py-2 text-primary font-semibold hover:text-blue-700 transition-colors"
              >
                <ChevronDown className="w-4 h-4 flex-shrink-0 rotate-180" aria-hidden="true" />
                Cerrar
              </button>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
