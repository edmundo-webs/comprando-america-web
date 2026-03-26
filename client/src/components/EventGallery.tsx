import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BASE = "https://res.cloudinary.com/dofccqypz/image/upload";

const photos = [
  { id: "apk6qpfofrvwvwkovbdm", v: "1774537566", alt: "Presentación 'Los Socios Fundadores'" },
  { id: "ddhzlxysdvxcfrwhhlhk", v: "1774537527", alt: "Taller sobre flujo de caja — evento binacional" },
  { id: "fou8skfadwce2lodr5yc", v: "1774537561", alt: "Panel de discusión en cumbre presencial" },
  { id: "bgprzji1dndpvyejpbbn", v: "1774537568", alt: "Foro empresarial con asistentes" },
  { id: "xvdkaaxpavgr9lrybk8g", v: "1774537558", alt: "Panel de expertos Comprando América" },
  { id: "um9rxzrmrveuim0of1yf", v: "1774537563", alt: "Panelistas en sesión de preguntas" },
  { id: "v7r3cxs7gg19ktnwniis", v: "1774537541", alt: "Conversación sobre estrategia de inmigración" },
  { id: "fn9xive0vzvew1n1xymt", v: "1774537524", alt: "Reunión de trabajo y capacitación" },
  { id: "n8lkmvpmlrnco9etkxfb", v: "1774537526", alt: "Cena privada — networking exclusivo" },
  { id: "fenfa1ovnmcwxfgttbkq", v: "1774537537", alt: "Conversación en sala de capacitación" },
  { id: "x9z2totnrqoowgdkjqui", v: "1774537532", alt: "Networking durante pausa del evento" },
  { id: "hpwrp8ofq5delfnpo9ro", v: "1774537559", alt: "Networking en vestíbulo del evento" },
  { id: "jqyrqajkj4czyxgdnlni", v: "1774537565", alt: "Salón preparado para cumbre presencial" },
  { id: "uefjxoxi5trojtoeivha", v: "1774537564", alt: "Vista aérea — viaje de inspección inmobiliaria" },
  { id: "vjyyrtfskd3w7nmklbt3", v: "1774537570", alt: "Propiedad en viaje de inspección" },
  { id: "d1ux821r9p9ndhymsiv1", v: "1774537571", alt: "Propiedad en comunidad residencial" },
];

function imgUrl(id: string, v: string, w: number, h: number) {
  return `${BASE}/c_fill,w_${w},h_${h},g_auto,q_auto,f_auto/v${v}/comprando-america/eventos/${id}.jpg`;
}

export default function EventGallery() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % photos.length);
  }, []);

  const prev = useCallback(() => {
    setAutoplay(false);
    setCurrent((p) => (p - 1 + photos.length) % photos.length);
  }, []);

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [autoplay, next]);

  const handleNext = () => {
    setAutoplay(false);
    next();
  };

  const photo = photos[current];

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-video rounded-2xl overflow-hidden border border-primary/20 shadow-2xl shadow-primary/10 bg-black">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={imgUrl(photo.id, photo.v, 1400, 788)}
            alt={photo.alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Gradient overlay for caption */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Caption */}
        <div className="absolute bottom-4 left-5 right-5">
          <p className="text-white text-sm font-medium drop-shadow-lg">
            {photo.alt}
          </p>
        </div>

        {/* Nav buttons */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors"
          aria-label="Siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide justify-center">
        {photos.map((p, i) => (
          <button
            key={i}
            onClick={() => {
              setAutoplay(false);
              setCurrent(i);
            }}
            className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
              i === current
                ? "border-primary opacity-100 ring-2 ring-primary/30"
                : "border-white/10 opacity-40 hover:opacity-75"
            }`}
          >
            <img
              src={imgUrl(p.id, p.v, 160, 112)}
              alt={p.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Counter */}
      <p className="text-white/40 text-xs text-center mt-3">
        {current + 1} / {photos.length}
      </p>
    </div>
  );
}
