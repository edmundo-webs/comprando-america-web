/*
 * Home 2026 — Centro de navegación del ecosistema Comprando América
 * Principio rector: ¿Qué estás intentando construir?
 * El protagonista es el empresario, no los productos.
 */

import { useRef, useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useInView } from "@/hooks/useInView";
import { openWhatsApp, WHATSAPP_PHONE } from "@/lib/whatsapp";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  Play,
  Mic,
  Newspaper,
  BookOpen,
  Youtube,
  Instagram,
  Facebook,
  Globe,
  Shield,
  TrendingUp,
  Users,
  MapPin,
  Building2,
  GraduationCap,
  Building,
  X,
  Monitor,
} from "lucide-react";

/* ─── FadeIn ─── */
function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
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

/* ─── CountUp ─── */
function useCountUp(target: number, duration: number, trigger: boolean) {
  const ref = useRef(0);
  const frameRef = useRef<number>();
  const [, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const value = Math.floor(progress * target);
      ref.current = value;
      setCount(value);
      document
        .querySelectorAll(`[data-count="${target}"]`)
        .forEach((el) => { el.textContent = String(value); });
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
      else
        document
          .querySelectorAll(`[data-count="${target}"]`)
          .forEach((el) => { el.textContent = String(target); });
    };
    frameRef.current = requestAnimationFrame(step);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [trigger, target, duration]);
}

function StatCounter({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const { ref, isInView } = useInView();
  useCountUp(value, 2000, isInView);
  return (
    <div ref={ref} className="text-center">
      <div className="text-primary text-3xl md:text-4xl font-bold mb-1">
        <span data-count={value}>0</span>
        {suffix}
      </div>
      <p className="text-slate-400 text-xs uppercase tracking-wider">{label}</p>
    </div>
  );
}

/* ─── SEO ─── */
import SEOHead from "@/components/SEOHead";
const PAGE_SEO = {
  title: "Comprando América | ¿Qué estás intentando construir?",
  description:
    "Comprando América no vende inversiones. Construye criterio para tomar decisiones patrimoniales. Grupo Empresarial de Edmundo — ecosistema para empresarios latinos en Estados Unidos.",
  path: "/",
  schema: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Qué es Comprando América?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Comprando América es un ecosistema de decisiones patrimoniales para empresarios latinos que buscan invertir, estructurar o expandirse en Estados Unidos. No vendemos inversiones; construimos criterio.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cómo invertir en Estados Unidos desde México?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Con Comprando América puedes estructurar tu inversión desde $100,000 USD a través de una LLC con acompañamiento estratégico y conexión a abogados y contadores certificados.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué es el Grupo Empresarial de Edmundo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Es el núcleo del ecosistema Comprando América. El espacio donde empresarios contrastan decisiones patrimoniales con otros empresarios que ya están ejecutando.",
        },
      },
    ],
  },
};

/* ─── Photos ─── */
const HERO_IMAGE =
  "https://lh3.googleusercontent.com/d/1Um6fwMpl_mMyAZWmF1hWVdnLYpJCp0Kz=w1920";
/* ─── Grupo Empresarial ───
   Cercanía, no escenario. El grid de la sección 9 mostraba audiencia, panel y
   una casa de un viaje de inspección: tres tomas desde el escenario y un activo.
   Ninguna decía qué se siente pertenecer al grupo. Estas cuatro sí: Edmundo con
   miembros, a un brazo de distancia, y una mesa privada. Los eventos son el
   lugar donde ocurre, no lo que se vende. */
const GRUPO_ACOMPANAMIENTO =
  "https://res.cloudinary.com/dofccqypz/image/upload/c_fill,w_800,h_800,g_auto,q_auto,f_auto/v1774537537/comprando-america/eventos/fenfa1ovnmcwxfgttbkq.jpg";
const GRUPO_CERCANIA =
  "https://res.cloudinary.com/dgruohz6f/image/upload/c_fill,w_800,h_800,g_auto,q_auto,f_auto/v1773439285/comprando-america/jAVgSvHifxmThGgy.jpg";
const GRUPO_CONFIANZA =
  "https://res.cloudinary.com/dofccqypz/image/upload/c_fill,w_800,h_800,g_auto,q_auto,f_auto/v1774537541/comprando-america/eventos/v7r3cxs7gg19ktnwniis.jpg";
const GRUPO_MESA_PRIVADA =
  "https://res.cloudinary.com/dofccqypz/image/upload/c_fill,w_800,h_800,g_auto,q_auto,f_auto/v1774537526/comprando-america/eventos/n8lkmvpmlrnco9etkxfb.jpg";
