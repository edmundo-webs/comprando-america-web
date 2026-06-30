import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useInView } from "@/hooks/useInView";
import { openWhatsApp, WHATSAPP_PHONE } from "@/lib/whatsapp";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Building2,
  TrendingUp,
  RefreshCw,
  AlertTriangle,
  Clock,
  DollarSign,
  MapPin,
  Users,
  Shield,
} from "lucide-react";

const PAGE_SEO = {
  title: "Fondo Victory Capital — Inversión en Parques de Casas Móviles en EE.UU. | Comprando América",
  description:
    "Invierte en tierra estratégica en Estados Unidos sin tener que operar. Victory Capital reúne capital para adquirir y administrar parques de casas móviles. Ticket mínimo USD $100,000.",
  path: "/fondo",
};

const WA_MSG =
  "Hola, quiero evaluar si el Fondo Victory Capital tiene sentido para mi perfil patrimonial.";

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

const CHECKLIST_ITEMS = [
  "Quiero diversificar parte de mi patrimonio en dólares.",
  "No quiero operar un negocio o propiedad directamente.",
  "Busco activos reales, no solo instrumentos financieros.",
  "Puedo mantener mi capital invertido 5 a 7 años.",
  "Me interesa recibir posibles distribuciones periódicas.",
  "Entiendo que no hay rendimientos garantizados.",
];

const RISKS = [
  "El parque puede generar menos flujo del esperado.",
  "La ocupación puede bajar.",
  "Los gastos pueden subir.",
  "Las tasas de interés pueden afectar refinanciamientos.",
  "El mercado inmobiliario puede cambiar.",
  "La operación puede no ejecutarse como se proyectó.",
  "Puede existir pérdida parcial o total del capital invertido.",
];

