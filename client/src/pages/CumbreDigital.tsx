import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useInView } from "@/hooks/useInView";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  CalendarDays,
  Clock,
  Wifi,
  CheckCircle2,
  Send,
  Youtube,
  Facebook,
  ChevronDown,
  ChevronRight,
  Lock,
  Globe,
  TrendingUp,
  Building2,
  Scale,
  Users,
  Star,
  MapPin,
} from "lucide-react";

/* ─── helpers ─── */
function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isInView } = useInView();
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── data ─── */
const COUNTRY_CODES = [
  { code: "+52", label: "🇲🇽 México (+52)" },
  { code: "+1",  label: "🇺🇸 EE.UU. (+1)" },
  { code: "+57", label: "🇨🇴 Colombia (+57)" },
  { code: "+34", label: "🇪🇸 España (+34)" },
  { code: "+54", label: "🇦🇷 Argentina (+54)" },
  { code: "+56", label: "🇨🇱 Chile (+56)" },
  { code: "+51", label: "🇵🇪 Perú (+51)" },
  { code: "+58", label: "🇻🇪 Venezuela (+58)" },
  { code: "+593", label: "🇪🇨 Ecuador (+593)" },
  { code: "+502", label: "🇬🇹 Guatemala (+502)" },
  { code: "+503", label: "🇸🇻 El Salvador (+503)" },
  { code: "+506", label: "🇨🇷 Costa Rica (+506)" },
  { code: "+507", label: "🇵🇦 Panamá (+507)" },
  { code: "+591", label: "🇧🇴 Bolivia (+591)" },
  { code: "+595", label: "🇵🇾 Paraguay (+595)" },
  { code: "+598", label: "🇺🇾 Uruguay (+598)" },
  { code: "+1CA", label: "🇨🇦 Canadá (+1)" },
];

const TEMAS = [
  {
    icon: <Globe className="w-6 h-6" />,
    titulo: "Migración y opciones reales para inversionistas",
    desc: "Qué caminos migratorios existen hoy para quienes quieren operar o vivir en Estados Unidos — más allá de los mitos.",
  },
  {
    icon: <Building2 className="w-6 h-6" />,
    titulo: "Oportunidades de inversión en EE.UU.",
    desc: "Algunos de los proyectos y mercados que estamos analizando: desde bienes raíces hasta adquisición de negocios.",
  },
  {
    icon: <Scale className="w-6 h-6" />,
    titulo: "Estructura, protección y fiscalidad",
    desc: "Cómo se estructura correctamente una inversión en Estados Unidos para proteger patrimonio y optimizar impuestos.",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    titulo: "Cómo piensan quienes ya operan en EE.UU.",
    desc: "El criterio detrás de cada decisión: qué revisan, qué evitan y cómo evalúan antes de mover capital al norte.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    titulo: "Casos reales de expansión e inversión",
    desc: "Historias concretas de empresarios latinoamericanos que ya tienen presencia en Estados Unidos.",
  },
  {
    icon: <Star className="w-6 h-6" />,
    titulo: "Próximos pasos y oportunidades activas",
    desc: "Cómo seguir conectado con Comprando América y qué oportunidades están disponibles ahora para quienes quieren avanzar.",
  },
];

const SPEAKERS = [
  {
    name: "Edmundo Treviño",
    role: "CEO & Fundador, Comprando América",
    photo: "/team/edmundo.jpg",
    bio: "Empresario con operaciones en Houston. Especialista en adquisición de negocios, estructura de inversión y expansión internacional.",
  },
  {
    name: "Tomás Reséndez",
    role: "Estrategia Migratoria",
    photo: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439328/comprando-america/ukgTQSSvdQDxOgaS.jpg",
    bio: "Experto en opciones migratorias para inversionistas latinoamericanos en Estados Unidos. Visa E-2, estructura y contexto regulatorio actual.",
  },
  {
    name: "Diego Alcalá",
    role: "Operaciones e Inversiones",
    photo: "https://res.cloudinary.com/dgruohz6f/image/upload/v1781894896/tts-news/wjjnswgxf6mv7kml8j8m.jpg",
    bio: "Especialista en evaluación de oportunidades y operación de negocios en el mercado estadounidense.",
  },
];

