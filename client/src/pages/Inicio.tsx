import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useInView } from "@/hooks/useInView";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { openWhatsApp, WHATSAPP_PHONE } from "@/lib/whatsapp";
import {
  ArrowRight,
  Compass,
  Landmark,
  Globe,
  TrendingUp,
  Building2,
  Home as HomeIcon,
  Key,
  Sparkles,
  Mic,
  Youtube,
  Instagram,
  Linkedin,
  Facebook,
  Music2,
  BookOpen,
  Newspaper,
  BarChart3,
  CheckCircle2,
  Plane,
  MessageCircle,
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
const PAGE_SEO = {
  title: "Comprando América | ¿Qué estás intentando construir en Estados Unidos?",
  description:
    "Comprando América es el Mapa Patrimonial que ayuda a empresarios a entender qué estrategia tiene sentido para ellos en Estados Unidos, antes de analizar cualquier proyecto o propiedad.",
  path: "/inicio",
};

/* ─── Photos (reused from the site's existing team/leadership content) ─── */
const EDMUNDO_PHOTO = "https://lh3.googleusercontent.com/d/1Um6fwMpl_mMyAZWmF1hWVdnLYpJCp0Kz=w800";
const JOE_PHOTO = "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439239/comprando-america/YfxVlywHHLmCeDRI.png";
const TOMAS_PHOTO = "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439162/comprando-america/QGuNYwiuoAkxjDwj.png";
const DANIEL_PHOTO = "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439036/comprando-america/CPGtnnreqZlWVzgL.png";

/* ─── Data ─── */
const COMPASS_ROUTES = [
  {
    icon: Landmark,
    title: "Arquitectura Patrimonial",
    summary: "Cómo pensamos la construcción de patrimonio a través de bienes raíces: fondos, programas de renta y propiedades seleccionadas.",
    ctaLabel: "Explorar la arquitectura",
    href: "/arquitectura-patrimonial",
    pos: { left: "50%", top: "6%" },
  },
  {
    icon: Globe,
    title: "Estrategia Migratoria",
    summary: "Cómo estructurar una inversión que además tenga sentido para un proceso migratorio, como la visa E-2 de inversionista.",
    ctaLabel: "Explorar la estrategia",
    href: "/visa-e2-inversion-en-estados-unidos",
    pos: { left: "89%", top: "27%" },
  },
  {
    icon: TrendingUp,
    title: "Expansión Empresarial",
    summary: "Cómo llevar una empresa que ya opera en Latinoamérica a competir y crecer dentro del mercado estadounidense.",
    ctaLabel: "Explorar la expansión",
    href: "/expansion-internacional-empresas",
    pos: { left: "89%", top: "73%" },
  },
  {
    icon: HomeIcon,
    title: "Bienes Raíces como Patrimonio",
    summary: "Por qué los bienes raíces en Estados Unidos son, para muchos empresarios, la puerta de entrada más clara a la inversión.",
    ctaLabel: "Explorar bienes raíces",
    href: "/bienes-raices-en-usa",
    pos: { left: "50%", top: "94%" },
  },
  {
    icon: Building2,
    title: "Compra de Empresas",
    summary: "Adquirir un negocio que ya opera en Estados Unidos, en lugar de construirlo desde cero. Una ruta que todavía estamos preparando en el sitio.",
    ctaLabel: "Conversar sobre esta ruta",
    href: null,
    pos: { left: "11%", top: "73%" },
  },
  {
    icon: Sparkles,
    title: "Nuevas Oportunidades",
    summary: "Oportunidades filtradas y evaluadas por el equipo, fuera de las rutas tradicionales, para empresarios que ya tienen claridad de su perfil.",
    ctaLabel: "Ver oportunidades",
    href: "/oportunidades-de-inversion-en-estados-unidos",
    pos: { left: "11%", top: "27%" },
  },
];

const VEHICLES = [
  {
    icon: Landmark,
    title: "Fondo de Compra de Tierra Estratégica",
    href: "/tierra-estrategica",
  },
  {
    icon: HomeIcon,
    title: "Programa de renta de vivienda garantizada por el gobierno",
    href: "/renta-garantizada",
  },
  {
    icon: Key,
    title: "Propiedades seleccionadas",
    href: "/activos-disponibles",
  },
  {
    icon: Globe,
    title: "Compra de propiedades para estrategia migratoria",
    href: "/visa-e2-inversion-en-estados-unidos",
  },
];

const FREE_CONTENT = [
  {
    icon: Mic,
    title: "Podcast",
    description: "Conversaciones sobre inversión, estructura legal y decisiones patrimoniales en Estados Unidos.",
    href: "/podcast",
    external: false,
  },
  {
    icon: Youtube,
    title: "YouTube",
    description: "Análisis, entrevistas y recorridos por propiedades y proyectos reales.",
    href: "https://www.youtube.com/@ComprandoAmerica",
    external: true,
  },
  {
    icon: Instagram,
    title: "Instagram",
    description: "Contenido detrás de cámaras de nuestros eventos, viajes de inspección y comunidad.",
    href: "https://www.instagram.com/edmundotrevino.usa/",
    external: true,
  },
  {
    icon: Linkedin,
    title: "LinkedIn",
    description: "Perspectiva más profesional sobre expansión empresarial y estructura en Estados Unidos.",
    href: null,
    external: true,
  },
  {
    icon: Facebook,
    title: "Facebook",
    description: "Comunidad, transmisiones en vivo y anuncios de próximos eventos.",
    href: "https://www.facebook.com/edmundotrevino.usa",
    external: true,
  },
  {
    icon: Music2,
    title: "Spotify",
    description: "El podcast, en formato audio, para escuchar mientras te mueves.",
    href: "https://open.spotify.com/show/1pYUGyRRFXgA0c9xpaEtw7",
    external: true,
  },
  {
    icon: BookOpen,
    title: "Blog",
    description: "Artículos a profundidad sobre estrategia, estructura legal y bienes raíces.",
    href: "/blog",
    external: false,
  },
  {
    icon: Newspaper,
    title: "Noticias",
    description: "Actualidad económica y regulatoria explicada desde la perspectiva del inversionista latinoamericano.",
    href: "/news",
    external: false,
  },
  {
    icon: BarChart3,
    title: "Análisis",
    description: "Lectura editorial de mercados, visas y bienes raíces, más allá de la noticia del día.",
    href: "/news",
    external: false,
  },
];

const STORIES = [
  {
    name: "Carlos",
    city: "Monterrey",
    objetivo: "Estructurar correctamente su expansión a Estados Unidos.",
    ruta: "Estructura Empresarial",
    resultado: "LLC estructurada y networking empresarial dentro de la comunidad.",
    quote: "Entré buscando cómo estructurar mi expansión a Estados Unidos. El equipo me ayudó a abrir mi LLC correctamente y entender la estructura fiscal.",
  },
  {
    name: "Alejandro",
    city: "Ciudad de México",
    objetivo: "Aplicar a una visa de inversionista con el capital que ya tenía disponible.",
    ruta: "Estrategia Migratoria",
    resultado: "Proyecto estructurado y proceso migratorio en marcha.",
    quote: "Yo ya tenía el capital pero no sabía cómo estructurar la inversión para aplicar a una visa. Con el acompañamiento del equipo logramos estructurar el proyecto y hoy mi proceso migratorio está en marcha.",
  },
  {
    name: "Jorge",
    city: "Guadalajara",
    objetivo: "Dar el primer paso como inversionista en Estados Unidos.",
    ruta: "Arquitectura Patrimonial",
    resultado: "Primera inversión ejecutada dentro de un proyecto ya estructurado.",
    quote: "Lo que más valoré fue que aquí no solo analizan oportunidades, las ejecutan. A través de la comunidad conocí un proyecto que ya estaba estructurado y hoy ya soy inversionista.",
  },
  {
    name: "Mariana",
    city: "Bogotá",
    objetivo: "Expandir su empresa hacia el mercado estadounidense.",
    ruta: "Expansión Empresarial",
    resultado: "Estructura legal y networking necesarios para expandirse con seguridad.",
    quote: "Como empresaria buscaba expandir mi negocio a Estados Unidos. Comprando América me proporcionó la estructura legal y el networking necesario para hacerlo de forma segura.",
  },
];

const TEAM = [
  {
    name: "Edmundo Treviño",
    role: "Fundador y CEO",
    photo: EDMUNDO_PHOTO,
    aporta: "Más de 20 años operando entre México y Estados Unidos, y la experiencia de haber fundado y operado más de 9 empresas activas en ambos países.",
    decisiones: "Cómo estructurar, operar y escalar un negocio en Estados Unidos sin repetir los errores que ya cuestan caro.",
  },
  {
    name: "Joe Faraci",
    role: "Inversionista en Bienes Raíces",
    photo: JOE_PHOTO,
    aporta: "28 años de experiencia y más de 250 propiedades operando, especializado en construir riqueza transgeneracional con bienes raíces.",
    decisiones: "Qué vehículo inmobiliario tiene sentido según tu perfil patrimonial y tu horizonte de tiempo.",
  },
  {
    name: "Tomás Resendez",
    role: "Abogado de Inmigración",
    photo: TOMAS_PHOTO,
    aporta: "Experiencia en inmigración corporativa, incluyendo casos representando a empresas Fortune 100.",
    decisiones: "Qué ruta migratoria corresponde a tu estrategia de inversión, y qué implica en términos legales.",
  },
  {
    name: "Daniel Palacios",
    role: "Contador CPA y Fiscalista",
    photo: DANIEL_PHOTO,
    aporta: "Especialista en contabilidad empresarial y planeación fiscal para empresas y socios latinos en Estados Unidos.",
    decisiones: "Cómo estructurar fiscalmente una inversión para que sea eficiente, y no solo legal.",
  },
];

/* ─── Reusable panel (Apple-style: opens in place, never navigates away) ─── */
function Panel({
  trigger,
  title,
  children,
}: {
  trigger: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full text-left">{trigger}</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-white text-[#0B1F3A] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#0B1F3A]">{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export default function Inicio() {
  const [activeStory, setActiveStory] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white overflow-x-hidden">
      <SEOHead {...PAGE_SEO} />
      <Navbar />

      {/* ═══ 1. HERO — autodiagnóstico, no slogan ═══ */}
      <section className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0E2544] via-[#0B1F3A] to-[#0B1F3A]" />
        <div className="container relative z-10">
          <FadeIn>
            <div className="max-w-3xl">
              <p className="text-blue-400 text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
                Comprando América
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
                ¿Qué estás intentando <span className="gradient-text-primary">construir realmente?</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-4 max-w-2xl">
                No todos los empresarios llegan buscando lo mismo. Algunos quieren proteger el patrimonio que les tomó décadas construir. Otros buscan generar flujo. Otros evalúan una estrategia migratoria. Algunos quieren expandir su empresa. Y otros simplemente quieren dejar de tomar decisiones solos.
              </p>
              <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
                Comprando América existe para ayudarte a descubrir cuál es la estrategia que realmente hace sentido para ti.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="/gps">
                  <Button className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25">
                    Descubre cuál es tu ruta patrimonial <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <a href="#como-pensamos">
                  <Button variant="outline" className="border-slate-600 text-white hover:bg-white/10 px-8 py-6 text-base gap-2">
                    Conoce cómo pensamos
                  </Button>
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 2. EL ERROR MÁS COMÚN — ☀️ blanco ═══ */}
      <section id="como-pensamos" className="bg-white py-20 md:py-28 scroll-mt-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <FadeIn>
              <div>
                <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-6">El error más común</h2>
                <p className="text-[#4B5563] text-lg leading-relaxed mb-4">
                  La mayoría empieza preguntando <strong className="text-[#0B1F3A]">¿qué compro?</strong> Nosotros empezamos preguntando <strong className="text-[#0B1F3A]">¿qué estás construyendo?</strong>
                </p>
                <p className="text-[#0B1F3A] text-lg font-semibold leading-relaxed">
                  Porque dependiendo de esa respuesta, la misma propiedad puede ser una excelente decisión o una muy mala.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="flex flex-col gap-4 max-w-sm mx-auto">
                <div className="px-6 py-5 rounded-xl border border-gray-200 bg-[#F5F7FA] text-center">
                  <p className="text-xs uppercase tracking-wider text-[#9CA3AF] font-semibold mb-2">La mayoría empieza aquí</p>
                  <p className="text-[#6B7280] text-lg">¿Qué compro?</p>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="w-5 h-5 text-primary rotate-90" />
                </div>
                <div className="px-6 py-5 rounded-xl border border-blue-200 bg-blue-50 text-center">
                  <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-2">Nosotros empezamos aquí</p>
                  <p className="text-[#0B1F3A] text-lg font-semibold">¿Qué estás construyendo?</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ 3. GRUPO EMPRESARIAL — brújula — navy ═══ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl text-white mb-4">
                El centro del ecosistema: el <span className="text-primary">Grupo Empresarial de Edmundo</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                No es un producto. Es la comunidad desde la que nacen todas las rutas. Elige una para profundizar, sin salir de esta página.
              </p>
            </div>
          </FadeIn>

          {/* Desktop: compass layout */}
          <FadeIn delay={0.1}>
            <div className="hidden md:block relative mx-auto" style={{ width: "min(90vw, 640px)", height: "min(90vw, 640px)" }}>
              <a
                href="/grupo-empresarial-edmundo"
                className="absolute z-10 flex flex-col items-center justify-center text-center rounded-full bg-primary hover:bg-blue-600 transition-colors shadow-lg shadow-blue-600/30"
                style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: "34%", height: "34%" }}
              >
                <Compass className="w-8 h-8 text-white mb-2" />
                <span className="text-white font-semibold text-sm leading-tight px-2">Grupo Empresarial</span>
              </a>
              {COMPASS_ROUTES.map((route, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{ left: route.pos.left, top: route.pos.top, transform: "translate(-50%, -50%)", width: "30%" }}
                >
                  <Panel
                    title={route.title}
                    trigger={
                      <div className="flex flex-col items-center gap-2 text-center cursor-pointer group">
                        <div className="w-16 h-16 rounded-full bg-[#0F2847] border border-[#1E3A5F] group-hover:border-primary flex items-center justify-center transition-colors">
                          <route.icon className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-white text-xs font-medium leading-tight">{route.title}</span>
                      </div>
                    }
                  >
                    <DialogDescription className="text-[#4B5563] text-base leading-relaxed">
                      {route.summary}
                    </DialogDescription>
                    <div className="mt-4">
                      {route.href ? (
                        <a href={route.href}>
                          <Button className="bg-primary hover:bg-blue-600 text-white gap-2">
                            {route.ctaLabel} <ArrowRight className="w-4 h-4" />
                          </Button>
                        </a>
                      ) : (
                        <Button
                          onClick={() => openWhatsApp(WHATSAPP_PHONE, `Hola, me interesa conversar sobre la ruta de ${route.title}.`)}
                          className="bg-primary hover:bg-blue-600 text-white gap-2"
                        >
                          {route.ctaLabel} <MessageCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </Panel>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Mobile fallback: simple list */}
          <div className="md:hidden grid grid-cols-2 gap-4 max-w-md mx-auto">
            {COMPASS_ROUTES.map((route, i) => (
              <Panel
                key={i}
                title={route.title}
                trigger={
                  <div className="flex flex-col items-center gap-2 text-center cursor-pointer bg-[#0F2847] border border-[#1E3A5F] rounded-xl p-4 h-full">
                    <route.icon className="w-6 h-6 text-primary" />
                    <span className="text-white text-xs font-medium leading-tight">{route.title}</span>
                  </div>
                }
              >
                <DialogDescription className="text-[#4B5563] text-base leading-relaxed">
                  {route.summary}
                </DialogDescription>
                <div className="mt-4">
                  {route.href ? (
                    <a href={route.href}>
                      <Button className="bg-primary hover:bg-blue-600 text-white gap-2">
                        {route.ctaLabel} <ArrowRight className="w-4 h-4" />
                      </Button>
                    </a>
                  ) : (
                    <Button
                      onClick={() => openWhatsApp(WHATSAPP_PHONE, `Hola, me interesa conversar sobre la ruta de ${route.title}.`)}
                      className="bg-primary hover:bg-blue-600 text-white gap-2"
                    >
                      {route.ctaLabel} <MessageCircle className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </Panel>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. ARQUITECTURA PATRIMONIAL — resumen — ☀️ ligero ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center mb-14">
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-4">Vehículos Patrimoniales</h2>
              <p className="text-[#4B5563] text-lg leading-relaxed">
                No los llamamos productos. Son vehículos: cada uno construido para un perfil distinto de empresario dentro de la Arquitectura Patrimonial.
              </p>
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto mb-8">
            {VEHICLES.map((v, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <a
                  href={v.href}
                  className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-primary/30 transition-all group h-full"
                >
                  <div className="w-11 h-11 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0">
                    <v.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[#0B1F3A] font-semibold leading-snug">{v.title}</p>
                    <span className="text-primary text-sm font-medium inline-flex items-center gap-1 mt-1 group-hover:gap-2 transition-all">
                      Ver estrategia <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </a>
              </FadeIn>
            ))}
          </div>
          <FadeIn>
            <p className="text-center text-[#6B7280] text-sm max-w-xl mx-auto">
              No todo será siempre bienes raíces. A medida que existan otras oportunidades evaluadas por el equipo, aparecerán aquí.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 5. CÓMO APRENDEMOS ANTES DE DECIDIR — navy ═══ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center mb-14">
              <h2 className="text-3xl md:text-4xl text-white mb-4">¿Cómo aprendemos antes de decidir?</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Antes de formar parte del Grupo Empresarial, puedes pasar meses aprendiendo con nosotros sin pagar un solo dólar.
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {FREE_CONTENT.map((item, i) => (
              <FadeIn key={i} delay={i * 0.04}>
                <Panel
                  title={item.title}
                  trigger={
                    <div className="flex flex-col items-center text-center gap-2 bg-[#0F2847] border border-[#1E3A5F] rounded-xl p-5 h-full cursor-pointer hover:border-primary/50 transition-colors">
                      <item.icon className="w-6 h-6 text-primary" />
                      <span className="text-white text-sm font-medium">{item.title}</span>
                    </div>
                  }
                >
                  <DialogDescription className="text-[#4B5563] text-base leading-relaxed">
                    {item.description}
                  </DialogDescription>
                  {item.href && (
                    <div className="mt-4">
                      {item.external ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer">
                          <Button className="bg-primary hover:bg-blue-600 text-white gap-2">
                            Ver contenido <ArrowRight className="w-4 h-4" />
                          </Button>
                        </a>
                      ) : (
                        <a href={item.href}>
                          <Button className="bg-primary hover:bg-blue-600 text-white gap-2">
                            Ver contenido <ArrowRight className="w-4 h-4" />
                          </Button>
                        </a>
                      )}
                    </div>
                  )}
                </Panel>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 6. CASOS REALES — ☀️ blanco ═══ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-14 text-center">Casos reales</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {STORIES.map((story, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <button onClick={() => setActiveStory(i)} className="w-full text-left">
                  <div className="bg-[#F5F7FA] border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-primary/30 transition-all h-full">
                    <p className="text-[#0B1F3A] font-semibold mb-1">{story.name} · {story.city}</p>
                    <p className="text-primary text-sm font-medium mb-3">{story.ruta}</p>
                    <p className="text-[#4B5563] text-sm leading-relaxed">{story.objetivo}</p>
                  </div>
                </button>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={activeStory !== null} onOpenChange={(open) => !open && setActiveStory(null)}>
        <DialogContent className="sm:max-w-lg bg-white text-[#0B1F3A] max-h-[85vh] overflow-y-auto">
          {activeStory !== null && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl text-[#0B1F3A]">
                  {STORIES[activeStory].name} · {STORIES[activeStory].city}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1">Objetivo</p>
                  <p className="text-[#374151] text-sm">{STORIES[activeStory].objetivo}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1">Ruta</p>
                  <p className="text-primary text-sm font-semibold">{STORIES[activeStory].ruta}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1">Resultado</p>
                  <p className="text-[#374151] text-sm">{STORIES[activeStory].resultado}</p>
                </div>
                <blockquote className="border-l-2 border-primary/30 pl-4 text-[#4B5563] text-sm italic leading-relaxed">
                  "{STORIES[activeStory].quote}"
                </blockquote>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ═══ 7. CONOCE AL EQUIPO — navy ═══ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center mb-14">
              <h2 className="text-3xl md:text-4xl text-white mb-4">Conoce al equipo</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                No los presentamos como staff. Los presentamos como criterio: cada uno ayuda a resolver un tipo distinto de decisión.
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 max-w-4xl mx-auto">
            {TEAM.map((member, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <Panel
                  title={member.name}
                  trigger={
                    <div className="flex flex-col items-center text-center gap-3 cursor-pointer group">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#1E3A5F] group-hover:border-primary transition-colors">
                        <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold leading-tight">{member.name}</p>
                        <p className="text-slate-500 text-xs mt-1">{member.role}</p>
                      </div>
                    </div>
                  }
                >
                  <p className="text-primary text-sm font-semibold uppercase tracking-wide mb-4">{member.role}</p>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1">Qué aporta</p>
                      <p className="text-[#374151] text-sm leading-relaxed">{member.aporta}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1">Qué decisiones ayuda a tomar</p>
                      <p className="text-[#374151] text-sm leading-relaxed">{member.decisiones}</p>
                    </div>
                  </div>
                </Panel>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 8. INVESTMENT WEEK — ☀️ blanco ═══ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6">
                <Plane className="w-4 h-4 text-primary" />
                <span className="text-primary text-sm font-semibold tracking-wide uppercase">Evento ocasional</span>
              </div>
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-6">
                Hay inversiones que se entienden leyendo. Y hay inversiones que solo se entienden caminándolas.
              </h2>
              <p className="text-[#4B5563] text-lg leading-relaxed mb-10">
                Investment Week es una experiencia presencial y ocasional para ver de cerca cómo se analiza una inversión antes de comprometer capital.
              </p>
              <a href="/investment-week">
                <Button variant="outline" className="border-gray-300 text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white px-8 py-6 text-base gap-2">
                  Conocer Investment Week <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 9. EVALÚA TU PERFIL — navy ═══ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-6">Evalúa tu perfil</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-10">
                Ya conoces cómo pensamos, qué rutas existen y quién te acompaña en el camino. El siguiente paso es entender, con base en tu propio perfil, cuál de estas rutas hace sentido para ti.
              </p>
              <a href="/gps">
                <Button className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25">
                  Evaluar mi perfil <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 10. CTA FINAL — deep navy ═══ */}
      <section className="bg-[#091A30] py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-6">Conversemos sobre tu estrategia.</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-10">
                Aquí no te estamos ofreciendo una inversión. Te estamos ayudando a ordenar una decisión que probablemente marcará el rumbo de tu patrimonio durante los próximos veinte años.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  onClick={() => openWhatsApp(WHATSAPP_PHONE, "Hola, me gustaría conversar sobre mi estrategia patrimonial en Estados Unidos.")}
                  className="bg-primary hover:bg-blue-600 text-white px-10 py-6 text-lg gap-2 shadow-lg shadow-blue-600/25"
                >
                  Conversemos sobre tu estrategia <MessageCircle className="w-5 h-5" />
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
