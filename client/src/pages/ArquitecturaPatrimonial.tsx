import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useInView } from "@/hooks/useInView";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  Shield,
  Banknote,
  Globe,
  Compass as CompassIcon,
  TrendingUp,
  Landmark,
  Home as HomeIcon,
  Hammer,
  CreditCard,
  Briefcase,
  Sparkles,
  Plane,
  Users,
  MessageCircle,
  Mic,
  Youtube,
  Linkedin,
  BookOpen,
  Newspaper,
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
  title: "Arquitectura Patrimonial en Estados Unidos | Comprando América",
  description:
    "Antes de elegir una propiedad, primero hay que entender qué papel debe jugar dentro de tu patrimonio. Cómo Comprando América piensa la estrategia inmobiliaria en Estados Unidos.",
  path: "/arquitectura-patrimonial",
};

/* ─── Reusable panel: opens in place, never navigates away ─── */
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

/* ─── Data: Mapa Patrimonial — objetivos ─── */
const OBJECTIVES = [
  {
    icon: Shield,
    title: "Protección patrimonial",
    description: "Preservar lo que ya construiste, sin exponerlo a riesgos innecesarios ni a la volatilidad de un solo país.",
    vehicles: "Fondo de Compra de Tierra Estratégica, Compra de propiedades para generar flujo.",
    pos: { left: "50%", top: "6%" },
  },
  {
    icon: Banknote,
    title: "Flujo de efectivo",
    description: "Generar ingresos recurrentes a partir de un activo, no solo una apreciación que solo existe en papel.",
    vehicles: "Programa de renta de vivienda garantizada por el gobierno, Compra de propiedades para generar flujo.",
    pos: { left: "89%", top: "27%" },
  },
  {
    icon: Globe,
    title: "Diversificación internacional",
    description: "Reducir la dependencia de un solo país, una sola moneda o un solo mercado.",
    vehicles: "Fondo de Compra de Tierra Estratégica, Oportunidades especiales.",
    pos: { left: "89%", top: "73%" },
  },
  {
    icon: CompassIcon,
    title: "Estrategia migratoria",
    description: "Que la inversión, además de tener sentido patrimonial, sostenga un proceso migratorio real.",
    vehicles: "Compra de propiedades ligadas a estrategia migratoria.",
    pos: { left: "50%", top: "94%" },
  },
  {
    icon: TrendingUp,
    title: "Crecimiento patrimonial",
    description: "Multiplicar el valor del patrimonio a través del tiempo, no solo conservarlo.",
    vehicles: "Remodelación y venta de propiedades, Compra de negocios con componente inmobiliario.",
    pos: { left: "11%", top: "73%" },
  },
  {
    icon: Users,
    title: "Legado familiar",
    description: "Construir algo que pueda heredarse con estructura, no solo con buena intención.",
    vehicles: "Fondo de Compra de Tierra Estratégica, Programa de renta de vivienda garantizada por el gobierno.",
    pos: { left: "11%", top: "27%" },
  },
];

