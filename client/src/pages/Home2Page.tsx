/*
 * Home2Page — A/B variant "Executive Noir"
 * Ecosystem-first: Membresía → Rutas → Servicios → Expertos → Roadmap
 */

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useInView } from "@/hooks/useInView";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Globe,
  Building2,
  Building,
  Star,
  Shield,
  DollarSign,
  Briefcase,
  FileText,
  Network,
  Search,
  Plane,
} from "lucide-react";

/* ─── Google Fonts: DM Serif Display + DM Sans ─── */
function useDMFonts() {
  useEffect(() => {
    if (document.getElementById("dm-fonts-h2")) return;
    const link = document.createElement("link");
    link.id = "dm-fonts-h2";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap";
    document.head.appendChild(link);
  }, []);
}

/* ─── Design tokens ─── */
const BG = "#0A1628";
const BG2 = "#0D1E35";
const BG3 = "#0F2444";
const GREEN = "#00C853";
const GOLD = "#C5A55A";
const SERIF = "'DM Serif Display', 'Manrope', serif";
const SANS = "'DM Sans', 'Inter', sans-serif";

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
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Section label chip ─── */
function Label({ text }: { text: string }) {
  return (
    <span
      className="inline-block text-xs font-semibold tracking-[0.25em] uppercase mb-5 px-3 py-1 rounded-full border"
      style={{ color: GOLD, borderColor: `${GOLD}50`, background: `${GOLD}10`, fontFamily: SANS }}
    >
      {text}
    </span>
  );
}

/* ─── Photo arrays from existing project ─── */
const HERO_IMG = "https://lh3.googleusercontent.com/d/1Um6fwMpl_mMyAZWmF1hWVdnLYpJCp0Kz=w1920";
const NETWORKING_IMG = "https://lh3.googleusercontent.com/d/1dOiMwsphB-MpHgpCDtufBtiqaycAIM8W=w1920";
const PANEL_IMG = "https://lh3.googleusercontent.com/d/191DAUtt8vkLpZJatNDqvtYrRIc1Z-VHO=w1920";