/* ─── images ─── */
const IMG_HERO      = "https://lh3.googleusercontent.com/d/1gnZX2RiYD4M29nQmqwcsN0k13db74LmV=w1920";
const IMG_AUDIENCE  = "https://res.cloudinary.com/dofccqypz/image/upload/v1774537564/comprando-america/eventos/uefjxoxi5trojtoeivha.jpg";
const IMG_PROPERTY  = "https://res.cloudinary.com/dofccqypz/image/upload/v1774537570/comprando-america/eventos/vjyyrtfskd3w7nmklbt3.jpg";
const IMG_STAGE     = "https://lh3.googleusercontent.com/d/1RK1ICQKrETpZBFYH_NoZmnYzMULHREYu=w1920";

const PAGE_SEO = {
  title: "Primera Cumbre Digital | Comprando América",
  description:
    "Por primera vez abrimos la Cumbre sin costo y en vivo. Sábado 22 de agosto 2026, 10 AM–3 PM México. Estrategia, inversión y expansión a Estados Unidos.",
  path: "/cumbre-digital",
};

export default function CumbreDigital() {
  const [formData, setFormData] = useState({ nombreCompleto: "", countryCode: "+52", whatsapp: "", email: "" });
  const [submitted, setSubmitted] = useState(false);

  const registerMutation = trpc.leads.create.useMutation({
    onSuccess: () => { setSubmitted(true); toast.success("¡Registro exitoso! Te esperamos el 22 de agosto."); },
    onError: (err) => { toast.error(err.message || "Ocurrió un error. Intenta de nuevo."); },
  });

  const scrollToForm = () => document.getElementById("registro")?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombreCompleto.trim()) { toast.error("Por favor ingresa tu nombre completo."); return; }
    if (!formData.whatsapp.trim())       { toast.error("Por favor ingresa tu número de WhatsApp."); return; }
    if (!formData.email.includes("@"))   { toast.error("Por favor ingresa un correo electrónico válido."); return; }
    registerMutation.mutate({
      nombreCompleto: formData.nombreCompleto.trim(),
      whatsapp: `${formData.countryCode.replace("CA", "")} ${formData.whatsapp.trim()}`,
      email: formData.email.trim(),
      fuente: "cumbre-digital",
    });
  };

  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white overflow-x-hidden">
      <SEOHead {...PAGE_SEO} />
      <Navbar />

      {/* ═══════════════════════════════════════════
          HERO — pantalla completa con imagen de fondo
      ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img src={IMG_HERO} alt="" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1F3A]/80 via-[#0B1F3A]/70 to-[#0B1F3A]" />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative container max-w-4xl mx-auto px-4 pt-28 pb-20 text-center">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/40 text-primary text-sm font-medium px-4 py-2 rounded-full mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Sábado 22 de agosto, 2026 · Transmisión en vivo
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">
            Primera Cumbre Digital · Comprando América
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
            className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Por primera vez<br />
            <span className="text-primary">abrimos la Cumbre.</span><br />
            Sin costo. En vivo.
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
            className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Durante años nuestra Cumbre de Inversiones se vivió solo de forma presencial y con cupo limitado.
            Este 22 de agosto la abrimos por primera vez: el mismo nivel de contenido, los mismos expertos —
            ahora en vivo y desde donde estés.
          </motion.p>

          {/* Value pills */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              { icon: <CheckCircle2 className="w-4 h-4" />, text: "Antes costaba $549 USD" },
              { icon: <CheckCircle2 className="w-4 h-4" />, text: "Hoy es 100% gratis" },
              { icon: <CheckCircle2 className="w-4 h-4" />, text: "Solo por primera vez en digital" },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/15 backdrop-blur px-4 py-2.5 rounded-xl text-sm text-slate-200">
                <span className="text-primary">{p.icon}</span>
                {p.text}
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Button onClick={scrollToForm} size="lg"
              className="bg-primary hover:bg-blue-500 text-white font-bold px-10 py-4 text-base rounded-xl">
              Reserva tu lugar gratis
            </Button>
          </motion.div>

          {/* Meta chips */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
            className="flex flex-wrap justify-center gap-4 text-slate-400 text-sm mb-12">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" />10 AM – 3 PM México · 11 AM – 4 PM Houston</span>
            <span className="flex items-center gap-1.5"><Wifi className="w-4 h-4 text-primary" />100% digital y gratuito</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" />Producción en Houston, TX</span>
          </motion.div>

          {/* Platforms */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-6 text-slate-400 text-sm">
            <span>En vivo por:</span>
            <span className="flex items-center gap-1.5 text-white"><Youtube className="w-5 h-5 text-red-500" />YouTube</span>
            <span className="flex items-center gap-1.5 text-white"><Facebook className="w-5 h-5 text-blue-400" />Facebook Live</span>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/30">
          <ChevronDown className="w-6 h-6" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECCIÓN 2 — Por qué asistir (3 ángulos)
      ═══════════════════════════════════════════ */}
      <section className="bg-[#0a1b33] py-24">
        <div className="container max-w-6xl mx-auto px-4">
          <FadeIn className="text-center mb-16">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">6 horas que podrían ahorrarte años</p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-5 leading-tight">
              Invertir en Estados Unidos<br className="hidden md:block" /> no es difícil.<br />
              <span className="text-primary">Difícil es hacerlo bien.</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Muchos empresarios no fracasan por falta de capital, sino por tomar decisiones sin contexto.
              En esta cumbre obtienes claridad, estrategia y acceso a expertos que ya invierten y operan en Estados Unidos.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16">
            <FadeIn>
              <img src={IMG_AUDIENCE} alt="Cumbre presencial Comprando América"
                className="rounded-2xl w-full h-72 object-cover shadow-2xl shadow-black/40" />
            </FadeIn>
            <div className="space-y-6">
              {[
                { title: "El problema no es falta de dinero.", body: "Es la falta de criterio, contexto y la red correcta. La mayoría pierde en Estados Unidos porque tomó decisiones sin información real del mercado." },
                { title: "No es un webinar de venta.", body: "Es información real de empresarios que ya operan: cómo piensan, qué revisan y qué evitan antes de invertir o mover su patrimonio. Sin hype. Sin promesas." },
                { title: "Una mañana puede cambiar tu perspectiva.", body: "En 6 horas descubrirás cómo empresarios que ya tienen presencia en EE.UU. evalúan oportunidades, protegen patrimonio y toman mejores decisiones." },
              ].map((item, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECCIÓN 3 — Imagen destacada con cita
      ═══════════════════════════════════════════ */}
      <section className="relative py-32 overflow-hidden">
        <img src={IMG_STAGE} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#0B1F3A]/85" />
        <div className="relative container max-w-3xl mx-auto px-4 text-center">
          <FadeIn>
            <div className="text-5xl mb-6 opacity-30">"</div>
            <p className="font-serif text-2xl md:text-3xl text-white leading-relaxed mb-6">
              La mesa donde se habla en serio de invertir en Estados Unidos.
            </p>
            <p className="text-slate-300 text-lg max-w-xl mx-auto mb-8">
              Un solo día, en vivo: estrategia migratoria, estructura fiscal y algunas de las oportunidades de inversión
              que estamos analizando en Estados Unidos. Con Edmundo Treviño, Tomás Reséndez y el equipo de Comprando América.
            </p>
            <Button onClick={scrollToForm} variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-xl font-semibold gap-2">
              Regístrate gratis <ChevronRight className="w-4 h-4" />
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECCIÓN 4 — Qué puedes encontrar (teaser)
      ═══════════════════════════════════════════ */}
      <section className="bg-[#0B1F3A] py-24">
        <div className="container max-w-5xl mx-auto px-4">
          <FadeIn className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Programa del día</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Qué puedes encontrar</h2>
            <div className="flex flex-wrap justify-center gap-3 text-sm text-slate-400 mb-4">
              <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4 text-primary" />Sábado 22 de agosto, 2026</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-primary" />10 AM – 3 PM México</span>
            </div>
            <p className="text-slate-500 text-sm">
              <Lock className="w-3.5 h-3.5 inline mr-1" />Agenda completa disponible próximamente
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEMAS.map((tema, i) => (
              <FadeIn key={i} delay={i * 0.07}>
                <div className="bg-[#0a1b33] border border-white/10 rounded-2xl p-6 h-full hover:border-primary/30 transition-colors group">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                    {tema.icon}
                  </div>
                  <h3 className="text-white font-semibold text-sm leading-snug mb-2">{tema.titulo}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{tema.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Imagen de contexto */}
          <FadeIn className="mt-12">
            <div className="relative rounded-2xl overflow-hidden h-64">
              <img src={IMG_PROPERTY} alt="Inversiones en Estados Unidos"
                className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/80 to-transparent flex items-center px-10">
                <div>
                  <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Sin hype. Sin promesas.</p>
                  <p className="font-serif text-2xl text-white font-bold max-w-sm">Información real para decidir mejor.</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECCIÓN 5 — Speakers (teaser)
      ═══════════════════════════════════════════ */}
      <section className="bg-[#07152a] py-24">
        <div className="container max-w-5xl mx-auto px-4">
          <FadeIn className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Quiénes estarán</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Los expertos detrás de la cumbre</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Empresarios y especialistas que ya operan en Estados Unidos. No teóricos — gente que evalúa,
              invierte y construye en el mercado americano.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {SPEAKERS.map((s, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-[#0B1F3A] border border-white/10 rounded-2xl overflow-hidden">
                  <div className="relative h-56 bg-[#0a1b33]">
                    <img src={s.photo} alt={s.name}
                      className="w-full h-full object-cover object-top" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-white font-bold text-lg mb-0.5">{s.name}</h3>
                    <p className="text-primary text-xs font-semibold mb-2">{s.role}</p>
                    <p className="text-slate-400 text-xs leading-relaxed">{s.bio}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-3 rounded-xl text-slate-400 text-sm">
              <Users className="w-4 h-4 text-primary" />
              + speaker adicional por confirmar
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECCIÓN 6 — Formulario de registro
      ═══════════════════════════════════════════ */}
      <section id="registro" className="bg-white py-24 scroll-mt-20">
        <div className="container max-w-xl mx-auto px-4">
          <FadeIn className="text-center mb-10">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Asegura tu lugar</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-3">Pre-registro gratuito</h2>
            <p className="text-gray-500">
              Si llevas tiempo considerando dar el paso hacia Estados Unidos, esta es tu oportunidad de
              escuchar a quienes ya lo hicieron — sin costo y desde donde estés.
            </p>
          </FadeIn>

          {submitted ? (
            <FadeIn>
              <div className="bg-gray-50 border border-primary/20 rounded-2xl p-10 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">¡Ya estás registrado!</h3>
                <p className="text-gray-600 mb-2">Te esperamos el sábado 22 de agosto.</p>
                <p className="text-gray-400 text-sm mb-6">Recibirás el link de transmisión por WhatsApp y correo electrónico.</p>
                <div className="flex justify-center gap-5 text-sm text-gray-400">
                  <span className="flex items-center gap-1.5"><Youtube className="w-4 h-4 text-red-500" />YouTube</span>
                  <span className="flex items-center gap-1.5"><Facebook className="w-4 h-4 text-blue-400" />Facebook Live</span>
                </div>
              </div>
            </FadeIn>
          ) : (
            <FadeIn>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Nombre */}
                  <div>
                    <Label className="text-gray-700 text-sm mb-1.5 block">
                      Nombre completo <span className="text-primary">*</span>
                    </Label>
                    <Input value={formData.nombreCompleto}
                      onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                      className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary h-11"
                      placeholder="Tu nombre y apellido" required />
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <Label className="text-gray-700 text-sm mb-1.5 block">
                      WhatsApp <span className="text-primary">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <div className="relative flex-shrink-0">
                        <select value={formData.countryCode}
                          onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                          className="appearance-none bg-white border border-gray-300 text-gray-900 text-sm rounded-md px-3 pr-8 h-11 focus:border-primary focus:outline-none cursor-pointer">
                          {COUNTRY_CODES.map((c, i) => (
                            <option key={i} value={c.code}>{c.label}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                      </div>
                      <Input type="tel" value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary h-11 flex-1"
                        placeholder="123 456 7890" required />
                    </div>
                    <p className="text-gray-400 text-xs mt-1.5">Usaremos este número para enviarte el link del evento.</p>
                  </div>

                  {/* Email */}
                  <div>
                    <Label className="text-gray-700 text-sm mb-1.5 block">
                      Correo electrónico <span className="text-primary">*</span>
                    </Label>
                    <Input type="email" value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-primary h-11"
                      placeholder="tu@correo.com" required />
                  </div>

                  <Button type="submit" disabled={registerMutation.isPending}
                    className="w-full bg-primary hover:bg-blue-500 text-white font-bold py-3 text-base gap-2 h-12 rounded-xl">
                    {registerMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Registrando...
                      </span>
                    ) : (
                      <><Send className="w-4 h-4" />Registrarme gratis</>
                    )}
                  </Button>

                  <p className="text-gray-400 text-xs text-center">
                    Al registrarte aceptas recibir comunicaciones de Comprando América relacionadas con este evento.
                  </p>
                </form>
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
