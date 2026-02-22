import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { NewsFilter } from "@/components/NewsFilter";
import { NewsList } from "@/components/NewsList";
import { Loader2 } from "lucide-react";

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch latest news
  const { data: latestNews = [], isLoading: isLoadingLatest } = trpc.news.getLatest.useQuery({
    limit: 100,
  });

  // Fetch news by category
  const { data: categoryNews = [], isLoading: isLoadingCategory } = trpc.news.getByCategory.useQuery(
    { category: selectedCategory, limit: 100 },
    { enabled: selectedCategory !== "all" }
  );

  // Fetch search results
  const { data: searchResults = [], isLoading: isLoadingSearch } = trpc.news.search.useQuery(
    { query: searchQuery, limit: 100 },
    { enabled: searchQuery.length > 0 }
  );

  // Determine which data to display
  const displayNews = useMemo(() => {
    if (searchQuery.length > 0) {
      return searchResults;
    }
    if (selectedCategory !== "all") {
      return categoryNews;
    }
    return latestNews;
  }, [searchQuery, selectedCategory, searchResults, categoryNews, latestNews]);

  const isLoading = isLoadingLatest || isLoadingCategory || isLoadingSearch;

  // Filter by search query if not using search endpoint
  const filteredNews = useMemo(() => {
    if (searchQuery.length === 0) {
      return displayNews;
    }
    return displayNews.filter(
      (article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [displayNews, searchQuery]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Noticias y Actualizaciones
            </h1>
            <p className="text-lg text-muted-foreground">
              Mantente informado sobre las últimas noticias en visas, economía, bienes raíces e
              inversiones en Estados Unidos.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Filters */}
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <NewsFilter
                  selectedCategory={selectedCategory}
                  searchQuery={searchQuery}
                  onCategoryChange={setSelectedCategory}
                  onSearchChange={setSearchQuery}
                />
              </div>
            </div>

            {/* Main Content - News Grid */}
            <div className="lg:col-span-3">
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}

              {!isLoading && filteredNews.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    {searchQuery.length > 0
                      ? `No se encontraron noticias para "${searchQuery}"`
                      : "No hay noticias disponibles en esta categoría"}
                  </p>
                </div>
              )}

              {!isLoading && filteredNews.length > 0 && (
                <NewsList articles={filteredNews} isLoading={false} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">
              Fuentes de Noticias Confiables
            </h2>
            <p className="text-muted-foreground mb-6">
              Nuestro portal de noticias se actualiza automáticamente cada 4 horas con contenido
              proveniente de fuentes oficiales y especializadas en:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "USCIS",
                "State Department",
                "Investing.com",
                "Trading Economics",
                "NAR",
                "CNBC",
              ].map((source) => (
                <div key={source} className="bg-background rounded-lg p-3 border border-border">
                  <p className="font-semibold text-sm">{source}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
