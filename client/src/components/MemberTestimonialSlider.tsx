import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Testimonial {
  id: number;
  name: string;
  city: string;
  quote: string;
  initials: string;
  bgGradient: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Carlos",
    city: "Monterrey",
    quote: "Entré buscando cómo estructurar mi expansión a Estados Unidos. El equipo me ayudó a abrir mi LLC correctamente y entender la estructura fiscal.",
    initials: "C",
    bgGradient: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    name: "Alejandro",
    city: "Ciudad de México",
    quote: "Lo que más valoré fue el acompañamiento del equipo multidisciplinario. No es teoría, es ejecución.",
    initials: "A",
    bgGradient: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    name: "Luis",
    city: "Guadalajara",
    quote: "Gracias a la comunidad pude estructurar mi primera inversión en Estados Unidos con mucho más claridad.",
    initials: "L",
    bgGradient: "from-emerald-500 to-teal-500",
  },
  {
    id: 4,
    name: "Ricardo",
    city: "Monterrey",
    quote: "Después de asistir a la Cumbre entendí el valor del networking con empresarios que ya están invirtiendo.",
    initials: "R",
    bgGradient: "from-orange-500 to-red-500",
  },
  {
    id: 5,
    name: "Jorge",
    city: "Houston",
    quote: "Comprando América me ayudó a entender cómo estructurar una inversión para una visa de inversionista.",
    initials: "J",
    bgGradient: "from-indigo-500 to-blue-500",
  },
  {
    id: 6,
    name: "Daniel",
    city: "Ciudad de México",
    quote: "El acceso a expertos fiscales y legales fue clave para estructurar correctamente mi operación.",
    initials: "D",
    bgGradient: "from-rose-500 to-pink-500",
  },
  {
    id: 7,
    name: "Fernando",
    city: "Monterrey",
    quote: "La diferencia es que aquí los proyectos ya vienen filtrados y estructurados.",
    initials: "F",
    bgGradient: "from-amber-500 to-orange-500",
  },
  {
    id: 8,
    name: "Andrés",
    city: "Guadalajara",
    quote: "Asistí al evento presencial en Guadalajara y fue donde realmente entendí el valor de la comunidad.",
    initials: "A",
    bgGradient: "from-cyan-500 to-blue-500",
  },
  {
    id: 9,
    name: "Sergio",
    city: "Cancún",
    quote: "Estar rodeado de empresarios con experiencia en Estados Unidos cambia completamente la perspectiva.",
    initials: "S",
    bgGradient: "from-teal-500 to-cyan-500",
  },
  {
    id: 10,
    name: "Roberto",
    city: "Monterrey",
    quote: "Gracias a la mentoría pude estructurar correctamente mi LLC y mi operación.",
    initials: "R",
    bgGradient: "from-violet-500 to-purple-500",
  },
  {
    id: 11,
    name: "Eduardo",
    city: "Ciudad de México",
    quote: "El networking dentro de el club de inversión abre puertas que de otra forma tomarían años.",
    initials: "E",
    bgGradient: "from-pink-500 to-rose-500",
  },
  {
    id: 12,
    name: "Héctor",
    city: "Monterrey",
    quote: "Lo que más me gustó fue ver casos reales de empresarios que ya están ejecutando inversiones.",
    initials: "H",
    bgGradient: "from-green-500 to-emerald-500",
  },
  {
    id: 13,
    name: "Marco",
    city: "Guadalajara",
    quote: "El acompañamiento del equipo fiscal y legal me dio mucha tranquilidad para avanzar.",
    initials: "M",
    bgGradient: "from-blue-600 to-blue-500",
  },
  {
    id: 14,
    name: "Adrián",
    city: "Houston",
    quote: "Después de años analizando oportunidades, aquí finalmente ejecuté mi primera inversión.",
    initials: "A",
    bgGradient: "from-fuchsia-500 to-purple-500",
  },
  {
    id: 15,
    name: "Raúl",
    city: "Monterrey",
    quote: "La comunidad tiene empresarios muy sólidos que comparten experiencias reales.",
    initials: "R",
    bgGradient: "from-sky-500 to-blue-500",
  },
  {
    id: 16,
    name: "David",
    city: "Ciudad de México",
    quote: "Las mentorías dentro de el club de inversión ayudan a entender cómo funciona realmente el mercado en Estados Unidos.",
    initials: "D",
    bgGradient: "from-lime-500 to-green-500",
  },
  {
    id: 17,
    name: "Miguel",
    city: "Guadalajara",
    quote: "Me ayudaron a estructurar correctamente mi estrategia de inversión y migración.",
    initials: "M",
    bgGradient: "from-red-500 to-orange-500",
  },
  {
    id: 18,
    name: "Francisco",
    city: "Monterrey",
    quote: "Participar en los eventos presenciales ha sido clave para conocer otros inversionistas.",
    initials: "F",
    bgGradient: "from-indigo-600 to-indigo-500",
  },
  {
    id: 19,
    name: "Víctor",
    city: "Cancún",
    quote: "La claridad que te dan sobre estructuras fiscales es algo que no encuentras fácilmente.",
    initials: "V",
    bgGradient: "from-cyan-600 to-cyan-500",
  },
  {
    id: 20,
    name: "Oscar",
    city: "Monterrey",
    quote: "El valor de tener una red de expertos disponibles es enorme.",
    initials: "O",
    bgGradient: "from-purple-600 to-purple-500",
  },
  {
    id: 21,
    name: "José",
    city: "Ciudad de México",
    quote: "Después de la cumbre en Monterrey entendí cómo funcionan realmente las adquisiciones de negocios.",
    initials: "J",
    bgGradient: "from-emerald-600 to-emerald-500",
  },
  {
    id: 22,
    name: "Alberto",
    city: "Guadalajara",
    quote: "Lo que más me sorprendió fue la apertura de los empresarios al compartir sus experiencias.",
    initials: "A",
    bgGradient: "from-orange-600 to-orange-500",
  },
  {
    id: 23,
    name: "Gabriel",
    city: "Monterrey",
    quote: "Comprando América te conecta con empresarios que ya están operando en Estados Unidos.",
    initials: "G",
    bgGradient: "from-pink-600 to-pink-500",
  },
  {
    id: 24,
    name: "Antonio",
    city: "Houston",
    quote: "Gracias al equipo pude entender la estructura necesaria para invertir correctamente.",
    initials: "A",
    bgGradient: "from-blue-700 to-blue-600",
  },
  {
    id: 25,
    name: "Rodrigo",
    city: "Monterrey",
    quote: "El networking dentro de la comunidad es de muchísimo valor.",
    initials: "R",
    bgGradient: "from-teal-600 to-teal-500",
  },
  {
    id: 26,
    name: "Pablo",
    city: "Ciudad de México",
    quote: "Entré por curiosidad y terminé estructurando mi primera inversión.",
    initials: "P",
    bgGradient: "from-rose-600 to-rose-500",
  },
  {
    id: 27,
    name: "Emilio",
    city: "Guadalajara",
    quote: "Los eventos presenciales ayudan mucho a entender cómo están invirtiendo otros empresarios.",
    initials: "E",
    bgGradient: "from-amber-600 to-amber-500",
  },
  {
    id: 28,
    name: "Javier",
    city: "Monterrey",
    quote: "Las oportunidades que se presentan dentro de la comunidad tienen un análisis muy sólido.",
    initials: "J",
    bgGradient: "from-violet-600 to-violet-500",
  },
  {
    id: 29,
    name: "Esteban",
    city: "Cancún",
    quote: "El acompañamiento del equipo es muy profesional.",
    initials: "E",
    bgGradient: "from-cyan-700 to-cyan-600",
  },
  {
    id: 30,
    name: "Mauricio",
    city: "Monterrey",
    quote: "La estructura de el club de inversión está pensada para empresarios que quieren ejecutar.",
    initials: "M",
    bgGradient: "from-green-600 to-green-500",
  },
  {
    id: 31,
    name: "Iván",
    city: "Ciudad de México",
    quote: "El acceso a expertos legales y fiscales simplifica mucho el proceso.",
    initials: "I",
    bgGradient: "from-red-600 to-red-500",
  },
  {
    id: 32,
    name: "Arturo",
    city: "Guadalajara",
    quote: "Después de asistir a la cumbre entendí el verdadero potencial de invertir en Estados Unidos.",
    initials: "A",
    bgGradient: "from-indigo-700 to-indigo-600",
  },
  {
    id: 33,
    name: "Rafael",
    city: "Monterrey",
    quote: "La comunidad reúne empresarios con mucha experiencia.",
    initials: "R",
    bgGradient: "from-lime-600 to-lime-500",
  },
  {
    id: 34,
    name: "Enrique",
    city: "Houston",
    quote: "Poder analizar oportunidades con otros inversionistas dentro de el club de inversión es muy valioso.",
    initials: "E",
    bgGradient: "from-fuchsia-600 to-fuchsia-500",
  },
  {
    id: 35,
    name: "Hugo",
    city: "Monterrey",
    quote: "Comprando América te da estructura y claridad para tomar decisiones de inversión.",
    initials: "H",
    bgGradient: "from-sky-600 to-sky-500",
  },
  {
    id: 36,
    name: "Óscar",
    city: "Ciudad de México",
    quote: "El equipo realmente entiende el mercado de inversión en Estados Unidos.",
    initials: "O",
    bgGradient: "from-rose-700 to-rose-600",
  },
  {
    id: 37,
    name: "Gustavo",
    city: "Guadalajara",
    quote: "Aquí encontré la combinación perfecta de educación, oportunidades y networking.",
    initials: "G",
    bgGradient: "from-amber-700 to-amber-600",
  },
  {
    id: 38,
    name: "Julio",
    city: "Monterrey",
    quote: "La mentoría personalizada fue exactamente lo que necesitaba para avanzar.",
    initials: "J",
    bgGradient: "from-purple-700 to-purple-600",
  },
  {
    id: 39,
    name: "Ramón",
    city: "Cancún",
    quote: "Estar en una comunidad de inversionistas reales acelera todo el proceso.",
    initials: "R",
    bgGradient: "from-teal-700 to-teal-600",
  },
  {
    id: 40,
    name: "Tomás",
    city: "Houston",
    quote: "El valor que he recibido de Comprando América ha superado todas mis expectativas.",
    initials: "T",
    bgGradient: "from-green-700 to-green-600",
  },
];

