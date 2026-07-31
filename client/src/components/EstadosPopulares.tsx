/*
 * Sección educativa "¿Y Wyoming, Delaware o Nevada?".
 *
 * Continúa la sección "Una LLC puede ser suficiente. A veces no lo es.": mismo
 * fondo y padding reducido entre ambas, para que se lean como una secuencia —
 * la LLC no siempre es la respuesta, los estados famosos tampoco lo son.
 *
 * Texto largo: ancho de lectura acotado y alineado a la izquierda. Nada de
 * viñetas con check — aquí no hay beneficios que enumerar, hay una creencia que
 * corregir con datos.
 *
 * El copy vive en `lib/estados.ts` (ver la nota de revisión fiscal de ese archivo).
 */
import { ESTADOS_POPULARES } from "@/lib/estados";

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
  return (
    <section className="bg-[#F5F7FA] pt-10 md:pt-12 pb-20 md:pb-28">
      <div className="container">
        <div className="max-w-[760px] mx-auto">
          <p className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-3 font-mono">
            {ESTADOS_POPULARES.eyebrow}
          </p>
          <h2 className="text-3xl md:text-4xl text-[#0B1F3A] font-bold mb-5">
            {ESTADOS_POPULARES.titulo}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-10 md:mb-12">
            {ESTADOS_POPULARES.intro}
          </p>

          {ESTADOS_POPULARES.bloques.map((bloque) => (
            <div key={bloque.titulo} className="mb-10 md:mb-12 last:mb-0">
              <h3 className="text-xl md:text-2xl text-[#0B1F3A] font-bold mb-3 leading-snug">
                {bloque.titulo}
              </h3>
              {bloque.parrafos.map((p) => (
                <Parrafo key={p} texto={p} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