export default function FondoVictoryCapital() {
  const [checked, setChecked] = useState<boolean[]>(
    Array(CHECKLIST_ITEMS.length).fill(false)
  );

  const checkedCount = checked.filter(Boolean).length;

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white overflow-x-hidden">
      <SEOHead {...PAGE_SEO} />
      <Navbar />

      {/* ═══ BANNER PROMOCIONAL — Florida Investment Weekend II ═══ */}
      <a
        href="/investment-week"
        className="block w-full bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#1D4ED8] hover:from-[#1E40AF] hover:to-[#1E40AF] transition-colors duration-300 group"
      >
        <div className="container flex items-center justify-center gap-3 py-3 px-4 text-center">
          <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full">
            Próximo evento
          </span>
          <p className="text-white text-sm font-medium">
            <span className="font-bold">Florida Investment Weekend II</span>
            {" — "}Terreno real. Propiedades reales. Números reales.
          </p>
          <span className="hidden sm:inline-flex items-center gap-1 text-white font-semibold text-sm underline underline-offset-2 group-hover:gap-2 transition-all">
            Ver detalles <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </a>

      {/* ═══ 1. HERO ═══ */}
      <section className="relative min-h-screen flex items-center pt-20 pb-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3A] via-[#0E2544] to-[#091A30]" />
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #2563EB 0%, transparent 50%), radial-gradient(circle at 80% 20%, #1D4ED8 0%, transparent 40%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0B1F3A] to-transparent" />

        <div className="container relative z-10">
          <FadeIn>
            <div className="max-w-3xl">
              {/* Label */}
              <p className="text-blue-400 text-xs font-semibold tracking-[0.25em] uppercase mb-4 font-mono">
                Fondo de Inversión · Victory Capital
              </p>

              {/* Headline */}
              <h1 className="text-3xl md:text-5xl text-white leading-tight mb-3">
                Invierte en tierra estratégica en{" "}
                <span className="gradient-text-primary">Estados Unidos</span>{" "}
                sin tener que operar.
              </h1>

              {/* Subhead — 1 línea */}
              <p className="text-slate-400 text-base md:text-lg mb-6 max-w-xl">
                Parques de casas móviles. Flujo potencial, apreciación y operación
                profesional. Tú solo aportas el capital.
              </p>

              {/* Stats en una sola fila horizontal */}
              <div className="flex flex-wrap gap-2 mb-7">
                {[
                  { label: "Ticket mínimo", value: "USD $100k+" },
                  { label: "Horizonte", value: "5 – 7 años" },
                  { label: "Rol", value: "Pasivo" },
                  { label: "Activo", value: "Tierra estratégica" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2 flex items-center gap-2"
                  >
                    <span className="text-blue-300 text-xs font-mono uppercase tracking-wide">
                      {stat.label}:
                    </span>
                    <span className="text-white font-semibold text-xs">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_MSG)}
                  className="bg-primary hover:bg-blue-600 text-white px-6 py-5 text-sm gap-2 shadow-lg shadow-blue-600/25"
                >
                  Evaluar si tiene sentido para mí <ArrowRight className="w-4 h-4" />
                </Button>
                <a href="#como-funciona">
                  <Button
                    variant="outline"
                    className="border-slate-600 text-white hover:bg-white/10 px-6 py-5 text-sm"
                  >
                    Cómo funciona
                  </Button>
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ BANNER INVESTMENT WEEK ═══ */}
      <a href="/investment-week" className="block">
        <div className="bg-[#2563EB] px-6 py-4 flex items-center justify-between gap-4 hover:brightness-105 transition-all">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✈️</span>
            <div>
              <p className="text-[#0B1F3A] font-bold text-base leading-tight">
                Viaja a Tampa y conoce las propiedades en persona.
              </p>
              <p className="text-[#0B1F3A]/70 text-sm">Investment Week · St. Petersburg, Florida</p>
            </div>
          </div>
          <div className="flex-shrink-0 bg-[#0B1F3A] text-white text-sm font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 whitespace-nowrap">
            Ver detalles <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </a>

      {/* ═══ 2. EXPLICACIÓN SENCILLA — ☀️ BLANCO ═══ */}
      <section id="como-funciona" className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-14">
              <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">
                Explicación sencilla
              </p>
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] max-w-2xl mx-auto">
                Imagina esto
              </h2>
              <p className="text-[#4B5563] text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
                Tú y varios inversionistas quieren comprar activos inmobiliarios grandes,
                pero ninguno quiere administrarlos personalmente.
              </p>
            </div>
          </FadeIn>

          {/* Flow diagram */}
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {[
                {
                  icon: Users,
                  step: "01",
                  title: "Todos aportan capital",
                  desc: "Varios inversionistas suman su capital en un fondo estructurado.",
                },
                {
                  icon: Building2,
                  step: "02",
                  title: "El fondo compra parques",
                  desc: "Ese capital se usa para adquirir parques de casas móviles en Estados Unidos.",
                },
                {
                  icon: TrendingUp,
                  step: "03",
                  title: "Un equipo profesional opera",
                  desc: "Tú no administras nada. Un equipo experto gestiona todo.",
                },
              ].map((item, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-primary font-mono text-xs font-bold tracking-widest">
                        {item.step}
                      </span>
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-[#0B1F3A] font-semibold mb-2">{item.title}</h3>
                    <p className="text-[#6B7280] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>

            <FadeIn>
              <div className="bg-[#0B1F3A] rounded-2xl p-8">
                <p className="text-blue-300 text-sm font-mono uppercase tracking-wider mb-4">
                  Lo importante
                </p>
                <p className="text-white text-xl font-semibold mb-6">
                  Tú no administras el parque.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    "Buscar oportunidades",
                    "Comprar activos con potencial",
                    "Mejorar la operación",
                    "Cobrar rentas",
                    "Administrar residentes",
                    "Hacer mantenimiento",
                    "Buscar que el activo valga más con el tiempo",
                  ].map((task, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ 3. QUÉ COMPRA EL FONDO — navy ═══ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <div className="mb-10">
                <p className="text-blue-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">
                  El activo
                </p>
                <h2 className="text-3xl md:text-4xl text-white mb-4">
                  ¿Qué compra realmente el fondo?
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  No se trata solo de casas móviles.
                </p>
              </div>
            </FadeIn>

            <div className="grid md:grid-cols-2 gap-8">
              <FadeIn>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 bg-[#0F2847] border border-[#1E3A5F] rounded-xl p-6">
                    <MapPin className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-white font-semibold mb-2">
                        Tierra estratégica bien ubicada
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        El fondo se enfoca principalmente en adquirir tierra estratégica
                        donde ya operan parques de casas móviles.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 bg-[#0F2847] border border-[#1E3A5F] rounded-xl p-6">
                    <Shield className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-white font-semibold mb-2">
                        Demanda constante de vivienda accesible
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        La vivienda accesible mantiene una demanda constante, incluso en
                        ciclos económicos complicados.
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-8 h-full flex flex-col justify-center">
                  <p className="text-blue-300 text-sm font-mono uppercase tracking-wider mb-4">
                    La tesis
                  </p>
                  <p className="text-white text-lg leading-relaxed">
                    En muchas ciudades de Estados Unidos ya no es fácil desarrollar
                    nuevos parques de casas móviles.
                  </p>
                  <div className="mt-4 pt-4 border-t border-blue-500/20">
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Eso vuelve más valiosa la tierra bien ubicada que ya cuenta con
                      operación y demanda.
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 4. CÓMO PUEDES GANAR — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-14">
              <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">
                Retorno potencial
              </p>
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A]">
                ¿Cómo puedes ganar dinero?
              </h2>
              <p className="text-[#4B5563] text-lg mt-4 max-w-xl mx-auto">
                El inversionista puede recibir valor de tres formas principales.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: DollarSign,
                num: "1",
                title: "Distribuciones periódicas",
                body: "Los parques cobran renta. Después de pagar gastos operativos, si queda flujo disponible, el fondo puede distribuir parte de esas ganancias. Pueden ser trimestrales, siempre que el desempeño lo permita.",
                note: "Las distribuciones no están garantizadas.",
              },
              {
                icon: TrendingUp,
                num: "2",
                title: "Apreciación del valor",
                body: "El fondo compra activos con oportunidades de mejora: subir ocupación, actualizar rentas, reducir gastos, mejorar infraestructura. Cuando el parque produce más ingreso neto, puede aumentar su valor.",
                note: null,
              },
              {
                icon: RefreshCw,
                num: "3",
                title: "Refinanciamiento o venta",
                body: "Después de varios años, si el activo vale más, el banco puede prestar sobre el nuevo valor y parte de ese capital se distribuye. O el fondo puede vender el activo y repartir las ganancias a inversionistas.",
                note: null,
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-primary font-mono font-bold text-sm">
                      0{item.num}
                    </span>
                  </div>
                  <h3 className="text-[#0B1F3A] font-semibold text-lg mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed flex-1">
                    {item.body}
                  </p>
                  {item.note && (
                    <div className="mt-4 pt-4 border-t border-blue-200 bg-blue-50 rounded-lg p-3">
                      <p className="text-amber-700 text-xs font-semibold">
                        Importante: {item.note}
                      </p>
                    </div>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. EJEMPLO — navy ═══ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <FadeIn>
              <p className="text-blue-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">
                Ejemplo simple
              </p>
              <h2 className="text-3xl md:text-4xl text-white mb-8">
                La lógica económica del modelo
              </h2>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="bg-[#0E2544] border border-[#1E3A5F] rounded-2xl p-8 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                  <div className="flex-1 text-center bg-[#0F2847] rounded-xl p-5">
                    <p className="text-slate-400 text-xs font-mono uppercase tracking-wider mb-2">
                      Compra
                    </p>
                    <p className="text-3xl font-bold text-white">$5M</p>
                    <p className="text-slate-500 text-xs mt-1">USD</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-blue-400 flex-shrink-0 rotate-0 sm:rotate-0 self-center" />
                  <div className="flex-1 text-center bg-blue-600/15 border border-blue-500/30 rounded-xl p-5">
                    <p className="text-blue-300 text-xs font-mono uppercase tracking-wider mb-2">
                      Valor potencial
                    </p>
                    <p className="text-3xl font-bold text-white">$9M</p>
                    <p className="text-slate-500 text-xs mt-1">USD</p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Supongamos que un parque se compra en USD $5 millones. Después de
                  mejorar la operación, aumentar ocupación y elevar el ingreso neto, el
                  parque podría valer USD $9 millones.
                </p>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  En ese caso, el valor se puede capturar mediante distribuciones,
                  refinanciamiento o venta futura.
                </p>
                <div className="border-t border-[#1E3A5F] pt-4">
                  <p className="text-slate-500 text-xs">
                    <span className="text-blue-400 font-semibold">Nota:</span> Esto no
                    es una promesa. Es la lógica económica del modelo.
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="flex items-start gap-4 bg-blue-500/10 border border-blue-500/30 rounded-xl p-5">
                <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-semibold mb-1">
                    Esta no es una inversión de corto plazo
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    El horizonte estimado es de 5 a 7 años. No existe liquidez inmediata.
                    No funciona como una cuenta bancaria ni como una acción que puedes
                    vender al día siguiente.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ 6. PARA QUIÉN — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-14">
              <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">
                Fit del inversionista
              </p>
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A]">
                ¿Para quién tiene sentido?
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn>
              <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-2xl p-8 h-full">
                <h3 className="text-xl text-white font-semibold mb-6 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-blue-400" /> Puede tener sentido si:
                </h3>
                <div className="space-y-3">
                  {[
                    "Ya construiste patrimonio.",
                    "Buscas diversificar en dólares.",
                    "No quieres operar directamente.",
                    "Tienes horizonte de largo plazo.",
                    "Entiendes que toda inversión tiene riesgo.",
                    "Buscas activos reales administrados profesionalmente.",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-300 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="bg-white border border-gray-200 rounded-2xl p-8 h-full shadow-sm">
                <h3 className="text-xl text-[#6B7280] font-semibold mb-6 flex items-center gap-3">
                  <XCircle className="w-6 h-6 text-red-400" /> Probablemente no sea adecuada si:
                </h3>
                <div className="space-y-3">
                  {[
                    "Necesitas liquidez inmediata.",
                    "Quieres controlar directamente la operación.",
                    "Buscas rendimientos garantizados.",
                    "Necesitas recuperar tu capital en menos de 5 años.",
                    "No toleras riesgos de mercado, operación o liquidez.",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-[#6B7280] text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ 7. RIESGOS — navy ═══ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <FadeIn>
              <div className="mb-10">
                <p className="text-blue-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">
                  Transparencia
                </p>
                <h2 className="text-3xl md:text-4xl text-white mb-4">
                  Riesgos principales
                </h2>
                <p className="text-slate-400 leading-relaxed">
                  Toda inversión tiene riesgos. Comprando América los comunica con
                  claridad porque la confianza se construye con información real, no con
                  promesas.
                </p>
              </div>
            </FadeIn>

            <div className="space-y-3">
              {RISKS.map((risk, i) => (
                <FadeIn key={i} delay={i * 0.05}>
                  <div className="flex items-start gap-4 bg-[#0F2847] border border-blue-500/20 rounded-xl p-5">
                    <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-300 text-sm leading-relaxed">{risk}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 8. MICRODIAGNÓSTICO — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <FadeIn>
              <div className="text-center mb-10">
                <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">
                  Microdiagnóstico
                </p>
                <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-4">
                  ¿Esta ruta se parece a lo que estás buscando?
                </h2>
                <p className="text-[#4B5563]">
                  Selecciona las frases que más se parecen a tu situación:
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
                <div className="space-y-3 mb-8">
                  {CHECKLIST_ITEMS.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => toggle(i)}
                      className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${
                        checked[i]
                          ? "bg-blue-50 border-blue-300 text-[#0B1F3A]"
                          : "bg-gray-50 border-gray-200 text-[#6B7280] hover:border-blue-200 hover:bg-blue-50/50"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center mt-0.5 transition-all ${
                          checked[i]
                            ? "bg-primary border-primary"
                            : "border-gray-300"
                        }`}
                      >
                        {checked[i] && (
                          <svg
                            className="w-3 h-3 text-white"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path
                              d="M2 6l3 3 5-5"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm leading-relaxed">{item}</span>
                    </button>
                  ))}
                </div>

                {/* Result */}
                <div
                  className={`rounded-xl p-5 transition-all ${
                    checkedCount >= 4
                      ? "bg-blue-600/10 border border-blue-400/30"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <p className="text-[#0B1F3A] font-semibold mb-1 text-sm">
                    {checkedCount}/6 seleccionadas
                  </p>
                  {checkedCount >= 4 ? (
                    <p className="text-[#0B1F3A] text-sm leading-relaxed">
                      Victory Capital podría ser una ruta a evaluar dentro de tu
                      estrategia patrimonial.
                    </p>
                  ) : (
                    <p className="text-[#6B7280] text-sm leading-relaxed">
                      Selecciona 4 o más para ver el resultado sugerido.
                    </p>
                  )}
                </div>
              </div>

              {checkedCount >= 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-center"
                >
                  <Button
                    onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_MSG)}
                    className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25"
                  >
                    Agendar diagnóstico estratégico <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ 9. ROL CA + ESTRUCTURA — navy ═══ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10">
              <FadeIn>
                <div>
                  <p className="text-blue-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">
                    Nuestro rol
                  </p>
                  <h2 className="text-2xl md:text-3xl text-white mb-4">
                    El rol de Comprando América
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    Comprando América no sustituye asesores legales, fiscales o
                    financieros.
                  </p>
                  <div className="space-y-3">
                    {[
                      "Ayudarte a entender la oportunidad",
                      "Evaluar si tiene sentido para tu perfil",
                      "Conectar con especialistas",
                      "Acompañarte antes, durante y después del proceso",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-slate-300 text-sm">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <div>
                  <p className="text-blue-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">
                    Estructura legal y fiscal
                  </p>
                  <h2 className="text-2xl md:text-3xl text-white mb-4">
                    Algunos inversionistas pueden requerir estructuras adicionales
                  </h2>
                  <div className="space-y-3 mb-6">
                    {[
                      "LLC",
                      "Cuenta bancaria empresarial",
                      "Documentación fiscal",
                      "Revisión patrimonial",
                      "Asesoría legal o migratoria",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 mt-1.5" />
                        <p className="text-slate-300 text-sm">{item}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Estos servicios tienen costos independientes a la inversión.
                      Comprando América cuenta con una red de expertos con quienes ha
                      trabajado durante más de 20 años.
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 10. FAQ — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">
                  Preguntas frecuentes
                </p>
                <h2 className="text-3xl md:text-4xl text-[#0B1F3A]">
                  Lo que los inversionistas suelen preguntar
                </h2>
              </div>
              <Accordion type="single" collapsible className="space-y-4">
                {[
                  {
                    q: "¿Cuánto puedo ganar?",
                    a: "Nadie puede garantizar un rendimiento. El objetivo del fondo es generar valor mediante flujo operativo, apreciación del activo, refinanciamientos y venta estratégica. Pero toda inversión implica riesgo y los resultados dependen de la operación, el mercado, las tasas, la ocupación y la ejecución del equipo.",
                  },
                  {
                    q: "¿Cuándo recupero mi dinero?",
                    a: "El horizonte estimado es de 5 a 7 años. No existe liquidez inmediata. Si necesitas recuperar tu capital antes de ese plazo, esta ruta probablemente no es adecuada para ti.",
                  },
                  {
                    q: "¿Necesito abrir una empresa en Estados Unidos?",
                    a: "Algunos inversionistas pueden requerir estructuras adicionales como una LLC, cuenta bancaria empresarial o documentación fiscal. Esto depende de tu perfil y origen del capital. Comprando América te acompaña para evaluar qué necesitas.",
                  },
                  {
                    q: "¿Por qué parques de casas móviles?",
                    a: "La tesis central es la escasez de tierra bien ubicada con operación existente. En muchas ciudades ya no es posible construir nuevos parques, lo que incrementa el valor de los existentes. Además, la vivienda accesible mantiene demanda constante incluso en ciclos económicos adversos.",
                  },
                  {
                    q: "¿La llamada estratégica es para venderme algo?",
                    a: "No. La llamada es para determinar si esta ruta se alinea con tu patrimonio, horizonte, tolerancia al riesgo y objetivos familiares. Si no es la ruta correcta para ti, lo decimos con claridad.",
                  },
                ].map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="bg-white border border-gray-200 rounded-xl px-6 shadow-sm"
                  >
                    <AccordionTrigger className="text-[#0B1F3A] text-left hover:no-underline py-5 font-semibold">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-[#6B7280] leading-relaxed pb-5">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 11. CIERRE CTA — deep navy ═══ */}
      <section className="bg-[#091A30] py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-blue-400 text-sm font-semibold tracking-[0.2em] uppercase mb-6 font-mono">
                Victory Capital
              </p>
              <h2 className="text-3xl md:text-4xl text-white mb-4">
                No necesitas evaluar todas las oportunidades.
              </h2>
              <p className="text-slate-400 text-lg mb-2">
                Necesitas entender cuál tiene sentido para ti.
              </p>
              <p className="text-slate-500 text-sm mb-12 max-w-lg mx-auto leading-relaxed">
                Victory Capital puede ser una ruta interesante para inversionistas que
                buscan exposición inmobiliaria en Estados Unidos, flujo potencial,
                diversificación en dólares y operación profesional.
              </p>

              <div className="bg-[#0E2544] border border-[#1E3A5F] rounded-2xl p-8 mb-10 text-left">
                <p className="text-blue-300 text-sm font-mono uppercase tracking-wider mb-4">
                  La llamada estratégica
                </p>
                <p className="text-white text-lg leading-relaxed mb-4">
                  No es para venderte una inversión.
                </p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Es para determinar si esta ruta se alinea con tu patrimonio, horizonte,
                  tolerancia al riesgo y objetivos familiares.
                </p>
              </div>

              <Button
                onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_MSG)}
                className="bg-primary hover:bg-blue-600 text-white px-10 py-6 text-base gap-2 shadow-lg shadow-blue-600/25 w-full sm:w-auto"
              >
                Evaluar mi perfil <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
