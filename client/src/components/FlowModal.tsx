/*
 * Concha de modal y botón de opción compartidos por las dos puertas de la
 * entrada de estructura: la compra directa (EstructuraFlow) y el diagnóstico
 * (DiagnosticoEstructura). Estaban duplicados; con dos modales en la página el
 * copiado dejaba de ser inocuo.
 */
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function FlowModal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative bg-[#0F2847] border border-[#1E3A5F] rounded-2xl max-w-lg w-full max-h-[88vh] overflow-y-auto shadow-2xl"
            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between p-6 border-b border-[#1E3A5F] sticky top-0 bg-[#0F2847] z-10">
              <h3 className="text-white font-semibold text-lg pr-4">{title}</h3>
              <button onClick={onClose} aria-label="Cerrar" className="text-slate-400 hover:text-white transition-colors flex-shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-slate-300 leading-relaxed space-y-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function OptionButton({
  label,
  desc,
  selected,
  onClick,
}: {
  label: string;
  desc?: string;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={`text-left rounded-xl px-5 py-4 border transition-all w-full ${
        selected ? "bg-primary/10 border-primary text-white" : "bg-[#0B1F3A] border-[#1E3A5F] text-slate-300 hover:border-primary/60 hover:text-white"
      }`}
    >
      <span className="block text-sm font-medium text-white">{label}</span>
      {desc && <span className="block text-slate-400 text-xs mt-1 leading-relaxed">{desc}</span>}
    </button>
  );
}