/* ─── Data: Vehículos Patrimoniales ─── */
const VEHICLES = [
  {
    icon: Landmark,
    title: "Fondo de Compra de Tierra Estratégica",
    paraQuien: "Empresarios que quieren construir patrimonio sin administrar directamente un proyecto inmobiliario.",
    problema: "No tener el tiempo, la estructura o el interés en operar un activo directamente.",
    objetivo: "Protección patrimonial, diversificación internacional y legado familiar.",
    perfil: "Perfil pasivo, con horizonte de largo plazo.",
    href: "/tierra-estrategica",
    ctaLabel: "Conocer la estrategia",
  },
  {
    icon: HomeIcon,
    title: "Programa de renta de vivienda garantizada por el gobierno",
    paraQuien: "Empresarios que quieren ser propietarios de un activo específico y generar flujo constante.",
    problema: "Depender de inquilinos sin respaldo o de ingresos poco predecibles.",
    objetivo: "Flujo de efectivo y legado familiar.",
    perfil: "Perfil de propietario directo, buscando estabilidad de ingreso.",
    href: "/renta-garantizada",
    ctaLabel: "Conocer el programa",
  },
  {
    icon: Hammer,
    title: "Remodelación y venta de propiedades",
    paraQuien: "Empresarios con capacidad de ejecución que buscan crecimiento patrimonial en un plazo más corto.",
    problema: "Un capital que se aprecia demasiado lento dentro de una estrategia puramente pasiva.",
    objetivo: "Crecimiento patrimonial.",
    perfil: "Perfil más activo, con tolerancia a un proyecto de ejecución.",
    href: null,
    ctaLabel: "Conversar sobre este vehículo",
  },
  {
    icon: Banknote,
    title: "Compra de propiedades para generar flujo",
    paraQuien: "Empresarios que quieren ser dueños de un activo puntual, con renta ya validada en el mercado.",
    problema: "Tener capital detenido sin generar ingreso recurrente.",
    objetivo: "Flujo de efectivo y protección patrimonial.",
    perfil: "Perfil de propietario directo, con interés en el análisis de números del activo.",
    href: "/activos-disponibles",
    ctaLabel: "Ver propiedades",
  },
  {
    icon: CreditCard,
    title: "Compra con crédito para extranjeros",
    paraQuien: "Empresarios que prefieren apalancar capital en vez de inmovilizarlo por completo en un solo activo.",
    problema: "Concentrar todo el capital disponible en una sola operación.",
    objetivo: "Crecimiento patrimonial y diversificación internacional.",
    perfil: "Perfil que ya entiende el mercado y busca estructurar el financiamiento correctamente.",
    href: null,
    ctaLabel: "Conversar sobre este vehículo",
  },
  {
    icon: CompassIcon,
    title: "Compra de propiedades ligadas a estrategia migratoria",
    paraQuien: "Empresarios que buscan que su inversión también sostenga un proceso migratorio, como la visa E-2.",
    problema: "Invertir sin que esa inversión cumpla ningún propósito migratorio.",
    objetivo: "Estrategia migratoria.",
    perfil: "Perfil con intención de residencia o movilidad hacia Estados Unidos.",
    href: "/visa-e2-inversion-en-estados-unidos",
    ctaLabel: "Explorar la estrategia migratoria",
  },
  {
    icon: Briefcase,
    title: "Compra de negocios con componente inmobiliario",
    paraQuien: "Empresarios que buscan adquirir una operación existente que además incluye el inmueble donde opera.",
    problema: "Elegir entre comprar un negocio o comprar un activo, cuando en realidad se puede evaluar ambos a la vez.",
    objetivo: "Crecimiento patrimonial.",
    perfil: "Perfil con experiencia operando negocios, buscando expandirse a Estados Unidos.",
    href: null,
    ctaLabel: "Conversar sobre este vehículo",
  },
  {
    icon: Sparkles,
    title: "Oportunidades especiales",
    paraQuien: "Empresarios que ya tienen claridad de su perfil y buscan algo fuera de las rutas tradicionales.",
    problema: "Que las únicas alternativas disponibles sean siempre las mismas.",
    objetivo: "Diversificación internacional.",
    perfil: "Estructura preparada para futuros proyectos, todavía en desarrollo.",
    href: null,
    ctaLabel: "Conversar sobre este vehículo",
  },
];

