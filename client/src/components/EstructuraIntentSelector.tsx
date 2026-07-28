/*
 * Selector de intención compartido entre las dos guías de estructura
 * (LLC e Inversión). Aparece en el hero de ambas páginas y resuelve la
 * indecisión desde el primer scroll:
 *   - Si la opción apunta a la OTRA página, navega allí.
 *   - Si apunta a la página actual (o es "no lo tengo claro"), abre el
 *     diagnóstico de la página actual en vez de navegar.
 */
import { Building2, TrendingUp, Compass } from "lucide-react";

const LLC_PATH = "/estructura-empresarial-en-estados-unidos";
const INV_PATH = "/estructura-de-inversion-en-usa";

type PageKey = "llc" | "inversion";

export default function EstructuraIntentSelector({
  currentPage,
  onOpenDiagnostic,
  className = "",
}: {
  currentPage: PageKey;
  onOpenDiagnostic: () => void;
  className?: string;
}) {
  const options: { key: PageKey | "unclear"; icon: typeof Building2; label: string; href: string | null }[] = [
    { key: "llc", icon: Building2, label: "Quiero abrir una empresa para operar", href: LLC_PATH },
    { key: "inversion", icon: TrendingUp, label: "Estoy evaluando invertir, una visa o expandir mi operación", href: INV_PATH },
    { key: "unclear", icon: Compass, label: "Todavía no lo tengo claro", href: null },
  ];

  const cardClass =
    "flex items-start gap-3 bg-[#0F2847] border border-[#1E3A5F] hover:border-primary rounded-xl px-4 py-4 text-left transition-all h-full w-full";

  return (
    <div className={className}>
      <p className="text-slate-300 text-sm font-semibold mb-3">¿Qué necesitas resolver primero?</p>
      <div className="grid sm:grid-cols-3 gap-3">
        {options.map((opt) => {
          const Icon = opt.icon;
          const inner = (
            <>
              <Icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm text-white leading-snug">{opt.label}</span>
            </>
          );
          // "no lo tengo claro" y la opción de la página actual abren el diagnóstico local.
          const opensDiagnostic = opt.key === "unclear" || opt.key === currentPage;
          return opensDiagnostic ? (
            <button key={opt.key} type="button" onClick={onOpenDiagnostic} className={cardClass}>
              {inner}
            </button>
          ) : (
            <a key={opt.key} href={opt.href!} className={cardClass}>
              {inner}
            </a>
          );
        })}
      </div>
    </div>
  );
}
