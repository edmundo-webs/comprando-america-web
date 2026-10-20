/*
 * Eventos 2026 — Premium Investment Club
 * Alternating navy/white with real event photos
 */

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useInView } from "@/hooks/useInView";
import { openWhatsApp, WHATSAPP_PHONE } from "@/lib/whatsapp";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Clock,
  CalendarDays,
  CheckCircle2,
  Compass,
  Utensils,
  Trophy,
  Lock,
  Handshake,
  Globe,
} from "lucide-react";

/* ─── FadeIn ─── */
function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isInView } = useInView();
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── SEO ─── */
import SEOHead from "@/components/SEOHead";
import { TIPO_CUMBRE, TIPO_INVESTMENT_WEEK, CUMBRE_URL, type Evento } from "@/lib/eventos";
import { useEventos } from "@/hooks/useEventos";
const PAGE_SEO = {
  title: "Eventos y Experiencias para Inversionistas | Comprando Am\u00e9rica",
  description: "Participa en eventos presenciales, viajes de inspecci\u00f3n y encuentros privados para empresarios e inversionistas en Estados Unidos.",
  path: "/eventos",
  schema: {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "\u00bfQu\u00e9 eventos organiza Comprando Am\u00e9rica?", "acceptedAnswer": {"@type": "Answer", "text": "Cumbres de emprendimiento, la Cumbre Digital, Ruta Inmobiliaria, viajes de inspección en Florida, cenas privadas y asambleas mensuales para miembros."}}]},
};

/* ─── Photos ─── */
const CLOUD = "https://res.cloudinary.com/dofccqypz/image/upload";
const photo = (id: string, v: string) => `${CLOUD}/c_fill,w_1200,h_600,g_auto,q_auto,f_auto/v${v}/comprando-america/eventos/${id}.jpg`;

const PHOTOS = {
  hero: "https://lh3.googleusercontent.com/d/1gnZX2RiYD4M29nQmqwcsN0k13db74LmV=w1920",
  ruta: "https://res.cloudinary.com/dofccqypz/image/upload/c_fill,w_1200,h_800,g_auto,q_auto,f_auto/v1774537570/comprando-america/eventos/vjyyrtfskd3w7nmklbt3.jpg",
  investWeek: "https://res.cloudinary.com/dofccqypz/image/upload/c_fill,w_1200,h_800,g_auto,q_auto,f_auto/v1774537561/comprando-america/eventos/fou8skfadwce2lodr5yc.jpg",
  cumbre: photo("fou8skfadwce2lodr5yc", "1774537561"),
  cumbreDigital: "https://res.cloudinary.com/dofccqypz/image/upload/c_fill,w_1200,h_800,g_auto,q_auto,f_auto/v1774537558/comprando-america/eventos/xvdkaaxpavgr9lrybk8g.jpg",
  cena: photo("n8lkmvpmlrnco9etkxfb", "1774537526"),
  panel: photo("xvdkaaxpavgr9lrybk8g", "1774537558"),
  networking: photo("n8lkmvpmlrnco9etkxfb", "1774537526"),
  audience: photo("xvdkaaxpavgr9lrybk8g", "1774537558"),
};

const WA_LISTA = "Hola, me interesa unirme a la lista prioritaria de eventos de Comprando América.";
const WA_GENERAL = "Hola, me interesa participar en los eventos de Comprando América.";

/* ═══════════════════════════════════════════════════════ */

