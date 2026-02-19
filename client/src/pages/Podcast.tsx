import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import { useInView } from "@/hooks/useInView";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Music, Play, Volume2, ArrowRight } from "lucide-react";

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

// ─── Video Card ───
function VideoCard({ 
  videoId, 
  title, 
  description, 
  duration 
}: { 
  videoId: string; 
  title: string; 
  description: string; 
  duration: string;
}) {
  return (
    <FadeIn>
      <div className="group relative bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-500 h-full flex flex-col">
        {/* Video Thumbnail */}
        <div className="relative w-full aspect-video bg-black overflow-hidden">
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <a
              href={`https://www.youtube.com/watch?v=${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-16 h-16 rounded-full bg-primary hover:bg-primary-dark transition-colors flex items-center justify-center shadow-lg"
            >
              <Play className="w-7 h-7 text-white fill-white ml-1" />
            </a>
          </div>

          {/* Duration Badge */}
          <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-xs text-white font-medium">
            {duration}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-lg font-serif text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-white/60 text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
            {description}
          </p>
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors"
          >
            Ver en YouTube <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </FadeIn>
  );
}

export default function Podcast() {
  // Videos destacados de Comprando América
  const featuredVideos = [
    {
      videoId: "HAZVutSO7cI",
      title: "Brian Tracy: ¿Quieres invertir en Estados Unidos? Esto puede hacerte triunfar",
      description: "Aprende de uno de los expertos en inversión más reconocidos del mundo. Brian Tracy comparte sus mejores estrategias para tener éxito en el mercado estadounidense.",
      duration: "28:45"
    },
    {
      videoId: "aZwXyxaEWKc",
      title: "Impuestos en la era Trump: Descifrando la nueva reforma del ISR",
      description: "Entiende cómo la nueva reforma fiscal impacta tus inversiones en Estados Unidos. Análisis completo de cambios tributarios y estrategias de optimización.",
      duration: "35:20"
    },
    {
      videoId: "MVweDe87IEA",
      title: "¿Cuánto dinero realmente necesitas para la visa E2?",
      description: "Descubre los requisitos reales de inversión para la visa E-2. Análisis detallado de montos, estructuras y opciones disponibles para inversionistas.",
      duration: "42:15"
    },
    {
      videoId: "VZH2JzhVaCk",
      title: "Deberías COMPRAR un negocio en Estados Unidos — Con Diego Alcalá",
      description: "Conversación profunda sobre las ventajas y desafíos de comprar negocios en USA. Diego Alcalá comparte casos reales y lecciones aprendidas.",
      duration: "31:50"
    },
    {
      videoId: "HAZVutSO7cI",
      title: "Cómo Encontrar Negocios Rentables en USA",
      description: "Aprende las estrategias clave para identificar oportunidades de inversión en el mercado estadounidense. Técnicas de prospección y análisis de mercado.",
      duration: "39:30"
    },
    {
      videoId: "aZwXyxaEWKc",
      title: "Estructura Legal y Fiscal para Inversionistas Latinos",
      description: "Entiende cómo estructurar tus inversiones para optimizar resultados fiscales y proteger tu patrimonio. Opciones legales y consideraciones importantes.",
      duration: "33:45"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[60vh] flex items-center pt-28 pb-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.08_0.03_250/0.92)] via-[oklch(0.10_0.03_250/0.85)] to-[oklch(0.08_0.03_250/0.70)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.10_0.03_250)] via-transparent to-transparent" />
        </div>
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <span className="inline-block text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
              Podcast
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-[1.1] mb-6">
              Escucha Nuestro{" "}
              <span className="gradient-text-primary">Podcast</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8">
              El espacio donde los latinoamericanos aprenden a invertir estratégicamente en el mercado más competitivo del mundo. Conversaciones con expertos, casos de éxito y análisis de sectores.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="https://www.youtube.com/playlist?list=PLRSYRwqvqDN_T6CzDxD041FCUyyMmMyV9" target="_blank" rel="noopener noreferrer" className="inline-block">
                <img src="https://private-us-east-1.manuscdn.com/sessionFile/rH3nUXiDzGJaE39MncmP5b/sandbox/PUdOkncPg8WZVX7RkaJcm3-img-1_1771538533000_na1fn_YnV0dG9uLXlvdXR1YmU.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvckgzblVYaUR6R0phRTM5TW5jbVA1Yi9zYW5kYm94L1BVZE9rbmNQZzhXWlZYN1JrYUpjbTMtaW1nLTFfMTc3MTUzODUzMzAwMF9uYTFmbl9ZblYwZEc5dUxYbHZkWFIxWW1VLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=rf6gDIEJEFQueE03vpUHoFR8jbIH3uoxafFmsvfQ3xgNoQmgoqnYOeoktCgY7YXALrhPeNLPuZJqu4DUqu6FjvHu~4wC2LkZBj7pkweoAiuDGJrlqnKsmWfvJMM2h4ue8pLESFCmRf1em34-Lk~KBOHWU4023g61t3LcVVQdEKHEL0UFo-eaV4JkOPVibcghS8-HaTMHLu2w9sdjpHovL~~Kl-h7drBzB~vuaZ4yPp67~Lqfwv730rgtqTF2781uxJAGdS5NIgTwdX2nrZ3DRI7hykJ2qZHkKuadsfIe-Pk5qt1E0QE0rtiQdCFSvI5cnTfgEjnLLlksr4SPxXftDw__" alt="Escuchar en YouTube" className="h-20 sm:h-24 hover:opacity-80 transition-opacity" />
              </a>
              <a href="https://open.spotify.com/show/1pYUGyRRFXgA0c9xpaEtw7" target="_blank" rel="noopener noreferrer" className="inline-block">
                <img src="https://private-us-east-1.manuscdn.com/sessionFile/rH3nUXiDzGJaE39MncmP5b/sandbox/PUdOkncPg8WZVX7RkaJcm3-img-2_1771538538000_na1fn_YnV0dG9uLXNwb3RpZnk.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvckgzblVYaUR6R0phRTM5TW5jbVA1Yi9zYW5kYm94L1BVZE9rbmNQZzhXWlZYN1JrYUpjbTMtaW1nLTJfMTc3MTUzODUzODAwMF9uYTFmbl9ZblYwZEc5dUxYTndiM1JwWm5rLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=b19ciSxohRUjmfNHgRx91yp-HIwuWvj2XMty1XLL7~TkLhVGguyDK-wpv~EgzlAQGF8gosdPxgZpoQVuSsg1DcrJjdRc6DnnzVyRDBxswDGp4byW2BKg7p0mzTkvSmxWRiMXto~HpK2EKvGfCA21Yws6hbbTy7RUZCX5jNTF~HYzIGrdQL9bsEgpfAIbyCb034182ioGosBzu5I1ovg7dT7Fwiz7dPw77m1zcY17WUM8lMGrh0PJOvyE0Ts4Fb1RIGAHZ9euiNeWh9~TYSz3aFAAF6Qm18lL0wiJQolhUqzLK4nKB9oER6kTDDHzRHQB7CFcYGlAnh7ZPWQQNJO~EA__" alt="Escuchar en Spotify" className="h-20 sm:h-24 hover:opacity-80 transition-opacity" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ DESCRIPCIÓN ═══ */}
      <section className="section-darker py-16 md:py-20">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto bg-gradient-to-r from-primary/10 to-emerald/10 border border-primary/20 rounded-2xl p-8 md:p-12">
              <div className="flex gap-4 items-start">
                <Volume2 className="w-8 h-8 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-serif text-white mb-3">Comprando América Podcast</h3>
                  <p className="text-white/70 leading-relaxed mb-4">
                    Cada episodio está diseñado para aportar valor real: entrevistas con expertos, casos de éxito, análisis de sectores y consejos prácticos para invertir, adquirir negocios o expandirse en el entorno empresarial estadounidense.
                  </p>
                  <p className="text-white/70 leading-relaxed">
                    Invertir en Estados Unidos no se trata solo de capital: se trata de estrategia, contexto y conexiones. En este podcast te ayudamos a entender el entorno legal, fiscal y migratorio; identificar modelos de negocio con potencial; escuchar de primera mano a empresarios latinos que ya dieron el paso; evitar errores comunes; y prepararte para estructurar inversiones que generen estabilidad y crecimiento.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ VIDEOS DESTACADOS ═══ */}
      <section className="section-dark py-24 md:py-32">
        <div className="container">
          <SectionHeading
            tag="Contenido Destacado"
            title="Videos Más Vistos"
            subtitle="Accede a nuestros episodios más populares. Disponibles en YouTube y Spotify."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVideos.map((video, i) => (
              <VideoCard
                key={i}
                videoId={video.videoId}
                title={video.title}
                description={video.description}
                duration={video.duration}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ¿POR QUÉ ESCUCHAR? ═══ */}
      <section className="section-dark py-24 md:py-32">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <FadeIn>
              <div>
                <h2 className="text-3xl md:text-4xl font-serif text-white mb-8">¿Por qué escuchar este podcast?</h2>
                <p className="text-white/70 text-lg mb-6">
                  Cada episodio está diseñado para aportar valor real: entrevistas con expertos, casos de éxito, análisis de sectores y consejos prácticos para invertir, adquirir negocios o expandirse en el entorno empresarial estadounidense.
                </p>
                <ul className="space-y-4">
                  {[
                    "Entender el entorno legal, fiscal y migratorio para inversionistas extranjeros",
                    "Identificar modelos de negocio con potencial en distintos estados y sectores",
                    "Escuchar de primera mano a empresarios latinos que ya dieron el paso",
                    "Evitar errores comunes al comprar o operar empresas en Estados Unidos",
                    "Prepararte para estructurar inversiones que generen estabilidad y crecimiento"
                  ].map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">✓</span>
                      <span className="text-white/70">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="bg-gradient-to-br from-primary/20 to-emerald/20 border border-primary/30 rounded-2xl p-8 md:p-10">
                <h3 className="text-2xl font-serif text-white mb-6">¿Para quién es este podcast?</h3>
                <ul className="space-y-4">
                  {[
                    "Eres empresario o inversionista y estás considerando diversificar en Estados Unidos",
                    "Quieres entender cómo operan los negocios en el mercado americano",
                    "Buscas una guía práctica, en español, sin promesas vacías ni fórmulas mágicas",
                    "Valoras aprender de experiencias reales, no solo de teoría"
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="text-primary text-xl">✅</span>
                      <span className="text-white/70">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section className="section-darker py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="bg-gradient-to-r from-primary/10 to-emerald/10 border border-primary/20 rounded-2xl p-12 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
                Da el siguiente paso con información, estrategia y visión
              </h2>
              <p className="text-white/70 text-lg mb-4 max-w-3xl mx-auto">
                Invertir en Estados Unidos no es solo una meta, es una decisión que transforma tu futuro personal y empresarial.
              </p>
              <p className="text-white/70 text-lg mb-8 max-w-3xl mx-auto">
                A través de nuestro podcast, te damos acceso directo al conocimiento que antes solo estaba reservado para expertos: experiencias reales, análisis sin filtros y herramientas prácticas para avanzar con seguridad.
              </p>
              <p className="text-white/70 text-lg mb-8 max-w-3xl mx-auto font-semibold">
                🎙️ Suscríbete al Podcast de Comprando América y acompáñanos en cada episodio a descubrir cómo empresarios latinos están conquistando el mercado estadounidense — uno negocio a la vez.
              </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://www.youtube.com/playlist?list=PLRSYRwqvqDN_T6CzDxD041FCUyyMmMyV9" target="_blank" rel="noopener noreferrer" className="inline-block">
                <img src="https://private-us-east-1.manuscdn.com/sessionFile/rH3nUXiDzGJaE39MncmP5b/sandbox/PUdOkncPg8WZVX7RkaJcm3-img-1_1771538533000_na1fn_YnV0dG9uLXlvdXR1YmU.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvckgzblVYaUR6R0phRTM5TW5jbVA1Yi9zYW5kYm94L1BVZE9rbmNQZzhXWlZYN1JrYUpjbTMtaW1nLTFfMTc3MTUzODUzMzAwMF9uYTFmbl9ZblYwZEc5dUxYbHZkWFIxWW1VLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=rf6gDIEJEFQueE03vpUHoFR8jbIH3uoxafFmsvfQ3xgNoQmgoqnYOeoktCgY7YXALrhPeNLPuZJqu4DUqu6FjvHu~4wC2LkZBj7pkweoAiuDGJrlqnKsmWfvJMM2h4ue8pLESFCmRf1em34-Lk~KBOHWU4023g61t3LcVVQdEKHEL0UFo-eaV4JkOPVibcghS8-HaTMHLu2w9sdjpHovL~~Kl-h7drBzB~vuaZ4yPp67~Lqfwv730rgtqTF2781uxJAGdS5NIgTwdX2nrZ3DRI7hykJ2qZHkKuadsfIe-Pk5qt1E0QE0rtiQdCFSvI5cnTfgEjnLLlksr4SPxXftDw__" alt="Escuchar en YouTube" className="h-20 sm:h-24 hover:opacity-80 transition-opacity" />
              </a>
              <a href="https://open.spotify.com/show/1pYUGyRRFXgA0c9xpaEtw7" target="_blank" rel="noopener noreferrer" className="inline-block">
                <img src="https://private-us-east-1.manuscdn.com/sessionFile/rH3nUXiDzGJaE39MncmP5b/sandbox/PUdOkncPg8WZVX7RkaJcm3-img-2_1771538538000_na1fn_YnV0dG9uLXNwb3RpZnk.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvckgzblVYaUR6R0phRTM5TW5jbVA1Yi9zYW5kYm94L1BVZE9rbmNQZzhXWlZYN1JrYUpjbTMtaW1nLTJfMTc3MTUzODUzODAwMF9uYTFmbl9ZblYwZEc5dUxYTndiM1JwWm5rLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=b19ciSxohRUjmfNHgRx91yp-HIwuWvj2XMty1XLL7~TkLhVGguyDK-wpv~EgzlAQGF8gosdPxgZpoQVuSsg1DcrJjdRc6DnnzVyRDBxswDGp4byW2BKg7p0mzTkvSmxWRiMXto~HpK2EKvGfCA21Yws6hbbTy7RUZCX5jNTF~HYzIGrdQL9bsEgpfAIbyCb034182ioGosBzu5I1ovg7dT7Fwiz7dPw77m1zcY17WUM8lMGrh0PJOvyE0Ts4Fb1RIGAHZ9euiNeWh9~TYSz3aFAAF6Qm18lL0wiJQolhUqzLK4nKB9oER6kTDDHzRHQB7CFcYGlAnh7ZPWQQNJO~EA__" alt="Escuchar en Spotify" className="h-20 sm:h-24 hover:opacity-80 transition-opacity" />
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
