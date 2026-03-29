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
  MapPin,
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
function SEOHead() {
  useEffect(() => {
    document.title = "Eventos y Experiencias para Inversionistas | Comprando América";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Participa en eventos presenciales, viajes de inspección y encuentros privados para empresarios e inversionistas en Estados Unidos.");
  }, []);
  return null;
}

/* ─── Photos ─── */
const CLOUD = "https://res.cloudinary.com/dofccqypz/image/upload";
const photo = (id: string, v: string) => `${CLOUD}/c_fill,w_1200,h_600,g_auto,q_auto,f_auto/v${v}/comprando-america/eventos/${id}.jpg`;

const PHOTOS = {
  hero: "https://lh3.googleusercontent.com/d/1gnZX2RiYD4M29nQmqwcsN0k13db74LmV=w1920",
  ruta: "https://lh3.googleusercontent.com/d/1jmPjN24MUpLYCLu2uizThN6ej938xfD3=w1200",
  investWeek: "https://lh3.googleusercontent.com/d/14QiLZK8eOY1ikSQB3fQqPo3ocWhD77bE=w1200",
  cumbre: photo("fou8skfadwce2lodr5yc", "1774537561"),
  cena: photo("n8lkmvpmlrnco9etkxfb", "1774537526"),
  panel: "https://lh3.googleusercontent.com/d/191DAUtt8vkLpZJatNDqvtYrRIc1Z-VHO=w1920",
  networking: "https://lh3.googleusercontent.com/d/1dOiMwsphB-MpHgpCDtufBtiqaycAIM8W=w1200",
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
      <SEOHead />
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

        {/* ─── RUTA INMOBILIARIA — dark navy ─── */}
        <section className="bg-[#091A30] py-20 md:py-28">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <FadeIn>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#1E3A5F] shadow-2xl">
                  <img src={PHOTOS.ruta} alt="Ruta Inmobiliaria en Estados Unidos" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-white text-xs font-semibold uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Próximo evento
                    </span>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <div>
                  <Compass className="w-10 h-10 text-blue-400 mb-4" />
                  <h3 className="text-3xl md:text-4xl text-white mb-3">Ruta Inmobiliaria en Estados Unidos</h3>
                  <p className="text-slate-400 text-lg leading-relaxed mb-6">Un evento presencial donde analizamos oportunidades reales en bienes raíces.</p>

                  <div className="space-y-3 mb-6">
                    {["Conocer proyectos en operación", "Entender estructuras de inversión", "Conectar con otros inversionistas", "Evaluar oportunidades con contexto real"].map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-slate-400 text-sm">{item}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4 text-slate-400 text-sm mb-8">
                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-400" /> Monterrey</span>
                    <span className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-blue-400" /> 18 abril 2026</span>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <a href="/ruta-inmobiliaria-en-estados-unidos">
                      <Button className="bg-primary hover:bg-blue-600 text-white gap-2">Reservar mi lugar <ArrowRight className="w-4 h-4" /></Button>
                    </a>
                    <a href="/ruta-inmobiliaria-en-estados-unidos">
                      <Button variant="outline" className="border-slate-600 text-white hover:bg-white/10 gap-2">Ver detalles</Button>
                    </a>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ─── INVESTMENT WEEK — ☀️ blanco ─── */}
        <section className="bg-white py-20 md:py-28">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <FadeIn delay={0.1} className="order-2 lg:order-1">
                <div>
                  <Globe className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-3xl md:text-4xl text-[#0B1F3A] mb-3">Florida Investment Week</h3>
                  <p className="text-[#4B5563] text-lg leading-relaxed mb-6">Viaje de inspección donde visitamos oportunidades y analizamos proyectos directamente en Estados Unidos.</p>

                  <div className="space-y-3 mb-6">
                    {["Visitas a propiedades reales en operación", "Analizar inversiones con expertos locales", "Entender estructuras de inversión en sitio", "Tomar decisiones con información directa"].map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-[#6B7280] text-sm">{item}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4 text-[#6B7280] text-sm mb-8">
                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Florida, EE.UU.</span>
                    <span className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-primary" /> 1–4 mayo 2026</span>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <a href="/investment-week">
                      <Button className="bg-primary hover:bg-blue-600 text-white gap-2">Aplicar al viaje <ArrowRight className="w-4 h-4" /></Button>
                    </a>
                    <a href="/investment-week">
                      <Button variant="outline" className="border-gray-300 text-[#0B1F3A] hover:bg-gray-50 gap-2">Ver detalles</Button>
                    </a>
                  </div>
                </div>
              </FadeIn>

              <FadeIn className="order-1 lg:order-2">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
                  <img src={PHOTOS.investWeek} alt="Florida Investment Week" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-white text-xs font-semibold uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Mayo 2026
                    </span>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ─── CUMBRE — navy ─── */}
        <section className="bg-[#0E2544] py-20 md:py-28">
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
                    {["Modelos de inversión probados", "Estructura empresarial en EE.UU.", "Oportunidades evaluadas", "Networking de alto nivel"].map((item, i) => (
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

        {/* ─── CENA PRIVADA — ☀️ blanco ─── */}
        <section className="bg-[#F5F7FA] py-20 md:py-28">
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
      </div>

      {/* ── Photo break — panel completo ── */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img src={PHOTOS.panel} alt="Panel de expertos Comprando América" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-[#F5F7FA]/50" />
      </section>

      {/* ═══ ECOSISTEMA — navy ═══ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-blue-400 text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">Ecosistema</p>
              <h2 className="text-3xl md:text-4xl text-white mb-6">Los eventos son solo una parte del ecosistema</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-10">
                Muchos de los participantes continúan su proceso a través del club de inversión, accediendo a oportunidades y estructurando su empresa en Estados Unidos.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/membresia">
                  <Button className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25">
                    Conocer el Club de Inversión <ArrowRight className="w-4 h-4" />
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
                <a href="/perfil">
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