/* ─── Data: perfiles orientativos ─── */
const PROFILE_TYPES = [
  {
    label: "Estoy explorando",
    recommendation: "Todavía no necesitas elegir nada. Recorre el Mapa Patrimonial arriba, o valida en persona con Investment Week antes de comprometer capital.",
    links: [
      { label: "Ver Mapa Patrimonial", href: "#mapa-patrimonial" },
      { label: "Conocer Investment Week", href: "/investment-week" },
    ],
  },
  {
    label: "Quiero proteger patrimonio",
    recommendation: "Suele tener sentido evaluar el Fondo de Compra de Tierra Estratégica o la compra directa de propiedades para generar flujo.",
    links: [
      { label: "Fondo de Tierra Estratégica", href: "/tierra-estrategica" },
      { label: "Ver propiedades", href: "/activos-disponibles" },
    ],
  },
  {
    label: "Busco flujo",
    recommendation: "El Programa de renta de vivienda garantizada y la compra de propiedades para generar flujo son los vehículos que más se acercan a este objetivo.",
    links: [
      { label: "Programa de renta garantizada", href: "/renta-garantizada" },
      { label: "Ver propiedades", href: "/activos-disponibles" },
    ],
  },
  {
    label: "Quiero vivir en Estados Unidos",
    recommendation: "Ahí la conversación no empieza en bienes raíces, empieza en la estrategia migratoria: qué papel puede jugar una propiedad dentro de ese proceso.",
    links: [{ label: "Explorar la estrategia migratoria", href: "/visa-e2-inversion-en-estados-unidos" }],
  },
  {
    label: "Quiero diversificar",
    recommendation: "El Fondo de Compra de Tierra Estratégica suele ser el punto de entrada; las Oportunidades especiales existen para cuando ya tienes más claridad.",
    links: [{ label: "Fondo de Tierra Estratégica", href: "/tierra-estrategica" }],
  },
  {
    label: "Tengo varias inversiones y busco estructura",
    recommendation: "Esa conversación ya no es sobre un vehículo puntual, es sobre compartir decisiones dentro del Grupo Empresarial y evaluar tu perfil completo.",
    links: [
      { label: "Grupo Empresarial de Edmundo", href: "/grupo-empresarial-edmundo" },
      { label: "Evaluar mi perfil", href: "/gps" },
    ],
  },
];

/* ─── Data: casos reales (misma fuente que ya usa el sitio para testimonios de miembros) ─── */
const STORIES = [
  {
    name: "Carlos",
    city: "Monterrey",
    objetivo: "Estructurar correctamente su expansión a Estados Unidos.",
    ruta: "Protección patrimonial",
    resultado: "LLC estructurada y networking empresarial dentro de la comunidad.",
    quote: "Entré buscando cómo estructurar mi expansión a Estados Unidos. El equipo me ayudó a abrir mi LLC correctamente y entender la estructura fiscal.",
  },
  {
    name: "Alejandro",
    city: "Ciudad de México",
    objetivo: "Aplicar a una visa de inversionista con el capital que ya tenía disponible.",
    ruta: "Estrategia migratoria",
    resultado: "Proyecto estructurado y proceso migratorio en marcha.",
    quote: "Yo ya tenía el capital pero no sabía cómo estructurar la inversión para aplicar a una visa. Con el acompañamiento del equipo logramos estructurar el proyecto y hoy mi proceso migratorio está en marcha.",
  },
  {
    name: "Jorge",
    city: "Guadalajara",
    objetivo: "Dar el primer paso como inversionista en Estados Unidos.",
    ruta: "Crecimiento patrimonial",
    resultado: "Primera inversión ejecutada dentro de un proyecto ya estructurado.",
    quote: "Lo que más valoré fue que aquí no solo analizan oportunidades, las ejecutan. A través de la comunidad conocí un proyecto que ya estaba estructurado y hoy ya soy inversionista.",
  },
  {
    name: "Mariana",
    city: "Bogotá",
    objetivo: "Expandir su empresa hacia el mercado estadounidense.",
    ruta: "Diversificación internacional",
    resultado: "Estructura legal y networking necesarios para expandirse con seguridad.",
    quote: "Como empresaria buscaba expandir mi negocio a Estados Unidos. Comprando América me proporcionó la estructura legal y el networking necesario para hacerlo de forma segura.",
  },
];

