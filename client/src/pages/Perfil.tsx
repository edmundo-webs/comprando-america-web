import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useInView } from "@/hooks/useInView";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Animated wrapper ───
function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
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

// ─── Types ───
interface FormAnswers {
  objetivo: string;
  etapa: string;
  tipoInversionista: string;
  capacidad: string;
  residencia: string;
  importanciaRed: string;
  ingresoAnual: string;
}

interface ScoringResult {
  score: number;
  level: "high" | "medium" | "low";
  message: string;
  cta: string;
  link?: string;
}

export default function Perfil() {
  const [step, setStep] = useState<"form" | "processing" | "result">("form");
  const [answers, setAnswers] = useState<FormAnswers>({
    objetivo: "",
    etapa: "",
    tipoInversionista: "",
    capacidad: "",
    residencia: "",
    importanciaRed: "",
    ingresoAnual: "",
  });
  const [scoringResult, setScoringResult] = useState<ScoringResult | null>(null);

  // ─── Scoring System ───
  const calculateScore = (formAnswers: FormAnswers): ScoringResult => {
    let score = 0;

    // Objetivo de inversión
    const objetivoScores: Record<string, number> = {
      "diversificar": 20,
      "expandir": 20,
      "ingresos": 15,
      "migracion": 15,
      "conocer": 5,
    };
    score += objetivoScores[formAnswers.objetivo] || 0;

    // Etapa de inversión
    const etapaScores: Record<string, number> = {
      "analizando": 25,
      "12meses": 20,
      "1-2anos": 10,
      "explorando": 5,
      "yainvirtio": 20,
    };
    score += etapaScores[formAnswers.etapa] || 0;

    // Tipo de inversionista
    const tipoScores: Record<string, number> = {
      "operador": 20,
      "estrategico": 15,
      "pasivo": 10,
      "explorando": 5,
    };
    score += tipoScores[formAnswers.tipoInversionista] || 0;

    // Capacidad de inversión
    const capacidadScores: Record<string, number> = {
      "1m": 30,
      "500k-1m": 25,
      "250k-500k": 20,
      "100k-250k": 15,
    };
    score += capacidadScores[formAnswers.capacidad] || 0;

    // Importancia de comunidad
    const importanciaScores: Record<string, number> = {
      "muy": 15,
      "importante": 10,
      "interesante": 5,
      "explorando": 2,
    };
    score += importanciaScores[formAnswers.importanciaRed] || 0;

    // Determinar nivel y mensaje
    let level: "high" | "medium" | "low";
    let message: string;
    let cta: string;
    let link: string | undefined;

    if (score > 90) {
      level = "high";
      message = "Tu perfil es compatible con oportunidades dentro de Comprando América.";
      cta = "Agendar llamada estratégica";
      link = "https://calendly.com/diegoalcalamo10/30min?month=2025-02";
    } else if (score >= 60) {
      level = "medium";
      message = "Tu perfil puede ser compatible con oportunidades dentro de Comprando América. Te recomendamos comenzar con nuestro contenido educativo.";
      cta = "Ver presentación";
      link = "https://comprandoamerica.com/formacion/";
    } else {
      level = "low";
      message = "Te recomendamos comenzar con nuestros recursos educativos antes de evaluar oportunidades de inversión.";
      cta = "Explorar recursos";
      link = "https://comprandoamerica.com/formacion/";
    }

    return { score, level, message, cta, link };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que todas las preguntas estén respondidas
    if (
      !answers.objetivo ||
      !answers.etapa ||
      !answers.tipoInversionista ||
      !answers.capacidad ||
      !answers.residencia ||
      !answers.importanciaRed ||
      !answers.ingresoAnual
    ) {
      toast.error("Por favor responde todas las preguntas");
      return;
    }

    // Mostrar pantalla de procesamiento
    setStep("processing");

    // Simular procesamiento
    setTimeout(() => {
      const result = calculateScore(answers);
      setScoringResult(result);
      setStep("result");
    }, 2000);
  };

  const handleAnswerChange = (field: keyof FormAnswers, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {step === "form" && (
        <>
          {/* ═══ HERO CON VIDEO ═══ */}
          <section className="relative min-h-screen flex items-center pt-28 pb-20 bg-gradient-to-b from-[oklch(0.12_0.03_250)] to-[oklch(0.10_0.03_250)]">
            <div className="container relative z-10">
              <FadeIn>
                <div className="max-w-3xl mx-auto text-center mb-12">
                  <div className="mb-12">
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black max-w-2xl mx-auto">
                      <video
                        src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663291837994/YalfpoAHGGBHORwE.mp4"
                        controls
                        className="w-full h-auto"
                        poster="https://files.manuscdn.com/user_upload_by_module/session_file/310519663291837994/YalfpoAHGGBHORwE.mp4"
                      />
                    </div>
                  </div>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-[1.1] mb-6">
                    Acceso a la Comunidad de Inversionistas{" "}
                    <span className="gradient-text-primary">Comprando América</span>
                  </h1>
                  <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-10">
                    Conecta con empresarios e inversionistas que están adquiriendo negocios y construyendo patrimonio en Estados Unidos.
                  </p>
                  <a href="#formulario">
                    <Button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base gap-2">
                      Evaluar mi perfil de inversionista <ArrowRight className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </FadeIn>
            </div>
          </section>

          {/* ═══ EXPLICACIÓN DE COMUNIDAD ═══ */}
          <section className="section-darker py-24 md:py-32">
            <div className="container">
              <FadeIn>
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
                    ¿Qué es Comprando América?
                  </h2>
                  <p className="text-lg text-white/70 leading-relaxed mb-8">
                    Comprando América es una comunidad privada de empresarios e inversionistas que buscan expandir su patrimonio y adquirir oportunidades de negocio en Estados Unidos.
                  </p>
                  <p className="text-lg text-white/70 leading-relaxed mb-8">
                    Dentro de la comunidad tendrás acceso a:
                  </p>
                  <ul className="space-y-4">
                    {[
                      "Oportunidades de inversión previamente evaluadas",
                      "Eventos privados con empresarios",
                      "Mentoría estratégica para invertir en Estados Unidos",
                      "Red de expertos en estructura fiscal, legal y operativa",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-white/70">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            </div>
          </section>

          {/* ═══ FILTRO PSICOLÓGICO ═══ */}
          <section className="section-dark py-24 md:py-32">
            <div className="container">
              <FadeIn>
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
                    ¿Quién suele ser miembro de Comprando América?
                  </h2>
                  <p className="text-lg text-white/70 leading-relaxed mb-8">
                    Empresarios e inversionistas que:
                  </p>
                  <ul className="space-y-4">
                    {[
                      "Buscan diversificar su patrimonio en Estados Unidos",
                      "Cuentan con capital disponible desde $100,000 dólares",
                      "Desean acceso a oportunidades previamente evaluadas",
                      "Valoran una red empresarial confiable",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-white/70">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            </div>
          </section>

          {/* ═══ FORMULARIO ═══ */}
          <section id="formulario" className="section-darker py-24 md:py-32">
            <div className="container">
              <FadeIn>
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
                      Evaluación de Perfil de Inversionista
                    </h2>
                    <p className="text-lg text-white/70 leading-relaxed mb-2">
                      Antes de compartir información sobre la membresía Comprando América, nuestro equipo revisa si el perfil del empresario o inversionista está alineado con las oportunidades que trabajamos dentro de la comunidad.
                    </p>
                    <p className="text-base text-white/60">
                      Este proceso toma menos de 60 segundos.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8 bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-2xl p-8">
                    {/* Pregunta 1 */}
                    <div>
                      <label className="block text-lg font-semibold text-white mb-4">
                        1. ¿Cuál es tu principal objetivo al invertir en Estados Unidos?
                      </label>
                      <div className="space-y-3">
                        {[
                          { value: "diversificar", label: "Diversificar mi patrimonio en Estados Unidos" },
                          { value: "expandir", label: "Expandir mi empresa al mercado estadounidense" },
                          { value: "ingresos", label: "Generar ingresos pasivos en dólares" },
                          { value: "migracion", label: "Evaluar opciones migratorias mediante inversión" },
                          { value: "conocer", label: "Conocer oportunidades de compra de negocios" },
                        ].map((option) => (
                          <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="objetivo"
                              value={option.value}
                              checked={answers.objetivo === option.value}
                              onChange={(e) => handleAnswerChange("objetivo", e.target.value)}
                              className="w-4 h-4"
                            />
                            <span className="text-white/70">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Pregunta 2 */}
                    <div>
                      <label className="block text-lg font-semibold text-white mb-4">
                        2. ¿En qué etapa te encuentras actualmente?
                      </label>
                      <div className="space-y-3">
                        {[
                          { value: "explorando", label: "Explorando oportunidades" },
                          { value: "12meses", label: "Planeando invertir en los próximos 12 meses" },
                          { value: "1-2anos", label: "Planeando invertir en los próximos 1-2 años" },
                          { value: "analizando", label: "Analizando oportunidades activamente" },
                          { value: "yainvirtio", label: "Ya he realizado inversiones en Estados Unidos" },
                        ].map((option) => (
                          <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="etapa"
                              value={option.value}
                              checked={answers.etapa === option.value}
                              onChange={(e) => handleAnswerChange("etapa", e.target.value)}
                              className="w-4 h-4"
                            />
                            <span className="text-white/70">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Pregunta 3 */}
                    <div>
                      <label className="block text-lg font-semibold text-white mb-4">
                        3. ¿Qué tipo de inversionista eres?
                      </label>
                      <div className="space-y-3">
                        {[
                          { value: "pasivo", label: "Inversionista pasivo (solo capital)" },
                          { value: "estrategico", label: "Inversionista estratégico" },
                          { value: "operador", label: "Inversionista operador" },
                          { value: "explorando", label: "Aún estoy explorando" },
                        ].map((option) => (
                          <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="tipoInversionista"
                              value={option.value}
                              checked={answers.tipoInversionista === option.value}
                              onChange={(e) => handleAnswerChange("tipoInversionista", e.target.value)}
                              className="w-4 h-4"
                            />
                            <span className="text-white/70">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Pregunta 4 */}
                    <div>
                      <label className="block text-lg font-semibold text-white mb-4">
                        4. ¿Qué capacidad de inversión podrías destinar?
                      </label>
                      <div className="space-y-3">
                        {[
                          { value: "100k-250k", label: "$100,000 – $250,000 dólares" },
                          { value: "250k-500k", label: "$250,000 – $500,000 dólares" },
                          { value: "500k-1m", label: "$500,000 – $1,000,000 dólares" },
                          { value: "1m", label: "Más de $1,000,000 dólares" },
                        ].map((option) => (
                          <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="capacidad"
                              value={option.value}
                              checked={answers.capacidad === option.value}
                              onChange={(e) => handleAnswerChange("capacidad", e.target.value)}
                              className="w-4 h-4"
                            />
                            <span className="text-white/70">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Pregunta 5 */}
                    <div>
                      <label className="block text-lg font-semibold text-white mb-4">
                        5. ¿Dónde resides actualmente?
                      </label>
                      <select
                        value={answers.residencia}
                        onChange={(e) => handleAnswerChange("residencia", e.target.value)}
                        className="w-full bg-[oklch(0.10_0.03_250)] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                      >
                        <option value="">Selecciona tu ciudad</option>
                        {[
                          "Ciudad de México",
                          "Monterrey",
                          "Guadalajara",
                          "Mérida",
                          "Cancún",
                          "Tampico",
                          "Estados Unidos",
                          "Otro",
                        ].map((city) => (
                          <option key={city} value={city.toLowerCase()}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Pregunta 6 */}
                    <div>
                      <label className="block text-lg font-semibold text-white mb-4">
                        6. ¿Qué tan importante es para ti tener acceso a oportunidades filtradas y una red de empresarios en Estados Unidos?
                      </label>
                      <div className="space-y-3">
                        {[
                          { value: "muy", label: "Muy importante" },
                          { value: "importante", label: "Importante" },
                          { value: "interesante", label: "Interesante pero no urgente" },
                          { value: "explorando", label: "Solo estoy explorando" },
                        ].map((option) => (
                          <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="importanciaRed"
                              value={option.value}
                              checked={answers.importanciaRed === option.value}
                              onChange={(e) => handleAnswerChange("importanciaRed", e.target.value)}
                              className="w-4 h-4"
                            />
                            <span className="text-white/70">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Pregunta 7 */}
                    <div>
                      <label className="block text-lg font-semibold text-white mb-4">
                        7. ¿Cuál es tu ingreso anual aproximado?
                      </label>
                      <div className="space-y-3">
                        {[
                          { value: "100k-250k", label: "$100k – $250k" },
                          { value: "250k-500k", label: "$250k – $500k" },
                          { value: "500k-1m", label: "$500k – $1M" },
                          { value: "1m", label: "Más de $1M" },
                        ].map((option) => (
                          <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name="ingresoAnual"
                              value={option.value}
                              checked={answers.ingresoAnual === option.value}
                              onChange={(e) => handleAnswerChange("ingresoAnual", e.target.value)}
                              className="w-4 h-4"
                            />
                            <span className="text-white/70">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Botón Submit */}
                    <div className="pt-6 border-t border-white/10">
                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-6 text-base"
                      >
                        Evaluar mi perfil
                      </Button>
                      <p className="text-center text-white/50 text-sm mt-4">
                        Nuestro equipo revisará tu perfil para determinar si la Membresía Comprando América es adecuada para tus objetivos.
                      </p>
                    </div>
                  </form>
                </div>
              </FadeIn>
            </div>
          </section>
        </>
      )}

      {step === "processing" && (
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[oklch(0.12_0.03_250)] to-[oklch(0.10_0.03_250)]">
          <div className="container">
            <FadeIn>
              <div className="max-w-2xl mx-auto text-center">
                <div className="mb-8">
                  <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto" />
                </div>
                <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
                  Evaluando tu perfil…
                </h2>
                <p className="text-lg text-white/70 leading-relaxed mb-8">
                  Tu perfil está siendo revisado por nuestro equipo.
                </p>
                <p className="text-lg text-white/70 leading-relaxed">
                  Si tu perfil es compatible con la comunidad Comprando América, recibirás información para acceder a:
                </p>
                <ul className="mt-6 space-y-3 max-w-md mx-auto">
                  {[
                    "Oportunidades de inversión filtradas",
                    "Eventos privados con empresarios",
                    "Mentoría estratégica",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 justify-center">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-white/70">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {step === "result" && scoringResult && (
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[oklch(0.12_0.03_250)] to-[oklch(0.10_0.03_250)]">
          <div className="container">
            <FadeIn>
              <div className="max-w-2xl mx-auto text-center">
                <div className="mb-8">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${
                    scoringResult.level === "high" ? "bg-emerald/20" : scoringResult.level === "medium" ? "bg-yellow-500/20" : "bg-red-500/20"
                  }`}>
                    <CheckCircle2 className={`w-12 h-12 ${
                      scoringResult.level === "high" ? "text-emerald-400" : scoringResult.level === "medium" ? "text-yellow-400" : "text-red-400"
                    }`} />
                  </div>
                </div>

                <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
                  Tu Perfil ha sido Evaluado
                </h2>

                <div className="mb-8 p-6 bg-[oklch(0.15_0.03_250)] border border-white/10 rounded-2xl">
                  <p className="text-2xl font-semibold text-primary mb-4">
                    Score: {scoringResult.score}/120
                  </p>
                  <p className="text-lg text-white/70 leading-relaxed">
                    {scoringResult.message}
                  </p>
                </div>

                {scoringResult.link && (
                  <a href={scoringResult.link} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base gap-2">
                      {scoringResult.cta} <ArrowRight className="w-4 h-4" />
                    </Button>
                  </a>
                )}

                <p className="text-white/50 text-sm mt-8">
                  ¿Preguntas? Contáctanos en contact@comprandoamerica.com
                </p>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
