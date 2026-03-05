import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useInView } from "@/hooks/useInView";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Loader2, Building2, TrendingUp, Users } from "lucide-react";
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
  listoParaInvertir?: string;
}

interface ScoringResult {
  score: number;
  profileType: "operador" | "patrimonial" | "explorador";
  message: string;
  benefits: string[];
  cta: string;
  link?: string;
  readinessLevel: string;
  readinessPercentage: number;
}

export default function Perfil() {
  const [step, setStep] = useState<"form" | "processing" | "result" | "microcommitment">("form");
  const [currentStep, setCurrentStep] = useState(1);
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

    // Determinar perfil y mensaje
    let profileType: "operador" | "patrimonial" | "explorador";
    let message: string;
    let benefits: string[];
    let cta: string;
    let link: string | undefined;
    let readinessLevel: string;
    let readinessPercentage: number;

    if (formAnswers.tipoInversionista === "operador") {
      profileType = "operador";
      message = "Tu perfil corresponde a un Empresario Operador. Este tipo de inversionista busca adquirir y participar activamente en la operación de negocios en Estados Unidos.";
      benefits = [
        "Acceso a oportunidades de compra de negocios",
        "Asesoría estratégica en adquisición",
        "Red de expertos legales y fiscales",
        "Eventos privados con empresarios",
      ];
    } else if (formAnswers.tipoInversionista === "pasivo" || formAnswers.tipoInversionista === "estrategico") {
      profileType = "patrimonial";
      message = "Tu perfil corresponde a un Inversionista Patrimonial. Este tipo de inversionista busca diversificar su patrimonio participando en oportunidades previamente evaluadas.";
      benefits = [
        "Oportunidades filtradas",
        "Inversión en negocios y bienes raíces",
        "Acceso a red empresarial",
        "Mentoría estratégica",
      ];
    } else {
      profileType = "explorador";
      message = "Tu perfil indica que estás explorando oportunidades de inversión. Recomendamos comenzar con contenido educativo antes de analizar oportunidades específicas.";
      benefits = [
        "Contenido educativo especializado",
        "Webinars y talleres",
        "Acceso a comunidad de aprendizaje",
        "Recursos de inversión",
      ];
    }

    // Readiness level
    if (score >= 70) {
      readinessLevel = "Perfil listo para inversión";
      readinessPercentage = Math.min(100, 70 + (score - 70));
      cta = "Agendar llamada estratégica";
      link = "https://calendly.com/diegoalcalamo10/30min?month=2025-02";
    } else if (score >= 40) {
      readinessLevel = "Perfil en desarrollo";
      readinessPercentage = 40 + (score - 40);
      cta = "Ver contenido educativo";
      link = "https://comprandoamerica.com/formacion/";
    } else {
      readinessLevel = "Nivel inicial";
      readinessPercentage = Math.min(40, score);
      cta = "Explorar recursos";
      link = "https://comprandoamerica.com/formacion/";
    }

    return {
      score,
      profileType,
      message,
      benefits,
      cta,
      link,
      readinessLevel,
      readinessPercentage,
    };
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
      
      // Si es operador, ir directamente a resultado
      if (result.profileType === "operador") {
        setStep("result");
      } else {
        // Si no es operador, mostrar microcommitment
        setStep("microcommitment");
      }
    }, 2500);
  };

  const handleMicrocommitment = (ready: boolean) => {
    if (ready) {
      setStep("result");
    } else {
      setStep("result");
    }
  };

  const handleAnswerChange = (field: keyof FormAnswers, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const progressPercentage = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {step === "form" && (
        <>
          {/* ═══ HERO CON VIDEO PROMINENTE ═══ */}
          <section className="relative py-20 md:py-32 bg-gradient-to-b from-[oklch(0.12_0.03_250)] to-[oklch(0.10_0.03_250)]">
            <div className="container relative z-10">
              <FadeIn>
                <div className="max-w-5xl mx-auto">
                  {/* Video */}
                  <div className="mb-12">
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl">
                      <video
                        src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663291837994/YalfpoAHGGBHORwE.mp4"
                        controls
                        className="w-full h-auto aspect-video"
                        poster="https://files.manuscdn.com/user_upload_by_module/session_file/310519663291837994/YalfpoAHGGBHORwE.mp4"
                      />
                    </div>
                  </div>

                  {/* Autoridad */}
                  <div className="text-center mb-12">
                    <p className="text-white/60 text-sm mb-6">
                      <span className="font-semibold text-white">Edmundo Treviño</span><br />
                      Empresario con operaciones activas en Estados Unidos y fundador de Comprando América.
                    </p>
                  </div>

                  {/* Título y CTA */}
                  <div className="text-center">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif text-white leading-[1.1] mb-6">
                      Diagnóstico de{" "}
                      <span className="gradient-text-primary">Inversionista</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-10 max-w-2xl mx-auto">
                      Descubre tu perfil de inversión y accede a oportunidades diseñadas específicamente para ti.
                    </p>
                    <a href="#formulario">
                      <Button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base gap-2">
                        Comenzar diagnóstico <ArrowRight className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
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

          {/* ═══ PRUEBA SOCIAL ═══ */}
          <section className="section-dark py-24 md:py-32">
            <div className="container">
              <FadeIn>
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-3xl md:text-4xl font-serif text-white mb-12">
                    Empresarios que ya forman parte de la comunidad
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-12 mb-12">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-6">Sectores de inversión</h3>
                      <ul className="space-y-3">
                        {[
                          "Servicios industriales",
                          "Logística",
                          "Manufactura",
                          "Bienes raíces",
                          "Negocios operativos",
                        ].map((sector, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-white/70">{sector}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-6">Ciudades principales</h3>
                      <ul className="space-y-3">
                        {[
                          "Ciudad de México",
                          "Monterrey",
                          "Guadalajara",
                          "Houston",
                        ].map((city, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-white/70">{city}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </section>

          {/* ═══ BLOQUE DE EXCLUSIVIDAD ═══ */}
          <section className="section-darker py-24 md:py-32">
            <div className="container">
              <FadeIn>
                <div className="max-w-3xl mx-auto bg-[oklch(0.15_0.03_250)] border border-primary/20 rounded-2xl p-8 md:p-12">
                  <h2 className="text-2xl md:text-3xl font-serif text-white mb-6">
                    Acceso limitado a inversionistas calificados
                  </h2>
                  <p className="text-lg text-white/70 leading-relaxed mb-8">
                    La comunidad Comprando América mantiene un proceso de admisión para asegurar que todos los miembros compartan un perfil empresarial y objetivos alineados.
                  </p>
                  <p className="text-lg text-white/70 leading-relaxed mb-8">
                    Por esta razón realizamos una breve evaluación antes de compartir las oportunidades que trabajamos dentro de la comunidad.
                  </p>
                  <p className="text-lg text-white/70 leading-relaxed mb-8">
                    Solo los perfiles compatibles reciben acceso a:
                  </p>
                  <ul className="space-y-4">
                    {[
                      "Oportunidades de inversión previamente filtradas",
                      "Eventos privados de networking empresarial",
                      "Mentoría estratégica con empresarios activos",
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

          {/* ═══ FORMULARIO CON INDICADOR DE PROGRESO ═══ */}
          <section id="formulario" className="section-dark py-24 md:py-32">
            <div className="container">
              <FadeIn>
                <div className="max-w-2xl mx-auto">
                  {/* Indicador de Progreso */}
                  <div className="mb-12">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-white font-semibold">
                        Paso {currentStep} de 3
                      </span>
                      <span className="text-white/60 text-sm">
                        {Math.round(progressPercentage)}% completado
                      </span>
                    </div>
                    <div className="w-full bg-[oklch(0.15_0.03_250)] rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
                      Evaluación de Perfil de Inversionista
                    </h2>
                    <p className="text-lg text-white/70 leading-relaxed mb-2">
                      Este proceso toma menos de 60 segundos.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8 bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-2xl p-8">
                    {/* PASO 1 - OBJETIVOS */}
                    {currentStep === 1 && (
                      <>
                        {/* Pregunta 1 */}
                        <div>
                          <label className="block text-lg font-semibold text-white mb-4">
                            ¿Cuál es tu principal objetivo al invertir en Estados Unidos?
                          </label>
                          <div className="space-y-3">
                            {[
                              { value: "diversificar", label: "Diversificar mi patrimonio en Estados Unidos" },
                              { value: "expandir", label: "Expandir mi empresa al mercado estadounidense" },
                              { value: "ingresos", label: "Generar ingresos pasivos en dólares" },
                              { value: "migracion", label: "Evaluar opciones migratorias mediante inversión" },
                              { value: "conocer", label: "Conocer oportunidades de compra de negocios" },
                            ].map((option) => (
                              <label key={option.value} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-[oklch(0.10_0.03_250)] transition">
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
                            ¿En qué etapa te encuentras actualmente?
                          </label>
                          <div className="space-y-3">
                            {[
                              { value: "explorando", label: "Explorando oportunidades" },
                              { value: "12meses", label: "Planeando invertir en los próximos 12 meses" },
                              { value: "1-2anos", label: "Planeando invertir en los próximos 1-2 años" },
                              { value: "analizando", label: "Analizando oportunidades activamente" },
                              { value: "yainvirtio", label: "Ya he realizado inversiones en Estados Unidos" },
                            ].map((option) => (
                              <label key={option.value} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-[oklch(0.10_0.03_250)] transition">
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

                        <div className="pt-6 border-t border-white/10 flex gap-4">
                          <Button
                            type="button"
                            onClick={() => {
                              if (answers.objetivo && answers.etapa) {
                                setCurrentStep(2);
                              } else {
                                toast.error("Por favor responde ambas preguntas");
                              }
                            }}
                            className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-6 text-base"
                          >
                            Siguiente
                          </Button>
                        </div>
                      </>
                    )}

                    {/* PASO 2 - PERFIL DE INVERSIÓN */}
                    {currentStep === 2 && (
                      <>
                        {/* Pregunta 3 */}
                        <div>
                          <label className="block text-lg font-semibold text-white mb-4">
                            ¿Qué tipo de inversionista eres?
                          </label>
                          <div className="space-y-3">
                            {[
                              { value: "pasivo", label: "Inversionista pasivo (solo capital)" },
                              { value: "estrategico", label: "Inversionista estratégico" },
                              { value: "operador", label: "Inversionista operador" },
                              { value: "explorando", label: "Aún estoy explorando" },
                            ].map((option) => (
                              <label key={option.value} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-[oklch(0.10_0.03_250)] transition">
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
                            ¿Qué capacidad de inversión podrías destinar?
                          </label>
                          <div className="space-y-3">
                            {[
                              { value: "100k-250k", label: "$100,000 – $250,000 dólares" },
                              { value: "250k-500k", label: "$250,000 – $500,000 dólares" },
                              { value: "500k-1m", label: "$500,000 – $1,000,000 dólares" },
                              { value: "1m", label: "Más de $1,000,000 dólares" },
                            ].map((option) => (
                              <label key={option.value} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-[oklch(0.10_0.03_250)] transition">
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

                        <div className="pt-6 border-t border-white/10 flex gap-4">
                          <Button
                            type="button"
                            onClick={() => setCurrentStep(1)}
                            variant="outline"
                            className="flex-1 border-white/20 text-white hover:bg-white/5 py-6 text-base"
                          >
                            Anterior
                          </Button>
                          <Button
                            type="button"
                            onClick={() => {
                              if (answers.tipoInversionista && answers.capacidad) {
                                setCurrentStep(3);
                              } else {
                                toast.error("Por favor responde ambas preguntas");
                              }
                            }}
                            className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-6 text-base"
                          >
                            Siguiente
                          </Button>
                        </div>
                      </>
                    )}

                    {/* PASO 3 - INFORMACIÓN FINAL */}
                    {currentStep === 3 && (
                      <>
                        {/* Pregunta 5 */}
                        <div>
                          <label className="block text-lg font-semibold text-white mb-4">
                            ¿Dónde resides actualmente?
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
                            ¿Qué tan importante es para ti tener acceso a oportunidades filtradas y una red de empresarios en Estados Unidos?
                          </label>
                          <div className="space-y-3">
                            {[
                              { value: "muy", label: "Muy importante" },
                              { value: "importante", label: "Importante" },
                              { value: "interesante", label: "Interesante pero no urgente" },
                              { value: "explorando", label: "Solo estoy explorando" },
                            ].map((option) => (
                              <label key={option.value} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-[oklch(0.10_0.03_250)] transition">
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
                            ¿Cuál es tu ingreso anual aproximado?
                          </label>
                          <div className="space-y-3">
                            {[
                              { value: "100k-250k", label: "$100k – $250k" },
                              { value: "250k-500k", label: "$250k – $500k" },
                              { value: "500k-1m", label: "$500k – $1M" },
                              { value: "1m", label: "Más de $1M" },
                            ].map((option) => (
                              <label key={option.value} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-[oklch(0.10_0.03_250)] transition">
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

                        <div className="pt-6 border-t border-white/10 flex gap-4">
                          <Button
                            type="button"
                            onClick={() => setCurrentStep(2)}
                            variant="outline"
                            className="flex-1 border-white/20 text-white hover:bg-white/5 py-6 text-base"
                          >
                            Anterior
                          </Button>
                          <Button
                            type="submit"
                            className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-6 text-base"
                          >
                            Evaluar mi perfil
                          </Button>
                        </div>
                      </>
                    )}
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
                  Analizando tu perfil de inversionista…
                </h2>
                <p className="text-lg text-white/70 leading-relaxed mb-8">
                  Estamos evaluando si tu perfil es compatible con las oportunidades que trabajamos dentro de Comprando América.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {step === "microcommitment" && scoringResult && (
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[oklch(0.12_0.03_250)] to-[oklch(0.10_0.03_250)]">
          <div className="container">
            <FadeIn>
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
                  Una pregunta más
                </h2>
                <p className="text-lg text-white/70 leading-relaxed mb-12">
                  ¿Estás listo para analizar oportunidades de inversión en los próximos 12 meses?
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => handleMicrocommitment(true)}
                    className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base"
                  >
                    Sí, estoy listo
                  </Button>
                  <Button
                    onClick={() => handleMicrocommitment(false)}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/5 font-semibold px-8 py-6 text-base"
                  >
                    Estoy explorando
                  </Button>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {step === "result" && scoringResult && (
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[oklch(0.12_0.03_250)] to-[oklch(0.10_0.03_250)]">
          <div className="container">
            <FadeIn>
              <div className="max-w-3xl mx-auto">
                {/* Tarjeta de Resultado */}
                <div className="bg-[oklch(0.15_0.03_250)] border border-white/10 rounded-2xl p-8 md:p-12 mb-12">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
                      Tu Perfil de Inversión
                    </h2>
                    <div className="inline-block bg-primary/20 rounded-full px-6 py-3 mb-8">
                      <p className="text-2xl font-semibold text-primary">
                        {scoringResult.profileType === "operador"
                          ? "Empresario Operador"
                          : scoringResult.profileType === "patrimonial"
                          ? "Inversionista Patrimonial"
                          : "Explorador de Oportunidades"}
                      </p>
                    </div>
                  </div>

                  {/* Readiness Level */}
                  <div className="mb-12">
                    <p className="text-white/70 text-sm mb-3">
                      Nivel de preparación para invertir
                    </p>
                    <div className="w-full bg-[oklch(0.10_0.03_250)] rounded-full h-3 overflow-hidden mb-3">
                      <div
                        className="bg-gradient-to-r from-primary to-emerald-400 h-full transition-all duration-500"
                        style={{ width: `${scoringResult.readinessPercentage}%` }}
                      />
                    </div>
                    <p className="text-white/60 text-sm">
                      {scoringResult.readinessLevel}
                    </p>
                  </div>

                  {/* Mensaje */}
                  <p className="text-lg text-white/70 leading-relaxed mb-8 text-center">
                    {scoringResult.message}
                  </p>

                  {/* Beneficios */}
                  <div className="mb-12">
                    <p className="text-white font-semibold mb-4">Beneficios:</p>
                    <ul className="space-y-3">
                      {scoringResult.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-white/70">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Siguiente Paso */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-serif text-white mb-4">
                    Siguiente paso
                  </h3>
                  <p className="text-lg text-white/70 leading-relaxed mb-8">
                    Si deseas conocer las oportunidades que actualmente se están analizando dentro de la comunidad Comprando América, puedes agendar una conversación estratégica con nuestro equipo.
                  </p>
                  <p className="text-white/60 text-sm mb-8">
                    Duración: 30 minutos
                  </p>
                </div>

                {/* CTA */}
                {scoringResult.link && (
                  <div className="text-center">
                    <a href={scoringResult.link} target="_blank" rel="noopener noreferrer">
                      <Button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base gap-2">
                        {scoringResult.cta} <ArrowRight className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                )}

                <p className="text-white/50 text-sm mt-12 text-center">
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