const INVEST_WEEK =
  "https://lh3.googleusercontent.com/d/14QiLZK8eOY1ikSQB3fQqPo3ocWhD77bE=w1200";
const CUMBRE_DIGITAL_PHOTO =
  "https://res.cloudinary.com/dgruohz6f/image/upload/v1782675102/tts-news/qsqtimcq0kinkp5j6gcs.jpg";
const AERIAL =
  "https://res.cloudinary.com/dofccqypz/image/upload/v1774537564/comprando-america/eventos/uefjxoxi5trojtoeivha.jpg";

/* ─── Ecosystem routes ─── */
const RUTAS = [
  {
    id: "patrimonio",
    icon: Shield,
    label: "Arquitectura Patrimonial",
    problema:
      "Tengo capital construido en México o Latinoamérica y quiero protegerlo, diversificarlo y hacerlo crecer en dólares con estructura real.",
    orienta:
      "Bienes raíces, fondos de inversión, compra de empresas y estructuras patrimoniales en Estados Unidos con criterio y acompañamiento.",
    href: "https://comprandoamerica.com/arquitectura-patrimonial",
  },
  {
    id: "expansion",
    icon: Building2,
    label: "Expansión Empresarial",
    problema:
      "Mi empresa funciona bien en mi país y quiero llevarla a operar en Estados Unidos, o abrir una nueva operación desde cero.",
    orienta:
      "Estructura legal, fiscal y operativa para empresas que buscan operar en el mercado americano con cumplimiento y eficiencia.",
    href: "/estructura-empresarial-en-estados-unidos",
  },
  {
    id: "migracion",
    icon: Globe,
    label: "Estrategias Migratorias",
    problema:
      "Evalúo una ruta migratoria real hacia Estados Unidos vinculada a una inversión o a la operación de un negocio.",
    orienta:
      "Visa E-2, estrategias de residencia a través de inversión y negocios reales en operación, con el acompañamiento de abogados y contadores certificados.",
    href: "/visa-e2-inversion-en-estados-unidos",
  },
  {
    id: "oportunidades",
    icon: TrendingUp,
    label: "Nuevas Oportunidades",
    problema:
      "Quiero acceder a proyectos de inversión previamente analizados y estructurados, sin tener que evaluarlos desde cero.",
    orienta:
      "Deal Day mensual con oportunidades filtradas, fondos de inversión y proyectos inmobiliarios con análisis previo del equipo.",
    href: "/oportunidades-de-inversion-en-estados-unidos",
  },
];

/* ─── Casos reales ─── */
const CASOS = [
  {
    perfil: "Empresario de manufactura · México · Capital: $200k USD",
    objetivo: "Proteger patrimonio en dólares sin migrar.",
    ruta: "Apertura de LLC en Texas + inversión inmobiliaria en programa de renta garantizada.",
    resultado: "Flujo mensual en dólares desde el primer trimestre. Patrimonio desvinculado del peso.",
  },
  {
    perfil: "Empresario de servicios · Colombia · Capital: $150k USD",
    objetivo: "Migrar con visa de inversionista y operar en Florida.",
    ruta: "Visa E-2 vinculada a la adquisición de un negocio de servicios en Miami.",
    resultado: "Visa aprobada en 4 meses. Negocio operando. Familia con estatus migratorio.",
  },
  {
    perfil: "Ejecutivo corporativo · Venezuela · Capital: $120k USD",
    objetivo: "Construir patrimonio fuera de Venezuela con estructura real.",
    ruta: "LLC + cuenta bancaria en Texas + participación en Fondo de Tierra Estratégica.",
    resultado: "Inversión activa en dólares. Primer Deal Day cerrado como co-inversionista.",
  },
];

/* ─── Expertos ─── */
const EXPERTS = [
  {
    name: "Edmundo Treviño",
    decision: "Arquitectura patrimonial y estrategia de inversión en Estados Unidos.",
    img: "https://lh3.googleusercontent.com/d/1Um6fwMpl_mMyAZWmF1hWVdnLYpJCp0Kz=w800",
  },
  {
    name: "Joe Faraci",
    decision: "Operación e inversión inmobiliaria. 250+ propiedades. 28 años en el mercado.",
    img: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439239/comprando-america/YfxVlywHHLmCeDRI.png",
  },
  {
    name: "Tomás Resendez",
    decision: "Estrategias migratorias. Visa E-2 y residencia a través de inversión.",
    img: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439162/comprando-america/QGuNYwiuoAkxjDwj.png",
  },
  {
    name: "Daniel Palacios",
    decision: "Estructura fiscal y optimización tributaria para empresas e inversionistas.",
    img: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439036/comprando-america/CPGtnnreqZlWVzgL.png",
  },
  {
    name: "Aubrey Dwyer",
    decision: "Apertura de empresas, contratos y propiedad intelectual en Estados Unidos.",
    img: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439166/comprando-america/QZAlYTAoaVokeCSo.jpg",
  },
  {
    name: "Destiny Bounds",
    decision: "Derecho corporativo, pequeñas empresas y propiedad intelectual.",
    img: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439040/comprando-america/EDQOyfeHfevdqerE.avif",
  },
  {
    name: "Sebastián Jara",
    decision: "Estrategia digital, expansión de marca y automatización para empresas en EE.UU.",
    img: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439309/comprando-america/qrZqfOUTzqKwJcYP.avif",
  },
  {
    name: "John McKee",
    decision: "Comercialización y adaptación de productos al mercado estadounidense.",
    img: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439314/comprando-america/sZacCQEqvoOyeOMO.avif",
  },
];

