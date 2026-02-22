import { trpc } from "@/lib/trpc";
import { NewsCard } from "./NewsCard";
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "wouter";

export function NewsHighlights() {
  const { data: latestNews = [], isLoading } = trpc.news.getLatest.useQuery({
    limit: 6,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  // Group news by category
  const newsByCategory = {
    "visas-migracion": latestNews.filter(n => n.category === "visas-migracion").slice(0, 3),
    "economia-finanzas": latestNews.filter(n => n.category === "economia-finanzas").slice(0, 3),
    "bienes-raices": latestNews.filter(n => n.category === "bienes-raices").slice(0, 3),
    "llc-negocios": latestNews.filter(n => n.category === "llc-negocios").slice(0, 3),
    "inversiones": latestNews.filter(n => n.category === "inversiones").slice(0, 3),
  };

  const categories = [
    { id: "visas-migracion", label: "Visas y Migraciones" },
    { id: "economia-finanzas", label: "Economía y Finanzas" },
    { id: "bienes-raices", label: "Bienes Raíces" },
    { id: "llc-negocios", label: "LLC y Negocios" },
    { id: "inversiones", label: "Inversiones" },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Noticias Destacadas
          </h2>
          <p className="text-lg text-foreground/70">
            Mantente actualizado con las últimas noticias sobre inversión en Estados Unidos
          </p>
        </div>

        <div className="space-y-16">
          {categories.map((category) => {
            const categoryNews = newsByCategory[category.id as keyof typeof newsByCategory] || [];
            
            if (categoryNews.length === 0) return null;

            return (
              <div key={category.id}>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-serif font-bold">{category.label}</h3>
                  <Link href={`/news?category=${category.id}`}>
                    <Button variant="outline" className="gap-2">
                      Ver todas <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {categoryNews.map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link href="/news">
            <Button size="lg" className="gap-2">
              Explorar todas las noticias <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
