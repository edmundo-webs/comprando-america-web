import { NewsArticle } from "@shared/types";
import { Calendar, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Link } from "wouter";

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const publishedDate = new Date(article.publishedAt);
  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true, locale: es });

  return (
    <Link href={`/news/${article.slug}`}>
      <div className="group relative bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300 cursor-pointer h-full flex flex-col">
        {/* Image */}
        {article.imageUrl && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          {/* Category Badge */}
          <div className="mb-3">
            <span className="inline-block px-2.5 py-1 bg-primary/20 text-primary text-xs font-semibold tracking-wider uppercase rounded-full">
              {getCategoryLabel(article.category)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-serif text-white line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>

          {/* Description */}
          {article.description && (
            <p className="text-sm text-white/50 line-clamp-3 mb-4 flex-grow leading-relaxed">
              {article.description}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Calendar className="w-3.5 h-3.5" />
              <span>{timeAgo}</span>
            </div>
            <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
              Leer más <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Author */}
          <div className="mt-2 text-xs text-white/30">
            Por {article.author || "Equipo Comprando América"}
          </div>
        </div>
      </div>
    </Link>
  );
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    "visas-migracion": "Visas y Migración",
    "economia-finanzas": "Economía y Finanzas",
    "bienes-raices": "Bienes Raíces",
    "llc-negocios": "LLC y Negocios",
    "inversiones": "Inversiones",
  };
  return labels[category] || category;
}
