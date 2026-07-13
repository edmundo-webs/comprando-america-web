import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useInView } from "@/hooks/useInView";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowDown,
  Building2,
  Home,
  Key,
  Plane,
  Target,
  Wallet,
  Clock,
  DollarSign,
  Briefcase,
  Users,
  Heart,
  Globe,
  Landmark,
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
  title: "Arquitectura Patrimonial en Estados Unidos | Estrategias inmobiliarias para empresarios | Comprando América",
  description:
    "Descubre cómo Comprando América estructura estrategias patrimoniales en Estados Unidos mediante proyectos inmobiliarios seleccionados, fondos, propiedades y experiencias diseñadas para empresarios que buscan construir patrimonio con criterio.",
  path: "/arquitectura-patrimonial",
};

/* ─── Flow diagram ─── */
function FlowDiagram({ steps, dark = false }: { steps: string[]; dark?: boolean }) {
  return (
    <div className="flex flex-col items-center max-w-md mx-auto">
      {steps.map((step, i) => (
        <div key={i} className="flex flex-col items-center w-full">
          <div
            className={`w-full px-6 py-4 rounded-xl border text-center font-medium ${
              dark ? "bg-[#0F2847] border-[#1E3A5F] text-white" : "bg-white border-gray-200 text-[#0B1F3A] shadow-sm"
            }`}
          >
            {step}
          </div>
          {i < steps.length - 1 && <ArrowDown className="w-5 h-5 my-2 text-primary shrink-0" />}
        </div>
      ))}
    </div>
  );
}

/* ─── Data ─── */
const GENERAL_FLOW = [
  "Comprando América",
  "Grupo Empresarial de Edmundo",
  "Arquitectura Patrimonial",
  "Análisis del perfil",
  "Selección del vehículo patrimonial",
  "Ejecución",
  "Acompañamiento",
];

const PROCESS_FLOW = [
  "Conocemos al empresario",
  "Construimos una estrategia",
  "Definimos el perfil patrimonial",
  "Seleccionamos proyectos compatibles",
  "Analizamos riesgos",
  "Estructuramos la operación",
  "Acompañamos la ejecución",
  "Seguimos presentes después de invertir",
];

const PROFILE_FACTORS = [
  { icon: Target, label: "Objetivos" },
  { icon: Landmark, label: "Patrimonio" },
  { icon: Clock, label: "Horizonte" },
  { icon: DollarSign, label: "Liquidez" },
  { icon: Briefcase, label: "Experiencia" },
  { icon: Users, label: "Participación deseada" },
  { icon: Heart, label: "Familia" },
  { icon: Globe, label: "Migración" },
  { icon: Wallet, label: "Legado" },
];

const PROJECTS = [
  {
    icon: Building2,
    title: "Fondo de Compra de Tierra Estratégica",
    objetivo: "Participar de manera pasiva en una estructura profesional dedicada a adquirir y desarrollar tierra estratégica con activos operando.",
    idealPara: "Empresarios que desean construir patrimonio sin administrar directamente un proyecto inmobiliario.",
    cta: "Conocer la estrategia",
    href: "/fondo",
  },
  {
    icon: Home,
    title: "Programa de Renta de Vivienda Garantizada por el Gobierno",
    objetivo: "Construir patrimonio mediante propiedades residenciales destinadas a programas de renta respaldados por el gobierno.",
    idealPara: "Empresarios que desean ser propietarios de un activo específico y generar flujo.",
    cta: "Conocer el programa",
    href: "/vc-8",
  },
  {
    icon: Key,
    title: "Propiedades Seleccionadas",
    objetivo: "Acceder a propiedades previamente analizadas por el equipo de Comprando América.",
    idealPara: "Empresarios que buscan adquirir un activo inmobiliario con acompañamiento estratégico.",
    cta: "Ver propiedades",
    href: "/propiedades",
  },
  {
    icon: Plane,
    title: "Investment Week",
    objetivo: "Conocer personalmente distintos proyectos inmobiliarios y comprender cómo se analizan antes de invertir.",
    idealPara: "Empresarios que desean validar una estrategia directamente en el mercado.",
    cta: "Conocer la experiencia",
    href: "/investment-week",
  },
];

const CHOICE_QUESTIONS = [
  "¿Qué quieres construir?",
  "¿Qué papel tendrá este activo dentro de tu patrimonio?",
  "¿Qué nivel de participación buscas?",
  "¿Qué pasaría si dentro de cinco años cambian tus circunstancias?",
];

