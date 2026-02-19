import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useInView } from "@/hooks/useInView";
import { motion } from "framer-motion";
import { Play, ArrowRight, CheckCircle2, Mic } from "lucide-react";

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

// ─── Episode Card with YouTube Thumbnail ───
function EpisodeCard({ 
  title,
  videoId,
  videoUrl,
  duration
}: { 
  title: string;
  videoId: string;
  videoUrl: string;
  duration?: string;
}) {
  // Extract video ID from URL if not provided
  const id = videoId || videoUrl.split('v=')[1]?.split('&')[0];
  const thumbnailUrl = `https://img.youtube.com/vi/${id}/mqdefault.jpg`;

  return (
    <a href={videoUrl} target="_blank" rel="noopener noreferrer">
      <div className="group relative bg-[oklch(0.12_0.03_250)] border border-white/10 rounded-lg overflow-hidden hover:border-primary/40 transition-all duration-500 cursor-pointer">
        {/* Thumbnail Container */}
        <div className="relative w-full aspect-video bg-black overflow-hidden">
          <img 
            src={thumbnailUrl} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
            <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center group-hover:bg-red-700 transition-colors transform group-hover:scale-110 duration-300">
              <Play className="w-7 h-7 text-white fill-white ml-1" />
            </div>
          </div>

          {/* Duration Badge */}
          {duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-white text-xs font-semibold">
              {duration}
            </div>
          )}
        </div>

        {/* Title */}
        <div className="p-3">
          <p className="text-white/80 text-sm group-hover:text-white transition-colors line-clamp-2 font-medium">{title}</p>
        </div>
      </div>
    </a>
  );
}