/* ─── Data: preguntas frecuentes ─── */
const FAQS = [
  {
    q: "¿Necesito vivir en Estados Unidos?",
    a: "No. La mayoría de los empresarios que participan en la Arquitectura Patrimonial invierte desde Latinoamérica sin residir en Estados Unidos. Vivir ahí es una decisión aparte, no un requisito.",
  },
  {
    q: "¿Necesito una visa?",
    a: "No necesariamente. Puedes invertir sin ningún trámite migratorio. Si además buscas una estrategia migratoria, esa es una ruta específica que puede combinarse con tu inversión, no una condición para invertir.",
  },
  {
    q: "¿Puedo invertir desde México?",
    a: "Sí. Es, de hecho, el caso más común dentro de la comunidad: empresarios que operan y viven en México o en otros países de Latinoamérica, e invierten en Estados Unidos con acompañamiento legal y fiscal.",
  },
  {
    q: "¿Qué estrategia genera flujo?",
    a: "El Programa de renta de vivienda garantizada por el gobierno y la compra de propiedades para generar flujo son los vehículos pensados específicamente para ingreso recurrente.",
  },
  {
    q: "¿Qué estrategia protege patrimonio?",
    a: "El Fondo de Compra de Tierra Estratégica está pensado para eso: participar de forma pasiva en una estructura profesional, sin la exposición de administrar un proyecto directamente.",
  },
  {
    q: "¿Cuándo tiene sentido una LLC?",
    a: "Cuando vas a ser propietario directo de un activo, o vas a operar en Estados Unidos. Ahí la estructura legal deja de ser opcional: separa tu responsabilidad personal y ordena la parte fiscal.",
    link: { label: "Ver Estructura Empresarial", href: "/estructura-empresarial-en-estados-unidos" },
  },
];

/* ─── Data: recursos gratuitos (compacto, sin descripciones) ─── */
const FREE_RESOURCES = [
  { icon: Mic, label: "Podcast", href: "/podcast", external: false },
  { icon: Youtube, label: "YouTube", href: "https://www.youtube.com/@ComprandoAmerica", external: true },
  { icon: Newspaper, label: "Noticias", href: "/news", external: false },
  { icon: BookOpen, label: "Blog", href: "/blog", external: false },
  { icon: Linkedin, label: "LinkedIn", href: null, external: true },
];