/* ─── Plataformas de contenido ─── */
type PlatformId =
  | "youtube"
  | "podcast"
  | "linkedin"
  | "instagram"
  | "facebook"
  | "spotify"
  | "articulos"
  | "noticias";

const PLATFORMS: {
  id: PlatformId;
  label: string;
  /* Color de marca ya aclarado para leerse sobre el azul marino del fondo.
     Va literal en cada entrada, no compuesto, porque Tailwind sólo genera
     las clases que encuentra escritas en el código. */
  accent: string;
  color: string;
  preview: { title: string; desc: string; href: string; videoId?: string };
}[] = [
  {
    id: "youtube",
    accent: "text-[#FF3D3D]",
    label: "YouTube",
    color: "bg-red-600",
    preview: {
      title: "Canal de YouTube",
      desc: "Conversaciones sobre inversión, estructura empresarial y patrimonio en Estados Unidos.",
      href: "https://www.youtube.com/@ComprandoAmerica",
      videoId: "iFx3QusSR90",
    },
  },
  {
    id: "podcast",
    accent: "text-[#7EA8FF]",
    label: "Podcast",
    color: "bg-blue-600",
    preview: {
      title: "Podcast · Comprando América",
      desc: "Casos reales, expertos en activo y análisis del mercado americano.",
      href: "/podcast",
      videoId: "asOMFCvUZNc",
    },
  },
  {
    id: "linkedin",
    accent: "text-[#3B9AE1]",
    label: "LinkedIn",
    color: "bg-[#0077B5]",
    preview: {
      title: "LinkedIn",
      desc: "Reflexiones, análisis y criterio patrimonial. Seguido por empresarios de toda América Latina.",
      href: "https://www.linkedin.com/company/comprandoamerica/",
    },
  },
  {
    id: "instagram",
    accent: "text-[#E1568C]",
    label: "Instagram",
    color: "bg-gradient-to-br from-purple-600 to-pink-500",
    preview: {
      title: "Instagram",
      desc: "Contenido visual sobre inversión, eventos y comunidad. Casos reales en formato breve.",
      href: "https://www.instagram.com/edmundotrevino.usa/",
    },
  },
  {
    id: "facebook",
    accent: "text-[#4293FB]",
    label: "Facebook",
    color: "bg-[#1877F2]",
    preview: {
      title: "Facebook",
      desc: "Comunidad activa de empresarios latinos. Transmisiones en vivo y contenido exclusivo.",
      href: "https://www.facebook.com/edmundotrevino.usa",
    },
  },
  {
    id: "spotify",
    accent: "text-[#1DB954]",
    label: "Spotify",
    color: "bg-green-600",
    preview: {
      title: "Spotify",
      desc: "Escucha el podcast en tu plataforma favorita. Disponible en todos los reproductores.",
      href: "https://open.spotify.com/show/1pYUGyRRFXgA0c9xpaEtw7",
    },
  },
  {
    id: "articulos",
    accent: "text-[#8B93F8]",
    label: "Artículos",
    color: "bg-indigo-600",
    preview: {
      title: "Blog · Guías estratégicas",
      desc: "Análisis escritos por el equipo sobre inversión, estructura legal y patrimonio en EE.UU.",
      href: "/blog",
    },
  },
  {
    id: "noticias",
    accent: "text-[#94A3B8]",
    label: "Noticias",
    color: "bg-slate-700",
    preview: {
      title: "Noticias del mercado",
      desc: "Actualidad del mercado inmobiliario, migración y economía en EE.UU. filtrada para inversionistas.",
      href: "/news",
    },
  },
];