export default function MemberTestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [autoplay]);

  const goToPrevious = () => {
    setAutoplay(false);
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToNext = () => {
    setAutoplay(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setAutoplay(false);
    setCurrentIndex(index);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="section-dark py-24 md:py-32">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">
            Comunidad
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">
            Lo que dicen los miembros de la comunidad
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Experiencias reales de empresarios que ya están ejecutando dentro de
            Comprando América
          </p>
        </div>

        {/* Video Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-blue-500/20 shadow-lg shadow-primary/5">
            <iframe
              src="https://www.youtube.com/embed/WYNwoTzG8Ss"
              title="Testimonial - Miembro Comprando América"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-blue-500/20 shadow-lg shadow-primary/5">
            <iframe
              src="https://www.youtube.com/embed/6J6IIPFsTD0"
              title="Testimonial - Miembro Comprando América"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>

        {/* Slider */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-[oklch(0.15_0.03_250)] to-[oklch(0.12_0.03_250)] border border-blue-500/20 rounded-2xl p-8 md:p-12"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div
                    className={`w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br ${currentTestimonial.bgGradient} flex items-center justify-center shadow-lg`}
                  >
                    <span className="text-4xl md:text-5xl font-serif text-white font-bold">
                      {currentTestimonial.initials}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <div className="mb-4">
                    <h3 className="text-2xl font-serif text-white mb-1">
                      {currentTestimonial.name}
                    </h3>
                    <p className="text-primary text-sm font-semibold">
                      {currentTestimonial.city}
                    </p>
                  </div>

                  <blockquote className="text-white/80 text-lg leading-relaxed italic">
                    "{currentTestimonial.quote}"
                  </blockquote>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={goToPrevious}
              className="p-3 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              aria-label="Testimonio anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Indicators - Show 5 dots at a time */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => {
                // Show 5 dots centered around current index
                const start = Math.max(0, currentIndex - 2);
                const end = Math.min(testimonials.length, start + 5);
                const adjustedStart = Math.max(0, end - 5);
                
                if (index < adjustedStart || index >= end) return null;

                return (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? "bg-primary w-8"
                        : "bg-[#0F2847]/20 w-2 hover:bg-[#0F2847]/40"
                    }`}
                    aria-label={`Ir a testimonio ${index + 1}`}
                  />
                );
              })}
            </div>

            <button
              onClick={goToNext}
              className="p-3 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              aria-label="Siguiente testimonio"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Counter */}
          <div className="text-center mt-6">
            <p className="text-white/50 text-sm">
              {currentIndex + 1} de {testimonials.length} miembros • Autoplay activado
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
