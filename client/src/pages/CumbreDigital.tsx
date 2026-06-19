import { useState } from "react";
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
  Play,
  Send,
  Youtube,
  Facebook,
  Globe,
  ChevronDown,
} from "lucide-react";

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

const COUNTRY_CODES = [
  { code: "+52", label: "🇲🇽 México (+52)" },
  { code: "+1", label: "🇺🇸 EE.UU. (+1)" },
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
  { code: "+1", label: "🇨🇦 Canadá (+1)" },
];

const AGENDA = [
  {
    hora: "10:00 AM",
    titulo: "Apertura: Cómo crear oportunidades desde Estados Unidos",
    speaker: "Edmundo Treviño",
  },
  {
    hora: "10:45 AM",
    titulo: "Opciones migratorias reales para inversionistas (entorno actual)",
    speaker: "Tomás",
  },
  {
    hora: "11:30 AM",
    titulo: "Oportunidades de inversión en Estados Unidos (Parte I)",
    speaker: "Edmundo / Diego",
  },
  {
    hora: "12:30 PM",
    titulo: "Bloque experto: speaker especial",
    speaker: "Por confirmar",
  },
  {
    hora: "1:30 PM",
    titulo: "Oportunidades de inversión + casos reales",
    speaker: "Diego / Edmundo",
  },
  {
    hora: "2:30 PM",
    titulo: "Cierre: qué es Comprando América y próximos pasos",
    speaker: "Edmundo + Diego",
  },
];

const PAGE_SEO = {
  title: "Primera Cumbre Digital | Comprando América",
  description:
    "Regístrate gratis a la Primera Cumbre Digital de Comprando América. Sábado 22 de agosto 2026, 10 AM Houston / 9 AM México. Transmisión en vivo por YouTube y Facebook.",
  path: "/cumbre-digital",
};

