import { NewsArticle } from "@shared/types";
import { Calendar, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface NewsCardProps {
  article: NewsArticle;
  onArticleClick?: (article: NewsArticle) => void;
}

export function NewsCard({ article, onArticleClick }: NewsCardProps) {
  const publishedDate = new Date(article.publishedAt);
  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true, locale: es });

  const handleClick = () => {
    if (onArticleClick) {
      onArticleClick(article);
    } else {
      window.open(article.url, "_blank");
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col"
    >
      {/* Image */}
      {article.imageUrl && (
        <div className="relative h-48 overflow-hidden bg-muted">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category Badge */}
        <div className="mb-3">
          <span className="inline-block px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
            {getCategoryLabel(article.category)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>

        {/* Description */}
        {article.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
            {article.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{timeAgo}</span>
          </div>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-primary hover:text-primary-dark transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Source */}
        <div className="mt-2 text-xs text-muted-foreground">
          Fuente: {article.source}
        </div>
      </div>
    </div>
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