export default function Podcast() {
  const episodes = [
    {
      title: "VISA E-1 de COMERCIANTE | La Visa que NADIE conoce",
      videoId: "iFx3QusSR90",
      videoUrl: "https://www.youtube.com/watch?v=iFx3QusSR90",
      duration: "40:09"
    },
    {
      title: "BRRRR vs. Flipping: ¿Cuál es la mejor estrategia de inversión inmobiliaria en Estados Unidos?",
      videoId: "asOMFCvUZNc",
      videoUrl: "https://www.youtube.com/watch?v=asOMFCvUZNc",
      duration: "25:16"
    },
    {
      title: "Brian Tracy: ¿Quieres invertir en Estados Unidos? Esto puede hacerte triunfar",
      videoId: "HAZVutSO7cI",
      videoUrl: "https://www.youtube.com/watch?v=HAZVutSO7cI",
      duration: "~25:00"
    },
    {
      title: "Deberías COMPRAR un negocio en Estados Unidos — Con Diego Alcalá",
      videoId: "VZH2JzhVaCk",
      videoUrl: "https://www.youtube.com/watch?v=VZH2JzhVaCk",
      duration: "~35:00"
    },
    {
      title: "¿Cuánto dinero realmente necesitas para la visa E2?",
      videoId: "MVweDe87IEA",
      videoUrl: "https://www.youtube.com/watch?v=MVweDe87IEA",
      duration: "35:01"
    },
    {
      title: "Impuestos en la era Trump: Descifrando la nueva reforma del ISR",
      videoId: "aZwXyxaEWKc",
      videoUrl: "https://www.youtube.com/watch?v=aZwXyxaEWKc",
      duration: "20:03"
    }
  ];

  const categories = [
    "Inversiones en Estados Unidos",
    "Visas E-2",
    "Real Estate",
    "Emprendimiento",
    "Estrategia Fiscal",
    "Estructura de Inversión"
  ];

  const whyListen = [
    "Entender el entorno legal, fiscal y migratorio para inversionistas extranjeros.",
    "Identificar modelos de negocio con potencial en distintos estados y sectores.",
    "Escuchar de primera mano a empresarios latinos que ya dieron el paso.",
    "Evitar errores comunes al comprar o operar empresas en Estados Unidos.",
    "Prepararte para estructurar inversiones que generen estabilidad y crecimiento."
  ];

  const forWhom = [
    "Eres empresario o inversionista y estás considerando diversificar en Estados Unidos.",
    "Quieres entender cómo operan los negocios en el mercado americano.",
    "Buscas una guía práctica, en español, sin promesas vacías ni fórmulas mágicas.",
    "Valoras aprender de experiencias reales, no solo de teoría."
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* ═══ MAIN SECTION ═══ */}
      <section className="section-darker py-20 md:py-32">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* LEFT SIDE */}
            <FadeIn>
              <div>
                {/* Tag */}
                <span className="inline-block text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
                  Podcast
                </span>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-serif text-white leading-[1.1] mb-6">
                  Comprando América<br />
                  <span className="text-base md:text-lg font-sans font-normal text-white/80">Podcast de Inversión en Estados Unidos</span>
                </h1>

                {/* Underline */}
                <div className="w-16 h-1 bg-primary mb-6" />

                {/* Description */}
                <p className="text-lg text-white/70 leading-relaxed mb-4">
                  El espacio donde los latinos aprenden a invertir estratégicamente en el mercado más competitivo del mundo.
                </p>
                <p className="text-lg text-white/70 leading-relaxed mb-8">
                  Comprando América presenta su podcast oficial: un espacio creado para empresarios e inversionistas latinoamericanos que quieren entender, planear y ejecutar inversiones sólidas en Estados Unidos.
                </p>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {categories.map((cat) => (
                    <span key={cat} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/60 text-xs font-medium">
                      {cat}
                    </span>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="https://www.youtube.com/playlist?list=PLRSYRwqvqDN_T6CzDxD041FCUyyMmMyV9" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    YouTube
                  </a>
                  <a href="https://open.spotify.com/show/1pYUGyRRFXgA0c9xpaEtw7" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-12.061-1.573-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15.079 10.561 18.739 12.84c.361.21.599.659.301 1.1zm.179-3.362C13.134 11.249 7.994 11.209 5.794 12.212c-.624.229-1.289-.355-1.06-.979.228-.624.978-.289 1.602-.06 2.457-1.073 7.929-1.033 11.861 1.134.719.425 1.404-.557.692-1.039z"/>
                    </svg>
                    Spotify
                  </a>
                </div>
              </div>
            </FadeIn>

            {/* RIGHT SIDE - EPISODES */}
            <FadeIn delay={0.2}>
              <div className="space-y-4">
                {/* Platform Cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <a href="https://www.youtube.com/playlist?list=PLRSYRwqvqDN_T6CzDxD041FCUyyMmMyV9" target="_blank" rel="noopener noreferrer" className="group">
                    <div className="bg-[oklch(0.15_0.03_250)] border border-white/10 rounded-lg p-4 hover:border-red-600/50 transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        <span className="text-white font-semibold">YouTube</span>
                      </div>
                      <p className="text-white/50 text-xs">30+ episodios</p>
                    </div>
                  </a>
                  <a href="https://open.spotify.com/show/1pYUGyRRFXgA0c9xpaEtw7" target="_blank" rel="noopener noreferrer" className="group">
                    <div className="bg-[oklch(0.15_0.03_250)] border border-white/10 rounded-lg p-4 hover:border-green-600/50 transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-12.061-1.573-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15.079 10.561 18.739 12.84c.361.21.599.659.301 1.1zm.179-3.362C13.134 11.249 7.994 11.209 5.794 12.212c-.624.229-1.289-.355-1.06-.979.228-.624.978-.289 1.602-.06 2.457-1.073 7.929-1.033 11.861 1.134.719.425 1.404-.557.692-1.039z"/>
                        </svg>
                        <span className="text-white font-semibold">Spotify</span>
                      </div>
                      <p className="text-white/50 text-xs">Podcast disponible</p>
                    </div>
                  </a>
                </div>

                {/* Episodes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {episodes.map((episode, i) => (
                    <EpisodeCard 
                      key={i} 
                      title={episode.title} 
                      videoId={episode.videoId}
                      videoUrl={episode.videoUrl}
                      duration={episode.duration}
                    />
                  ))}
                </div>

                {/* View All Link */}
                <a href="https://www.youtube.com/playlist?list=PLRSYRwqvqDN_T6CzDxD041FCUyyMmMyV9" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:text-primary-light transition-colors mt-4 font-semibold">
                  Ver todos los episodios
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ WHY LISTEN SECTION ═══ */}
      <section className="section-dark py-20 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">¿Por qué escuchar este podcast?</h2>
              <div className="w-16 h-1 bg-primary mb-8" />
              
              <p className="text-lg text-white/70 leading-relaxed mb-10">
                Cada episodio está diseñado para aportar valor real: entrevistas con expertos, casos de éxito, análisis de sectores y consejos prácticos para invertir, adquirir negocios o expandirse en el entorno empresarial estadounidense.
              </p>

              <p className="text-lg text-white/70 leading-relaxed mb-10">
                Invertir en Estados Unidos no se trata solo de capital: se trata de estrategia, contexto y conexiones. En este podcast te ayudamos a:
              </p>

              <div className="space-y-4 mb-10">
                {whyListen.map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <p className="text-white/70">{item}</p>
                  </div>
                ))}
              </div>

              <a href="https://open.spotify.com/show/1pYUGyRRFXgA0c9xpaEtw7" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded transition-colors">
                <Mic className="w-5 h-5" />
                Escuchar el podcast ahora
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ FOR WHOM SECTION ═══ */}
      <section className="section-darker py-20 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">¿Para quién es este podcast?</h2>
              <div className="w-16 h-1 bg-primary mb-8" />
              
              <p className="text-lg text-white/70 leading-relaxed mb-10">
                Este podcast es para ti si:
              </p>

              <div className="space-y-4 mb-10">
                {forWhom.map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="text-primary font-bold text-lg mt-0.5">✅</div>
                    <p className="text-white/70">{item}</p>
                  </div>
                ))}
              </div>

              <a href="https://www.youtube.com/@ComprandoAmerica" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition-colors">
                Disponible en YouTube
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ CTA FINAL SECTION ═══ */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
        <div className="container relative z-10">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-6 leading-tight">
                Da el siguiente paso con información, estrategia y visión
              </h2>

              <p className="text-lg text-white/70 leading-relaxed mb-10">
                Invertir en Estados Unidos no es solo una meta, es una decisión que transforma tu futuro personal y empresarial. A través de nuestro podcast, te damos acceso directo al conocimiento que antes solo estaba reservado para expertos: experiencias reales, análisis sin filtros y herramientas prácticas para avanzar con seguridad.
              </p>

              <p className="text-lg text-white/70 leading-relaxed mb-12">
                🎙️ Suscríbete al Podcast de Comprando América y acompáñanos en cada episodio a descubrir cómo empresarios latinos están conquistando el mercado estadounidense — uno negocio a la vez.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://www.youtube.com/@ComprandoAmerica" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  Empieza a escuchar hoy
                </a>
                <a href="https://open.spotify.com/show/1pYUGyRRFXgA0c9xpaEtw7" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-12.061-1.573-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15.079 10.561 18.739 12.84c.361.21.599.659.301 1.1zm.179-3.362C13.134 11.249 7.994 11.209 5.794 12.212c-.624.229-1.289-.355-1.06-.979.228-.624.978-.289 1.602-.06 2.457-1.073 7.929-1.033 11.861 1.134.719.425 1.404-.557.692-1.039z"/>
                  </svg>
                  Spotify
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