export default function CumbreDigital() {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    countryCode: "+52",
    whatsapp: "",
    email: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const scrollToForm = () => {
    document.getElementById("registro")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombreCompleto.trim()) {
      toast.error("Por favor ingresa tu nombre completo.");
      return;
    }
    if (!formData.whatsapp.trim()) {
      toast.error("Por favor ingresa tu número de WhatsApp.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Por favor ingresa un correo electrónico válido.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
    toast.success("¡Registro exitoso! Te esperamos el 22 de agosto.");
  };

  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white overflow-x-hidden">
      <SEOHead {...PAGE_SEO} />
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="relative pt-24 pb-0 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3A] via-[#0d2545] to-[#071628]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(37,99,235,0.15)_0%,_transparent_60%)]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative container max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary text-sm font-medium px-4 py-2 rounded-full mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Transmisión en vivo · Gratuita
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-primary font-semibold uppercase tracking-widest text-sm mb-3"
          >
            Primera Cumbre Digital
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            Cumbre Digital{" "}
            <span className="text-primary">Comprando América</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Por primera vez abrimos la cumbre sin costo y en vivo. El mismo nivel de expertos y contenido de siempre —{" "}
            <span className="text-white font-semibold">ahora accesible para todos.</span>
          </motion.p>

          {/* Event details chips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-slate-200">
              <CalendarDays className="w-4 h-4 text-primary flex-shrink-0" />
              Sábado 22 de agosto, 2026
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-slate-200">
              <Clock className="w-4 h-4 text-primary flex-shrink-0" />
              10:00 AM Houston · 9:00 AM México
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-slate-200">
              <Wifi className="w-4 h-4 text-primary flex-shrink-0" />
              100% digital y gratuito
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-sm text-slate-200">
              <Globe className="w-4 h-4 text-primary flex-shrink-0" />
              Producción presencial en Houston, TX
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button
              onClick={scrollToForm}
              size="lg"
              className="bg-primary hover:bg-blue-500 text-white font-bold px-8 py-4 text-base rounded-xl gap-2"
            >
              <Play className="w-4 h-4" />
              Regístrate gratis
            </Button>
          </motion.div>

          {/* Live platforms */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex items-center justify-center gap-6 pb-16 text-slate-400 text-sm"
          >
            <span>Transmisión en vivo por:</span>
            <div className="flex items-center gap-2 text-white">
              <Youtube className="w-5 h-5 text-red-500" />
              YouTube
            </div>
            <div className="flex items-center gap-2 text-white">
              <Facebook className="w-5 h-5 text-blue-400" />
              Facebook
            </div>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="relative h-16 bg-gradient-to-b from-transparent to-[#0a1b33]" />
      </section>

      {/* ═══ QUÉ ES ═══ */}
      <section className="bg-[#0a1b33] py-20">
        <div className="container max-w-5xl mx-auto px-4">
          <FadeIn className="text-center mb-14">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              ¿Qué es la Cumbre Digital?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Nuestra primera cumbre 100% gratuita y en vivo. Contenido que antes costaba{" "}
              <span className="text-white font-semibold line-through opacity-60">$549 USD</span>{" "}
              —ahora abierto para todos.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <CheckCircle2 className="w-6 h-6 text-primary" />,
                titulo: "Conocimiento real",
                desc: "No es un webinar de venta. Es contenido de valor con expertos que operan en el mercado americano.",
              },
              {
                icon: <CheckCircle2 className="w-6 h-6 text-primary" />,
                titulo: "Oportunidades concretas",
                desc: "Presentamos proyectos y oportunidades de inversión actuales en Estados Unidos.",
              },
              {
                icon: <CheckCircle2 className="w-6 h-6 text-primary" />,
                titulo: "Sin barreras",
                desc: "Sin costo, sin viaje, sin requisitos. Solo necesitas internet para asistir.",
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-[#0B1F3A] border border-white/10 rounded-2xl p-6 h-full">
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="text-white font-semibold text-lg mb-2">{item.titulo}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ AGENDA ═══ */}
      <section className="bg-[#0B1F3A] py-20">
        <div className="container max-w-4xl mx-auto px-4">
          <FadeIn className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">
              Programa del día
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold">
              Agenda · 22 de agosto
            </h2>
            <p className="text-slate-400 mt-3">
              10:00 AM – 3:00 PM (Houston) · 9:00 AM – 2:00 PM (México)
            </p>
          </FadeIn>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[88px] top-0 bottom-0 w-px bg-white/10 hidden md:block" />

            <div className="space-y-4">
              {AGENDA.map((item, i) => (
                <FadeIn key={i} delay={i * 0.08}>
                  <div className="flex gap-4 md:gap-8 items-start">
                    {/* Time */}
                    <div className="flex-shrink-0 w-20 text-right hidden md:block">
                      <span className="text-primary font-mono text-sm font-semibold">
                        {item.hora}
                      </span>
                    </div>

                    {/* Dot */}
                    <div className="hidden md:flex flex-shrink-0 items-start pt-1.5">
                      <div className="w-3 h-3 rounded-full bg-primary border-2 border-[#0B1F3A] ring-2 ring-primary/30 z-10" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-[#0a1b33] border border-white/10 rounded-xl p-4 md:p-5">
                      <div className="md:hidden text-primary font-mono text-xs font-semibold mb-1">
                        {item.hora}
                      </div>
                      <h3 className="text-white font-semibold leading-snug mb-1">
                        {item.titulo}
                      </h3>
                      <p className="text-slate-400 text-sm">{item.speaker}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FORMULARIO ═══ */}
      <section id="registro" className="bg-[#07152a] py-20 scroll-mt-20">
        <div className="container max-w-xl mx-auto px-4">
          <FadeIn className="text-center mb-10">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-2">
              Asegura tu lugar
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">
              Pre-registro gratuito
            </h2>
            <p className="text-slate-400">
              Regístrate para recibir el link de transmisión y recordatorios del evento.
            </p>
          </FadeIn>

          {submitted ? (
            <FadeIn>
              <div className="bg-[#0B1F3A] border border-primary/30 rounded-2xl p-10 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-3">
                  ¡Ya estás registrado!
                </h3>
                <p className="text-slate-400 mb-2">
                  Te esperamos el sábado 22 de agosto.
                </p>
                <p className="text-slate-400 text-sm">
                  Recibirás el link de transmisión por WhatsApp y correo electrónico.
                </p>
                <div className="mt-6 flex justify-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Youtube className="w-4 h-4 text-red-500" />
                    YouTube
                  </div>
                  <div className="flex items-center gap-2">
                    <Facebook className="w-4 h-4 text-blue-400" />
                    Facebook Live
                  </div>
                </div>
              </div>
            </FadeIn>
          ) : (
            <FadeIn>
              <div className="bg-[#0B1F3A] border border-white/10 rounded-2xl p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Nombre completo */}
                  <div>
                    <Label className="text-white/70 text-sm mb-1.5 block">
                      Nombre completo <span className="text-primary">*</span>
                    </Label>
                    <Input
                      value={formData.nombreCompleto}
                      onChange={(e) =>
                        setFormData({ ...formData, nombreCompleto: e.target.value })
                      }
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary h-11"
                      placeholder="Tu nombre y apellido"
                      required
                    />
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <Label className="text-white/70 text-sm mb-1.5 block">
                      WhatsApp <span className="text-primary">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <div className="relative flex-shrink-0">
                        <select
                          value={formData.countryCode}
                          onChange={(e) =>
                            setFormData({ ...formData, countryCode: e.target.value })
                          }
                          className="appearance-none bg-white/5 border border-white/10 text-white text-sm rounded-md px-3 pr-8 h-11 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                        >
                          {COUNTRY_CODES.map((c, i) => (
                            <option
                              key={i}
                              value={c.code}
                              className="bg-[#0B1F3A] text-white"
                            >
                              {c.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 pointer-events-none" />
                      </div>
                      <Input
                        type="tel"
                        value={formData.whatsapp}
                        onChange={(e) =>
                          setFormData({ ...formData, whatsapp: e.target.value })
                        }
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary h-11 flex-1"
                        placeholder="123 456 7890"
                        required
                      />
                    </div>
                    <p className="text-white/30 text-xs mt-1.5">
                      Incluye el código de país — usaremos este número para enviarte el link del evento.
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <Label className="text-white/70 text-sm mb-1.5 block">
                      Correo electrónico <span className="text-primary">*</span>
                    </Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary h-11"
                      placeholder="tu@correo.com"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-blue-500 text-white font-bold py-3 text-base gap-2 h-12 rounded-xl"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Registrando...
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Registrarme gratis
                      </>
                    )}
                  </Button>

                  <p className="text-white/30 text-xs text-center">
                    Al registrarte aceptas recibir comunicaciones de Comprando América
                    relacionadas con este evento.
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
