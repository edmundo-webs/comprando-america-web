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
      videoId: "dQw4w9WgXcQ", // Placeholder - reemplazar con IDs reales
      title: "Cómo Encontrar Negocios Rentables en USA",
      description: "Aprende las estrategias clave para identificar oportunidades de inversión en el mercado estadounidense. Edmundo Treviño comparte sus mejores técnicas de prospección.",
      duration: "28:45"
    },
    {
      videoId: "dQw4w9WgXcQ",
      title: "Estructura Legal y Fiscal para Inversionistas Latinos",
      description: "Entiende cómo estructurar tus inversiones para optimizar resultados fiscales y proteger tu patrimonio. Análisis completo de opciones legales.",
      duration: "35:20"
    },
    {
      videoId: "dQw4w9WgXcQ",
      title: "Visa E-2: Tu Camino a la Residencia en USA",
      description: "Descubre cómo la visa E-2 puede ayudarte a vivir y operar tu negocio en Estados Unidos. Requisitos, proceso y ventajas explicadas.",
      duration: "42:15"
    },
    {
      videoId: "dQw4w9WgXcQ",
      title: "Análisis Financiero: Valuación de Empresas",
      description: "Domina los métodos de valuación para tomar decisiones informadas. Aprende a calcular el SDE y otros indicadores clave de valor.",
      duration: "31:50"
    },
    {
      videoId: "dQw4w9WgXcQ",
      title: "Operación de Negocios Adquiridos en USA",
      description: "Estrategias prácticas para administrar y optimizar negocios que has adquirido. Desde gestión de personal hasta digitalización de procesos.",
      duration: "39:30"
    },
    {
      videoId: "dQw4w9WgXcQ",
      title: "Crecimiento y Expansión: Escalando tu Negocio",
      description: "Descubre cómo crecer tu negocio en Estados Unidos. Estrategias de financiamiento, diferenciación de marca y adquisición de clientes.",
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
              Conversaciones con expertos sobre inversión, negocios y oportunidades en Estados Unidos. Aprende estrategias probadas de emprendedores e inversionistas latinos exitosos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="https://www.youtube.com/playlist?list=PLRSYRwqvqDN_T6CzDxD041FCUyyMmMyV9" target="_blank" rel="noopener noreferrer">
                <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-6 text-base gap-2 w-full sm:w-auto">
                  <Play className="w-5 h-5 fill-white" /> Ver en YouTube
                </Button>
              </a>
              <a href="https://open.spotify.com/show/1pYUGyRRFXgA0c9xpaEtw7" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 font-semibold px-8 py-6 text-base gap-2 w-full sm:w-auto">
                  <Music className="w-5 h-5" /> Escuchar en Spotify
                </Button>
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
                  <p className="text-white/70 leading-relaxed">
                    Cada episodio explora temas clave para inversionistas latinos: desde cómo encontrar negocios rentables hasta estrategias de visa, estructura legal y operación de empresas en Estados Unidos. Escucha a Edmundo Treviño y nuestro equipo de expertos compartir experiencias reales, casos de éxito y lecciones aprendidas en el mercado estadounidense.
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

      {/* ═══ CTA ═══ */}
      <section className="section-darker py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="bg-gradient-to-r from-primary/10 to-emerald/10 border border-primary/20 rounded-2xl p-12 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
                Suscríbete para Nuevos Episodios
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                Mantente actualizado con nuestros últimos episodios. Disponibles en YouTube, Spotify y todas las plataformas de podcast.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://www.youtube.com/playlist?list=PLRSYRwqvqDN_T6CzDxD041FCUyyMmMyV9" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-6 text-base gap-2">
                    <Play className="w-5 h-5 fill-white" /> Suscribirse en YouTube
                  </Button>
                </a>
                <a href="https://open.spotify.com/show/1pYUGyRRFXgA0c9xpaEtw7" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 font-semibold px-8 py-6 text-base gap-2">
                    <Music className="w-5 h-5" /> Suscribirse en Spotify
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
