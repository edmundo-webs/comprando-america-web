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
  Users,
  Compass,
  Utensils,
  Trophy,
  ShieldCheck,
  Lock,
  Handshake,
} from "lucide-react";

/* ─── Animated wrapper ─── */
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

/* ─── SEO Head ─── */
function SEOHead() {
  useEffect(() => {
    document.title =
      "Eventos y Experiencias para Inversionistas | Comprando América";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Participa en eventos presenciales, viajes de inspección y encuentros privados para empresarios e inversionistas en Estados Unidos."
      );
    }
  }, []);
  return null;
}

/* ─── Cloudinary event photos ─── */
const CLOUD_BASE = "https://res.cloudinary.com/dofccqypz/image/upload";
function eventImg(id: string, v: string, w = 800, h = 500) {
  return `${CLOUD_BASE}/c_fill,w_${w},h_${h},g_auto,q_auto,f_auto/v${v}/comprando-america/eventos/${id}.jpg`;
}

const PHOTOS = {
  cumbre: eventImg("fou8skfadwce2lodr5yc", "1774537561", 1200, 600),
  panel: eventImg("xvdkaaxpavgr9lrybk8g", "1774537558", 1200, 600),
  cena: eventImg("n8lkmvpmlrnco9etkxfb", "1774537526", 1200, 600),
  networking: eventImg("hpwrp8ofq5delfnpo9ro", "1774537559", 1200, 600),
  salon: eventImg("jqyrqajkj4czyxgdnlni", "1774537565", 1200, 600),
  inspeccion: eventImg("uefjxoxi5trojtoeivha", "1774537564", 1200, 600),
  presentacion: eventImg("apk6qpfofrvwvwkovbdm", "1774537566", 1200, 600),
  ruta: eventImg("ddhzlxysdvxcfrwhhlhk", "1774537527", 1200, 600),
};

const WA_LISTA = "Hola, me interesa unirme a la lista prioritaria de eventos de Comprando América.";
const WA_GENERAL = "Hola, me interesa participar en los eventos de Comprando América.";

/* ═══════════════════════════════════════════════════════ */