/* Logos de las plataformas.
   Los cinco de marca van como SVG en línea en vez de importarse: lucide dejó
   sus iconos de marca como deprecados y nunca tuvo el de Spotify, así que la
   mitad del set no existiría. Los tres que no son marca (podcast, artículos,
   noticias) reutilizan los iconos de lucide que este archivo ya importa. */
function PlatformIcon({
  id,
  className = "w-[18px] h-[18px]",
}: {
  id: PlatformId;
  className?: string;
}) {
  const brand = (d: string) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d={d} />
    </svg>
  );
  switch (id) {
    case "youtube":
      return brand("M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z");
    case "linkedin":
      return brand("M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z");
    case "instagram":
      return brand("M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z");
    case "facebook":
      return brand("M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z");
    case "spotify":
      return brand("M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.601.301.96zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z");
    case "podcast":
      return <Mic className={className} aria-hidden="true" />;
    case "articulos":
      return <BookOpen className={className} aria-hidden="true" />;
    case "noticias":
      return <Newspaper className={className} aria-hidden="true" />;
  }
}

/* ═══════════════════════════════════════════════════════ */

export default function Home() {
  const [activeRuta, setActiveRuta] = useState<string | null>(null);
  /* Arranca en YouTube: la sección solía cargar sin nada seleccionado, así que
     lo primero que veía el visitante eran ocho botones de texto y el aviso de
     "selecciona una plataforma". Ahora entra con un video puesto. */
  const [activePlatform, setActivePlatform] = useState<PlatformId>("youtube");
  const [activeExpert, setActiveExpert] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white overflow-x-hidden">
      <SEOHead {...PAGE_SEO} />
      <Navbar />

      {/* ══════════════════════════════════════════════════════
          1. HERO — El protagonista es el empresario
      ══════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Edmundo Treviño — Comprando América"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/97 via-[#0B1F3A]/90 to-[#0B1F3A]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-transparent" />
        </div>

        <div className="container relative z-10 pt-32 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-8 font-light">
              ¿Qué estás intentando{" "}
              <span className="font-bold text-white">construir?</span>
            </h1>

            <div className="space-y-3 mb-10 text-slate-300 text-lg leading-relaxed max-w-2xl">
              <p>No todos los empresarios llegan buscando lo mismo.</p>
              <p>
                Algunos quieren proteger el patrimonio que construyeron durante
                años. Otros buscan generar flujo en dólares. Algunos evalúan
                una estrategia migratoria.
              </p>
              <p>
                Y otros simplemente quieren dejar de tomar decisiones
                patrimoniales solos.
              </p>
            </div>

            <p className="text-slate-400 text-base mb-10 max-w-xl">
              Comprando América existe para ayudarte a descubrir cuál de esas
              rutas realmente hace sentido para ti.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="https://comprandoamerica.com/gps">
                <Button className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25 font-semibold">
                  Descubre tu ruta patrimonial{" "}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
              <a href="/quienes-somos">
                <Button
                  variant="outline"
                  className="border-slate-500 text-white hover:bg-white/10 px-8 py-6 text-base"
                >
                  Conoce cómo pensamos
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ Banners eventos ══ */}
      <a
        href="/cumbre-digital"
        className="block w-full bg-gradient-to-r from-[#0B1F3A] via-[#132D52] to-[#0B1F3A] hover:from-[#061428] hover:to-[#061428] transition-colors duration-300 group border-t border-white/10"
      >
        <div className="container flex items-center justify-center gap-3 py-3 px-4 text-center">
          <span className="inline-flex items-center gap-1.5 bg-yellow-400/20 text-yellow-300 text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full">
            Evento online
          </span>
          <p className="text-white text-sm font-medium">
            <span className="font-bold">Cumbre Digital</span>
            {" — "}Una mañana intensiva para construir y proteger tu patrimonio en EE.UU.
          </p>
          <span className="hidden sm:inline-flex items-center gap-1 text-yellow-300 font-semibold text-sm underline underline-offset-2 group-hover:gap-2 transition-all">
            Ver detalles <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </a>

      {/* ══════════════════════════════════════════════════════
          2. ¿CÓMO FUNCIONA COMPRANDO AMÉRICA?
          Ecosistema visual — el Grupo Empresarial es el núcleo
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-14">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">
                El ecosistema
              </p>
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-4">
                ¿Cómo funciona Comprando América?
              </h2>
              <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
                Comprando América no es un portafolio de productos. Es un
                ecosistema de decisiones patrimoniales.
              </p>
            </div>
          </FadeIn>

          {/* Diagrama visual del ecosistema */}
          <FadeIn delay={0.1}>
            <div className="max-w-4xl mx-auto">
              {/* Núcleo */}
              <div className="flex justify-center">
                <div className="bg-primary text-white rounded-2xl px-8 py-6 text-center shadow-xl shadow-blue-600/25">
                  <p className="text-xs font-mono uppercase tracking-[0.3em] text-blue-200 mb-2">
                    Núcleo del ecosistema
                  </p>
                  <p className="text-xl font-bold">
                    Grupo Empresarial de Edmundo
                  </p>
                  <p className="text-blue-200 text-sm mt-1">
                    Donde se contrastan las decisiones patrimoniales
                  </p>
                </div>
              </div>

              {/* Conector núcleo → rutas.
                  Antes era una línea suelta colgando del núcleo que no llegaba
                  a ninguna tarjeta. El bus se dibuja sobre una grid con las
                  mismas columnas que las tarjetas, así que cada bajada cae
                  exactamente en el centro de la suya sin cuentas de porcentajes.
                  Los tramos se extienden 6px (media separación de gap-3) hacia
                  cada lado para cruzar los huecos y quedar continuos. */}
              <div className="md:hidden mx-auto w-px h-8 bg-primary/30" aria-hidden="true" />
              <div className="hidden md:block" aria-hidden="true">
                <div className="mx-auto w-px h-7 bg-primary/30" />
                <div className="grid grid-cols-4 gap-3">
                  {RUTAS.map((ruta, i) => (
                    <div key={ruta.id} className="relative h-7">
                      <div
                        className={`absolute top-0 h-px bg-primary/30 ${
                          i === 0
                            ? "left-1/2 right-[-6px]"
                            : i === RUTAS.length - 1
                              ? "left-[-6px] right-1/2"
                              : "left-[-6px] right-[-6px]"
                        }`}
                      />
                      <div className="absolute inset-y-0 left-1/2 w-px bg-primary/30" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Rutas que nacen del núcleo */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {RUTAS.map((ruta, i) => {
                  const Icon = ruta.icon;
                  return (
                    <FadeIn key={ruta.id} delay={0.05 * i} className="h-full">
                      <div className="h-full bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3 shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-[#0B1F3A] text-xs md:text-sm font-semibold leading-tight text-balance">
                          {ruta.label}
                        </p>
                      </div>
                    </FadeIn>
                  );
                })}
              </div>

              <FadeIn delay={0.3}>
                <p className="text-center text-[#9CA3AF] text-sm mt-6">
                  Todas las rutas nacen del Grupo Empresarial — nunca al revés.
                </p>
              </FadeIn>
            </div>
          </FadeIn>

          {/* Stats */}
          <FadeIn delay={0.2}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto mt-16 pt-16 border-t border-gray-200">
              <StatCounter value={40} suffix="+" label="Miembros activos" />
              <StatCounter value={53} suffix="+" label="LLCs estructuradas" />
              <StatCounter value={6} suffix="" label="Viajes de inspección" />
              <StatCounter value={14} suffix="+" label="Visas tramitadas" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          3. MAPA DEL ECOSISTEMA — Cards expandibles
          Sin cambio de página
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-14">
              <p className="text-blue-400 text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">
                Rutas disponibles
              </p>
              <h2 className="text-3xl md:text-4xl text-white mb-4">
                ¿Qué estás intentando construir?
              </h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">
                Selecciona la ruta que más se acerca a tu situación.
              </p>
            </div>
          </FadeIn>

          <div className="max-w-5xl mx-auto space-y-3">
            {RUTAS.map((ruta, i) => {
              const Icon = ruta.icon;
              const isOpen = activeRuta === ruta.id;
              return (
                <FadeIn key={ruta.id} delay={i * 0.06}>
                  <motion.div
                    className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
                      isOpen
                        ? "border-primary/50 bg-[#0F2847]"
                        : "border-[#1E3A5F] bg-[#0F2847] hover:border-blue-500/30"
                    }`}
                  >
                    {/* Header */}
                    <button
                      onClick={() =>
                        setActiveRuta(isOpen ? null : ruta.id)
                      }
                      className="w-full flex items-center justify-between gap-4 p-6 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            isOpen ? "bg-primary" : "bg-[#1E3A5F]"
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 ${isOpen ? "text-white" : "text-blue-400"}`}
                          />
                        </div>
                        <div>
                          <p className="text-white font-semibold text-lg leading-tight">
                            {ruta.label}
                          </p>
                          {!isOpen && (
                            <p className="text-slate-500 text-sm mt-0.5 line-clamp-1">
                              {ruta.problema.slice(0, 60)}…
                            </p>
                          )}
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Expandable content */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-0">
                            <div className="border-t border-white/5 pt-5 grid md:grid-cols-2 gap-6">
                              <div>
                                <p className="text-blue-400 text-xs font-mono uppercase tracking-widest mb-3">
                                  Qué problema resuelve
                                </p>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                  {ruta.problema}
                                </p>
                              </div>
                              <div>
                                <p className="text-blue-400 text-xs font-mono uppercase tracking-widest mb-3">
                                  Cómo orienta
                                </p>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                  {ruta.orienta}
                                </p>
                              </div>
                            </div>
                            <div className="mt-6 flex items-center justify-between">
                              <p className="text-slate-500 text-xs">
                                El GPS te indica si esta ruta aplica para tu
                                perfil.
                              </p>
                              <a href={ruta.href}>
                                <Button
                                  size="sm"
                                  className="bg-primary hover:bg-blue-600 text-white gap-2"
                                >
                                  Explorar esta ruta{" "}
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </Button>
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          4. OPORTUNIDADES INMOBILIARIAS — Introducción
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[#F5F7FA] py-20 md:py-24">
        <div className="container">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={AERIAL}
                  alt="Inversión inmobiliaria en Estados Unidos"
                  className="w-full h-72 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/60 to-transparent" />
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div>
                <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">
                  Arquitectura Patrimonial
                </p>
                <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-4">
                  Los bienes raíces son una de las rutas patrimoniales, no la
                  única.
                </h2>
                <p className="text-[#4B5563] text-lg leading-relaxed mb-8">
                  Comprando América trabaja con vehículos inmobiliarios
                  estructurados: tierra estratégica, renta garantizada por el
                  gobierno y compra de propiedades. Cada uno responde a un
                  perfil diferente.
                </p>
                <a href="https://comprandoamerica.com/arquitectura-patrimonial">
                  <Button className="bg-primary hover:bg-blue-600 text-white gap-2 shadow-lg shadow-blue-600/20">
                    Conocer Arquitectura Patrimonial{" "}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          5. CONTENIDO GRATUITO
          Plataformas con preview inline
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[#0B1F3A] py-16 md:py-20">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-8">
              <p className="text-blue-400 text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">
                Aprende antes de invertir
              </p>
              <h2 className="text-3xl md:text-4xl text-white mb-4">
                Cualquier empresario puede aprender con Comprando América
              </h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">
                Antes de ser miembro, puedes construir criterio. Todo el
                contenido es gratuito.
              </p>
            </div>
          </FadeIn>

          {/* Platform grid */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
              {PLATFORMS.map((p, i) => {
                const active = activePlatform === p.id;
                return (
                  <FadeIn key={p.id} delay={i * 0.04}>
                    <button
                      onClick={() => setActivePlatform(p.id)}
                      aria-pressed={active}
                      className={`group w-full flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all border ${
                        active
                          ? "border-primary/60 bg-primary/10 text-white shadow-lg shadow-blue-600/10"
                          : "border-[#1E3A5F] bg-[#0F2847] text-slate-300 hover:border-blue-500/40 hover:bg-[#122E52] hover:text-white"
                      }`}
                    >
                      <span
                        className={`shrink-0 transition-opacity ${p.accent} ${
                          active ? "" : "opacity-70 group-hover:opacity-100"
                        }`}
                      >
                        <PlatformIcon id={p.id} />
                      </span>
                      {p.label}
                    </button>
                  </FadeIn>
                );
              })}
            </div>

            {/* Inline preview panel */}
            <AnimatePresence mode="wait">
              {activePlatform && (
                <motion.div
                  key={activePlatform}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="bg-[#0F2847] border border-[#1E3A5F] rounded-2xl overflow-hidden"
                >
                  {(() => {
                    const platform = PLATFORMS.find(
                      (p) => p.id === activePlatform
                    )!;
                    return (
                      <div className="grid md:grid-cols-2 gap-0">
                        {/* Video embed si aplica */}
                        {platform.preview.videoId ? (
                          <div className="aspect-video bg-black">
                            <iframe
                              src={`https://www.youtube.com/embed/${platform.preview.videoId}?rel=0&modestbranding=1`}
                              title={platform.preview.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full"
                            />
                          </div>
                        ) : (
                          <div
                            className={`${platform.color} flex flex-col items-center justify-center gap-3 min-h-[200px] p-8`}
                          >
                            <PlatformIcon
                              id={platform.id}
                              className="w-12 h-12 text-white"
                            />
                            <p className="text-white/80 text-sm text-center font-medium">
                              Accede al contenido en {platform.label}
                            </p>
                          </div>
                        )}
                        {/* Info */}
                        <div className="p-8 flex flex-col justify-between">
                          <div>
                            <p className="text-blue-400 text-xs font-mono uppercase tracking-widest mb-3">
                              {platform.label}
                            </p>
                            <h3 className="text-white text-xl font-bold mb-3">
                              {platform.preview.title}
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                              {platform.preview.desc}
                            </p>
                          </div>
                          <div className="mt-6">
                            <a
                              href={platform.preview.href}
                              target={
                                platform.preview.href.startsWith("http")
                                  ? "_blank"
                                  : undefined
                              }
                              rel="noopener noreferrer"
                            >
                              <Button
                                size="sm"
                                className="bg-primary hover:bg-blue-600 text-white gap-2"
                              >
                                Seguir aprendiendo{" "}
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Button>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          6. CASOS REALES
          Perfil → Objetivo → Ruta → Resultado
      ══════════════════════════════════════════════════════ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-14">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">
                Casos reales
              </p>
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-4">
                Empresarios que encontraron su ruta
              </h2>
              <p className="text-[#6B7280] text-lg max-w-xl mx-auto">
                Historias reales de cómo empresarios distintos encontraron
                caminos distintos dentro del mismo ecosistema.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {CASOS.map((caso, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-[#F5F7FA] border border-gray-200 rounded-2xl overflow-hidden h-full">
                  {/* Header */}
                  <div className="bg-[#0B1F3A] px-6 py-5">
                    <p className="text-blue-400 text-xs font-mono uppercase tracking-widest mb-1">
                      Perfil
                    </p>
                    <p className="text-white text-sm font-semibold leading-snug">
                      {caso.perfil}
                    </p>
                  </div>
                  {/* Flow */}
                  <div className="p-6 space-y-5">
                    {[
                      { label: "Objetivo", value: caso.objetivo },
                      { label: "Ruta elegida", value: caso.ruta },
                      { label: "Resultado", value: caso.resultado },
                    ].map((step, j) => (
                      <div key={j} className="flex gap-4">
                        <div className="flex flex-col items-center shrink-0">
                          <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                            <span className="text-primary text-xs font-bold">
                              {j + 1}
                            </span>
                          </div>
                          {j < 2 && (
                            <div className="w-px flex-1 bg-gray-200 my-1" />
                          )}
                        </div>
                        <div className="pb-2">
                          <p className="text-[#6B7280] text-xs font-semibold uppercase tracking-widest mb-1">
                            {step.label}
                          </p>
                          <p className="text-[#374151] text-sm leading-relaxed">
                            {step.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="text-center mt-10">
              <button
                onClick={() =>
                  openWhatsApp(
                    WHATSAPP_PHONE,
                    "Hola, quisiera hablar sobre mi situación y ver qué ruta hace sentido para mí.",
                    "home-rutas-whatsapp",
                    "/"
                  )
                }
                className="inline-flex items-center gap-2 text-primary font-semibold hover:text-blue-700 transition-colors"
              >
                Habla con el equipo sobre tu caso{" "}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          7. EXPERTOS
          ¿En qué tipo de decisiones acompaña al empresario?
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-14">
              <p className="text-blue-400 text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">
                Equipo multidisciplinario
              </p>
              <h2 className="text-3xl md:text-4xl text-white mb-4">
                Un equipo. Ocho perspectivas. Una sola dirección.
              </h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">
                No un directorio de especialistas. Un equipo que trabaja junto
                para que el empresario tome mejores decisiones.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {EXPERTS.map((expert, i) => {
              const isActive = activeExpert === i;
              return (
                <FadeIn key={i} delay={i * 0.05}>
                  <motion.button
                    onClick={() => setActiveExpert(isActive ? null : i)}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full text-left rounded-2xl p-4 border transition-all duration-300 ${
                      isActive
                        ? "bg-primary/10 border-primary/50 shadow-lg shadow-blue-600/10"
                        : "bg-[#0F2847] border-[#1E3A5F] hover:border-blue-500/30"
                    }`}
                  >
                    <div className="flex flex-col items-center text-center gap-3">
                      <div
                        className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all ${
                          isActive ? "border-primary" : "border-[#1E3A5F]"
                        }`}
                      >
                        <img
                          src={expert.img}
                          alt={expert.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-white text-sm font-bold leading-tight">
                        {expert.name}
                      </p>
                    </div>

                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-white/10">
                            <p className="text-blue-400 text-[10px] font-mono uppercase tracking-widest mb-2">
                              Acompaña en
                            </p>
                            <p className="text-slate-300 text-xs leading-relaxed text-left">
                              {expert.decision}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </FadeIn>
              );
            })}
          </div>
          <FadeIn>
            <p className="text-center text-slate-600 text-sm mt-6">
              Selecciona a un experto para ver en qué decisiones acompaña.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          8. INVESTMENT WEEK — Reposicionado
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[#F5F7FA] py-20 md:py-24">
        <div className="container">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <FadeIn delay={0.1}>
              <div>
                <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">
                  Investment Week
                </p>
                <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-6">
                  Hay inversiones que solo se entienden caminándolas.
                </h2>
                <p className="text-[#4B5563] text-lg leading-relaxed mb-4">
                  Hay decisiones que pueden tomarse leyendo un análisis.
                  Y hay otras que únicamente se comprenden estando en el terreno,
                  revisando los números reales frente a un activo real.
                </p>
                <p className="text-[#4B5563] text-base leading-relaxed mb-8">
                  Investment Week existe para que el empresario comprenda{" "}
                  <span className="font-semibold text-[#0B1F3A]">
                    cómo analizamos activos reales
                  </span>{" "}
                  — no para venderle una propiedad.
                </p>
                <a href="/investment-week">
                  <Button className="bg-primary hover:bg-blue-600 text-white gap-2 shadow-lg shadow-blue-600/20">
                    Conocer Investment Week <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </FadeIn>
            <FadeIn>
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200">
                <img
                  src={INVEST_WEEK}
                  alt="Investment Week"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/50 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <span className="bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    Investment Week
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          9. GRUPO EMPRESARIAL — Pilar emocional
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl overflow-hidden aspect-square">
                  <img
                    src={GRUPO_ACOMPANAMIENTO}
                    alt="Edmundo Treviño conversando uno a uno con un miembro del Grupo Empresarial"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-xl overflow-hidden aspect-square mt-6">
                  <img
                    src={GRUPO_CERCANIA}
                    alt="Edmundo Treviño con miembros del Grupo Empresarial al cierre de una sesión"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-xl overflow-hidden aspect-square -mt-6">
                  <img
                    src={GRUPO_CONFIANZA}
                    alt="Edmundo Treviño en conversación distendida con dos miembros del grupo"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-xl overflow-hidden aspect-square">
                  <img
                    src={GRUPO_MESA_PRIVADA}
                    alt="Cena privada del Grupo Empresarial: mesa reducida de empresarios"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div>
                <p className="text-blue-400 text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
                  El núcleo del ecosistema
                </p>
                <h2 className="text-3xl md:text-4xl text-white mb-6">
                  Grupo Empresarial de Edmundo
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed mb-6">
                  El criterio no se construye solo. Se construye contrastando
                  decisiones con otros empresarios que ya están ejecutando.
                </p>
                <p className="text-slate-400 leading-relaxed mb-8">
                  El Grupo Empresarial es el espacio donde los miembros de
                  Comprando América contrastan sus decisiones patrimoniales con
                  pares y expertos. No es un grupo de networking. Es un espacio
                  de criterio compartido.
                </p>
                <div className="space-y-3 mb-8">
                  {[
                    "Decisiones patrimoniales con contexto real",
                    "Acceso mensual al Deal Day",
                    "Contraste con empresarios que ya ejecutan",
                    "Acompañamiento del equipo multidisciplinario",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <p className="text-slate-300 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
                <a href="/circulo-cercano">
                  <Button className="bg-primary hover:bg-blue-600 text-white gap-2 shadow-lg shadow-blue-600/25">
                    Conocer el Grupo Empresarial{" "}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          10. GPS — Cierre natural del recorrido
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[#091A30] py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-blue-400 text-xs font-semibold tracking-[0.3em] uppercase font-mono mb-6">
                GPS · Evaluación de perfil
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl text-white mb-6 leading-tight">
                Antes de elegir una inversión, conviene entender cuál estrategia
                hace sentido para tu patrimonio.
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
                El GPS de Comprando América te ayuda a identificar tu perfil,
                trazar tu ruta y evaluar tu capital en minutos. Sin compromiso.
                Sin presión.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <a href="https://comprandoamerica.com/gps">
                  <Button className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25 font-semibold">
                    Evalúa tu perfil <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <button
                  onClick={() =>
                    openWhatsApp(
                      WHATSAPP_PHONE,
                      "Hola, vi Comprando América y me gustaría hablar sobre mi situación.",
                      "home-cta-whatsapp",
                      "/"
                    )
                  }
                  className="border border-slate-600 text-white hover:bg-white/10 px-8 py-6 text-base rounded-md transition-colors font-medium"
                >
                  Hablar por WhatsApp
                </button>
              </div>
              <p className="text-slate-600 text-xs">
                Sin promesas de retorno. Sin presión de venta.
                Contenido informativo — la elegibilidad depende del perfil y del
                caso.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
