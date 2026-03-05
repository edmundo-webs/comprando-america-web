/*
 * Design: "Executive Noir" — Dark luxury club de inversión
 * Palette: Navy deep (#0A1628), Emerald (#00C853), Gold (#C5A55A), White
 * Typography: DM Serif Display (headings), DM Sans (body), Space Grotesk (data)
 */

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProspectForm from "@/components/ProspectForm";

import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";
import { IMAGES, EXTERNAL_LINKS } from "@/lib/constants";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  ArrowRight, CheckCircle2, Home as HomeIcon, Building2, Globe, Users,
  GraduationCap, Briefcase, Shield, TrendingUp, Star, ChevronRight
} from "lucide-react";

// ─── Animated wrapper ───
function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
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

// ─── Stat Counter ───
function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, isInView } = useInView();
  const count = useCountUp(value, 2000, isInView);
  return (
    <div ref={ref} className="text-center">
      <div className="stat-number text-4xl md:text-5xl lg:text-6xl text-primary mb-2">
        {count}{suffix}
      </div>
      <p className="text-white/50 text-sm leading-relaxed max-w-[200px] mx-auto">{label}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN PAGE - NUEVA ESTRUCTURA 2026
// ═══════════════════════════════════════════════════════
export default function Home() {
  const [newsletterEmail, setNewsletterEmail] = useState("");

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* ═══ 1️⃣ HERO - NUEVO ═══ */}
      <section id="hero" className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          <img src={IMAGES.hero} alt="Skyline" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.08_0.03_250/0.92)] via-[oklch(0.10_0.03_250/0.85)] to-[oklch(0.08_0.03_250/0.70)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.10_0.03_250)] via-transparent to-transparent" />
        </div>
        <div className="container relative z-10 pt-28 pb-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-block text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
                Membresía Privada para Inversionistas
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-white leading-[1.1] mb-6">
                Invierte en Estados Unidos con{" "}
                <span className="gradient-text-primary">criterio, estructura</span>{" "}
                y acompañamiento real
              </h1>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-6 max-w-2xl">
                Invierte desde $100,000 dólares en Estados Unidos con estructura legal, fiscal y migratoria correcta desde el inicio.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8 max-w-2xl">
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="text-sm">Diagnóstico estratégico personalizado</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="text-sm">Plan de inversión en 30 días</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="text-sm">Ejecución estructurada en 60–90 días</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href={EXTERNAL_LINKS.membresia}>
                  <Button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base gap-2 w-full sm:w-auto">
                    Solicitar Evaluación <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <a href="#sistema">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/5 px-8 py-6 text-base w-full sm:w-auto">
                    Ver cómo funciona
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
        {/* Diagonal cut */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path d="M0 80L1440 20V80H0Z" fill="oklch(0.12 0.03 250)" />
          </svg>
        </div>
      </section>

      {/* ═══ 2️⃣ EL PROBLEMA REAL ═══ */}
      <section className="section-dark py-20 md:py-24">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-6 font-mono">El Problema Real</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-6">
                El error no es invertir en Estados Unidos
              </h2>
              <p className="text-2xl md:text-3xl font-serif text-primary mb-8">
                El error es hacerlo sin estructura.
              </p>
              <p className="text-lg text-white/70 leading-relaxed mb-8">
                Cada año, inversionistas latinos pierden capital por:
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            {[
              { title: "Comprar activos sobrevalorados", desc: "Sin análisis real del mercado" },
              { title: "Invertir solo por la visa", desc: "Sin estrategia de inversión clara" },
              { title: "Confiar en propuestas sin due diligence real", desc: "Sin validación de oportunidades" },
              { title: "Estructurar mal su LLC", desc: "Y pagar impuestos innecesarios" },
              { title: "No tener plan de salida", desc: "Sin estrategia de liquidez" }
            ].map((problem, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-6 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 font-semibold text-sm mt-1">
                    ✕
                  </div>
                  <div>
                    <p className="text-white font-semibold">{problem.title}</p>
                    <p className="text-white/60 text-sm mt-1">{problem.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-lg text-white/70 leading-relaxed">
                <span className="text-white font-semibold">Invertir sin sistema cuesta más que no invertir.</span>
              </p>
              <p className="text-lg text-white/70 leading-relaxed mt-4">
                Nosotros evitamos esos errores desde el día uno.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>


      {/* ═══ 3️⃣ QUÉ ES COMPRANDO AMÉRICA ═══ */}
      <section className="section-darker py-20 md:py-24">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">Sistema Privado</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-8">
                Qué es Comprando América
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            <FadeIn delay={0.1}>
              <div className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-8">
                <h3 className="text-xl font-serif text-white mb-6">No es...</h3>
                <ul className="space-y-4">
                  {[
                    "Un curso",
                    "Una asesoría genérica",
                    "Un despacho migratorio"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/70">
                      <span className="text-red-400 font-bold text-lg mt-0.5">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="bg-gradient-to-br from-primary/20 to-transparent border border-primary/30 rounded-xl p-8">
                <h3 className="text-xl font-serif text-white mb-6">Es...</h3>
                <p className="text-white/80 mb-6">
                  Un sistema privado de decisión y ejecución para inversionistas latinoamericanos que quieren diversificar patrimonio en Estados Unidos con estructura profesional.
                </p>
                <ul className="space-y-4">
                  {[
                    "Metodología estructurada",
                    "Filtro estratégico riguroso",
                    "Acompañamiento integral"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/80">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>

          <FadeIn>
            <div className="text-center bg-[oklch(0.15_0.03_250)] border border-primary/20 rounded-xl p-8 max-w-2xl mx-auto">
              <p className="text-lg text-white/80 mb-2">
                <span className="font-semibold">Aquí no decidimos por ti.</span>
              </p>
              <p className="text-lg text-primary font-semibold">
                Decidimos contigo.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 3.5️⃣ COMUNIDAD REAL ═══ */}
      <section className="section-dark py-20 md:py-24">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">Nuestra Comunidad</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white">
                Inversionistas que ya están actuando
              </h2>
              <p className="text-lg text-white/60 mt-4 max-w-2xl mx-auto">
                Empresarios y profesionales que han tomado acción en Estados Unidos
              </p>
            </div>
          </FadeIn>

          {/* Miembros destacados */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663291837994/TXKhhi3qa3kqCbF2c9sawS/member-edmundo-natural-6GCimzhH43ZHfHpiPxchXK.webp", name: "Edmundo", role: "Fundador, Cumbres" },
              { img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663291837994/TXKhhi3qa3kqCbF2c9sawS/member-maria-natural-ntb2ZHwfmdHa9s5Twxni6n.webp", name: "María", role: "Empresaria, Real Estate" },
              { img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663291837994/TXKhhi3qa3kqCbF2c9sawS/member-carlos-natural-FkNYZdx7EF8Tbz5XxdNzos.webp", name: "Carlos", role: "Inversionista, Startups" },
              { img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663291837994/TXKhhi3qa3kqCbF2c9sawS/member-alejandra-natural-dGMFdfBEmYRRxo6XKoABHF.webp", name: "Alejandra", role: "CEO, Tech Ventures" }
            ].map((member, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="text-center group">
                  <div className="relative mb-4 overflow-hidden rounded-xl border border-primary/20 group-hover:border-primary/50 transition-all duration-300">
                    <img src={member.img} alt={member.name} className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0.03_250/0.8)] to-transparent" />
                  </div>
                  <h3 className="text-lg font-serif text-white">{member.name}</h3>
                  <p className="text-sm text-primary font-semibold">{member.role}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Evento de comunidad */}
          <FadeIn>
            <div className="relative rounded-2xl overflow-hidden border border-primary/20 h-96">
              <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663291837994/TXKhhi3qa3kqCbF2c9sawS/community-gathering-1-LdfkVTBt5Tv6mSE22UES4S.webp" alt="Comunidad" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.08_0.03_250/0.9)] to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="max-w-2xl text-center">
                  <h3 className="text-3xl md:text-4xl font-serif text-white mb-4">Eventos y Networking Exclusivos</h3>
                  <p className="text-lg text-white/80 mb-6">Reuniones estratégicas, Deal Days y viajes de inspección con miembros de la comunidad</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 4️⃣ VITRINA ESTRATÉGICA ═══ */}
      <section id="sistema" className="section-dark py-20 md:py-24">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">Nuestro Enfoque</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white">
                Nuestro enfoque integral en Estados Unidos
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: <Building2 className="w-8 h-8" />,
                title: "Bienes Raíces Estratégicos",
                desc: "Single family homes y tierra estratégica con análisis real de entrada."
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Migración con estructura",
                desc: "Visa E-1, E-2 o expansión empresarial alineada a inversión sostenible."
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Estructuración LLC",
                desc: "Diseño correcto desde el inicio para proteger patrimonio."
              },
              {
                icon: <GraduationCap className="w-8 h-8" />,
                title: "Educación Ejecutiva",
                desc: "Deal Days, mentorías y análisis práctico."
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Red de Expertos",
                desc: "Abogados, contadores, brokers y consultores con experiencia real."
              }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-6 hover:border-primary/30 transition-all duration-500 h-full">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-serif text-white mb-2">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5️⃣ NUESTROS PILARES 2026 ═══ */}
      <section className="section-darker py-20 md:py-24">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">Metodología</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white">
                El sistema detrás de la membresía
              </h2>
              <p className="text-lg text-white/60 mt-4 max-w-2xl mx-auto">
                6 pilares que transforman barreras en ventajas estratégicas
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                num: "1",
                title: "Criterio de Inversión",
                desc: "Decidimos con proceso, no con emoción. Analizamos tesis, números, riesgos y escenarios."
              },
              {
                num: "2",
                title: "Curación Estratégica",
                desc: "Descartamos la mayoría de oportunidades. Protegemos capital, no vendemos proyectos."
              },
              {
                num: "3",
                title: "Acompañamiento Integral",
                desc: "Estructura legal, fiscal, bancaria y migratoria alineada desde el inicio."
              },
              {
                num: "4",
                title: "Comunidad Ejecutora",
                desc: "Empresarios que ya están tomando acción comparten experiencia real."
              },
              {
                num: "5",
                title: "Velocidad de Activación",
                desc: "Diagnóstico claro y plan estructurado. Inversión en 60–90 días cuando hay encaje."
              },
              {
                num: "6",
                title: "Transferencia Patrimonial",
                desc: "Diversificación internacional con visión de largo plazo y protección estructurada."
              }
            ].map((pillar, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-6 hover:border-primary/30 transition-all duration-500">
                  <div className="text-3xl font-serif text-primary mb-3">{pillar.num}</div>
                  <h3 className="text-lg font-serif text-white mb-2">{pillar.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{pillar.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="text-center">
              <p className="text-lg text-white/70 mb-6 max-w-2xl mx-auto">
                <span className="font-semibold">No vendemos promesas.</span> Construimos estructura.
              </p>
              <a href={EXTERNAL_LINKS.membresia}>
                <Button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base gap-2">
                  Conocer el Sistema <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 4.5️⃣ POR QUÉ ES DIFERENTE ═══ */}
      <section className="section-darker py-20 md:py-24">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-12 text-center">
                ¿Por qué es diferente?
              </h2>

              <div className="space-y-6 mb-12">
                {[
                  "No vivimos de comisiones por vender activos.",
                  "No promovemos cualquier oportunidad.",
                  "No mezclamos migración con improvisación.",
                  "No dejamos que inviertas sin estructura bancaria y fiscal clara.",
                  "Solo el 20% de las oportunidades evaluadas son presentadas."
                ].map((item, i) => (
                  <FadeIn key={i} delay={i * 0.1}>
                    <div className="flex items-start gap-4 bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-lg p-6 hover:border-primary/20 transition-all duration-500">
                      <div className="text-primary text-2xl font-bold shrink-0 mt-1">✓</div>
                      <p className="text-white/80 text-lg leading-relaxed">{item}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>

              <FadeIn>
                <div className="text-center bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-xl p-8">
                  <p className="text-xl md:text-2xl font-serif text-white">
                    Somos <span className="text-primary font-bold">sistema de inversión</span>.
                  </p>
                  <p className="text-xl md:text-2xl font-serif text-white mt-2">
                    No <span className="text-primary font-bold">marketing de proyectos</span>.
                  </p>
                </div>
              </FadeIn>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 5️⃣ RED DE EXPERTOS ALIADOS ═══ */}
      <section className="section-dark py-20 md:py-24">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">Respaldo Profesional</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white">
                Red de Expertos Aliados
              </h2>
              <p className="text-lg text-white/60 mt-4 max-w-2xl mx-auto">
                CPA, abogados especializados en migración, propiedad intelectual, real estate y derecho comercial
              </p>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="relative rounded-2xl overflow-hidden border border-primary/20 h-96 md:h-[500px]">
              <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663291837994/gnumaucdsTZCWXNK.jpg" alt="Expertos Aliados" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.08_0.03_250/0.7)] to-transparent" />
              <div className="absolute inset-0 flex items-end justify-start p-8 md:p-12">
                <div className="max-w-2xl">
                  <h3 className="text-2xl md:text-3xl font-serif text-white mb-3">Estructura Legal y Fiscal Completa</h3>
                  <p className="text-lg text-white/90">Cada inversión cuenta con respaldo de expertos en más de 10 disciplinas para asegurar que tu estructura sea correcta desde el inicio.</p>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {[
                { title: "CPA", desc: "Estructura fiscal optimizada" },
                { title: "Abogado Migración", desc: "Visa E-2 y opciones legales" },
                { title: "Propiedad Intelectual", desc: "Protección de activos" },
                { title: "Real Estate", desc: "Inversión inmobiliaria estratégica" }
              ].map((expert, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-6 text-center hover:border-primary/30 transition-all duration-500">
                    <h3 className="text-lg font-serif text-primary mb-2">{expert.title}</h3>
                    <p className="text-sm text-white/60">{expert.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 5.5️⃣ PERFIL IDEAL DEL MIEMBRO ═══ */}
      <section className="section-darker py-20 md:py-24">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">Perfil Ideal</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-8">
                Esta membresía es para ti si:
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            <FadeIn delay={0.1}>
              <div className="bg-gradient-to-br from-primary/20 to-transparent border border-primary/30 rounded-xl p-8">
                <h3 className="text-xl font-serif text-white mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  Para ti
                </h3>
                <ul className="space-y-4">
                  {[
                    "Puedes invertir $100,000 USD o más",
                    "Buscas diversificación internacional estructurada",
                    "Valoras proceso sobre improvisación",
                    "Entiendes que proteger capital es prioridad",
                    "Quieres acompañamiento real, no teoría"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/80">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-8">
                <h3 className="text-xl font-serif text-white mb-6 flex items-center gap-2">
                  <span className="text-red-400 font-bold text-lg">✕</span>
                  No es para
                </h3>
                <ul className="space-y-4">
                  {[
                    "Quien busca oportunidades rápidas",
                    "Quien no tiene capital disponible",
                    "Quien espera que otros decidan por él",
                    "Quien busca cursos"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/70">
                      <span className="text-red-400 font-bold text-lg mt-0.5">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>

          <FadeIn>
            <div className="text-center bg-[oklch(0.15_0.03_250)] border border-primary/20 rounded-xl p-8 max-w-2xl mx-auto">
              <p className="text-lg text-white/80 mb-4">
                <span className="font-semibold">Esto no es para todos.</span>
              </p>
              <p className="text-lg text-primary font-semibold mb-6">
                Es para quien entiende que estructurar bien es más importante que entrar rápido.
              </p>
              <p className="text-white/70">
                El siguiente paso no es pagar. Es validar si tu perfil encaja.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 6️⃣ RESULTADOS Y MÉTRICAS ═══ */}
      <section className="section-dark py-20 md:py-24">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">Autoridad</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white">
                Ejecutamos. No solo analizamos.
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
            {[
              { value: 38, suffix: "+", label: "Miembros activos" },
              { value: 50, suffix: "+", label: "LLCs estructuradas" },
              { value: 6, suffix: "", label: "Viajes de inspección" },
              { value: 7, suffix: "", label: "Eventos presenciales" },
              { value: 11, suffix: "+", label: "Visas tramitadas" },
              { value: 7, suffix: "", label: "Visas en proceso" }
            ].map((stat, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <StatCounter {...stat} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 7️⃣ TESTIMONIOS ═══ */}
      <section className="section-darker py-20 md:py-24">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">Comunidad</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white">
                Historias reales de miembros
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: "Arturo Orozco",
                videoId: "WYNwoTzG8Ss",
                title: "Testimonial de Arturo Orozco"
              },
              {
                name: "Gerardo Bejarano",
                videoId: "6J6IIPFsTD0",
                title: "Testimonial de Gerardo Bejarano"
              }
            ].map((testimonial, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="relative group rounded-xl overflow-hidden bg-[oklch(0.15_0.03_250)] border border-white/5 hover:border-primary/30 transition-all duration-500">
                  {/* Embedded YouTube Video */}
                  <div className="relative w-full aspect-video overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${testimonial.videoId}?rel=0&modestbranding=1`}
                      title={testimonial.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0"
                    />
                  </div>
                  
                  {/* Info Section */}
                  <div className="p-6">
                    <h3 className="text-lg font-serif text-white mb-2">{testimonial.name}</h3>
                    <p className="text-sm text-white/70">{testimonial.title}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 8️⃣ PARA QUIÉN ES / NO ES ═══ */}
      <section className="section-dark py-20 md:py-24">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white">
                ¿Para quién es Comprando América?
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            <FadeIn delay={0.1}>
              <div className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-8">
                <h3 className="text-xl font-serif text-primary mb-6">✓ Es para ti si...</h3>
                <ul className="space-y-3">
                  {[
                    "Puedes invertir $100,000 USD o más",
                    "Buscas diversificación internacional estructurada",
                    "Valoras proceso sobre improvisación",
                    "Entiendes que proteger capital es prioridad",
                    "Quieres acompañamiento real, no teoría",
                    "Buscas ejecutar con orden y criterio"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/80">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-8">
                <h3 className="text-xl font-serif text-red-400 mb-6">✕ No es para ti si...</h3>
                <ul className="space-y-3">
                  {[
                    "Buscas oportunidades rápidas sin análisis",
                    "Esperas que otros tomen decisiones por ti",
                    "No tienes capital disponible",
                    "Quieres comisiones o intermediarios",
                    "Buscas cursos o mentoría genérica",
                    "No estás comprometido con la ejecución",
                    "Buscas resultados inmediatos sin estructura"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/80">
                      <span className="text-red-400 font-bold mt-0.5">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>

          <FadeIn>
            <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-xl p-8">
              <p className="text-lg text-white/80 mb-4">
                Esto no es para todos.
              </p>
              <p className="text-xl md:text-2xl font-serif text-white mb-6">
                Es para quien entiende que <span className="text-primary font-bold">estructurar bien es más importante que entrar rápido</span>.
              </p>
              <p className="text-lg text-white/70">
                El siguiente paso no es pagar. <span className="text-primary font-semibold">Es validar si tu perfil encaja</span>.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 9️⃣ PODCAST / EDUCACIÓN ═══ */}
      <section className="section-darker py-20 md:py-24">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">Aprendizaje</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-6">
                Aprendizaje continuo
              </h2>
              <p className="text-lg text-white/70 leading-relaxed mb-8">
                Contenido educativo para empresarios que quieren entender el mercado estadounidense antes de actuar.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://comprandoamerica.com/podcast">
                  <Button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base gap-2">
                    Escuchar Podcast <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <a href="https://comprandoamerica.com/formacion/">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-6 text-base gap-2">
                    Conoce nuestro programa educativo <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 🔟 CTA FINAL FUERTE ═══ */}
      <section className="section-dark py-20 md:py-24">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-6">
                ¿Estás listo?
              </h2>
              <p className="text-lg text-white/70 leading-relaxed mb-6">
                Si entiendes que invertir en Estados Unidos requiere estructura, el siguiente paso es validar tu encaje.
              </p>
              <p className="text-lg text-white/60 mb-8">
                <span className="font-semibold">No es pagar.</span> Es evaluar si perteneces al grupo.
              </p>
              <a href={EXTERNAL_LINKS.membresia}>
                <Button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base gap-2">
                  Solicitar Evaluación <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ MEMBRESÍA FORM ═══ */}
      <section id="membresia" className="section-darker py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">Siguiente Paso</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-6">
                Validar tu encaje
              </h2>
              <p className="text-lg text-white/70 leading-relaxed max-w-2xl mx-auto">
                Completa el formulario y nos pondremos en contacto para evaluar si eres un buen fit para la membresía.
              </p>
            </div>
          </FadeIn>

          <div className="max-w-2xl mx-auto">
            <ProspectForm title="Solicitud de Membresía" />
          </div>
        </div>
      </section>



      <Footer />
    </div>
  );
}