export default function Eventos() {
  const scrollToEventos = () => {
    document
      .getElementById("proximos-eventos")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead />
      <Navbar />

      {/* ═══ 1. HERO ═══ */}
      <section className="relative isolate min-h-[85vh] flex items-center pt-20 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://lh3.googleusercontent.com/d/1gnZX2RiYD4M29nQmqwcsN0k13db74LmV=w1920" alt="Comunidad de inversionistas en evento" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/90 via-[#0B1F3A]/75 to-[#0B1F3A]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-[#0B1F3A]/30" />
        </div>

        <div className="container relative z-10">
          <FadeIn>
            <div className="max-w-3xl">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
                Experiencias & Eventos
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
                Experiencias diseñadas para empresarios que quieren invertir y
                expandirse hacia Estados Unidos
              </h1>
              <p className="text-white/60 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
                Participa en eventos, viajes de inspección y encuentros privados
                donde se analizan oportunidades reales y se construyen
                relaciones estratégicas.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Button
                  onClick={scrollToEventos}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/20"
                >
                  Ver próximos eventos <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_LISTA)}
                  className="border-[#2A4A6B] text-white hover:bg-[#1E3A5F] px-8 py-6 text-base gap-2"
                >
                  Unirme a lista prioritaria
                </Button>
              </div>

              <div className="flex flex-wrap gap-6 text-white/50 text-sm">
                <span className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-primary" /> Eventos
                  presenciales
                </span>
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" /> Espacios privados
                </span>
                <span className="flex items-center gap-2">
                  <Handshake className="w-4 h-4 text-primary" /> Networking
                  estratégico
                </span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 2. INTRO CONTEXTUAL ═══ */}
      <section className="section-darker py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                Las oportunidades no se entienden desde una pantalla…
                <br />
                <span className="text-primary">se viven en el terreno</span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Comprando América organiza experiencias donde empresarios
                pueden:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "Analizar oportunidades de inversión en persona",
                  "Visitar proyectos reales en operación",
                  "Conectar con otros inversionistas activos",
                  "Tomar decisiones con contexto real y directo",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-white/60">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ PRÓXIMOS EVENTOS ═══ */}
      <div id="proximos-eventos">
        {/* ─── BLOQUE 1: RUTA INMOBILIARIA ─── */}
        <section className="section-dark py-20 md:py-28 overflow-hidden">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <FadeIn>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-blue-500/20 shadow-2xl shadow-primary/10">
                  <img
                    src={PHOTOS.ruta}
                    alt="Ruta Inmobiliaria en Estados Unidos"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/90 text-white text-xs font-semibold uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-[#0F2847] animate-pulse" />
                      Próximo evento
                    </div>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <div>
                  <Compass className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-3xl md:text-4xl text-white mb-3">
                    Ruta Inmobiliaria en Estados Unidos
                  </h3>
                  <p className="text-white/60 text-lg leading-relaxed mb-6">
                    Un evento presencial donde analizamos oportunidades reales en
                    bienes raíces.
                  </p>

                  <div className="space-y-3 mb-6">
                    {[
                      "Conocer proyectos en operación",
                      "Entender estructuras de inversión",
                      "Conectar con otros inversionistas",
                      "Evaluar oportunidades con contexto real",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-white/60 text-sm">{item}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4 text-white/60 text-sm mb-8">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" /> Monterrey
                    </span>
                    <span className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-primary" /> 18 abril
                      2026
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <a href="/ruta-inmobiliaria-en-estados-unidos">
                      <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
                        Reservar mi lugar <ArrowRight className="w-4 h-4" />
                      </Button>
                    </a>
                    <a href="/ruta-inmobiliaria-en-estados-unidos">
                      <Button
                        variant="outline"
                        className="border-[#2A4A6B] text-white hover:bg-[#1E3A5F] gap-2"
                      >
                        Ver detalles
                      </Button>
                    </a>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ─── BLOQUE 2: INVESTMENT WEEK ─── */}
        <section className="section-darker py-20 md:py-28 overflow-hidden">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <FadeIn delay={0.1} className="order-2 lg:order-1">
                <div>
                  <MapPin className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-3xl md:text-4xl text-white mb-3">
                    Florida Investment Week
                  </h3>
                  <p className="text-white/60 text-lg leading-relaxed mb-6">
                    Viaje de inspección donde visitamos oportunidades y
                    analizamos proyectos directamente en Estados Unidos.
                  </p>

                  <div className="space-y-3 mb-6">
                    {[
                      "Visitas a propiedades reales en operación",
                      "Entender estructuras de inversión en sitio",
                      "Analizar inversiones con expertos locales",
                      "Tomar decisiones con información directa",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-white/60 text-sm">{item}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4 text-white/60 text-sm mb-8">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" /> Florida, EE.UU.
                    </span>
                    <span className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-primary" /> 1–4 mayo
                      2026
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <a href="/investment-week">
                      <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
                        Aplicar al viaje <ArrowRight className="w-4 h-4" />
                      </Button>
                    </a>
                    <a href="/investment-week">
                      <Button
                        variant="outline"
                        className="border-[#2A4A6B] text-white hover:bg-[#1E3A5F] gap-2"
                      >
                        Ver detalles
                      </Button>
                    </a>
                  </div>
                </div>
              </FadeIn>

              <FadeIn className="order-1 lg:order-2">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-blue-500/20 shadow-2xl shadow-primary/10">
                  <img
                    src={PHOTOS.inspeccion}
                    alt="Florida Investment Week — Viaje de inspección"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/90 text-white text-xs font-semibold uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-[#0F2847] animate-pulse" />
                      Mayo 2026
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ─── BLOQUE 3: CUMBRE ─── */}
        <section className="section-dark py-20 md:py-28 overflow-hidden">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <FadeIn>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#1E3A5F] shadow-2xl">
                  <img
                    src={PHOTOS.cumbre}
                    alt="Cumbre de Emprendimiento e Inversiones Estratégicas"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F2847]/10 backdrop-blur-sm text-white/80 text-xs font-semibold uppercase tracking-wider">
                      En planeación
                    </div>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <div>
                  <Trophy className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-3xl md:text-4xl text-white mb-3">
                    Cumbre de Emprendimiento e Inversiones Estratégicas
                  </h3>
                  <p className="text-white/60 text-lg leading-relaxed mb-6">
                    Evento diseñado para empresarios que buscan entender cómo
                    expandirse hacia Estados Unidos con estructura y estrategia.
                  </p>

                  <div className="space-y-3 mb-8">
                    {[
                      "Modelos de inversión probados",
                      "Estructura empresarial en EE.UU.",
                      "Oportunidades evaluadas",
                      "Networking de alto nivel",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-white/60 text-sm">{item}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-white/50 text-sm mb-6 italic">
                    Próxima edición en planeación
                  </p>

                  <Button
                    onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_LISTA)}
                    className="bg-primary hover:bg-primary/90 text-white gap-2"
                  >
                    Unirme a lista de espera <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ─── BLOQUE 4: CENA PRIVADA ─── */}
        <section className="section-darker py-20 md:py-28 overflow-hidden">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <FadeIn delay={0.1} className="order-2 lg:order-1">
                <div>
                  <Utensils className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-3xl md:text-4xl text-white mb-3">
                    Cena privada de inversión
                  </h3>
                  <p className="text-white/60 text-lg leading-relaxed mb-6">
                    Encuentros exclusivos donde se analizan oportunidades en un
                    ambiente más cercano e íntimo.
                  </p>

                  <div className="space-y-3 mb-8">
                    {[
                      "Conversaciones estratégicas en grupo reducido",
                      "Networking de alto nivel",
                      "Análisis de oportunidades en contexto privado",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-white/60 text-sm">{item}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-white/50 text-sm mb-6 italic">
                    Próximas fechas por anunciar
                  </p>

                  <Button
                    onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_LISTA)}
                    className="bg-primary hover:bg-primary/90 text-white gap-2"
                  >
                    Unirme a lista prioritaria{" "}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </FadeIn>

              <FadeIn className="order-1 lg:order-2">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#1E3A5F] shadow-2xl">
                  <img
                    src={PHOTOS.cena}
                    alt="Cena privada de inversión"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F2847]/10 backdrop-blur-sm text-white/80 text-xs font-semibold uppercase tracking-wider">
                      Por anunciar
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
      </div>

      {/* ═══ 6. FILTRO ═══ */}
      <section className="section-dark py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <ShieldCheck className="w-10 h-10 text-primary mb-4" />
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                Estos espacios no son para todos
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Los eventos están dirigidos a empresarios e inversionistas que:
              </p>
              <div className="space-y-4">
                {[
                  "Buscan expandirse hacia Estados Unidos con estructura",
                  "Tienen interés real en inversión y crecimiento patrimonial",
                  "Valoran el análisis estratégico antes de tomar decisiones",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-white/60 text-lg">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 7. CTA INTERMEDIO ═══ */}
      <section className="section-darker py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-8">
                ¿Te interesa participar en estas experiencias?
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_GENERAL)}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/20"
                >
                  WhatsApp <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_LISTA)}
                  className="border-[#2A4A6B] text-white hover:bg-[#1E3A5F] px-8 py-6 text-base gap-2"
                >
                  Lista de espera
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 8. CONEXIÓN CON ECOSISTEMA ═══ */}
      <section className="section-dark py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">
                Ecosistema
              </p>
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                Los eventos son solo una parte del ecosistema
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-10">
                Muchos de los participantes continúan su proceso a través de la
                membresía, accediendo a oportunidades y estructurando su empresa
                en Estados Unidos.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/membresia">
                  <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/20">
                    Conocer membresía <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <a href="/oportunidades-de-inversion-en-estados-unidos">
                  <Button
                    variant="outline"
                    className="border-[#2A4A6B] text-white hover:bg-[#1E3A5F] px-8 py-6 text-base gap-2"
                  >
                    Ver oportunidades
                  </Button>
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 9. CTA FINAL ═══ */}
      <section className="section-darker py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                Accede a experiencias donde se toman decisiones reales
              </h2>
              <p className="text-white/50 text-sm mb-10">
                Los mejores espacios no se publican. Se comparten.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  onClick={scrollToEventos}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/20"
                >
                  Ver eventos <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_LISTA)}
                  className="border-[#2A4A6B] text-white hover:bg-[#1E3A5F] px-8 py-6 text-base gap-2"
                >
                  Lista prioritaria
                </Button>
                <Button
                  variant="outline"
                  onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_GENERAL)}
                  className="border-[#2A4A6B] text-white hover:bg-[#1E3A5F] px-8 py-6 text-base gap-2"
                >
                  WhatsApp
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
