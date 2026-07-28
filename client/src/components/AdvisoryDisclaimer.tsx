/*
 * Disclaimer de cumplimiento.
 * En Estados Unidos existen regulaciones sobre el uso de los términos
 * "asesoría legal / fiscal" sin certificación ante la autoridad. Comprando
 * América comparte recomendaciones y experiencias desde un punto de vista
 * empírico y conecta con abogados y contadores (CPA) certificados; NO ofrece
 * asesoría legal, fiscal ni migratoria de forma directa. Este componente
 * centraliza ese aviso para reutilizarlo en cualquier página.
 */
export const ADVISORY_DISCLAIMER_TEXT =
  "Comprando América no es un despacho legal, contable ni migratorio y no ofrece asesoría legal, fiscal o migratoria. El contenido de esta página son recomendaciones y experiencias compartidas con fines orientativos, no un estudio formal de tu caso. La asesoría oficial la brindan abogados y contadores públicos certificados (CPA) con quienes te podemos poner en contacto.";

export default function AdvisoryDisclaimer({
  variant = "box",
  className = "",
}: {
  variant?: "box" | "inline";
  className?: string;
}) {
  if (variant === "inline") {
    return <p className={`text-slate-500 text-xs leading-relaxed ${className}`}>{ADVISORY_DISCLAIMER_TEXT}</p>;
  }
  return (
    <div className={`bg-[#0F2847] border border-[#1E3A5F] rounded-xl p-5 ${className}`}>
      <p className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase mb-2 font-mono">Aviso importante</p>
      <p className="text-slate-400 text-xs leading-relaxed">{ADVISORY_DISCLAIMER_TEXT}</p>
    </div>
  );
}
