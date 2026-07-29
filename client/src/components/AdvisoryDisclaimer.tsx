/*
 * Disclaimer de cumplimiento.
 * En Estados Unidos existen regulaciones sobre el uso de los términos
 * "asesoría legal / fiscal" sin certificación ante la autoridad. Comprando
 * América comparte recomendaciones y experiencias desde un punto de vista
 * empírico y conecta con abogados y contadores (CPA) certificados; NO ofrece
 * asesoría legal, fiscal ni migratoria de forma directa.
 *
 * Debe estar presente, pero discreto: nota al pie en texto pequeño y apagado,
 * nunca un bloque protagonista que compita con el contenido.
 */
export const ADVISORY_DISCLAIMER_TEXT =
  "Comprando América no es un despacho legal, contable ni migratorio y no ofrece asesoría legal, fiscal o migratoria. El contenido de esta página son recomendaciones y experiencias compartidas con fines orientativos, no un estudio formal de tu caso. La asesoría oficial la brindan abogados y contadores públicos certificados (CPA) con quienes te podemos poner en contacto.";

/** Versión corta para espacios reducidos (resultados de diagnóstico, modales). */
export const ADVISORY_DISCLAIMER_SHORT =
  "Orientación general, no asesoría legal ni fiscal. La asesoría oficial la brindan abogados y contadores certificados.";

export default function AdvisoryDisclaimer({
  variant = "inline",
  className = "",
}: {
  /** "inline": nota al pie discreta. "short": una línea, para modales y resultados. */
  variant?: "inline" | "short";
  className?: string;
}) {
  if (variant === "short") {
    return (
      <p className={`text-slate-500/80 text-[11px] leading-relaxed ${className}`}>
        {ADVISORY_DISCLAIMER_SHORT}
      </p>
    );
  }
  return (
    <p className={`text-slate-500/70 text-[11px] leading-relaxed ${className}`}>
      {ADVISORY_DISCLAIMER_TEXT}
    </p>
  );
}
