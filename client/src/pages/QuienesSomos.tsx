import { motion } from "framer-motion";
import { ArrowRight, Users, Briefcase, Globe, Shield, TrendingUp, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AlliesSection from "@/components/AlliesSection";
import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";
import { openWhatsApp, WHATSAPP_PHONE, WHATSAPP_MESSAGE } from "@/lib/whatsapp";

/* ── animation helper ── */
function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isInView } = useInView();
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

/* ── photos from Drive ── */
const HERO_IMAGE = "https://lh3.googleusercontent.com/d/12leYCR8tlXXxZ6jeBlgthhmUqcyEmtoz=w1920"; // panel de expertos
const TEAM_IMAGE = "https://lh3.googleusercontent.com/d/1RK1ICQKrETpZBFYH_NoZmnYzMULHREYu=w1920"; // equipo rooftop
const AUDIENCE_IMAGE = "https://lh3.googleusercontent.com/d/1gnZX2RiYD4M29nQmqwcsN0k13db74LmV=w1920"; // sala llena
const EDMUNDO_PORTRAIT = "https://lh3.googleusercontent.com/d/1Um6fwMpl_mMyAZWmF1hWVdnLYpJCp0Kz=w800";
const WORKSHOP_IMAGE = "https://lh3.googleusercontent.com/d/1mQWgGjGOCgTU8BsOl3Rgdh5mGR3eObRd=w1200";

const stats = [
  { value: 38, suffix: "+", label: "Miembros activos" },
  { value: 50, suffix: "+", label: "LLCs estructuradas" },
  { value: 6, suffix: "", label: "Viajes de inspección" },
  { value: 11, suffix: "+", label: "Visas tramitadas" },
];

function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, isInView } = useInView();
  const count = useCountUp(value, 2000, isInView);
  return (
    <div ref={ref} className="text-center">
      <div className="text-primary text-3xl md:text-4xl font-bold mb-1">{count}{suffix}</div>
      <p className="text-[#6B7280] text-xs">{label}</p>
    </div>
  );
}