export default function Eventos() {
  const scrollToEventos = () => {
    document.getElementById("proximos-eventos")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white overflow-x-hidden">
      <SEOHead {...PAGE_SEO} />
      <Navbar />

      {/* ═══ 1. HERO ═══ */}
      <section className="relative min-h-[85vh] flex items-center pt-20 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={PHOTOS.hero} alt="Comunidad de inversionistas en evento" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/90 via-[#0B1F3A]/75 to-[#0B1F3A]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-[#0B1F3A]/30" />
        </div>

        <div className="container relative z-10">
          <FadeIn>
            <div className="max-w-3xl">
              <p className="text-blue-400 text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">Experiencias & Eventos</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
                Experiencias diseñadas para empresarios que quieren invertir en Estados Unidos
              </h1>
              <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
                Eventos presenciales, viajes de inspección y encuentros privados donde se analizan oportunidades reales y se construyen relaciones estratégicas.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Button onClick={scrollToEventos} className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25">
                  Ver próximos eventos <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_LISTA)} className="border-slate-500 text-white hover:bg-white/10 px-8 py-6 text-base gap-2">
                  Lista prioritaria
                </Button>
              </div>

              <div className="flex flex-wrap gap-6 text-slate-400 text-sm">
                <span className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-blue-400" /> Eventos presenciales</span>
                <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-blue-400" /> Espacios privados</span>
                <span className="flex items-center gap-2"><Handshake className="w-4 h-4 text-blue-400" /> Networking estratégico</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 2. GALERÍA DE EXPERIENCIA — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-4">Las oportunidades se viven en el terreno</h2>
              <p className="text-[#4B5563] text-lg max-w-2xl mx-auto">Comprando América organiza experiencias donde empresarios analizan, conectan y deciden con información de primera mano.</p>
            </div>
          </FadeIn>

          {/* Photo grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto mb-14">
            {[
              { src: PHOTOS.panel, alt: "Panel de expertos" },
              { src: PHOTOS.networking, alt: "Networking entre miembros" },
              { src: PHOTOS.audience, alt: "Audiencia en evento" },
              { src: PHOTOS.cena, alt: "Cena privada de inversión" },
            ].map((img, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="aspect-square rounded-xl overflow-hidden">
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                "Analizar oportunidades en persona",
                "Visitar proyectos en operación",
                "Conectar con inversionistas activos",
                "Decidir con contexto real",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-[#374151] text-sm">{item}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 3. PRÓXIMOS EVENTOS ═══ */}
      <div id="proximos-eventos">

        {/* ─── PRÓXIMOS EVENTOS DEL CMS — dark navy ───
            Antes aquí estaba escrita a mano la Primera Cumbre Digital (22 de
            agosto) y se quedó anunciada después de pasar. Ahora salen los
            próximos eventos públicos capturados en el CMS; si no hay, o si el
            CMS no responde, el bloque no se muestra. */}
        <ProximosDelCms />

        {/* ─── INVESTMENT WEEKEND II — oculto: edición de julio 2026 ya finalizada ─── */}

        {/* ─── RUTA INMOBILIARIA — oculta temporalmente ─── */}

        {/* ─── CENA PRIVADA — ☀️ blanco ─── */}
        <section className="bg-white py-20 md:py-28">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <FadeIn delay={0.1} className="order-2 lg:order-1">
                <div>
                  <Utensils className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-3xl md:text-4xl text-[#0B1F3A] mb-3">Cena privada de inversión</h3>
                  <p className="text-[#4B5563] text-lg leading-relaxed mb-6">Encuentros exclusivos donde se analizan oportunidades en un ambiente cercano e íntimo.</p>

                  <div className="space-y-3 mb-8">
                    {["Conversaciones estratégicas en grupo reducido", "Networking de alto nivel", "Análisis de oportunidades en contexto privado"].map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-[#6B7280] text-sm">{item}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-[#9CA3AF] text-sm mb-6 italic">Próximas fechas por anunciar</p>
                  <Button onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_LISTA)} className="bg-primary hover:bg-blue-600 text-white gap-2">
                    Lista prioritaria <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </FadeIn>

              <FadeIn className="order-1 lg:order-2">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
                  <img src={PHOTOS.cena} alt="Cena privada de inversión" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-xs font-semibold uppercase tracking-wider">Por anunciar</span>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ─── CUMBRE DE EMPRENDIMIENTO — navy ─── */}
        <section className="bg-[#091A30] py-20 md:py-28">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <FadeIn>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#1E3A5F] shadow-2xl">
                  <img src={PHOTOS.cumbre} alt="Cumbre de Emprendimiento e Inversiones Estratégicas" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-xs font-semibold uppercase tracking-wider">En planeación</span>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <div>
                  <Trophy className="w-10 h-10 text-blue-400 mb-4" />
                  <h3 className="text-3xl md:text-4xl text-white mb-3">Cumbre de Emprendimiento e Inversiones Estratégicas</h3>
                  <p className="text-slate-400 text-lg leading-relaxed mb-6">Evento diseñado para empresarios que buscan entender cómo expandirse hacia Estados Unidos con estructura y estrategia.</p>

                  <div className="space-y-3 mb-8">
                    {["Modelos de inversión probados", "Estructura empresarial en Estados Unidos", "Oportunidades evaluadas", "Networking de alto nivel"].map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-slate-400 text-sm">{item}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-slate-500 text-sm mb-6 italic">Próxima edición en planeación</p>
                  <Button onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_LISTA)} className="bg-primary hover:bg-blue-600 text-white gap-2">
                    Lista de espera <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
      </div>


      {/* ═══ ECOSISTEMA — navy ═══ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-blue-400 text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">Ecosistema</p>
              <h2 className="text-3xl md:text-4xl text-white mb-6">Los eventos son solo una parte del ecosistema</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-10">
                Muchos de los participantes continúan su proceso a través del Grupo Empresarial de Edmundo, accediendo a oportunidades y estructurando su empresa en Estados Unidos.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/membresia">
                  <Button className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25">
                    Conocer el Grupo Empresarial de Edmundo <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <a href="/oportunidades-de-inversion-en-estados-unidos">
                  <Button variant="outline" className="border-slate-600 text-white hover:bg-white/10 px-8 py-6 text-base">
                    Ver oportunidades
                  </Button>
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ CTA FINAL — deep navy ═══ */}
      <section className="bg-[#091A30] py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-6">Accede a experiencias donde se toman decisiones reales</h2>
              <p className="text-slate-500 text-sm mb-10">Los mejores espacios no se publican. Se comparten.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="https://comprandoamerica.com/gps">
                  <Button className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25">
                    Evaluar mi Perfil <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <Button variant="outline" onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_GENERAL)} className="border-slate-600 text-white hover:bg-white/10 px-8 py-6 text-base gap-2">
                  WhatsApp <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* A dónde lleva el botón de cada evento: la página propia de la Cumbre o de
   Investment Week, la liga de registro capturada en el CMS, o WhatsApp. */
