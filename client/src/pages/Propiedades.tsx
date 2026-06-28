import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useInView } from "@/hooks/useInView";
import { openWhatsApp, WHATSAPP_PHONE } from "@/lib/whatsapp";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  CheckCircle2,
  ExternalLink,
  Building2,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { DEALS } from "@/lib/deals";

const PAGE_SEO = {
  title: "Propiedades de Inversión en Estados Unidos | Comprando América",
  description:
    "Oportunidades inmobiliarias filtradas y evaluadas con retorno documentado. Cap rates del 6–8%. Propiedades en Florida y Nueva York.",
  path: "/propiedades",
};

function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isInView } = useInView();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export default function Propiedades() {
  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white overflow-x-hidden">
      <SEOHead {...PAGE_SEO} />
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="pt-32 pb-20 container">
        <FadeIn>
          <p className="text-blue-400 text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">
            Oportunidades filtradas
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6 max-w-3xl">
            Propiedades de Inversión en{" "}
            <span className="gradient-text-primary">Estados Unidos</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mb-4">
            Cada propiedad pasa por un filtro riguroso antes de ser presentada.
            Cap rates documentados, estructura legal lista y acceso directo por
            WhatsApp.
          </p>
          <div className="flex flex-wrap gap-6 text-slate-500 text-sm">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" /> Evaluadas y
              filtradas
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" /> Cap rate 6–8%
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" /> Florida &amp;
              Nueva York
            </span>
          </div>
        </FadeIn>
      </section>

      {/* ═══ GRID DE DEALS ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEALS.map((deal, i) => (
              <FadeIn key={deal.id} delay={i * 0.07}>
                <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-2xl overflow-hidden h-full flex flex-col group hover:border-primary/40 transition-all">
                  {/* Cabecera */}
                  <div className="p-6 pb-4 border-b border-[#1E3A5F]">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-primary text-xs font-semibold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Oportunidad #{deal.id}
                      </div>
                      {deal.savings && (
                        <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                          -{fmt(deal.savings)} ahorro
                        </div>
                      )}
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white font-semibold text-sm leading-snug">
                          {deal.address}
                        </p>
                        <p className="text-slate-500 text-xs">
                          {deal.city}, {deal.state} {deal.zip}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Precio + specs */}
                  <div className="p-6 pb-4 flex-1">
                    <div className="mb-4">
                      {deal.listPrice && (
                        <p className="text-slate-500 text-xs line-through mb-0.5">
                          {fmt(deal.listPrice)} precio de lista
                        </p>
                      )}
                      <p className="text-primary text-2xl font-bold">
                        {fmt(deal.investorPrice)}
                      </p>
                      <p className="text-slate-500 text-xs">
                        Precio para inversionista
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-slate-400 text-xs mb-5">
                      <span className="flex items-center gap-1">
                        <BedDouble className="w-3.5 h-3.5" />
                        {deal.bedrooms} rec.
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="w-3.5 h-3.5" />
                        {deal.bathrooms} baño{deal.bathrooms !== 1 ? "s" : ""}
                      </span>
                      <span className="flex items-center gap-1">
                        <Ruler className="w-3.5 h-3.5" />
                        {deal.sqft.toLocaleString()} sqft
                      </span>
                    </div>

                    {/* ROI */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="bg-[#0F2847] rounded-lg p-3">
                        <p className="text-slate-500 text-xs mb-0.5">
                          Renta mensual
                        </p>
                        <p className="text-white font-semibold text-sm">
                          ${deal.monthlyRent.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-[#0F2847] rounded-lg p-3">
                        <p className="text-slate-500 text-xs mb-0.5">
                          NOI anual
                        </p>
                        <p className="text-white font-semibold text-sm">
                          ${deal.noi.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-[#0F2847] rounded-lg p-3">
                        <p className="text-slate-500 text-xs mb-0.5">
                          Gastos op.
                        </p>
                        <p className="text-white font-semibold text-sm">
                          ${deal.operatingExpenses.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                        <p className="text-blue-400 text-xs mb-0.5">Cap Rate</p>
                        <p className="text-primary font-bold text-sm">
                          {deal.capRate}%
                        </p>
                      </div>
                    </div>

                    <p className="text-slate-500 text-xs mb-1">
                      {deal.propertyType} · Construida en {deal.builtYear}
                      {deal.lotSqft
                        ? ` · Terreno: ${deal.lotSqft.toLocaleString()} sqft`
                        : ""}
                    </p>
                    {deal.hoa ? (
                      <p className="text-slate-500 text-xs">
                        HOA: ${deal.hoa.toLocaleString()}/año
                      </p>
                    ) : (
                      <p className="text-emerald-500 text-xs">Sin HOA</p>
                    )}

                    {/* Highlights */}
                    {deal.highlights.length > 0 && (
                      <div className="mt-4 space-y-1.5">
                        {deal.highlights.map((h, j) => (
                          <div key={j} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                            <p className="text-slate-400 text-xs">{h}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="p-6 pt-0 flex flex-col gap-2">
                    <Button
                      onClick={() =>
                        openWhatsApp(
                          WHATSAPP_PHONE,
                          `Hola, me interesa la oportunidad #${deal.id}: ${deal.address}, ${deal.city}, ${deal.state}.`
                        )
                      }
                      className="bg-primary hover:bg-blue-600 text-white gap-2 w-full text-sm"
                    >
                      Consultar esta propiedad{" "}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    {deal.zillowUrl && (
                      <a
                        href={deal.zillowUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-300 text-xs transition-colors py-1"
                      >
                        <ExternalLink className="w-3 h-3" /> Ver en Zillow
                      </a>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="mt-12 text-center">
              <p className="text-[#4B5563] text-sm italic">
                El acceso detallado a cada deal es exclusivo para miembros
                activos de la comunidad.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section className="bg-[#091A30] py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <Building2 className="w-10 h-10 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl text-white mb-4">
                ¿Listo para evaluar una propiedad?
              </h2>
              <p className="text-slate-400 mb-10 text-lg">
                Habla directamente con un asesor y recibe análisis completo
                de la oportunidad que te interesa.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  onClick={() =>
                    openWhatsApp(
                      WHATSAPP_PHONE,
                      "Hola, me interesan las propiedades de inversión en Estados Unidos."
                    )
                  }
                  className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25"
                >
                  Hablar con un asesor <ArrowRight className="w-4 h-4" />
                </Button>
                <a href="/oportunidades-de-inversion-en-estados-unidos">
                  <Button
                    variant="outline"
                    className="border-slate-600 text-white hover:bg-white/10 px-8 py-6 text-base"
                  >
                    Ver todas las oportunidades
                  </Button>
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