const EXPERTS = [
  { name: "Joe Faraci", role: "Bienes Raíces", img: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439239/comprando-america/YfxVlywHHLmCeDRI.png" },
  { name: "Tomás Resendez", role: "Inmigración", img: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439162/comprando-america/QGuNYwiuoAkxjDwj.png" },
  { name: "Daniel Palacios", role: "CPA & Fiscal", img: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439036/comprando-america/CPGtnnreqZlWVzgL.png" },
  { name: "Aubrey Dwyer", role: "Derecho Corporativo", img: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439166/comprando-america/QZAlYTAoaVokeCSo.jpg" },
  { name: "Destiny Bounds", role: "Corporativo & PI", img: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439040/comprando-america/EDQOyfeHfevdqerE.avif" },
  { name: "John McKee", role: "Estrategia Comercial", img: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439314/comprando-america/sZacCQEqvoOyeOMO.avif" },
];

/* ─── Route card ─── */
type RouteCardProps = {
  icon: React.ElementType;
  title: string;
  description: string;
  services: string[];
  delay?: number;
};
function RouteCard({ icon: Icon, title, description, services, delay = 0 }: RouteCardProps) {
  return (
    <FadeIn delay={delay}>
      <div
        className="rounded-2xl p-8 h-full flex flex-col border transition-all duration-300 hover:-translate-y-1 group"
        style={{ background: BG2, borderColor: "#1E3A5F" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = `${GREEN}50`;
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 24px 60px rgba(0,200,83,0.07)`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "#1E3A5F";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "";
        }}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
          style={{ background: `${GREEN}18` }}
        >
          <Icon className="w-6 h-6" style={{ color: GREEN }} />
        </div>
        <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: SERIF }}>
          {title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1" style={{ fontFamily: SANS }}>
          {description}
        </p>
        <div className="space-y-2">
          {services.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: GREEN }} />
              <span className="text-slate-300 text-xs" style={{ fontFamily: SANS }}>
                {s}
              </span>
            </div>
          ))}
        </div>
      </div>
    </FadeIn>
  );
}

/* ─── Service card ─── */
type ServiceCardProps = {
  icon: React.ElementType;
  name: string;
  description: string;
  price?: string;
  featured?: boolean;
  delay?: number;
};
function ServiceCard({ icon: Icon, name, description, price, featured = false, delay = 0 }: ServiceCardProps) {
  return (
    <FadeIn delay={delay}>
      <div
        className="rounded-xl p-6 h-full flex flex-col border transition-all duration-300 hover:-translate-y-0.5"
        style={{
          background: featured ? `${GOLD}0A` : BG3,
          borderColor: featured ? `${GOLD}60` : "#1E3A5F",
        }}
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
          style={{ background: featured ? `${GOLD}22` : `${GREEN}14` }}
        >
          <Icon className="w-5 h-5" style={{ color: featured ? GOLD : GREEN }} />
        </div>
        {featured && (
          <span
            className="text-[10px] font-bold uppercase tracking-widest mb-2"
            style={{ color: GOLD, fontFamily: SANS }}
          >
            Puerta de entrada
          </span>
        )}
        <h4 className="text-white font-semibold text-sm mb-2" style={{ fontFamily: SANS }}>
          {name}
        </h4>
        <p className="text-slate-400 text-xs leading-relaxed flex-1 mb-4" style={{ fontFamily: SANS }}>
          {description}
        </p>
        {price && (
          <p
            className="text-xs font-semibold"
            style={{ color: featured ? GOLD : GREEN, fontFamily: SANS }}
          >
            {price}
          </p>
        )}
      </div>
    </FadeIn>
  );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function Home2Page() {
  useDMFonts();

  const ROUTES: RouteCardProps[] = [
    {
      icon: TrendingUp,
      title: "Quiero invertir en Estados Unidos",
      description:
        "Para empresarios con capital disponible que buscan diversificación, flujo, fondos, real estate o co-inversiones.",
      services: ["Membresía", "Victory Capital", "Deal Days", "Deal Finding", "Real Estate", "Investment Tours"],
    },
    {
      icon: Globe,
      title: "Quiero migrar con inversión",
      description:
        "Para familias o empresarios que buscan una ruta E-2, E-1 u otra estrategia migratoria respaldada por estructura real.",
      services: ["Membresía", "Diagnóstico", "Estrategia migratoria", "LLC", "Business Plan E-2", "Red legal migratoria"],
    },
    {
      icon: Building2,
      title: "Quiero expandir mi empresa",
      description:
        "Para empresarios que desean entrar al mercado estadounidense, vender, operar o abrir presencia formal.",
      services: ["Membresía", "Americaniza tu Operación", "LLC", "Banca", "Fiscal", "Red comercial"],
    },
  ];

  const SERVICES: ServiceCardProps[] = [
    {
      icon: Star,
      name: "Membresía Comprando América",
      description: "Acceso vitalicio al ecosistema privado.",
      price: "$10,000 USD",
      featured: true,
    },
    {
      icon: TrendingUp,
      name: "Victory Capital Fund",
      description: "Fondo inmobiliario en mobile home parks y affordable housing.",
      price: "Desde $100,000 USD",
    },
    {
      icon: FileText,
      name: "Formación de LLC",
      description: "Estructura corporativa para operar en EE.UU.",
      price: "Desde $1,499 USD",
    },
    {
      icon: Globe,
      name: "Ruta Migratoria",
      description: "Estrategia + estructura + acompañamiento legal migratorio.",
    },
    {
      icon: Search,
      name: "Deal Finding",
      description: "Búsqueda y evaluación de oportunidades alineadas al perfil.",
    },
    {
      icon: Plane,
      name: "Investment Tours",
      description: "Visitas privadas a activos reales y oportunidades.",
    },
    {
      icon: Network,
      name: "Americaniza tu Operación",
      description: "Ruta para empresas latinas que quieren entrar al mercado de EE.UU.",
    },
  ];

  const EXPERT_CATEGORIES = [
    { label: "Abogados migratorios", icon: Shield },
    { label: "CPAs y fiscalistas", icon: FileText },
    { label: "Bancos y estructura financiera", icon: DollarSign },
    { label: "Operadores inmobiliarios", icon: Building2 },
    { label: "Brokers", icon: Briefcase },
    { label: "Desarrolladores", icon: Building },
    { label: "Especialistas en LLC", icon: Network },
    { label: "Fondos y oportunidades privadas", icon: TrendingUp },
  ];

  const ROADMAP = [
    { num: 1, label: "Evaluación de perfil" },
    { num: 2, label: "Membresía" },
    { num: 3, label: "Diagnóstico estratégico" },
    { num: 4, label: "Estructura legal / fiscal / bancaria" },
    { num: 5, label: "Acceso a oportunidades" },
    { num: 6, label: "Due diligence" },
    { num: 7, label: "Inversión / migración / expansión" },
    { num: 8, label: "Seguimiento y escalamiento patrimonial" },
  ];

  return (
    <div style={{ background: BG, fontFamily: SANS }} className="min-h-screen text-white overflow-x-hidden">
      <Navbar />

      {/* ══════════════════════════════════════════════
          S1 — HERO
      ══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          <img
            src={HERO_IMG}
            alt="Edmundo Treviño — Comprando América"
            className="w-full h-full object-cover object-top"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, ${BG}F8 35%, ${BG}D0 60%, ${BG}80)`,
            }}
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(to top, ${BG} 0%, transparent 45%)` }}
          />
        </div>

        {/* Gold accent bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px]"
          style={{ background: `linear-gradient(to bottom, transparent 10%, ${GOLD} 50%, transparent 90%)` }}
        />

        <div className="container relative z-10 pt-36 pb-28">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-14" style={{ background: GOLD }} />
                <span
                  className="text-[11px] font-semibold tracking-[0.3em] uppercase"
                  style={{ color: GOLD, fontFamily: SANS }}
                >
                  Ecosistema Privado de Inversión
                </span>
              </div>

              <h1
                className="text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.1] text-white mb-6"
                style={{ fontFamily: SERIF }}
              >
                Invertir en Estados Unidos no es el reto.{" "}
                <em style={{ color: GREEN, fontStyle: "italic" }}>
                  El reto es hacerlo con estructura.
                </em>
              </h1>

              <p
                className="text-lg text-slate-300 leading-relaxed mb-10 max-w-2xl"
                style={{ fontFamily: SANS }}
              >
                Comprando América es un ecosistema privado para empresarios e inversionistas latinos
                que buscan mover capital, proteger patrimonio, acceder a oportunidades reales y tomar
                decisiones acompañados por una red validada de expertos en Estados Unidos.
              </p>

              <div className="flex flex-wrap gap-4">
                <a href="/diagnostico">
                  <Button
                    className="px-8 py-6 text-base font-semibold gap-2 rounded-xl border-0"
                    style={{ background: GREEN, color: "#061008" }}
                  >
                    Evaluar mi perfil <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <a href="/membresia">
                  <Button
                    variant="outline"
                    className="px-8 py-6 text-base font-semibold gap-2 rounded-xl text-white hover:text-white"
                    style={{ borderColor: `${GOLD}70`, background: `${GOLD}0C` }}
                  >
                    Conocer la Membresía
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          S2 — ELIGE TU RUTA
      ══════════════════════════════════════════════ */}
      <section className="py-24 md:py-32" style={{ background: BG2 }}>
        <div className="container">
          <FadeIn>
            <div className="text-center mb-16">
              <Label text="Elige tu ruta" />
              <h2
                className="text-3xl md:text-4xl lg:text-5xl text-white"
                style={{ fontFamily: SERIF }}
              >
                ¿Cuál es tu objetivo hoy?
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {ROUTES.map((route, i) => (
              <RouteCard key={i} {...route} delay={i * 0.09} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          S3 — LA MEMBRESÍA
      ══════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: BG }}>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${GREEN}07 0%, transparent 70%)` }}
        />

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <div className="text-center mb-12">
                <Label text="El origen de todo" />
                <h2
                  className="text-3xl md:text-4xl lg:text-5xl text-white mb-6"
                  style={{ fontFamily: SERIF }}
                >
                  La Membresía es el origen de todo
                </h2>
                <p
                  className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto"
                  style={{ fontFamily: SANS }}
                >
                  La membresía no es un curso ni un paquete de beneficios. Es la puerta de entrada
                  al ecosistema Comprando América.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.12}>
              <div
                className="rounded-2xl p-8 md:p-12 mb-10 border"
                style={{ background: BG3, borderColor: `${GREEN}35` }}
              >
                <p
                  className="text-slate-300 text-base leading-relaxed mb-8"
                  style={{ fontFamily: SANS }}
                >
                  Ser miembro te permite:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Formar criterio sobre el mercado estadounidense",
                    "Entender cómo funciona el sistema desde adentro",
                    "Acceder a oportunidades privadas de inversión",
                    "Conectar con una red de expertos validados",
                    "Evaluar rutas fiscales, legales y migratorias",
                    "Tomar decisiones con acompañamiento real",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        style={{ color: GREEN }}
                      />
                      <span
                        className="text-slate-300 text-sm leading-relaxed"
                        style={{ fontFamily: SANS }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.22}>
              <div className="text-center">
                <a href="/membresia">
                  <Button
                    className="px-10 py-6 text-base font-semibold gap-2 rounded-xl border-0"
                    style={{ background: GREEN, color: "#061008" }}
                  >
                    Solicitar acceso a la membresía <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Photo break ── */}
      <section className="relative h-56 md:h-72 overflow-hidden">
        <img
          src={NETWORKING_IMG}
          alt="Networking Comprando América"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${BG} 0%, transparent 25%, transparent 75%, ${BG2} 100%)`,
          }}
        />
      </section>

      {/* ══════════════════════════════════════════════
          S4 — SERVICIOS DEL ECOSISTEMA
      ══════════════════════════════════════════════ */}
      <section className="py-24 md:py-32" style={{ background: BG2 }}>
        <div className="container">
          <FadeIn>
            <div className="text-center mb-16">
              <Label text="Ecosistema completo" />
              <h2
                className="text-3xl md:text-4xl lg:text-5xl text-white"
                style={{ fontFamily: SERIF }}
              >
                Servicios del ecosistema
              </h2>
            </div>
          </FadeIn>

          {/* Featured card full-width row + 6 in grid */}
          <div className="max-w-5xl mx-auto">
            <FadeIn>
              <div
                className="rounded-2xl p-8 mb-4 border flex flex-col md:flex-row md:items-center gap-6"
                style={{ background: `${GOLD}0A`, borderColor: `${GOLD}60` }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${GOLD}22` }}
                >
                  <Star className="w-7 h-7" style={{ color: GOLD }} />
                </div>
                <div className="flex-1">
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: GOLD, fontFamily: SANS }}
                  >
                    Puerta de entrada · Todo comienza aquí
                  </span>
                  <h4
                    className="text-white font-bold text-lg mt-1 mb-1"
                    style={{ fontFamily: SANS }}
                  >
                    Membresía Comprando América
                  </h4>
                  <p className="text-slate-400 text-sm" style={{ fontFamily: SANS }}>
                    Acceso vitalicio al ecosistema privado. La membresía no es un beneficio — es la
                    condición de entrada.
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-lg" style={{ color: GOLD, fontFamily: SANS }}>
                    $10,000 USD
                  </p>
                  <a href="/membresia">
                    <Button
                      size="sm"
                      className="mt-3 gap-1 rounded-lg border-0"
                      style={{ background: GOLD, color: "#0A0A0A" }}
                    >
                      Solicitar acceso <ArrowRight className="w-3 h-3" />
                    </Button>
                  </a>
                </div>
              </div>
            </FadeIn>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SERVICES.slice(1).map((service, i) => (
                <ServiceCard key={i} {...service} delay={i * 0.07} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          S5 — RED VALIDADA DE EXPERTOS
      ══════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 relative" style={{ background: BG }}>
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <Label text="Red de expertos" />
              <h2
                className="text-3xl md:text-4xl lg:text-5xl text-white mb-6"
                style={{ fontFamily: SERIF }}
              >
                Red validada de expertos
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed" style={{ fontFamily: SANS }}>
                Durante más de 20 años operando en Estados Unidos, Edmundo Treviño ha construido una
                red de especialistas que acompañan al inversionista en áreas críticas.
              </p>
            </div>
          </FadeIn>

          {/* Expert portraits */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6 max-w-4xl mx-auto mb-14">
            {EXPERTS.map((expert, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="text-center group">
                  <div
                    className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full overflow-hidden mb-3 border-2 transition-all duration-300"
                    style={{ borderColor: "#1E3A5F" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = GOLD;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = "#1E3A5F";
                    }}
                  >
                    <img
                      src={expert.img}
                      alt={expert.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-white text-xs font-semibold" style={{ fontFamily: SANS }}>
                    {expert.name}
                  </p>
                  <p className="text-slate-500 text-[10px]" style={{ fontFamily: SANS }}>
                    {expert.role}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Category grid */}
          <FadeIn delay={0.1}>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
              {EXPERT_CATEGORIES.map((cat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 border"
                  style={{ background: BG3, borderColor: "#1E3A5F" }}
                >
                  <cat.icon className="w-4 h-4 flex-shrink-0" style={{ color: GOLD }} />
                  <span
                    className="text-slate-300 text-xs leading-tight"
                    style={{ fontFamily: SANS }}
                  >
                    {cat.label}
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Photo break ── */}
      <section className="relative h-56 md:h-72 overflow-hidden">
        <img
          src={PANEL_IMG}
          alt="Panel de expertos Comprando América"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${BG} 0%, transparent 25%, transparent 75%, ${BG3} 100%)`,
          }}
        />
      </section>

      {/* ══════════════════════════════════════════════
          S6 — ROADMAP DEL INVERSIONISTA
      ══════════════════════════════════════════════ */}
      <section className="py-24 md:py-32" style={{ background: BG3 }}>
        <div className="container">
          <FadeIn>
            <div className="text-center mb-16">
              <Label text="El proceso" />
              <h2
                className="text-3xl md:text-4xl lg:text-5xl text-white"
                style={{ fontFamily: SERIF }}
              >
                Roadmap del inversionista
              </h2>
            </div>
          </FadeIn>

          {/* Desktop — horizontal */}
          <div className="hidden md:block max-w-5xl mx-auto">
            <div className="relative">
              {/* Connector line */}
              <div
                className="absolute top-8 left-[5%] right-[5%] h-px"
                style={{
                  background: `linear-gradient(to right, ${GREEN}60, ${GOLD}60, ${GREEN}60)`,
                }}
              />
              <div className="grid grid-cols-8 gap-2">
                {ROADMAP.map((step, i) => {
                  const isFirst = i === 0;
                  const isLast = i === ROADMAP.length - 1;
                  const accent = isFirst ? GREEN : isLast ? GOLD : undefined;
                  return (
                    <FadeIn key={i} delay={i * 0.07}>
                      <div className="flex flex-col items-center text-center px-1">
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center text-base font-bold mb-4 relative z-10 border-2 transition-all"
                          style={{
                            background: accent ? `${accent}18` : BG,
                            borderColor: accent ?? "#2A4A6E",
                            color: accent ?? "#4A6E90",
                            fontFamily: SANS,
                          }}
                        >
                          {step.num}
                        </div>
                        <p
                          className="text-xs leading-tight"
                          style={{
                            color: accent ?? "#64748B",
                            fontFamily: SANS,
                          }}
                        >
                          {step.label}
                        </p>
                      </div>
                    </FadeIn>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile — vertical */}
          <div className="md:hidden max-w-sm mx-auto space-y-3">
            {ROADMAP.map((step, i) => {
              const isFirst = i === 0;
              const isLast = i === ROADMAP.length - 1;
              const accent = isFirst ? GREEN : isLast ? GOLD : undefined;
              return (
                <FadeIn key={i} delay={i * 0.05}>
                  <div
                    className="flex items-center gap-4 rounded-xl px-5 py-4 border"
                    style={{
                      background: BG,
                      borderColor: accent ? `${accent}55` : "#1E3A5F",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                      style={{
                        background: accent ? `${accent}20` : "#1E3A5F",
                        color: accent ?? "#64748B",
                        fontFamily: SANS,
                      }}
                    >
                      {step.num}
                    </div>
                    <p
                      className="text-slate-300 text-sm leading-tight"
                      style={{ fontFamily: SANS }}
                    >
                      {step.label}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA FINAL
      ══════════════════════════════════════════════ */}
      <section className="py-28 md:py-36 relative overflow-hidden" style={{ background: BG }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 100%, ${GREEN}07 0%, transparent 65%)`,
          }}
        />

        <div className="container relative z-10">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px flex-1 max-w-[80px]" style={{ background: GOLD }} />
                <span
                  className="text-[11px] font-semibold tracking-[0.3em] uppercase"
                  style={{ color: GOLD, fontFamily: SANS }}
                >
                  Comprando América
                </span>
                <div className="h-px flex-1 max-w-[80px]" style={{ background: GOLD }} />
              </div>

              <h2
                className="text-3xl md:text-4xl lg:text-5xl text-white mb-6"
                style={{ fontFamily: SERIF }}
              >
                El primer paso es evaluar si encajas con el ecosistema.
              </h2>

              <p
                className="text-slate-400 text-lg leading-relaxed mb-10"
                style={{ fontFamily: SANS }}
              >
                No vendemos acceso a todo el mundo. Evaluamos tu perfil para determinar si el
                ecosistema es el lugar correcto para tus objetivos.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <a href="/diagnostico">
                  <Button
                    className="px-10 py-6 text-base font-semibold gap-2 rounded-xl border-0"
                    style={{ background: GREEN, color: "#061008" }}
                  >
                    Evaluar mi perfil <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <a href="/membresia">
                  <Button
                    variant="outline"
                    className="px-10 py-6 text-base font-semibold gap-2 rounded-xl text-white hover:text-white"
                    style={{ borderColor: `${GOLD}70`, background: "transparent" }}
                  >
                    Conocer la Membresía
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
