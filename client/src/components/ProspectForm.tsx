import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Send } from "lucide-react";

interface ProspectFormProps {
  variant?: "dark" | "light";
  title?: string;
}

export default function ProspectForm({ variant = "dark", title = "Solicita más información" }: ProspectFormProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    pais: "México",
    interes: [] as string[],
    etapa: "",
    tipoInversionista: "",
    capacidad: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.email) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }
    toast.success("¡Gracias! Nos pondremos en contacto contigo pronto.");
    setFormData({
      nombre: "", apellido: "", email: "", telefono: "",
      pais: "México", interes: [], etapa: "", tipoInversionista: "", capacidad: "",
    });
  };

  const bgClass = variant === "dark"
    ? "bg-[oklch(0.12_0.03_250)] border-[oklch(0.25_0.02_250)]"
    : "bg-[oklch(0.18_0.03_250)] border-[oklch(0.28_0.02_250)]";

  const interesOptions = [
    "Aprender a comprar negocios en Estados Unidos.",
    "Conocer a otros compradores de negocios.",
    "Tener acceso a oportunidades de compra de negocios.",
    "Asistir a eventos educativos y de networking.",
    "Conseguir inversionistas para mis compras de negocios.",
    "Tener acceso a personal capacitado para operar mi negocio en Estados Unidos.",
  ];

  const etapaOptions = [
    "Buscando comprar en los próximos 12 meses.",
    "Buscando comprar en los próximos 1-2 años.",
    "En negociaciones de compra.",
    "Recientemente compré un negocio.",
  ];

  const tipoOptions = [
    "Inversionista pasivo",
    "Inversionista administrador activo",
    "Inversionista operador",
    "No lo tengo claro",
  ];

  const capacidadOptions = [
    "De 10,000 a 50,000 dólares",
    "De 50,001 a 100,000 dólares",
    "Más de 100,000 dólares",
  ];

  return (
    <div className={`rounded-xl border p-6 md:p-8 ${bgClass}`}>
      <h3 className="text-2xl font-serif text-white mb-6">{title}</h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-white/70 text-sm mb-1.5 block">Nombre *</Label>
            <Input
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary"
              placeholder="Tu nombre"
              required
            />
          </div>
          <div>
            <Label className="text-white/70 text-sm mb-1.5 block">Apellido</Label>
            <Input
              value={formData.apellido}
              onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary"
              placeholder="Tu apellido"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-white/70 text-sm mb-1.5 block">Email *</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary"
              placeholder="tu@email.com"
              required
            />
          </div>
          <div>
            <Label className="text-white/70 text-sm mb-1.5 block">Teléfono</Label>
            <Input
              type="tel"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary"
              placeholder="+52 123 456 7890"
            />
          </div>
        </div>

        <div>
          <Label className="text-white/70 text-sm mb-2 block">¿Cómo podemos ayudarte?</Label>
          <div className="space-y-2">
            {interesOptions.map((opt) => (
              <label key={opt} className="flex items-start gap-3 text-sm text-white/60 hover:text-white/80 transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.interes.includes(opt)}
                  onChange={(e) => {
                    const newInteres = e.target.checked
                      ? [...formData.interes, opt]
                      : formData.interes.filter((i) => i !== opt);
                    setFormData({ ...formData, interes: newInteres });
                  }}
                  className="mt-0.5 rounded border-white/20 bg-white/5 text-primary focus:ring-emerald"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-white/70 text-sm mb-2 block">¿En qué etapa te encuentras? *</Label>
          <div className="space-y-2">
            {etapaOptions.map((opt) => (
              <label key={opt} className="flex items-center gap-3 text-sm text-white/60 hover:text-white/80 transition-colors cursor-pointer">
                <input
                  type="radio"
                  name="etapa"
                  value={opt}
                  checked={formData.etapa === opt}
                  onChange={(e) => setFormData({ ...formData, etapa: e.target.value })}
                  className="border-white/20 bg-white/5 text-primary focus:ring-emerald"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-white/70 text-sm mb-2 block">¿Qué tipo de inversionista eres? *</Label>
          <div className="space-y-2">
            {tipoOptions.map((opt) => (
              <label key={opt} className="flex items-center gap-3 text-sm text-white/60 hover:text-white/80 transition-colors cursor-pointer">
                <input
                  type="radio"
                  name="tipo"
                  value={opt}
                  checked={formData.tipoInversionista === opt}
                  onChange={(e) => setFormData({ ...formData, tipoInversionista: e.target.value })}
                  className="border-white/20 bg-white/5 text-primary focus:ring-emerald"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-white/70 text-sm mb-2 block">¿Qué capacidad de inversión puedes destinar? *</Label>
          <div className="space-y-2">
            {capacidadOptions.map((opt) => (
              <label key={opt} className="flex items-center gap-3 text-sm text-white/60 hover:text-white/80 transition-colors cursor-pointer">
                <input
                  type="radio"
                  name="capacidad"
                  value={opt}
                  checked={formData.capacidad === opt}
                  onChange={(e) => setFormData({ ...formData, capacidad: e.target.value })}
                  className="border-white/20 bg-white/5 text-primary focus:ring-emerald"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 text-base gap-2"
        >
          <Send className="w-4 h-4" />
          Enviar Solicitud
        </Button>
      </form>
    </div>
  );
}
