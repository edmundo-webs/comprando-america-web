import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  city: string;
  result: string;
  results: string[];
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Carlos",
    city: "Monterrey",
    result: "Estructuración de LLC y networking",
    results: ["LLC estructurada", "Networking empresarial"],
    quote:
      "Entré a Comprando América buscando estructura para invertir en Estados Unidos. El equipo me ayudó a estructurar correctamente mi LLC y a entender el sistema fiscal. Además, el networking en los eventos presenciales en Monterrey me abrió relaciones con otros empresarios que ya están invirtiendo.",
  },
  {
    id: 2,
    name: "Alejandro",
    city: "Ciudad de México",
    result: "Visa de inversionista",
    results: ["Visa en proceso", "Proyecto estructurado"],
    quote:
      "Yo ya tenía el capital pero no sabía cómo estructurar la inversión para aplicar a una visa. Con el acompañamiento del equipo de Comprando América logramos estructurar el proyecto y hoy mi proceso migratorio está en marcha.",
  },
  {
    id: 3,
    name: "Jorge",
    city: "Guadalajara",
    result: "Primera inversión en Estados Unidos",
    results: ["Inversionista activo", "Oportunidad ejecutada"],
    quote:
      "Lo que más valoré fue que aquí no solo analizan oportunidades, las ejecutan. A través de la comunidad conocí un proyecto que ya estaba estructurado y hoy ya soy inversionista.",
  },
  {
    id: 4,
    name: "Luis",
    city: "Cancún",
    result: "Evento presencial + networking",
    results: ["Red de contactos", "Conocimiento práctico"],
    quote:
      "Asistí a la Cumbre en Guadalajara y fue donde realmente entendí el valor de la comunidad. No son solo conferencias, son empresarios compartiendo cómo están invirtiendo.",
  },
  {
    id: 5,
    name: "Ricardo",
    city: "Houston",
    result: "Estructura fiscal y red de expertos",
    results: ["Asesoría multidisciplinaria", "Red de operadores"],
    quote:
      "El mayor valor para mí ha sido tener acceso a un equipo multidisciplinario. Abogados, contadores y empresarios que ya están operando en Estados Unidos.",
  },
];

export default function MemberTestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [autoPlay]);

  const goToPrevious = () => {
    setAutoPlay(false);
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToNext = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setAutoPlay(false);
    setCurrentIndex(index);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="section-darker py-24 md:py-32">
      <div className="container">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">
            Comunidad
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6">
            Lo que dicen los miembros de la comunidad
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Experiencias reales de empresarios que ya están ejecutando dentro de
            Comprando América.
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial Card */}
          <div className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-2xl p-8 md:p-12 min-h-[500px] flex flex-col justify-between">
            {/* Avatar Placeholder */}
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary/20 flex items-center justify-center">
                <span className="text-4xl font-serif text-primary/60">
                  {current.name[0]}
                </span>
              </div>
            </div>

            {/* Name & City */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-serif text-white mb-2">
                {current.name}
              </h3>
              <p className="text-white/50 text-sm">{current.city}</p>
            </div>

            {/* Quote */}
            <blockquote className="text-center mb-8 flex-grow">
              <p className="text-white/80 text-lg leading-relaxed italic">
                "{current.quote}"
              </p>
            </blockquote>

            {/* Results */}
            <div className="border-t border-white/10 pt-6">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-4 font-mono">
                Resultado
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                {current.results.map((result, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2"
                  >
                    <span className="text-primary text-sm">✔</span>
                    <span className="text-white/70 text-sm">{result}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={goToPrevious}
              className="w-12 h-12 rounded-full border border-white/20 hover:border-primary/50 text-white/60 hover:text-primary flex items-center justify-center transition-all duration-300 hover:bg-primary/10"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Indicators */}
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
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
              onClick={goToNext}
              className="w-12 h-12 rounded-full border border-white/20 hover:border-primary/50 text-white/60 hover:text-primary flex items-center justify-center transition-all duration-300 hover:bg-primary/10"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Counter */}
          <div className="text-center mt-8">
            <p className="text-white/40 text-sm">
              {currentIndex + 1} de {testimonials.length}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
