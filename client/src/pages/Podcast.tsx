import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useInView } from "@/hooks/useInView";
import { motion } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";

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

// ─── Episode Card ───
function EpisodeCard({ 
  title,
  videoUrl
}: { 
  title: string;
  videoUrl: string;
}) {
  return (
    <a href={videoUrl} target="_blank" rel="noopener noreferrer">
      <div className="group relative bg-[oklch(0.12_0.03_250)] border border-white/10 rounded-lg p-4 hover:border-primary/40 transition-all duration-500 flex items-center gap-4 cursor-pointer">
        {/* Play Button */}
        <div className="flex-shrink-0 w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center group-hover:bg-red-700 transition-colors">
          <Play className="w-6 h-6 text-white fill-white" />
        </div>
        
        {/* Title */}
        <div className="flex-1 min-w-0">
          <p className="text-white/80 text-sm group-hover:text-white transition-colors line-clamp-2">{title}</p>
        </div>
      </div>
    </a>
  );
}

export default function Podcast() {
  const episodes = [
    {
      title: "El Dólar Sigue Siendo El Rey (y Aquí Te Digo Por Qué)",
      videoUrl: "https://www.youtube.com/watch?v=HAZVutSO7cI&t=17s"
    },
    {
      title: "Impuestos en la era Trump: Nueva reforma del ISR",
      videoUrl: "https://www.youtube.com/watch?v=aZwXyxaEWKc"
    },
    {
      title: "¿Cuánto dinero necesitas para la visa E2?",
      videoUrl: "https://www.youtube.com/watch?v=MVweDe87IEA&t=3s"
    }
  ];

  const categories = [
    "Inversiones en Estados Unidos",
    "Visas E-2",
    "Real Estate",
    "Emprendimiento",
    "Estrategia Fiscal"
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
                  Conquistadores de América
                </h1>

                {/* Underline */}
                <div className="w-16 h-1 bg-primary mb-6" />

                {/* Description */}
                <p className="text-lg text-white/70 leading-relaxed mb-8">
                  Escucha estrategias de negocio, inversiones y emprendimiento para el mercado americano. Entrevistas con empresarios exitosos, análisis de oportunidades y consejos prácticos basados en más de 24 años de experiencia.
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
                      <p className="text-white/50 text-xs">365+ suscriptores</p>
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

                {/* Episodes */}
                <div className="space-y-3">
                  {episodes.map((episode, i) => (
                    <EpisodeCard key={i} title={episode.title} videoUrl={episode.videoUrl} />
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

      <Footer />
    </div>
  );
}
