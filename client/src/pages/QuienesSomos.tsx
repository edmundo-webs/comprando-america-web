import { motion } from "framer-motion";
import { ArrowRight, Users, Briefcase, Globe, Shield, TrendingUp, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { IMAGES, EXTERNAL_LINKS } from "@/lib/constants";

export default function QuienesSomos() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center pt-32 pb-20">
        <div className="absolute inset-0">
          <img src={IMAGES.hero} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.08_0.03_250/0.92)] via-[oklch(0.10_0.03_250/0.85)] to-[oklch(0.08_0.03_250/0.70)]" />
        </div>
        <div className="container relative z-10">
          <motion.div {...fadeIn}>
            <span className="inline-block text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
              Sobre Nosotros
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.1] mb-6">
              Impulsamos a inversionistas latinos a conquistar el mercado{" "}
              <span className="gradient-text-primary">estadounidense</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl">
              Comprando América es una comunidad privada de empresarios e inversionistas latinos que, a través de una membresía anual, acceden a oportunidades de inversión en Estados Unidos.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Misión Section */}
      <section className="section-dark py-24 md:py-32">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeIn}>
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Nuestra Misión</h2>
              <p className="text-white/70 text-lg leading-relaxed mb-8">
                Nuestro objetivo es democratizar el acceso a inversiones estratégicas en Estados Unidos, brindando a nuestros miembros las herramientas, el conocimiento y el acompañamiento necesarios para adquirir y operar negocios rentables en el mercado estadounidense.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <span className="text-white/80">Acceso a oportunidades validadas y estructuradas</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <span className="text-white/80">Educación ejecutiva y formación estratégica</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <span className="text-white/80">Acompañamiento legal, fiscal y migratorio</span>
                </div>
              </div>
            </motion.div>
            <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
              <div className="relative rounded-2xl overflow-hidden">
                <img src={IMAGES.investmentBusiness} alt="Misión" className="w-full h-[400px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0.03_250)] to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Lo que hacemos Section */}
      <section className="section-darker py-24 md:py-32">
        <div className="container">
          <motion.div {...fadeIn} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Lo que hacemos</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              En Comprando América operamos como una solución integral para el proceso de inversión extranjera en Estados Unidos
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Acceso a oportunidades validadas",
                description: "Selección rigurosa de negocios operativos con potencial de crecimiento, rentabilidad comprobada y estructura legal lista para transacción.",
              },
              {
                icon: <Briefcase className="w-8 h-8" />,
                title: "Educación ejecutiva y formación estratégica",
                description: "Capacitación dirigida a inversionistas y equipos gerenciales para comprender la dinámica del mercado estadounidense y los requisitos de adquisición.",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Acompañamiento legal, fiscal y migratorio",
                description: "Alianzas con firmas especializadas que garantizan procesos alineados con la legislación estadounidense y los objetivos de residencia o expansión internacional.",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Red de contactos y co-inversión",
                description: "Acceso a una comunidad activa de empresarios con los que es posible colaborar, coinvertir o compartir conocimiento estratégico.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                {...fadeIn}
                transition={{ delay: i * 0.1 }}
                className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-8 hover:border-primary/30 transition-all duration-500 group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl font-serif text-white mb-3">{item.title}</h3>
                <p className="text-white/60 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Diferencial Section */}
      <section className="section-dark py-24 md:py-32">
        <div className="container">
          <motion.div {...fadeIn} className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-12">Nuestro Diferencial</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-1">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-white mb-2">Enfoque 100% en inversionistas latinoamericanos</h3>
                  <p className="text-white/60">Entendemos las particularidades, desafíos y oportunidades únicas del empresario latino en Estados Unidos.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-1">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-white mb-2">Metodología probada</h3>
                  <p className="text-white/60">Identificamos oportunidades sólidas y sostenibles con un proceso estructurado y validado.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-1">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-white mb-2">Equipo multidisciplinario</h3>
                  <p className="text-white/60">Especialistas en adquisiciones, migración, operaciones y planificación patrimonial trabajan juntos por tu éxito.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Liderazgo Section */}
      <section className="section-darker py-24 md:py-32">
        <div className="container">
          <motion.div {...fadeIn} className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-12">Liderazgo</h2>
            <div className="bg-[oklch(0.15_0.03_250)] border border-primary/20 rounded-2xl p-12">
              <h3 className="text-2xl font-serif text-white mb-4">Edmundo Treviño</h3>
              <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-6">Fundador y Director General</p>
              <p className="text-white/70 leading-relaxed mb-8">
                Empresario con más de dos décadas de experiencia en comercio internacional, adquisiciones transfronterizas y desarrollo empresarial entre Estados Unidos y América Latina.
              </p>
              <p className="text-white/60 leading-relaxed mb-8">
                Junto a un equipo de especialistas en legal, finanzas y operaciones, lidera Comprando América con un enfoque claro: <span className="text-white font-semibold">reducir la complejidad del mercado estadounidense para el empresario latino que busca crecimiento real.</span>
              </p>
              <a href={EXTERNAL_LINKS.mentoria} target="_blank" rel="noopener noreferrer">
                <Button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 gap-2">
                  Agenda una mentoría <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comunidad Section */}
      <section className="section-dark py-24 md:py-32">
        <div className="container">
          <motion.div {...fadeIn} className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-8">Forma parte de una red que transforma inversión en acción</h2>
            <div className="space-y-6 text-white/70 leading-relaxed">
              <p>
                Unirte a <span className="text-white font-semibold">Comprando América</span> no es solo acceder a oportunidades de negocio: es integrarte a una comunidad de empresarios que entienden el valor de invertir con visión, información y respaldo.
              </p>
              <p>
                Nuestros miembros comparten un <span className="text-white font-semibold">mismo objetivo</span>: generar crecimiento sostenido a través de decisiones estratégicas en uno de los mercados más estables y rentables del mundo.
              </p>
              <p>
                Lo hacen respaldados por un equipo multidisciplinario, una red activa de profesionales y una metodología comprobada.
              </p>
              <div className="pt-8 border-t border-white/10">
                <p className="text-lg font-serif text-white">
                  <span className="text-primary">Comprando América.</span> Inversión con dirección. Comunidad con propósito.
                </p>
              </div>
            </div>
            <div className="mt-12">
              <a href={EXTERNAL_LINKS.membresia} target="_blank" rel="noopener noreferrer">
                <Button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base gap-2">
                  Conoce la Membresía <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Photo Section */}
      <section className="section-dark py-24 md:py-32">
        <div className="container">
          <motion.div {...fadeIn} className="text-center mb-12">
            <span className="inline-block text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
              El Equipo
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Somos una comunidad de ejecución</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Profesionales especializados trabajando juntos para transformar tu visión en realidad.
            </p>
          </motion.div>

          <motion.div {...fadeIn} className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663291837994/ZCsPWjMTupqNFLuJ.avif"
              alt="Equipo Comprando América"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0.03_250)] via-transparent to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Expertos Section */}
      <section className="section-darker py-24 md:py-32">
        <div className="container">
          <motion.div {...fadeIn} className="text-center mb-16">
            <span className="inline-block text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
              Dedicación. Experiencia. Pasión.
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Nuestros Expertos</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Conoce al equipo que lidera Comprando América y acompaña a cada inversionista en su camino.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Edmundo Treviño",
                title: "Director General",
                description: "Empresario serial, fundador y CEO de 9 empresas operando en Estados Unidos. Apasionado por trascender conquistando el mercado americano.",
                credentials: [
                  "Ingeniero Mecánico Administrador con MBA en Economía Industrial",
                  "Maestría en Sistema Fiscal en Estados Unidos",
                  "10 años de experiencia en contabilidad y administración de empresas",
                  "20 años de experiencia en comercio internacional",
                  "Más de 8 empresas operando en Estados Unidos y México",
                ],
                image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663291837994/INQMtHnxZUpqoHhX.png",
                showCredentials: true,
                showButtons: true,
              },
              {
                name: "Tomás Resendez",
                title: "Abogado inmigración",
                description: "Especialista en inmigración corporativa con experiencia representando a Fortune 100. Bilingüe (inglés-español), garantiza asesoramiento legal claro y preciso.",
                image: "https://cdn.manus.im/uploads/tomas-resendez.jpg",
              },
              {
                name: "John Mckee",
                title: "Consultor comercial",
                description: "Experto en Estrategia Comercial con 35+ años adaptando productos al mercado estadounidense en manufactura, consumo masivo y tecnología.",
                image: "https://cdn.manus.im/uploads/john-mckee.avif",
              },
              {
                name: "Destiny Bounds",
                title: "Abogada corporativa y PI",
                description: "Fundadora de Bounds Law LLC, especializada en derecho corporativo, pequeñas empresas y propiedad intelectual. Autora y conferencista nacional.",
                image: "https://cdn.manus.im/uploads/destiny-bounds.avif",
              },
              {
                name: "Aubrey Dwyer",
                title: "Abogada corporativa",
                description: "Especializada en apertura de empresas, contratos y trademarks. Graduada de la Facultad de Derecho de la Universidad de Oklahoma.",
                image: "https://cdn.manus.im/uploads/aubrey-dwyer.jpg",
              },
              {
                name: "Daniel Palacios",
                title: "Contador CPA y fiscalista",
                description: "Especialista en contabilidad empresarial y planeación fiscal. Experto asesorando a empresas y particulares con socios latinos.",
                image: "https://cdn.manus.im/uploads/daniel-palacios.png",
              },
              {
                name: "Sebastián Jara",
                title: "Consultor de marketing digital",
                description: "15+ años optimizando estrategias digitales y procesos de marketing con automatización e IA para empresas en inmobiliario, educación y e-commerce.",
                image: "https://cdn.manus.im/uploads/sebastian-jara.avif",
              },
              {
                name: "Joe Faraci",
                title: "Inversionista en bienes raíces",
                description: "Propietario de 250+ propiedades con 28 años de experiencia. Especialista en crear riqueza transgeneracional con Real Estate en USA.",
                image: "https://cdn.manus.im/uploads/joe-faraci.jpg",
              },
            ].map((expert, i) => (
              <motion.div
                key={expert.name}
                {...fadeIn}
                transition={{ delay: i * 0.1 }}
                className="group relative"
              >
                <div className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-500 h-full flex flex-col">
                  {/* Image */}
                  <div className="relative w-full h-48 overflow-hidden bg-gradient-to-b from-primary/10 to-transparent flex items-center justify-center">
                    {expert.image ? (
                      <img
                        src={expert.image}
                        alt={expert.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <Users className="w-16 h-16 text-primary/30" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-serif text-white mb-1">{expert.name}</h3>
                    <p className="text-primary text-sm font-semibold mb-4">{expert.title}</p>
                    <p className="text-white/60 text-sm leading-relaxed mb-4 flex-1">{expert.description}</p>

                    {/* Credentials */}
                    {expert.showCredentials && (
                      <div className="space-y-2 mb-6 pt-4 border-t border-white/10">
                        {expert.credentials?.map((cred, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <span className="text-white/70 text-xs leading-tight">{cred}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Buttons */}
                    {expert.showButtons && (
                      <div className="space-y-2">
                        <a href={EXTERNAL_LINKS.mentoria} target="_blank" rel="noopener noreferrer" className="block">
                          <Button className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 text-sm">
                            Conoce más
                          </Button>
                        </a>
                        <a href={EXTERNAL_LINKS.mentoria} target="_blank" rel="noopener noreferrer" className="block">
                          <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/5 font-semibold py-2 text-sm">
                            Agendar Asesoría 1:1
                          </Button>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