function BotonEvento({ e }: { e: Evento }) {
  const clase = "bg-primary hover:bg-blue-600 text-white gap-2";
  if (e.clave === TIPO_CUMBRE) {
    return <a href={CUMBRE_URL}><Button className={clase}>Registro gratuito <ArrowRight className="w-4 h-4" /></Button></a>;
  }
  if (e.clave === TIPO_INVESTMENT_WEEK) {
    return <a href="/investment-week"><Button className={clase}>Ver el programa <ArrowRight className="w-4 h-4" /></Button></a>;
  }
  if (e.registro) {
    return <a href={e.registro} target="_blank" rel="noopener noreferrer"><Button className={clase}>Registro <ArrowRight className="w-4 h-4" /></Button></a>;
  }
  return (
    <Button
      onClick={() => openWhatsApp(WHATSAPP_PHONE, `Hola, me interesa ${e.titulo} (${e.fecha}).`)}
      className={clase}
    >
      Solicitar información <ArrowRight className="w-4 h-4" />
    </Button>
  );
}

function ProximosDelCms() {
  const { eventos } = useEventos();
  if (eventos.length === 0) return null;
  return (
    <section className="bg-[#091A30] py-20 md:py-28">
      <div className="container">
        <FadeIn>
          <div className="text-center mb-12">
            <p className="text-blue-400 text-xs font-semibold tracking-[0.2em] uppercase mb-2 font-mono">Calendario</p>
            <h2 className="text-3xl md:text-4xl text-white">Próximos eventos</h2>
          </div>
        </FadeIn>
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {eventos.map((e, i) => (
            <FadeIn key={e.id} delay={i * 0.08}>
              <article className="h-full rounded-2xl overflow-hidden border border-[#1E3A5F] bg-[#0B1F3A] grid sm:grid-cols-[200px_1fr]">
                {e.imagen ? (
                  <img src={e.imagen} alt={e.titulo} loading="lazy" className="w-full h-64 sm:h-full object-cover" />
                ) : (
                  <div className="hidden sm:block bg-gradient-to-br from-[#132D52] to-[#0B1F3A]" />
                )}
                <div className="p-6">
                  <p className="text-blue-400 text-xs font-semibold tracking-[0.2em] uppercase mb-2 font-mono">
                    {e.kicker ? `${e.kicker} · ${e.tipo}` : e.tipo}
                  </p>
                  <h3 className={`text-2xl text-white mb-3 ${e.cancelado ? "line-through decoration-red-400/70" : ""}`}>{e.titulo}</h3>
                  {e.cancelado && <p className="text-red-300 text-sm font-semibold mb-3">Este evento se canceló.</p>}
                  <div className="space-y-1.5 text-slate-400 text-sm mb-4">
                    <p className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-blue-400 shrink-0" /> {e.fecha}</p>
                    {e.horario && <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-blue-400 shrink-0" /> {e.horario}</p>}
                    {e.lugar && <p className="flex items-center gap-2"><Globe className="w-4 h-4 text-blue-400 shrink-0" /> {e.lugar}</p>}
                  </div>
                  {e.desc && <p className="text-slate-400 leading-relaxed mb-6">{e.desc}</p>}
                  {!e.cancelado && e.transmision && (
                    <div className="mb-5">
                      {e.transmision.url ? (
                        <a href={e.transmision.url} target="_blank" rel="noopener noreferrer">
                          <Button className="bg-red-600 hover:bg-red-500 text-white gap-2">Ver la transmisión <ArrowRight className="w-4 h-4" /></Button>
                        </a>
                      ) : (
                        <p className="text-slate-300 text-sm">{e.transmision.mensaje}</p>
                      )}
                    </div>
                  )}
                  {!e.cancelado && <BotonEvento e={e} />}
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