export default function ArquitecturaPatrimonial() {
  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white overflow-x-hidden">
      <SEOHead {...PAGE_SEO} />
      <Navbar />

      {/* ═══ 1. HERO ═══ */}
      <section className="relative min-h-[70vh] flex items-center pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0E2544] via-[#0B1F3A] to-[#0B1F3A]" />
        <div className="container relative z-10">
          <FadeIn>
            <div className="max-w-3xl">
              <p className="text-blue-400 text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
                División Patrimonial de Comprando América
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
                Arquitectura Patrimonial en <span className="gradient-text-primary">Estados Unidos</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-4 max-w-2xl">
                Los bienes raíces no son un producto. Son uno de los vehículos mediante los cuales algunos empresarios construyen patrimonio, generan flujo y diversifican riesgos.
              </p>
              <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
                La decisión correcta depende menos del activo y más de la estrategia.
              </p>
              <a href="/grupo-empresarial-edmundo">
                <Button className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25">
                  Conocer el Grupo Empresarial <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 2. MENSAJE CLAVE + DIAGRAMA GENERAL — ☀️ BLANCO ═══ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <FadeIn>
              <div>
                <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-6">
                  Comprando América no comienza mostrando propiedades.
                </h2>
                <p className="text-[#4B5563] text-lg leading-relaxed mb-4">
                  Comienza entendiendo al empresario. Porque una misma inversión puede ser extraordinaria para una persona y completamente equivocada para otra.
                </p>
                <p className="text-[#0B1F3A] text-lg font-semibold leading-relaxed">
                  Por eso primero construimos criterio. Después analizamos proyectos.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <FlowDiagram steps={GENERAL_FLOW} />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ 3. TODO COMIENZA EN EL GRUPO EMPRESARIAL — navy ═══ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                Todo comienza en el <span className="text-primary">Grupo Empresarial</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-4">
                El Grupo Empresarial de Edmundo es el punto de entrada al ecosistema de Comprando América. No es una membresía para recibir información.
              </p>
              <p className="text-slate-300 text-lg leading-relaxed mb-4">
                Es el espacio donde empresarios construyen criterio, analizan oportunidades y desarrollan relaciones de largo plazo.
              </p>
              <p className="text-white text-lg font-semibold leading-relaxed">
                Desde aquí nacen las distintas rutas patrimoniales.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 4. NO TODOS NECESITAN EL MISMO PROYECTO — ☀️ ligero ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center mb-14">
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-6">
                No todos los empresarios necesitan el mismo proyecto
              </h2>
              <p className="text-[#4B5563] text-lg leading-relaxed">
                Antes de presentar una oportunidad entendemos:
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            {PROFILE_FACTORS.map((item, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="flex flex-col items-center text-center gap-3 bg-white border border-gray-200 rounded-xl p-6 h-full">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <p className="text-[#0B1F3A] font-medium">{item.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn>
            <p className="text-[#0B1F3A] text-lg font-semibold text-center">
              Después se determina cuál vehículo tiene sentido.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 5. PROYECTOS PATRIMONIALES — blanco ═══ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center mb-14">
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-4">Proyectos Patrimoniales</h2>
              <p className="text-[#4B5563] text-lg leading-relaxed">
                Estas no son ofertas de inversión. Son rutas dentro de la Arquitectura Patrimonial, cada una construida para un perfil distinto de empresario.
              </p>
            </div>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {PROJECTS.map((project, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="flex flex-col h-full bg-[#F5F7FA] border border-gray-200 rounded-2xl p-8 hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary flex items-center justify-center mb-6">
                    <project.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-[#0B1F3A] text-xl font-semibold mb-4">{project.title}</h3>
                  <p className="text-[#4B5563] text-sm leading-relaxed mb-4">
                    <span className="font-semibold text-[#0B1F3A]">Objetivo. </span>
                    {project.objetivo}
                  </p>
                  <p className="text-[#4B5563] text-sm leading-relaxed mb-6">
                    <span className="font-semibold text-[#0B1F3A]">Ideal para. </span>
                    {project.idealPara}
                  </p>
                  <div className="mt-auto">
                    <a href={project.href}>
                      <Button variant="outline" className="border-gray-300 text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white gap-2">
                        {project.cta} <ArrowRight className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 6. CÓMO ELEGIMOS UN PROYECTO — navy ═══ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-4">¿Cómo elegimos un proyecto?</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-10">
                No comenzamos preguntando cuánto quieres invertir. Comenzamos preguntando:
              </p>
              <div className="grid sm:grid-cols-2 gap-6 mb-10">
                {CHOICE_QUESTIONS.map((q, i) => (
                  <div key={i} className="bg-[#0F2847] border border-[#1E3A5F] rounded-xl p-6 text-left">
                    <p className="text-white text-lg font-medium">{q}</p>
                  </div>
                ))}
              </div>
              <p className="text-slate-300 text-lg font-semibold">
                Solo después analizamos un proyecto. Nunca al revés.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 7. NUESTRO PROCESO — ☀️ blanco ═══ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-14 text-center">Nuestro proceso</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <FlowDiagram steps={PROCESS_FLOW} />
          </FadeIn>
        </div>
      </section>

      {/* ═══ 8. OPORTUNIDADES NO PUBLICADAS — navy ═══ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                ¿Por qué muchas oportunidades no aparecen publicadas?
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-4">
                No todas las oportunidades forman parte del sitio web. Muchas requieren contexto para entender si realmente tienen sentido para determinado empresario.
              </p>
              <p className="text-white text-lg font-semibold leading-relaxed">
                Por eso las conversaciones comienzan con la estrategia. No con el inventario.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 9. CTA FINAL — deep navy ═══ */}
      <section className="bg-[#091A30] py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                Toda estrategia patrimonial comienza mucho antes de elegir un activo.
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-10">
                Conoce primero cómo funciona el Grupo Empresarial de Edmundo y descubre cómo se construyen las decisiones antes de ejecutar una inversión.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/grupo-empresarial-edmundo">
                  <Button className="bg-primary hover:bg-blue-600 text-white px-10 py-6 text-lg gap-2 shadow-lg shadow-blue-600/25">
                    Conocer el Grupo Empresarial <ArrowRight className="w-5 h-5" />
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
