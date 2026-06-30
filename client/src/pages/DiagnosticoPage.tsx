import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";

// ─── Types ───────────────────────────────────────────────────────────────────
type ProfileKey = "explorador" | "constructor" | "patrimonial" | null;

interface Profile {
  key: Exclude<ProfileKey, null>;
  emoji: string;
  title: string;
  subtitle: string;
  range: string;
  color: string;
  colorBorder: string;
  colorBg: string;
  colorText: string;
  enfoque: string;
  resultado: string;
  bullets: string[];
}

// ─── Data ────────────────────────────────────────────────────────────────────
const PROFILES: Profile[] = [
  {
    key: "explorador",
    emoji: "🌱",
    title: "El Explorador",
    subtitle: "Tu primera propiedad en Estados Unidos",
    range: "$50k – $100k",
    color: "#22c55e",
    colorBorder: "border-green-500",
    colorBg: "bg-green-500/10",
    colorText: "text-green-400",
    enfoque: "Rendimiento (Cash on Cash)",
    resultado: "Primer Activo en Estados Unidos",
    bullets: [
      "Decide si necesitas LLC o no (ahorra miles en impuestos)",
      "Mercado seleccionado por análisis: Texas o Florida",
      "Deal Day: acceso a propiedades fuera del mercado",
      "Administración sin complicaciones desde tu país",
    ],
  },
  {
    key: "constructor",
    emoji: "🏗️",
    title: "El Constructor",
    subtitle: "Escala tu portafolio sistemáticamente",
    range: "$100k – $500k",
    color: "#f59e0b",
    colorBorder: "border-amber-400",
    colorBg: "bg-amber-400/10",
    colorText: "text-amber-400",
    enfoque: "Escalamiento",
    resultado: "Portafolio Diversificado",
    bullets: [
      "Estructura LLC multi-propiedades optimizada",
      "Estrategia dual: Texas + Florida para diversificar",
      "Acceso a off-market deals con mayor volumen",
      "Sistema de administración que trabaja solo",
    ],
  },
  {
    key: "patrimonial",
    emoji: "🏛️",
    title: "El Patrimonial",
    subtitle: "Protección, residencia y legado",
    range: "$500k – $1M+",
    color: "#a78bfa",
    colorBorder: "border-violet-400",
    colorBg: "bg-violet-400/10",
    colorText: "text-violet-400",
    enfoque: "Protección y Residencia",
    resultado: "Blindaje Legal y Estatus Migratorio",
    bullets: [
      "Estructura patrimonial con holding en Estados Unidos",
      "Ruta hacia visa de inversionista EB-5 o E-2",
      "Deal Day: activos de alto valor y cap rate premium",
      "Retorno optimizado + protección de activos",
    ],
  },
];

