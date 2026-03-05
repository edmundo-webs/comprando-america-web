import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Testimonial {
  id: string;
  name: string;
  city: string;
  results: string[];
  quote: string;
  avatar?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Carlos",
    city: "Monterrey",
    results: ["LLC estructurada", "Networking empresarial"],
    quote: "Entré a Comprando América buscando estructura para invertir en Estados Unidos. El equipo me ayudó a estructurar correctamente mi LLC y a entender el sistema fiscal. Además, el networking en los eventos presenciales en Monterrey me abrió relaciones con otros empresarios que ya están invirtiendo.",
    avatar: "C"
  },
  {
    id: "2",
    name: "Alejandro",
    city: "Ciudad de México",
    results: ["Visa de inversionista", "Estructura legal completa"],
    quote: "Yo ya tenía el capital pero no sabía cómo estructurar la inversión para aplicar a una visa. Con el acompañamiento del equipo de Comprando América logramos estructurar el proyecto y hoy mi proceso migratorio está en marcha.",
    avatar: "A"
  },
  {
    id: "3",
    name: "Jorge",
    city: "Guadalajara",
    results: ["Primera inversión en USA", "Acceso a oportunidades"],
    quote: "Lo que más valoré fue que aquí no solo analizan oportunidades, las ejecutan. A través de la comunidad conocí un proyecto que ya estaba estructurado y hoy ya soy inversionista.",
    avatar: "J"
  },
  {
    id: "4",
    name: "Luis",
    city: "Cancún",
    results: ["Networking de alto nivel", "Comprensión del ecosistema"],
    quote: "Asistí a la Cumbre en Guadalajara y fue donde realmente entendí el valor de la comunidad. No son solo conferencias, son empresarios compartiendo cómo están invirtiendo.",
    avatar: "L"
  },
  {
    id: "5",
    name: "Ricardo",
    city: "Houston",
    results: ["Estructura fiscal", "Red de expertos multidisciplinaria"],
    quote: "El mayor valor para mí ha sido tener acceso a un equipo multidisciplinario. Abogados, contadores y empresarios que ya están operando en Estados Unidos.",
    avatar: "R"
  },
  {
    id: "6",
    name: "Mariana",
    city: "Bogotá",
    results: ["Expansión internacional", "Asesoría legal completa"],
    quote: "Como empresaria buscaba expandir mi negocio a Estados Unidos. Comprando América me proporcionó la estructura legal y el networking necesario para hacerlo de forma segura.",
    avatar: "M"
  }
];

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [autoPlay]);

  const handlePrev = () => {
    setAutoPlay(false);
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNext = () => {
    setAutoPlay(false);
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="section-darker py-24 md:py-32">
      <div className="container">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">
            Historias Reales
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-6">
            Lo que dicen los miembros de la comunidad
          </h2>
          <p className="text-lg text-white/70 leading-relaxed">
            Experiencias reales de empresarios que ya están ejecutando dentro de Comprando América
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial Cards */}
          <div className="relative h-[500px] md:h-[450px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="absolute inset-0"
              >
                <div className="h-full bg-gradient-to-br from-[oklch(0.15_0.03_250)] to-[oklch(0.12_0.03_250)] border border-primary/20 rounded-2xl p-8 md:p-12 flex flex-col justify-between">
                  {/* Avatar & Name */}
                  <div className="flex items-start gap-6 mb-8">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-serif text-white font-bold">
                        {current.avatar}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif text-white mb-1">
                        {current.name}
                      </h3>
                      <p className="text-white/60 font-mono text-sm">
                        {current.city}
                      </p>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="mb-8 flex-grow">
                    <p className="text-lg text-white/90 leading-relaxed italic">
                      "{current.quote}"
                    </p>
                  </div>

                  {/* Results */}
                  <div className="space-y-3 pt-6 border-t border-white/10">
                    <p className="text-sm font-semibold text-primary uppercase tracking-[0.1em]">
                      Resultado obtenido
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {current.results.map((result, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-white/80 text-sm"
                        >
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>{result}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-primary/20 border border-white/20 hover:border-primary/40 flex items-center justify-center transition-all duration-300 group"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 text-white group-hover:text-primary transition-colors" />
            </button>

            {/* Indicators */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setAutoPlay(false);
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "bg-primary w-8"
                      : "bg-white/20 w-2 hover:bg-white/40"
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-primary/20 border border-white/20 hover:border-primary/40 flex items-center justify-center transition-all duration-300 group"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 text-white group-hover:text-primary transition-colors" />
            </button>
          </div>

          {/* Auto-play indicator */}
          <div className="text-center mt-6">
            <p className="text-white/40 text-sm font-mono">
              {currentIndex + 1} / {TESTIMONIALS.length}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