export default function ArquitecturaPatrimonial() {
  const [activeStory, setActiveStory] = useState<number | null>(null);
  const [activeProfile, setActiveProfile] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white overflow-x-hidden">
      <SEOHead {...PAGE_SEO} />
      <Navbar />

      {/* ═══ 1. HERO ═══ */}
      <section className="relative flex items-center pt-28 pb-14 md:pt-32 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0E2544] via-[#0B1F3A] to-[#0B1F3A]" />
        <div className="container relative z-10">
          <FadeIn>
            <div className="max-w-3xl">
              <p className="text-blue-400 text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
                Comprando América
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
                Arquitectura Patrimonial en <span className="gradient-text-primary">Estados Unidos</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
                Antes de elegir una propiedad, primero hay que entender qué papel debe jugar dentro de tu patrimonio.
              </p>
              <a href="#mapa-patrimonial">
                <Button className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25">
                  Explorar las rutas patrimoniales <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 2. CAMBIO DE PARADIGMA — ☀️ blanco ═══ */}
      <section className="bg-white py-14 md:py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-5xl mx-auto">
            <FadeIn>
              <div>
                <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-6">
                  La mayoría de los empresarios pregunta <span className="text-[#9CA3AF]">¿qué propiedad compro?</span>
                </h2>
                <p className="text-[#0B1F3A] text-2xl font-semibold leading-relaxed mb-6">
                  Nosotros preguntamos: ¿qué estás construyendo?
                </p>
                <p className="text-[#4B5563] text-lg leading-relaxed">
                  Porque dependiendo del objetivo, la misma propiedad puede ser una excelente decisión o una mala decisión.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="flex flex-col gap-4 max-w-sm mx-auto">
                <div className="px-6 py-5 rounded-xl border border-gray-200 bg-[#F5F7FA] text-center">
                  <p className="text-xs uppercase tracking-wider text-[#9CA3AF] font-semibold mb-2">La mayoría empieza aquí</p>
                  <p className="text-[#6B7280] text-lg">¿Qué propiedad compro?</p>
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

      {/* ═══ 3. MAPA PATRIMONIAL — navy ═══ */}
      <section id="mapa-patrimonial" className="bg-[#0E2544] py-14 md:py-20 scroll-mt-20">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center mb-10">
              <h2 className="text-3xl md:text-4xl text-white mb-4">Mapa Patrimonial</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Un mismo patrimonio puede perseguir objetivos distintos. Elige uno para profundizar, sin salir de esta página.
              </p>
            </div>
          </FadeIn>

          {/* Desktop: radial layout */}
          <FadeIn delay={0.1}>
            <div className="hidden md:block relative mx-auto" style={{ width: "min(70vw, 480px)", height: "min(70vw, 480px)" }}>
              <div
                className="absolute z-10 flex flex-col items-center justify-center text-center rounded-full bg-primary shadow-lg shadow-blue-600/30"
                style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: "34%", height: "34%" }}
              >
                <span className="text-white font-semibold text-sm leading-tight px-2">Tu Patrimonio</span>
              </div>
              {OBJECTIVES.map((obj, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{ left: obj.pos.left, top: obj.pos.top, transform: "translate(-50%, -50%)", width: "30%" }}
                >
                  <Panel
                    title={obj.title}
                    trigger={
                      <div className="flex flex-col items-center gap-2 text-center cursor-pointer group">
                        <div className="w-16 h-16 rounded-full bg-[#0F2847] border border-[#1E3A5F] group-hover:border-primary flex items-center justify-center transition-colors">
                          <obj.icon className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-white text-xs font-medium leading-tight">{obj.title}</span>
                      </div>
                    }
                  >
                    <DialogDescription className="text-[#4B5563] text-base leading-relaxed mb-4">
                      {obj.description}
                    </DialogDescription>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1">Vehículos relacionados</p>
                      <p className="text-[#374151] text-sm">{obj.vehicles}</p>
                    </div>
                  </Panel>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Mobile fallback */}
          <div className="md:hidden grid grid-cols-2 gap-4 max-w-md mx-auto">
            {OBJECTIVES.map((obj, i) => (
              <Panel
                key={i}
                title={obj.title}
                trigger={
                  <div className="flex flex-col items-center gap-2 text-center cursor-pointer bg-[#0F2847] border border-[#1E3A5F] rounded-xl p-4 h-full">
                    <obj.icon className="w-6 h-6 text-primary" />
                    <span className="text-white text-xs font-medium leading-tight">{obj.title}</span>
                  </div>
                }
              >
                <DialogDescription className="text-[#4B5563] text-base leading-relaxed mb-4">
                  {obj.description}
                </DialogDescription>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1">Vehículos relacionados</p>
                  <p className="text-[#374151] text-sm">{obj.vehicles}</p>
                </div>
              </Panel>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. VEHÍCULOS PATRIMONIALES — ☀️ blanco ═══ */}
      <section className="bg-white py-14 md:py-20">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center mb-8">
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-4">Vehículos Patrimoniales</h2>
              <p className="text-[#4B5563] text-lg leading-relaxed">
                No son un catálogo. Son herramientas construidas para objetivos distintos. Elige una para ver a quién sirve y qué problema resuelve.
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 max-w-6xl mx-auto">
            {VEHICLES.map((v, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <Panel
                  title={v.title}
                  trigger={
                    <div className="flex flex-col items-start text-left gap-2 sm:gap-3 bg-[#F5F7FA] border border-gray-200 rounded-xl p-4 sm:p-6 h-full cursor-pointer hover:shadow-md hover:border-primary/30 transition-all">
                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0">
                        <v.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <p className="text-[#0B1F3A] font-semibold text-sm sm:text-base leading-snug">{v.title}</p>
                    </div>
                  }
                >
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1">¿Para quién tiene sentido?</p>
                      <p className="text-[#374151] text-sm leading-relaxed">{v.paraQuien}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1">¿Qué problema resuelve?</p>
                      <p className="text-[#374151] text-sm leading-relaxed">{v.problema}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1">¿Qué objetivo patrimonial cumple?</p>
                      <p className="text-[#374151] text-sm leading-relaxed">{v.objetivo}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1">¿Qué perfil suele utilizarlo?</p>
                      <p className="text-[#374151] text-sm leading-relaxed">{v.perfil}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    {v.href ? (
                      <a href={v.href}>
                        <Button className="bg-primary hover:bg-blue-600 text-white gap-2">
                          {v.ctaLabel} <ArrowRight className="w-4 h-4" />
                        </Button>
                      </a>
                    ) : (
                      <Button
                        onClick={() => openWhatsApp(WHATSAPP_PHONE, `Hola, me interesa conversar sobre el vehículo de ${v.title}.`)}
                        className="bg-primary hover:bg-blue-600 text-white gap-2"
                      >
                        {v.ctaLabel} <MessageCircle className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </Panel>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. UNA MISMA PROPIEDAD, OBJETIVOS DISTINTOS — navy ═══ */}
      <section className="bg-[#0E2544] py-14 md:py-20">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center mb-6">
              <h2 className="text-3xl md:text-4xl text-white mb-4">
                Una misma propiedad puede cumplir objetivos distintos
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Por eso la propiedad nunca es el punto de partida. La misma casa puede servir para:
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-4xl mx-auto">
            {[
              { icon: Banknote, label: "Generar flujo" },
              { icon: Shield, label: "Proteger patrimonio" },
              { icon: CompassIcon, label: "Obtener una estrategia migratoria" },
              { icon: Globe, label: "Diversificar" },
              { icon: Users, label: "Desarrollar patrimonio familiar" },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="flex flex-col items-center text-center gap-2 bg-[#0F2847] border border-[#1E3A5F] rounded-xl p-4 h-full">
                  <item.icon className="w-6 h-6 text-primary" />
                  <p className="text-white text-sm font-medium leading-snug">{item.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 6. INVESTMENT WEEK — ☀️ blanco ═══ */}
      <section className="bg-white py-14 md:py-20">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6">
                <Plane className="w-4 h-4 text-primary" />
                <span className="text-primary text-sm font-semibold tracking-wide uppercase">Evento ocasional</span>
              </div>
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-6">
                Hay inversiones que se entienden leyendo. Y hay inversiones que solamente se entienden caminándolas.
              </h2>
              <p className="text-[#4B5563] text-lg leading-relaxed mb-10">
                Investment Week existe para recorrer activos reales y comprender el criterio detrás de cada decisión, antes de comprometer capital.
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

      {/* ═══ 7. ¿QUÉ TIPO DE EMPRESARIO ERES? — navy ═══ */}
      <section className="bg-[#0B1F3A] py-14 md:py-20">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center mb-8">
              <h2 className="text-3xl md:text-4xl text-white mb-4">¿Qué tipo de empresario eres?</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Esto no sustituye tu evaluación de perfil. Es solo orientativo, para saber por dónde empezar a mirar.
              </p>
            </div>
          </FadeIn>
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {PROFILE_TYPES.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setActiveProfile(activeProfile === i ? null : i)}
                  className={`px-5 py-3 rounded-full border text-sm font-medium transition-colors ${
                    activeProfile === i
                      ? "bg-primary border-primary text-white"
                      : "bg-[#0F2847] border-[#1E3A5F] text-slate-300 hover:border-primary/50"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <AnimatePresence>
              {activeProfile !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="bg-[#0F2847] border border-[#1E3A5F] rounded-xl p-8">
                    <p className="text-white text-lg leading-relaxed mb-6">{PROFILE_TYPES[activeProfile].recommendation}</p>
                    <div className="flex flex-wrap gap-3">
                      {PROFILE_TYPES[activeProfile].links.map((link, j) => (
                        <a key={j} href={link.href}>
                          <Button variant="outline" className="border-slate-600 text-white hover:bg-white/10 gap-2">
                            {link.label} <ArrowRight className="w-4 h-4" />
                          </Button>
                        </a>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ═══ 8. GRUPO EMPRESARIAL — ☀️ blanco ═══ */}
      <section className="bg-white py-14 md:py-20">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-6">
                Toda esta arquitectura cobra sentido en el <span className="text-primary">Grupo Empresarial</span>
              </h2>
              <p className="text-[#4B5563] text-lg leading-relaxed mb-10">
                Cuando puedes compartir estas decisiones con empresarios que están construyendo patrimonio bajo una visión de largo plazo, no solas.
              </p>
              <a href="/grupo-empresarial-edmundo">
                <Button variant="outline" className="border-gray-300 text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white px-8 py-6 text-base gap-2">
                  Grupo Empresarial de Edmundo <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 9. CASOS REALES — navy ═══ */}
      <section className="bg-[#0E2544] py-14 md:py-20">
        <div className="container">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl text-white mb-10 text-center">Casos reales</h2>
          </FadeIn>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 max-w-4xl mx-auto">
            {STORIES.map((story, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <button onClick={() => setActiveStory(i)} className="w-full text-left">
                  <div className="bg-[#0F2847] border border-[#1E3A5F] rounded-xl p-4 sm:p-6 hover:border-primary/40 transition-all h-full">
                    <p className="text-white font-semibold text-sm sm:text-base mb-1">{story.name} · {story.city}</p>
                    <p className="text-primary text-xs sm:text-sm font-medium mb-2 sm:mb-3">{story.ruta}</p>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{story.objetivo}</p>
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
                  <p className="text-xs uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1">Objetivo inicial</p>
                  <p className="text-[#374151] text-sm">{STORIES[activeStory].objetivo}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1">Ruta elegida</p>
                  <p className="text-primary text-sm font-semibold">{STORIES[activeStory].ruta}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1">Resultado obtenido</p>
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

      {/* ═══ 10. PREGUNTAS FRECUENTES — ☀️ blanco ═══ */}
      <section className="bg-white py-14 md:py-20">
        <div className="container">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-10 text-center">Preguntas frecuentes</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-3">
                {FAQS.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="bg-[#F5F7FA] border border-gray-200 rounded-xl px-6">
                    <AccordionTrigger className="text-[#0B1F3A] hover:text-primary transition-colors py-5 text-base font-semibold hover:no-underline">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="pb-5">
                      <p className="text-[#4B5563] text-sm leading-relaxed">{faq.a}</p>
                      {faq.link && (
                        <a href={faq.link.href} className="inline-flex items-center gap-1 text-primary text-sm font-semibold mt-3 hover:gap-2 transition-all">
                          {faq.link.label} <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 11. RECURSOS GRATUITOS — navy ═══ */}
      <section className="bg-[#0E2544] py-10 md:py-14">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-slate-400 text-base mb-8">Sigue aprendiendo antes de decidir, sin costo.</p>
              <div className="flex flex-wrap justify-center gap-4">
                {FREE_RESOURCES.map((r, i) =>
                  r.href ? (
                    <a
                      key={i}
                      href={r.href}
                      target={r.external ? "_blank" : undefined}
                      rel={r.external ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-2 bg-[#0F2847] border border-[#1E3A5F] hover:border-primary/50 rounded-full px-5 py-3 text-slate-300 hover:text-white transition-colors"
                    >
                      <r.icon className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{r.label}</span>
                    </a>
                  ) : (
                    <span
                      key={i}
                      className="flex items-center gap-2 bg-[#0F2847] border border-[#1E3A5F] rounded-full px-5 py-3 text-slate-500"
                    >
                      <r.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{r.label}</span>
                    </span>
                  )
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 12. CTA FINAL — deep navy ═══ */}
      <section className="bg-[#091A30] py-16 md:py-20">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                Antes de elegir una propiedad, conviene entender qué papel debe jugar dentro de tu patrimonio.
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-10">
                Evalúa tu perfil.
              </p>
              <a href="/gps">
                <Button className="bg-primary hover:bg-blue-600 text-white px-10 py-6 text-lg gap-2 shadow-lg shadow-blue-600/25">
                  Evaluar mi perfil <ArrowRight className="w-5 h-5" />
                </Button>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