const ROADMAP_STEPS = [
  {
    id: "A",
    label: "Cimiento",
    desc: "Estructura Legal & Fiscal",
    detail: "Decidimos juntos si necesitas LLC, cómo proteger tus activos y cómo pagar menos impuestos desde el día uno.",
    icon: "⚖️",
  },
  {
    id: "B",
    label: "Estrategia",
    desc: "Selección de Mercado",
    detail: "Analizamos Texas vs. Florida según tu capital, objetivos y perfil migratorio para elegir el mercado correcto.",
    icon: "🗺️",
  },
  {
    id: "C",
    label: "Ejecución",
    desc: "Deal Day",
    detail: "El punto fuerte de el Círculo Cercano. Accedes a propiedades fuera del mercado con precios y condiciones exclusivas.",
    icon: "🔑",
  },
  {
    id: "D",
    label: "Cierre",
    desc: "Administración y Retorno",
    detail: "Tu propiedad trabaja sola. Sistema de administración, reportes mensuales y estrategia de salida optimizada.",
    icon: "📈",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function ProfileCard({
  profile,
  selected,
  onSelect,
}: {
  profile: Profile;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`relative flex flex-col gap-4 rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300 ${
        selected
          ? `${profile.colorBorder} ${profile.colorBg} shadow-lg scale-[1.02]`
          : "border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/8"
      }`}
    >
      {selected && (
        <div
          className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: profile.color }}
        >
          ✓
        </div>
      )}
      <div className="text-4xl">{profile.emoji}</div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">
          Tu etapa actual
        </p>
        <h3 className="text-xl font-bold text-white">{profile.title}</h3>
        <p className="text-sm text-white/60 mt-1">{profile.subtitle}</p>
      </div>
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${profile.colorBg} ${profile.colorText} self-start`}
      >
        💰 {profile.range}
      </div>
      <button
        className={`mt-auto w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
          selected
            ? `text-white`
            : "bg-white/10 text-white/70 hover:bg-white/15"
        }`}
        style={selected ? { backgroundColor: profile.color } : {}}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        {selected ? "✓ Perfil seleccionado" : "Seleccionar este camino"}
      </button>
    </div>
  );
}

function RoadmapSection({ selectedProfile }: { selectedProfile: Profile | null }) {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;

      if (sectionTop < viewportHeight && sectionTop + sectionHeight > 0) {
        const progress = Math.max(
          0,
          Math.min(1, (viewportHeight - sectionTop) / (viewportHeight + sectionHeight))
        );
        setActiveStep(Math.floor(progress * (ROADMAP_STEPS.length + 0.5)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const accentColor = selectedProfile?.color ?? "#368A45";

  return (
    <div ref={sectionRef} className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: accentColor }}>
            Tu GPS Financiero
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            El Mapa de Ruta de tu Inversión
          </h2>
          {selectedProfile && (
            <p className="mt-3 text-white/60 text-lg">
              Adaptado para{" "}
              <span className="font-semibold" style={{ color: accentColor }}>
                {selectedProfile.title}
              </span>
            </p>
          )}
        </div>

        {/* Progress line desktop */}
        <div className="hidden md:block relative mb-12">
          <div className="absolute top-8 left-[12.5%] right-[12.5%] h-1 bg-white/10 rounded-full" />
          <div
            className="absolute top-8 left-[12.5%] h-1 rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(activeStep / (ROADMAP_STEPS.length - 1), 1) * 75}%`,
              backgroundColor: accentColor,
            }}
          />
          <div className="grid grid-cols-4 gap-4">
            {ROADMAP_STEPS.map((step, idx) => (
              <div key={step.id} className="flex flex-col items-center gap-3">
                <div
                  className="w-16 h-16 rounded-full border-2 flex items-center justify-center text-2xl transition-all duration-500 cursor-pointer z-10 relative"
                  style={{
                    borderColor: idx <= activeStep ? accentColor : "rgba(255,255,255,0.15)",
                    backgroundColor:
                      idx <= activeStep ? `${accentColor}20` : "rgba(255,255,255,0.03)",
                  }}
                  onClick={() => setActiveStep(idx)}
                >
                  {step.icon}
                </div>
                <div className="text-center">
                  <p
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: idx <= activeStep ? accentColor : "rgba(255,255,255,0.3)" }}
                  >
                    Punto {step.id}
                  </p>
                  <p
                    className={`text-sm font-semibold mt-0.5 ${
                      idx <= activeStep ? "text-white" : "text-white/40"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-white/40 mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail card */}
        <div
          className="rounded-2xl border p-8 transition-all duration-500"
          style={{
            borderColor: `${accentColor}40`,
            backgroundColor: `${accentColor}08`,
          }}
        >
          {ROADMAP_STEPS.map((step, idx) => (
            <div
              key={step.id}
              className={`transition-all duration-500 ${
                idx === Math.min(activeStep, ROADMAP_STEPS.length - 1)
                  ? "opacity-100"
                  : "hidden"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{ backgroundColor: `${accentColor}20` }}
                >
                  {step.icon}
                </div>
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-wider mb-1"
                    style={{ color: accentColor }}
                  >
                    Punto {step.id} · {step.desc}
                  </p>
                  <h3 className="text-2xl font-bold text-white mb-2">{step.label}</h3>
                  <p className="text-white/70 text-lg leading-relaxed">{step.detail}</p>
                  {selectedProfile && (
                    <ul className="mt-4 space-y-2">
                      {selectedProfile.bullets
                        .filter((_, i) => i === idx)
                        .map((bullet, i) => (
                          <li key={i} className="flex items-start gap-2 text-white/80">
                            <span style={{ color: accentColor }} className="mt-0.5">
                              ›
                            </span>
                            {bullet}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile steps */}
        <div className="md:hidden mt-8 space-y-4">
          {ROADMAP_STEPS.map((step, idx) => (
            <div
              key={step.id}
              className="flex gap-4 p-4 rounded-xl border transition-all cursor-pointer"
              style={{
                borderColor:
                  idx <= activeStep ? `${accentColor}60` : "rgba(255,255,255,0.08)",
                backgroundColor:
                  idx <= activeStep ? `${accentColor}08` : "transparent",
              }}
              onClick={() => setActiveStep(idx)}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                style={{
                  backgroundColor:
                    idx <= activeStep ? `${accentColor}25` : "rgba(255,255,255,0.05)",
                }}
              >
                {step.icon}
              </div>
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: idx <= activeStep ? accentColor : "rgba(255,255,255,0.3)" }}
                >
                  Punto {step.id}
                </p>
                <p className="text-sm font-semibold text-white">{step.label}</p>
                <p className="text-xs text-white/50">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CapitalSlider({
  selectedProfile,
  onCapitalChange,
}: {
  selectedProfile: Profile | null;
  onCapitalChange: (v: number) => void;
}) {
  const [value, setValue] = useState(50000);
  const MIN = 50000;
  const MAX = 1000000;

  const formatMoney = (v: number) =>
    v >= 1000000
      ? "$1M+"
      : v >= 1000
      ? `$${(v / 1000).toFixed(0)}k`
      : `$${v}`;

  const percent = ((value - MIN) / (MAX - MIN)) * 100;

  const accentColor = selectedProfile?.color ?? "#368A45";

  const getProfileFromValue = (v: number): Profile => {
    if (v < 100000) return PROFILES[0];
    if (v < 500000) return PROFILES[1];
    return PROFILES[2];
  };

  const suggestedProfile = getProfileFromValue(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setValue(v);
    onCapitalChange(v);
  };

  return (
    <div className="py-20 px-4 border-t border-white/8">
      <div className="max-w-3xl mx-auto text-center">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: accentColor }}
        >
          Personaliza tu plan
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          ¿Cuánto capital tienes disponible?
        </h2>
        <p className="text-white/50 mb-12">
          Mueve el slider y descubre qué estrategia se adapta a ti
        </p>

        <div className="relative mb-8">
          <div
            className="text-5xl md:text-6xl font-black mb-2 transition-all duration-300"
            style={{ color: accentColor }}
          >
            {formatMoney(value)}
          </div>
          <p className="text-white/40 text-sm">en capital disponible para invertir</p>
        </div>

        <div className="relative mb-10">
          <input
            type="range"
            min={MIN}
            max={MAX}
            step={5000}
            value={value}
            onChange={handleChange}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${accentColor} ${percent}%, rgba(255,255,255,0.1) ${percent}%)`,
            }}
          />
          <div className="flex justify-between text-xs text-white/30 mt-2">
            <span>$50k</span>
            <span>$250k</span>
            <span>$500k</span>
            <span>$1M+</span>
          </div>
        </div>

        <div
          className={`rounded-2xl border-2 p-6 transition-all duration-500 ${suggestedProfile.colorBorder} ${suggestedProfile.colorBg}`}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">
            Con {formatMoney(value)}, tu perfil ideal es:
          </p>
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl">{suggestedProfile.emoji}</span>
            <div className="text-left">
              <h3
                className="text-xl font-bold"
                style={{ color: suggestedProfile.color }}
              >
                {suggestedProfile.title}
              </h3>
              <p className="text-white/60 text-sm">{suggestedProfile.subtitle}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestedProfile.bullets.map((bullet, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-sm text-white/70 text-left"
              >
                <span style={{ color: suggestedProfile.color }} className="mt-0.5 shrink-0">
                  ›
                </span>
                {bullet}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ComparisonTable() {
  return (
    <div className="py-20 px-4 border-t border-white/8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#368A45] mb-3">
            La Herramienta
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Los 3 Perfiles. Una Sola Herramienta.
          </h2>
          <p className="text-white/50 mt-3 max-w-xl mx-auto">
            Sin importar en qué etapa estás, el plan{" "}
            <span className="text-white font-semibold">Investor Entry ($10k)</span> es el
            vehículo que te lleva al siguiente nivel.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4 text-white/40 text-sm font-normal">Perfil</th>
                <th className="text-left py-4 px-4 text-white/40 text-sm font-normal">Enfoque</th>
                <th className="text-center py-4 px-4 text-white/40 text-sm font-normal">
                  Herramienta
                </th>
                <th className="text-left py-4 px-4 text-white/40 text-sm font-normal">Resultado</th>
              </tr>
            </thead>
            <tbody>
              {PROFILES.map((profile, idx) => (
                <tr
                  key={profile.key}
                  className={`border-b border-white/5 transition-colors hover:bg-white/3 ${
                    idx === 1 ? "bg-white/3" : ""
                  }`}
                >
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{profile.emoji}</span>
                      <div>
                        <p
                          className="font-bold text-sm"
                          style={{ color: profile.color }}
                        >
                          {profile.title}
                        </p>
                        <p className="text-white/40 text-xs">{profile.range}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <p className="text-white/80 text-sm">{profile.enfoque}</p>
                  </td>
                  <td className="py-5 px-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#368A45]/20 text-[#4ade80] text-xs font-bold border border-[#368A45]/40">
                      ⭐ Investor Entry
                      <span className="text-white/60 font-normal">$10k</span>
                    </span>
                  </td>
                  <td className="py-5 px-4">
                    <p className="text-white font-semibold text-sm">{profile.resultado}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 rounded-2xl border border-[#368A45]/30 bg-[#368A45]/8 p-6 text-center">
          <p className="text-white/60 text-sm mb-1">Inversión en el Círculo Cercano</p>
          <p className="text-4xl font-black text-white">
            $10,000{" "}
            <span className="text-lg font-normal text-white/40">USD</span>
          </p>
          <p className="text-[#4ade80] text-sm mt-1 font-semibold">
            Investor Entry — acceso completo a los 4 puntos del roadmap
          </p>
        </div>
      </div>
    </div>
  );
}

function WhatsAppWidget({ selectedProfile }: { selectedProfile: Profile | null }) {
  const profileLabel = selectedProfile?.title ?? "inversor";
  const message = encodeURIComponent(
    `Hola, mi perfil es ${profileLabel}. ¿Podemos validar mi capital para el plan Investor Entry?`
  );
  const whatsappUrl = `https://wa.me/17862784421?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#25D366] text-white font-bold text-sm px-4 py-3 rounded-2xl shadow-2xl hover:bg-[#20bd5a] transition-all duration-300 hover:scale-105 group"
    >
      <svg
        className="w-5 h-5 shrink-0"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      <div className="hidden sm:flex flex-col leading-tight">
        <span className="text-[10px] font-normal opacity-80">Evaluación inmediata</span>
        <span>
          {selectedProfile ? `Soy ${profileLabel.split(" ")[1]}` : "Validar mi capital"}
        </span>
      </div>
      <svg className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </a>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DiagnosticoPage() {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [, setCapital] = useState(50000);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const accentColor = selectedProfile?.color ?? "#368A45";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0f1a", color: "white" }}>
      {/* ── Navbar ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? "bg-[#0a0f1a]/95 backdrop-blur-md border-b border-white/8" : ""
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-black"
                style={{ backgroundColor: accentColor }}
              >
                CA
              </div>
              <span className="font-bold text-white text-sm hidden sm:block">
                Comprando América
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-white/50">
            <a href="#perfiles" className="hover:text-white transition-colors">
              El Club
            </a>
            <a href="#roadmap" className="hover:text-white transition-colors">
              Roadmap
            </a>
            <a
              href="https://wa.me/17862784421"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-white text-xs font-bold transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: accentColor }}
            >
              Diagnóstico Gratis
            </a>
          </nav>

          <a
            href="https://wa.me/17862784421"
            target="_blank"
            rel="noopener noreferrer"
            className="md:hidden px-3 py-1.5 rounded-lg text-white text-xs font-bold"
            style={{ backgroundColor: accentColor }}
          >
            Diagnóstico
          </a>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative pt-28 pb-16 px-4 overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none transition-all duration-1000"
          style={{
            background: `radial-gradient(ellipse 80% 50% at 50% -20%, ${accentColor}, transparent)`,
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 border"
            style={{
              color: accentColor,
              borderColor: `${accentColor}40`,
              backgroundColor: `${accentColor}10`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
            Panel de Estrategia Privado
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            Configura tu futuro
            <br />
            <span
              className="transition-all duration-500"
              style={{ color: accentColor }}
            >
              en bienes raíces Estados Unidos
            </span>
          </h1>

          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Este no es un sitio de servicios. Es tu panel de control. Elige tu
            perfil, traza tu ruta y valida tu capital en minutos.
          </p>

          {/* Video placeholder */}
          <div className="relative mx-auto max-w-2xl rounded-2xl overflow-hidden border border-white/10 bg-white/5 aspect-video flex items-center justify-center group cursor-pointer hover:border-white/20 transition-all">
            <div
              className="absolute inset-0 opacity-5"
              style={{ backgroundColor: accentColor }}
            />
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: accentColor }}
              >
                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-white/50 text-sm">
                Edmundo explica el Roadmap de Inversión
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Profile Selector ── */}
      <section id="perfiles" className="py-20 px-4 border-t border-white/8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: accentColor }}
            >
              Paso 1 de 4
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              ¿En qué etapa estás hoy?
            </h2>
            <p className="text-white/50 mt-3 max-w-lg mx-auto">
              Selecciona tu perfil. Tu roadmap se adaptará automáticamente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PROFILES.map((profile) => (
              <ProfileCard
                key={profile.key}
                profile={profile}
                selected={selectedProfile?.key === profile.key}
                onSelect={() =>
                  setSelectedProfile(
                    selectedProfile?.key === profile.key ? null : profile
                  )
                }
              />
            ))}
          </div>

          {selectedProfile && (
            <div className="mt-8 text-center">
              <p className="text-white/50 text-sm">
                Perfil seleccionado:{" "}
                <span className="font-semibold" style={{ color: selectedProfile.color }}>
                  {selectedProfile.title}
                </span>{" "}
                · Tu roadmap está listo ↓
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Roadmap ── */}
      <section id="roadmap">
        <RoadmapSection selectedProfile={selectedProfile} />
      </section>

      {/* ── Capital Slider ── */}
      <CapitalSlider
        selectedProfile={selectedProfile}
        onCapitalChange={setCapital}
      />

      {/* ── Comparison Table ── */}
      <ComparisonTable />

      {/* ── CTA + Disclaimer ── */}
      <section className="py-20 px-4 border-t border-white/8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para validar tu capital?
          </h2>
          <p className="text-white/60 mb-8 text-lg">
            Nuestro equipo revisa tu situación y te dice exactamente qué hacer
            en los próximos 30 días.
          </p>

          <a
            href={`https://wa.me/17862784421?text=${encodeURIComponent(
              selectedProfile
                ? `Hola, mi perfil es ${selectedProfile.title}. ¿Podemos validar mi capital para el plan Investor Entry?`
                : "Hola, quiero conocer más sobre el plan Investor Entry."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold text-lg transition-all duration-300 hover:opacity-90 hover:scale-105 shadow-lg mb-12"
            style={{ backgroundColor: "#25D366" }}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {selectedProfile
              ? `Mi perfil es ${selectedProfile.title.split(" ")[1]}. Validar capital`
              : "Hablar con el equipo ahora"}
          </a>

          {/* Legal disclaimer */}
          <div className="rounded-xl border border-white/8 bg-white/3 p-5 text-left">
            <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-2">
              Aviso Legal
            </p>
            <p className="text-xs text-white/30 leading-relaxed">
              La información presentada en esta página es únicamente de carácter
              educativo e informativo. No constituye asesoramiento financiero,
              legal ni fiscal. Las inversiones en bienes raíces conllevan riesgos
              inherentes. Los resultados pasados no garantizan rendimientos
              futuros. Consulta siempre con profesionales licenciados antes de
              tomar decisiones de inversión. Comprando América no es un
              asesor de inversiones registrado.
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/8 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-white/30 text-xs">
          <p>© 2025 Comprando América. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <a href="/" className="hover:text-white/60 transition-colors">
              Inicio
            </a>
            <a
              href="https://wa.me/17862784421"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 transition-colors"
            >
              Contacto
            </a>
          </div>
        </div>
      </footer>

      {/* ── Sticky WhatsApp ── */}
      <WhatsAppWidget selectedProfile={selectedProfile} />

      {/* Range input style override */}
      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 0 0 3px rgba(255,255,255,0.15);
        }
        input[type='range']::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 0 3px rgba(255,255,255,0.15);
        }
      `}</style>
    </div>
  );
}
