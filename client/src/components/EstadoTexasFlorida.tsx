/*
 * Sección "Texas o Florida" — el criterio de estado, sin argumentos de venta.
 *
 * No lleva CTA a propósito: aquí no se elige un estado, se entiende cómo se
 * elige. Quien ya sabe dónde ocurre su operación llega al estado por el
 * diagnóstico o por la compra directa, donde esa decisión sí se toma.
 *
 * El copy vive en `lib/estados.ts` porque el paso de estado del diagnóstico usa
 * exactamente el mismo criterio: una sola fuente, sin versiones divergiendo.
 * Los argumentos por estado (ecosistema, comunidad latina, mercado inmobiliario)
 * no van aquí: su lugar es la página de cada estado, después de rutear.
 */
import { ESTADO_HEADER, ESTADO_INFO, ESTADO_SIN_IMPUESTO } from "@/lib/estados";

export default function EstadoTexasFlorida() {
  return (
    <section className="bg-[#F5F7FA] py-20 md:py-28">
      <div className="container max-w-[820px] mx-auto px-6">
        <p className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-3 font-mono text-center">
          Estado
        </p>
        <h2 className="text-3xl md:text-4xl text-[#0B1F3A] font-bold text-center mb-5">
          Texas o Florida
        </h2>
        <p className="text-lg text-slate-600 text-center leading-relaxed max-w-[520px] mx-auto mb-7">
          {ESTADO_HEADER}
        </p>
        <div className="flex justify-center mb-10 md:mb-12">
          <p className="text-[15px] text-slate-600 bg-white rounded-full px-6 py-2.5">
            {ESTADO_SIN_IMPUESTO}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_1px_1fr] md:gap-10">
          <div>
            <p className="text-lg font-bold text-[#0B1F3A] mb-2.5">Texas</p>
            <p className="text-base text-slate-600 leading-relaxed">{ESTADO_INFO.Texas.desc}</p>
          </div>
          <div className="hidden md:block bg-slate-200" aria-hidden="true" />
          <div className="border-t border-slate-200 pt-8 md:border-t-0 md:pt-0">
            <p className="text-lg font-bold text-[#0B1F3A] mb-2.5">Florida</p>
            <p className="text-base text-slate-600 leading-relaxed">{ESTADO_INFO.Florida.desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