export default function QuienesSomos() {
  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white overflow-x-hidden">
      <Navbar />

      {/* ═══ HERO — foto panel expertos ═══ */}
      <section className="relative min-h-[70vh] flex items-center pt-32 pb-20">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Panel de expertos Comprando América" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/95 via-[#0B1F3A]/80 to-[#0B1F3A]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-[#0B1F3A]/30" />
        </div>

        <div className="container relative z-10">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <div className="max-w-3xl">
              <span className="inline-block text-blue-400 text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
                Sobre Nosotros
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-6">
                Club privado de inversionistas en{" "}
                <span className="gradient-text-primary">Estados Unidos</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl mb-8">
                Comprando América es una comunidad exclusiva para empresarios e inversionistas latinos que buscan estructurar inversiones estratégicas en Estados Unidos.
              </p>
              <div className="space-y-2 text-slate-400 text-sm mb-10">
                <p className="font-semibold text-white">No somos brokers. No vendemos negocios. No improvisamos.</p>
                <p>Diseñamos y presentamos oportunidades estructuradas con análisis previo y visión estratégica.</p>
              </div>
              <a href="/membresia">
                <Button className="bg-primary hover:bg-blue-600 text-white font-semibold px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25">
                  Conoce el Club de Inversión <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ MISIÓN + VISIÓN — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <FadeIn>
              <div>
                <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">Nuestra Misión</p>
                <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-6">
                  Democratizar el acceso a inversiones estratégicas
                </h2>
                <p className="text-[#4B5563] text-lg leading-relaxed mb-8">
                  Brindamos a nuestros miembros las herramientas, el conocimiento y el acompañamiento necesarios para invertir y operar en el mercado estadounidense con estructura y visión.
                </p>
                <div className="space-y-4">
                  {[
                    "Acceso a oportunidades validadas y estructuradas",
                    "Educación ejecutiva y formación estratégica",
                    "Acompañamiento legal, fiscal y migratorio",
                    "Red de contactos y co-inversión activa",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-[#374151] text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <img src={WORKSHOP_IMAGE} alt="Taller de inversión" className="w-full h-80 object-cover" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ STATS — ☀️ BLANCO ═══ */}
      <section className="bg-white py-16 md:py-20">
        <div className="container">
          <FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {stats.map((s, i) => (
                <StatCounter key={i} {...s} />
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ LO QUE HACEMOS — navy ═══ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-blue-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">Lo Que Hacemos</p>
              <h2 className="text-3xl md:text-4xl text-white">Solución integral para inversión en EE.UU.</h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Globe, title: "Oportunidades validadas", desc: "Selección rigurosa de negocios con potencial, rentabilidad comprobada y estructura legal lista." },
              { icon: Briefcase, title: "Educación ejecutiva", desc: "Capacitación dirigida para comprender la dinámica del mercado estadounidense." },
              { icon: Shield, title: "Acompañamiento integral", desc: "Alianzas con firmas legales, fiscales y migratorias especializadas." },
              { icon: Users, title: "Red de co-inversión", desc: "Comunidad activa de empresarios para colaborar y compartir conocimiento." },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="bg-[#132D50] border border-[#1E3A5F] rounded-xl p-6 hover:border-blue-500/30 transition-all h-full">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-primary flex items-center justify-center mb-4">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Photo break — equipo rooftop ── */}
      <section className="relative h-64 md:h-96 overflow-hidden">
        <img src={TEAM_IMAGE} alt="Equipo Comprando América" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F5F7FA] via-transparent to-[#0E2544]" />
      </section>

      {/* ═══ DIFERENCIAL — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <div className="text-center mb-12">
                <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">¿Por Qué Nosotros?</p>
                <h2 className="text-3xl md:text-4xl text-[#0B1F3A]">Nuestro Diferencial</h2>
              </div>
            </FadeIn>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: TrendingUp, title: "100% enfocados en latinos", desc: "Entendemos los desafíos y oportunidades únicos del empresario latino en Estados Unidos." },
                { icon: CheckCircle2, title: "Metodología probada", desc: "Proceso estructurado para identificar oportunidades sólidas y sostenibles." },
                { icon: Users, title: "Equipo multidisciplinario", desc: "Especialistas en adquisiciones, migración, operaciones y patrimonio." },
              ].map((d, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-all h-full shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-primary flex items-center justify-center mx-auto mb-4">
                      <d.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-[#0B1F3A] font-semibold mb-2">{d.title}</h3>
                    <p className="text-[#6B7280] text-sm leading-relaxed">{d.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ EDMUNDO CEO — navy ═══ */}
      <section className="bg-[#0B1F3A] py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-blue-400 text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">Liderazgo</p>
              <h2 className="text-4xl md:text-5xl text-white">Quién está al frente</h2>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="max-w-5xl mx-auto bg-[#0F2847] border border-[#1E3A5F] rounded-2xl p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-10 items-start">
                <div className="flex-shrink-0 mx-auto md:mx-0">
                  <img src={EDMUNDO_PORTRAIT} alt="Edmundo Treviño" className="w-48 h-56 md:w-56 md:h-64 rounded-xl object-cover border-2 border-blue-500/20 shadow-lg" />
                </div>

                <div className="flex-1">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">Edmundo Treviño</h3>
                  <p className="text-blue-400 text-sm font-semibold tracking-[0.2em] uppercase mb-6">Fundador y Director General</p>
                  <p className="text-slate-300 text-lg leading-relaxed mb-8">
                    Empresario serial, fundador y CEO de 9 empresas operando en Estados Unidos. Más de dos décadas de experiencia en comercio internacional y adquisiciones transfronterizas.
                  </p>

                  <ul className="space-y-3 mb-10">
                    {[
                      "Ingeniero Mecánico Administrador con MBA en Economía Industrial",
                      "Maestría en Sistema Fiscal en Estados Unidos",
                      "10 años de experiencia en contabilidad y administración",
                      "20 años de experiencia en comercio internacional",
                      "Más de 8 empresas operando en EE.UU. y México",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <span className="text-slate-400 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-4">
                    <a href="https://edmundotrevino.com" target="_blank" rel="noopener noreferrer">
                      <Button className="bg-primary hover:bg-blue-600 text-white px-6 py-3 text-sm gap-2 shadow-lg shadow-blue-600/15">
                        Conoce más <ArrowRight className="w-4 h-4" />
                      </Button>
                    </a>
                    <a href="https://edmundotrevino.com" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="border-slate-600 text-white hover:bg-white/10 px-6 py-3 text-sm gap-2">
                        Agendar Asesoría 1:1 <ArrowRight className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ ALIADOS — component (navy) ═══ */}
      <AlliesSection />

      {/* ── Photo break — audiencia ── */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img src={AUDIENCE_IMAGE} alt="Comunidad de inversionistas" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F5F7FA] via-transparent to-[#0B1F3A]/60" />
      </section>

      {/* ═══ COMUNIDAD — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">Comunidad</p>
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-8">
                Inversión con dirección. Comunidad con propósito.
              </h2>
              <p className="text-[#4B5563] text-lg leading-relaxed mb-6">
                Unirte a Comprando América es integrarte a una comunidad de empresarios que entienden el valor de invertir con visión, información y respaldo.
              </p>
              <p className="text-[#4B5563] text-lg leading-relaxed mb-10">
                Nuestros miembros comparten un mismo objetivo: generar crecimiento sostenido a través de decisiones estratégicas en uno de los mercados más estables del mundo.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/membresia">
                  <Button className="bg-primary hover:bg-blue-600 text-white font-semibold px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/20">
                    Conoce el Club de Inversión <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <a href="/perfil">
                  <Button variant="outline" className="border-gray-300 text-[#0B1F3A] hover:bg-gray-50 px-8 py-6 text-base">
                    Evaluar mi Perfil
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
              <h2 className="text-3xl md:text-4xl text-white mb-4">¿Listo para dar el siguiente paso?</h2>
              <p className="text-slate-400 leading-relaxed mb-10">
                Si entiendes que invertir en Estados Unidos requiere estructura, criterio y comunidad, el siguiente paso es conocernos.
              </p>
              <Button
                onClick={() => openWhatsApp(WHATSAPP_PHONE, WHATSAPP_MESSAGE)}
                className="bg-primary hover:bg-blue-600 text-white font-semibold px-10 py-6 text-lg gap-2 shadow-lg shadow-blue-600/25"
              >
                Hablar con un asesor <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
