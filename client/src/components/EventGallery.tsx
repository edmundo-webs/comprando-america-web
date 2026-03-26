import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BASE = "https://res.cloudinary.com/dofccqypz/image/upload";
const TRANSFORM = "c_fill,w_800,h_500,q_auto,f_auto";

const photos = [
  { src: `${BASE}/${TRANSFORM}/v1774537566/comprando-america/eventos/apk6qpfofrvwvwkovbdm.jpg`, alt: "Edmundo Treviño presentando '100 Socios Fundadores'" },
  { src: `${BASE}/${TRANSFORM}/v1774537527/comprando-america/eventos/ddhzlxysdvxcfrwhhlhk.jpg`, alt: "Cumbre presencial Comprando América" },
  { src: `${BASE}/${TRANSFORM}/v1774537561/comprando-america/eventos/fou8skfadwce2lodr5yc.jpg`, alt: "Salón lleno en cumbre presencial" },
  { src: `${BASE}/${TRANSFORM}/v1774537568/comprando-america/eventos/bgprzji1dndpvyejpbbn.jpg`, alt: "Conferencia con asistentes" },
  { src: `${BASE}/${TRANSFORM}/v1774537558/comprando-america/eventos/xvdkaaxpavgr9lrybk8g.jpg`, alt: "Panel de expertos Comprando América" },
  { src: `${BASE}/${TRANSFORM}/v1774537563/comprando-america/eventos/um9rxzrmrveuim0of1yf.jpg`, alt: "Panel de expertos — vista lateral" },
  { src: `${BASE}/${TRANSFORM}/v1774537541/comprando-america/eventos/v7r3cxs7gg19ktnwniis.jpg`, alt: "Sesión de trabajo sobre inmigración" },
  { src: `${BASE}/${TRANSFORM}/v1774537524/comprando-america/eventos/fn9xive0vzvew1n1xymt.jpg`, alt: "Mesa de trabajo entre miembros" },
  { src: `${BASE}/${TRANSFORM}/v1774537526/comprando-america/eventos/n8lkmvpmlrnco9etkxfb.jpg`, alt: "Cena privada y networking exclusivo" },
  { src: `${BASE}/${TRANSFORM}/v1774537537/comprando-america/eventos/fenfa1ovnmcwxfgttbkq.jpg`, alt: "Edmundo en conversación 1:1 con miembro" },
  { src: `${BASE}/${TRANSFORM}/v1774537532/comprando-america/eventos/x9z2totnrqoowgdkjqui.jpg`, alt: "Networking entre asistentes" },
  { src: `${BASE}/${TRANSFORM}/v1774537559/comprando-america/eventos/hpwrp8ofq5delfnpo9ro.jpg`, alt: "Networking en lobby del evento" },
  { src: `${BASE}/${TRANSFORM}/v1774537565/comprando-america/eventos/jqyrqajkj4czyxgdnlni.jpg`, alt: "Salón preparado para evento" },
  { src: `${BASE}/${TRANSFORM}/v1774537564/comprando-america/eventos/uefjxoxi5trojtoeivha.jpg`, alt: "Comunidad residencial — viaje de inspección" },
  { src: `${BASE}/${TRANSFORM}/v1774537570/comprando-america/eventos/vjyyrtfskd3w7nmklbt3.jpg`, alt: "Evento presencial Comprando América" },
  { src: `${BASE}/${TRANSFORM}/v1774537571/comprando-america/eventos/d1ux821r9p9ndhymsiv1.jpg`, alt: "Cumbre Comprando América" },
];

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

  return (
    <div className="mt-10">
      {/* Main image */}
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-primary/20 shadow-lg shadow-primary/5 bg-black/20">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={photos[current].src}
            alt={photos[current].alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </AnimatePresence>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Caption */}
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white/80 text-sm font-medium drop-shadow-lg">
            {photos[current].alt}
          </p>
        </div>

        {/* Nav buttons */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
          aria-label="Siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
        {photos.map((photo, i) => (
          <button
            key={i}
            onClick={() => {
              setAutoplay(false);
              setCurrent(i);
            }}
            className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
              i === current
                ? "border-primary opacity-100 scale-105"
                : "border-transparent opacity-50 hover:opacity-80"
            }`}
          >
            <img
              src={photo.src.replace("w_800,h_500", "w_100,h_70")}
              alt={photo.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Counter */}
      <p className="text-white/40 text-xs text-center mt-3">
        {current + 1} de {photos.length}
      </p>
    </div>
  );
}
