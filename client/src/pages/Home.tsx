/*
 * Design: "Executive Noir" — Dark luxury club de inversión
 * Palette: Navy deep (#0A1628), Emerald (#00C853), Gold (#C5A55A), White
 * Typography: DM Serif Display (headings), DM Sans (body), Space Grotesk (data)
 */

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import ProspectForm from "@/components/ProspectForm";
import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";
import { IMAGES, EXTERNAL_LINKS, STATS, MEMBERSHIP_PILLARS, FAQ_ITEMS } from "@/lib/constants";
import { openWhatsApp, WHATSAPP_PHONE, WHATSAPP_MESSAGE } from "@/lib/whatsapp";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { useState } from "react";
import {
  ArrowRight, Calendar, Search, Globe, Shield, Users, Building2,
  BookOpen, Mic, Play, TrendingUp, Briefcase, Home as HomeIcon,
  GraduationCap, ChevronRight, Star, Target, Handshake, ExternalLink,
  Mail, CheckCircle2
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

// ─── Pillar Icon ───
function PillarIcon({ icon }: { icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    calendar: <Calendar className="w-6 h-6" />,
    search: <Search className="w-6 h-6" />,
    globe: <Globe className="w-6 h-6" />,
    shield: <Shield className="w-6 h-6" />,
    users: <Users className="w-6 h-6" />,
    building: <Building2 className="w-6 h-6" />,
  };
  return <>{icons[icon] || <Star className="w-6 h-6" />}</>;
}

// ═══════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════
export default function Home() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const { data: blogPosts } = trpc.blogPosts.listPublished.useQuery();

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) { toast.error("Ingresa tu email"); return; }
    toast.success("¡Te has suscrito al newsletter exitosamente!");
    setNewsletterEmail("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* ═══ HERO ═══ */}
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
                Comunidad Exclusiva de Inversionistas
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-white leading-[1.1] mb-6">
                Invierte o Crea tu Negocio en{" "}
                <span className="gradient-text-primary">Estados Unidos</span>{" "}
                de Forma Segura
              </h1>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-10 max-w-2xl">
                Comprando América es una comunidad exclusiva de inversionistas que buscan elevar su patrimonio a través de adquisiciones empresariales en Estados Unidos, brindando acceso a oportunidades de inversión filtradas por nuestros expertos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#membresia">
                  <Button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base gap-2 w-full sm:w-auto">
                    Ver Membresía <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <a href="#quienes-somos">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/5 px-8 py-6 text-base w-full sm:w-auto">
                    Conoce Más
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

      {/* ═══ STATS ═══ */}
      <section className="section-dark py-20">
        <div className="container">
          <FadeIn>
            <p className="text-center text-white/40 text-sm tracking-[0.2em] uppercase mb-12 font-mono">
              Resultados y proyecciones de nuestra comunidad
            </p>
          </FadeIn>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {STATS.map((stat, i) => (
              <StatCounter key={i} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MEMBRESÍA ═══ */}
      <section id="membresia" className="section-darker py-24 md:py-32">
        <div className="container">
          <SectionHeading
            tag="Membresía Vitalicia"
            title="Los Pilares Fundamentales de Nuestra Comunidad"
            subtitle="Todas las solicitudes de ingreso son revisadas para mantener la exclusividad, valores e integridad del grupo."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {MEMBERSHIP_PILLARS.map((pillar, i) => (
              <FadeIn key={pillar.title} delay={i * 0.1}>
                <div className="group relative bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-6 hover:border-primary/30 transition-all duration-500 h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <PillarIcon icon={pillar.icon} />
                    </div>
                    <h3 className="text-xl font-serif text-white mb-3">{pillar.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{pillar.description}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Membership Benefits */}
          <FadeIn>
            <div className="bg-gradient-to-r from-emerald/10 to-gold/10 border border-primary/20 rounded-2xl p-8 md:p-12 mb-16">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl md:text-3xl font-serif text-white mb-6">Beneficios de la Membresía</h3>
                  <ul className="space-y-4">
                    {[
                      "Apertura de empresa + cuentas bancarias en USA",
                      "Inversiones exclusivas para miembros",
                      "Consultorías 1:1 con expertos",
                      "Construcción de crédito para extranjeros",
                      "Acceso a eventos presenciales y viajes de inspección",
                      "Membresía vitalicia con cupo limitado",
                    ].map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-white/70">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <a href={EXTERNAL_LINKS.membresia} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-6 text-primary hover:text-primary-dark font-semibold transition-colors">
                    Ver detalles completos <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <ProspectForm title="¿Quieres ser parte?" />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ FORMACIÓN ═══ */}
      <section id="formacion" className="section-dark py-24 md:py-32">
        <div className="container">
          <SectionHeading
            tag="Educación"
            title="Programa de Formación"
            subtitle="Contenido educativo diseñado para prepararte en cada etapa del proceso de inversión en Estados Unidos."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { num: "01", title: "Detección de Oportunidades", desc: "Aprende a identificar y evaluar oportunidades de negocio en el mercado americano.", icon: <Target className="w-6 h-6" /> },
              { num: "02", title: "Valuación de Oportunidades", desc: "Domina las técnicas de valuación para tomar decisiones de inversión informadas.", icon: <TrendingUp className="w-6 h-6" /> },
              { num: "03", title: "Operación de Negocios", desc: "Estrategias para operar exitosamente negocios adquiridos en Estados Unidos.", icon: <Briefcase className="w-6 h-6" /> },
              { num: "04", title: "Crecimiento de Negocios", desc: "Escala tu negocio con estrategias probadas de crecimiento y expansión.", icon: <ArrowRight className="w-6 h-6" /> },
            ].map((item, i) => (
              <FadeIn key={item.num} delay={i * 0.1}>
                <div className="relative bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-6 hover:border-primary/30 transition-all duration-500 h-full group">
                  <span className="stat-number text-5xl text-white/5 absolute top-4 right-4 group-hover:text-primary/10 transition-colors">{item.num}</span>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-serif text-white mb-2">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn>
            <div className="text-center">
              <a href={EXTERNAL_LINKS.formacion} target="_blank" rel="noopener noreferrer">
                <Button className="bg-primary hover:bg-primary-light text-white font-semibold px-8 py-6 text-base gap-2">
                  <GraduationCap className="w-5 h-5" /> Conoce el Programa Completo
                </Button>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ VISA E-2 ═══ */}
      <section id="visa-e2" className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.visa} alt="Visa E-2" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.08_0.03_250/0.95)] to-[oklch(0.08_0.03_250/0.80)]" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-2xl">
            <SectionHeading
              tag="Asesoría Migratoria"
              title="Visa E-2 Inversionista USA"
              subtitle="Accede a la visa de inversionista que te permite vivir y operar tu negocio en Estados Unidos de forma legal."
              align="left"
            />
            <div className="space-y-6 mb-10">
              {[
                "Asesoría personalizada para calificar a la visa E-2",
                "Esquemas confiables con costos justos y bajo riesgo",
                "Acompañamiento en todo el proceso migratorio",
                "Conexión con abogados de inmigración especializados",
                "Opciones de inversión que califican para la visa",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <ChevronRight className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-white/70">{item}</span>
                </div>
              ))}
            </div>
            <a href={EXTERNAL_LINKS.visaE2} target="_blank" rel="noopener noreferrer">
              <Button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base gap-2">
                Más Información sobre Visa E-2 <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ═══ BIENES RAÍCES ═══ */}
      <section id="bienes-raices" className="section-darker py-24 md:py-32">
        <div className="container">
          <SectionHeading
            tag="Real Estate"
            title="Bienes Raíces en USA"
            subtitle="Invierte en el mercado inmobiliario más grande del mundo con estrategias optimizadas para inversionistas latinos."
          />
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <FadeIn>
              <div className="relative rounded-2xl overflow-hidden">
                <img src={IMAGES.realEstate} alt="Real Estate" className="w-full h-[400px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0.03_250)] to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-2xl font-serif text-white mb-3">Oportunidades en Real Estate</h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-4">
                    Desde propiedades residenciales hasta parques de casas móviles, exploramos las mejores oportunidades del mercado inmobiliario americano con enfoque en rentabilidad y apreciación de capital.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 backdrop-blur rounded-lg p-3 text-center">
                      <span className="stat-number text-2xl text-primary block">+12.5%</span>
                      <span className="text-white/50 text-xs">ROI Promedio</span>
                    </div>
                    <div className="bg-white/5 backdrop-blur rounded-lg p-3 text-center">
                      <span className="stat-number text-2xl text-primary block">4.2%</span>
                      <span className="text-white/50 text-xs">Yield de Renta</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <a href={EXTERNAL_LINKS.bienesRaices} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors">
                  Ver más sobre Bienes Raíces <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <ProspectForm title="Interesado en Bienes Raíces" variant="light" />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ INVERSIONES / ESTRUCTURA ═══ */}
      <section id="inversiones" className="section-dark py-24 md:py-32">
        <div className="container">
          <SectionHeading
            tag="Inversiones"
            title="Estructura de Inversión en USA"
            subtitle="Diseñamos la estructura legal y financiera óptima para proteger y maximizar tu inversión en Estados Unidos."
          />
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: <Building2 className="w-7 h-7" />,
                title: "Constitución de Empresas",
                desc: "Apertura de LLC, Corp o la estructura ideal para tu inversión. Incluye cuentas bancarias personales y empresariales.",
                color: "emerald",
              },
              {
                icon: <Shield className="w-7 h-7" />,
                title: "Protección Patrimonial",
                desc: "Estructuras legales diseñadas para proteger tu patrimonio y optimizar la carga fiscal tanto en USA como en tu país de origen.",
                color: "gold",
              },
              {
                icon: <TrendingUp className="w-7 h-7" />,
                title: "Inversión en Negocios",
                desc: "Exploramos y presentamos solo negocios que nos hacen sentido y sinergia con la experiencia de nuestro equipo. Cada oportunidad es filtrada rigurosamente antes de ser compartida con la comunidad.",
                color: "emerald",
              },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.15}>
                <div className={`bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-8 hover:border-${item.color}/30 transition-all duration-500 h-full group`}>
                  <div className={`w-14 h-14 rounded-xl bg-${item.color}/10 text-${item.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-serif text-white mb-3">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Market Opportunity Stats */}
          <FadeIn>
            <div className="bg-[oklch(0.12_0.03_250)] border border-white/5 rounded-2xl p-8 md:p-12">
              <h3 className="text-2xl font-serif text-white mb-8 text-center">Oportunidades Reales de Negocios en Estados Unidos</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { value: "80%", label: "De los negocios pequeños se venden con financiamiento" },
                  { value: "10M+", label: "De negocios nuevos en venta en los próximos 5 años" },
                  { value: "12M+", label: "De negocios a la venta en Estados Unidos" },
                  { value: "70%", label: "De los negocios listados no encuentran comprador" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <span className="stat-number text-3xl md:text-4xl text-primary block mb-2">{stat.value}</span>
                    <p className="text-white/50 text-xs leading-relaxed">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <a href={EXTERNAL_LINKS.estructura} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 px-8 py-5 gap-2">
                    Conoce la Estructura de Inversión <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ EXPANSIÓN INTERNACIONAL ═══ */}
      <section id="expansion" className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.expansion} alt="Expansión Global" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-[oklch(0.08_0.03_250/0.95)] to-[oklch(0.08_0.03_250/0.80)]" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-2xl ml-auto">
            <SectionHeading
              tag="Internacionalización"
              title="Expansión Internacional de Empresas"
              subtitle="Lleva tu negocio al mercado americano con una estrategia probada y el acompañamiento de expertos."
              align="left"
            />
            <div className="space-y-4 mb-10">
              {[
                "Americaniza tu operación con estrategias adaptadas al mercado USA",
                "Acceso a una red de contactos y proveedores en Estados Unidos",
                "Asesoría en regulaciones, licencias y cumplimiento normativo",
                "Mentoría 1 a 1 con empresarios que ya operan en USA",
                "Estrategias de entrada al mercado y posicionamiento de marca",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Handshake className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-white/70">{item}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={EXTERNAL_LINKS.expansion} target="_blank" rel="noopener noreferrer">
                <Button className="bg-primary hover:bg-primary-light text-white font-semibold px-8 py-6 text-base gap-2 w-full sm:w-auto">
                  Más Información <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
              <a href={EXTERNAL_LINKS.mentoria} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 px-8 py-6 text-base gap-2 w-full sm:w-auto">
                  Agendar Mentoría Privada <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ NUESTROS EXPERTOS ═══ */}
      <section id="quienes-somos" className="section-darker py-24 md:py-32">
        <div className="container">
          <SectionHeading
            tag="Nuestros Expertos"
            title="Dedicación. Experiencia. Pasión."
            subtitle="Conoce al equipo que lidera Comprando América y acompaña a cada inversionista en su camino."
          />
          <FadeIn>
            <div className="max-w-4xl mx-auto">
              <div className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-2xl p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative grid md:grid-cols-[200px_1fr] gap-8 items-start">
                  <div className="text-center">
                    <div className="w-40 h-40 mx-auto rounded-2xl overflow-hidden mb-4 border border-white/10">
                      <img src="/edmundo-trevino.jpg" alt="Edmundo Treviño" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-xl font-serif text-white">Edmundo Treviño</h3>
                    <p className="text-primary text-sm font-semibold">Director General</p>
                  </div>
                  <div>
                    <p className="text-white/70 leading-relaxed mb-6">
                      Empresario serial, fundador y CEO de 9 empresas operando en Estados Unidos. Apasionado por trascender conquistando el mercado americano.
                    </p>
                    <ul className="space-y-3 mb-6">
                      {[
                        "Ingeniero Mecánico Administrador con MBA en Economía Industrial",
                        "Maestría en Sistema Fiscal en Estados Unidos",
                        "10 años de experiencia en contabilidad y administración de empresas",
                        "20 años de experiencia en comercio internacional",
                        "Más de 8 empresas operando en Estados Unidos y México",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span className="text-white/60">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-3">
                      <a href={EXTERNAL_LINKS.edmundoTrevino} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 gap-2">
                          Conoce más <ExternalLink className="w-4 h-4" />
                        </Button>
                      </a>
                      <a href={EXTERNAL_LINKS.mentoria} target="_blank" rel="noopener noreferrer">
                        <Button className="bg-primary hover:bg-primary-dark text-white font-semibold gap-2">
                          Agendar Asesoría 1:1 <ArrowRight className="w-4 h-4" />
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Otros Expertos */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              {
                name: "Tomás Resendez",
                title: "Abogado inmigración",
                description: "Especialista en inmigración corporativa con experiencia representando a Fortune 100. Bilingüe (inglés-español), garantiza asesoramiento legal claro y preciso.",
                image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291837994/TudnzYtNSkbiAEjH.jpg",
              },
              {
                name: "John Mckee",
                title: "Consultor comercial",
                description: "Experto en Estrategia Comercial con 35+ años adaptando productos al mercado estadounidense en manufactura, consumo masivo y tecnología.",
                image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291837994/YZwbYSbDGLoXJCpB.avif",
              },
              {
                name: "Destiny Bounds",
                title: "Abogada corporativa y PI",
                description: "Fundadora de Bounds Law LLC, especializada en derecho corporativo, pequeñas empresas y propiedad intelectual. Autora y conferencista nacional.",
                image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291837994/EhWRcdaSCGZJrcJC.jpeg",
              },
              {
                name: "Aubrey Dwyer",
                title: "Abogada corporativa",
                description: "Especializada en apertura de empresas, contratos y trademarks. Graduada de la Facultad de Derecho de la Universidad de Oklahoma.",
              },
              {
                name: "Daniel Palacios",
                title: "Contador CPA y fiscalista",
                description: "Especialista en contabilidad empresarial y planeación fiscal. Experto asesorando a empresas y particulares con socios latinos.",
                image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291837994/FcmgGJqLhSBfLmJp.png",
              },
              {
                name: "Sebastián Jara",
                title: "Consultor de marketing digital",
                description: "15+ años optimizando estrategias digitales y procesos de marketing con automatización e IA para empresas en inmobiliario, educación y e-commerce.",
                image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291837994/MzUQRLgWVcfkVsfg.avif",
              },
              {
                name: "Joe Faraci",
                title: "Inversionista en bienes raíces",
                description: "Propietario de 250+ propiedades con 28 años de experiencia. Especialista en crear riqueza transgeneracional con Real Estate en USA.",
                image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291837994/XbopLcBxxcFrEnFM.jpg",
              },
            ].map((expert, i) => (
              <FadeIn key={expert.name} delay={i * 0.1}>
                <div className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-6 hover:border-primary/30 transition-all duration-500 h-full">
                  {expert.image && (
                    <div className="w-24 h-24 mx-auto rounded-lg overflow-hidden mb-4 border border-white/10">
                      <img src={expert.image} alt={expert.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h3 className="text-lg font-serif text-white mb-1">{expert.name}</h3>
                  <p className="text-primary text-sm font-semibold mb-4">{expert.title}</p>
                  <p className="text-white/60 text-sm leading-relaxed">{expert.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROPUESTA ═══ */}
      <section className="section-dark py-24 md:py-32">
        <div className="container">
          <SectionHeading
            tag="Nuestra Propuesta"
            title="¿Qué Resolvemos en Comprando América?"
            subtitle="Muchos empresarios latinos enfrentan barreras para invertir en Estados Unidos. Nosotros las eliminamos."
          />
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { title: "Desconocimiento de oportunidades", desc: "El desconocimiento sobre cómo encontrar y negociar las oportunidades de inversión y adquisición que existen en el mercado americano.", icon: <Search className="w-6 h-6" /> },
              { title: "Esquemas de acceso a visas", desc: "La mayoría de los trámites y esquemas que se ofertan en línea para calificar a la visa de inversionista son poco fiables y excesivamente costosos.", icon: <Shield className="w-6 h-6" /> },
              { title: "Elección entre oportunidades", desc: "La amplia gama de posibilidades y negocios que existen para adquirir en Estados Unidos nos deja ante la pregunta: ¿Cuál es el ideal para mí?", icon: <Target className="w-6 h-6" /> },
              { title: "Detección de oportunidades", desc: "La falta de herramientas para detectar oportunidades de adquisición, cómo analizarlas, cómo negociarlas y cómo cerrarlas.", icon: <TrendingUp className="w-6 h-6" /> },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <div className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-6 hover:border-primary/20 transition-all duration-500 h-full">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-serif text-white mb-2">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="section-darker py-24 md:py-32">
        <div className="container">
          <SectionHeading
            tag="Preguntas Frecuentes"
            title="Todo lo que Necesitas Saber"
          />
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-3">
                {FAQ_ITEMS.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl px-6 data-[state=open]:border-primary/20"
                  >
                    <AccordionTrigger className="text-white hover:text-primary text-left py-5 font-serif text-lg">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-white/60 leading-relaxed pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ RECURSOS: PODCAST ═══ */}
      <section id="podcast" className="section-dark py-24 md:py-32">
        <div className="container">
          <SectionHeading
            tag="Podcast"
            title="Escucha Nuestro Podcast"
            subtitle="Conversaciones con expertos sobre inversión, negocios y oportunidades en Estados Unidos."
          />
          <FadeIn>
            <div className="max-w-3xl mx-auto bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-2xl p-8 md:p-12 text-center">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Mic className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-serif text-white mb-4">Comprando América Podcast</h3>
              <p className="text-white/60 leading-relaxed mb-8 max-w-xl mx-auto">
                Cada episodio exploramos temas clave para inversionistas latinos: desde cómo encontrar negocios rentables hasta estrategias de visa y expansión internacional.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://www.youtube.com/playlist?list=PLRSYRwqvqDN_T6CzDxD041FCUyyMmMyV9" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-5 gap-2">
                    <Play className="w-5 h-5" /> YouTube
                  </Button>
                </a>
                <a href="https://open.spotify.com/show/1pYUGyRRFXgA0c9xpaEtw7" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-5 gap-2">
                    <Play className="w-5 h-5" /> Spotify
                  </Button>
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ BLOG + NEWSLETTER ═══ */}
      <section id="blog" className="section-darker py-24 md:py-32">
        <div className="container">
          <SectionHeading
            tag="Blog"
            title="Últimas Publicaciones"
            subtitle="Artículos, análisis y guías para inversionistas latinos en Estados Unidos."
          />
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {blogPosts && blogPosts.length > 0 ? (
              blogPosts.slice(0, 3).map((post, i) => (
                <FadeIn key={post.id} delay={i * 0.1}>
                  <a href={`/blog/${post.slug}`} className="group block h-full">
                    <div className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl overflow-hidden hover:border-primary/20 transition-all duration-500 h-full flex flex-col">
                      {post.featuredImage && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.10_0.03_250)] to-transparent" />
                        </div>
                      )}
                      <div className="p-6 flex flex-col flex-1">
                        <span className="text-primary text-xs font-mono tracking-wider mb-2">
                          {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                        </span>
                        <h3 className="text-lg font-serif text-white mb-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-white/50 text-sm leading-relaxed flex-1">
                          {post.excerpt || post.content.substring(0, 150) + "..."}
                        </p>
                        <span className="inline-flex items-center gap-1 text-primary text-sm font-semibold mt-4 group-hover:gap-2 transition-all">
                          Leer más <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </a>
                </FadeIn>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-white/50">No hay blogs publicados aún</p>
              </div>
            )}
          </div>

          {/* Newsletter */}
          <FadeIn>
            <div className="max-w-2xl mx-auto bg-gradient-to-r from-emerald/10 to-gold/10 border border-primary/20 rounded-2xl p-8 md:p-12 text-center">
              <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-serif text-white mb-3">Suscríbete al Newsletter</h3>
              <p className="text-white/60 mb-6">
                Recibe las últimas oportunidades de inversión, artículos y noticias directamente en tu bandeja de entrada.
              </p>
              <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-primary focus:outline-none transition-colors"
                  required
                />
                <Button type="submit" className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 whitespace-nowrap">
                  Suscribirse
                </Button>
              </form>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section id="contacto" className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.investmentBusiness} alt="Inversión" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[oklch(0.08_0.03_250/0.90)]" />
        </div>
        <div className="container relative z-10 text-center">
          <FadeIn>
            <span className="inline-block text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
              Da el Primer Paso
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-6 max-w-3xl mx-auto">
              ¿Quieres Saber si Puedes Formar Parte de Esta Comunidad?
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Contacta a nuestro equipo para conocer más detalles. Nuestra comunidad es un grupo exclusivo con cupo limitado para mantener la cercanía entre nuestros miembros y una alta calidad en nuestros servicios.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => openWhatsApp(WHATSAPP_PHONE, WHATSAPP_MESSAGE)}
                className="bg-primary hover:bg-primary-dark text-white font-semibold px-10 py-6 text-lg gap-2 w-full sm:w-auto"
              >
                Solicitar Información <ArrowRight className="w-5 h-5" />
              </Button>
              <a href={EXTERNAL_LINKS.mentoria} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/5 px-10 py-6 text-lg gap-2 w-full sm:w-auto">
                  Agendar Asesoría con Edmundo
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
