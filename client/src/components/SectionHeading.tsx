import { useInView } from "@/hooks/useInView";
import { motion } from "framer-motion";

interface SectionHeadingProps {
  tag?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
}

export default function SectionHeading({ tag, title, subtitle, align = "center", light = false }: SectionHeadingProps) {
  const { ref, isInView } = useInView();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`mb-12 md:mb-16 ${align === "center" ? "text-center" : "text-left"}`}
    >
      {tag && (
        <span className="inline-block text-emerald text-sm font-semibold tracking-[0.2em] uppercase mb-3 font-mono">
          {tag}
        </span>
      )}
      <h2 className={`text-3xl md:text-4xl lg:text-5xl font-serif leading-tight ${light ? "text-white" : "text-white"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className={`mt-6 h-1 w-16 bg-emerald rounded-full ${align === "center" ? "mx-auto" : ""}`} />
    </motion.div>
  );
}
