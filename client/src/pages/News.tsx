import { useState, useMemo, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { NewsList } from "@/components/NewsList";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2, Globe, Plane, TrendingUp, Home, Building2, DollarSign, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearch } from "wouter";

export default function News() {
  // Read initial category from URL query params
  const searchString = useSearch();
  const urlParams = new URLSearchParams(searchString);
  const initialCategory = urlParams.get("category") || "all";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", label: "Todas", icon: Globe },
    { id: "visas-migracion", label: "Visas y Migraciones", icon: Plane },
    { id: "economia-finanzas", label: "Economía y Finanzas", icon: TrendingUp },
    { id: "bienes-raices", label: "Bienes Raíces", icon: Home },
    { id: "llc-negocios", label: "LLC y Negocios", icon: Building2 },
    { id: "inversiones", label: "Inversiones", icon: DollarSign },
  ];

  // SEO Meta Tags
  useEffect(() => {
    const categoryName = categories.find(c => c.id === selectedCategory)?.label || "Noticias";
    document.title = `${categoryName} | Comprando América - Portal de Noticias`;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      const descriptions: Record<string, string> = {
        all: "Portal de noticias sobre visas E-2, economía, bienes raíces, LLC e inversiones en Estados Unidos para emprendedores latinoamericanos.",
        "visas-migracion": "Noticias sobre visas E-2, EB-5 y trámites migratorios para inversionistas latinoamericanos en Estados Unidos.",
        "economia-finanzas": "Últimas noticias sobre economía, inflación, tipos de cambio y proyecciones financieras de Estados Unidos.",
        "bienes-raices": "Noticias del mercado inmobiliario estadounidense, precios de vivienda, tasas hipotecarias y oportunidades de inversión.",
        "llc-negocios": "Información sobre constitución de LLC, regulaciones tributarias y estructura empresarial en Estados Unidos.",
        "inversiones": "Análisis de mercados bursátiles, estrategias de inversión y oportunidades en Estados Unidos.",
      };
      metaDescription.setAttribute('content', descriptions[selectedCategory] || descriptions.all);
    }

    let canonicalUrl = "https://comprandoamerica.com/news";
    if (selectedCategory !== "all") {
      canonicalUrl += `?category=${selectedCategory}`;
    }
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link') as HTMLLinkElement;
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [selectedCategory]);

  // Schema.org markup
  useEffect(() => {
    const schemaScript = document.getElementById('news-schema');
    if (schemaScript) schemaScript.remove();

    const schema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Portal de Noticias - Comprando América",
      "description": "Noticias editoriales sobre visas, economía, bienes raíces, LLC e inversiones en Estados Unidos",
      "url": "https://comprandoamerica.com/news",
      "publisher": {
        "@type": "Organization",
        "name": "Comprando América",
        "url": "https://comprandoamerica.com"
      }
    };

    const script = document.createElement('script');
    script.id = 'news-schema';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }, []);

  // Fetch latest news
  const { data: latestNews = [], isLoading: isLoadingLatest } = trpc.news.getLatest.useQuery({
    limit: 100,
  });

  // Fetch news by category
  const { data: categoryNews = [], isLoading: isLoadingCategory } = trpc.news.getByCategory.useQuery(
    { category: selectedCategory as any, limit: 100 },
    { enabled: selectedCategory !== "all" }
  );

  // Fetch search results
  const { data: searchResults = [], isLoading: isLoadingSearch } = trpc.news.search.useQuery(
    { query: searchQuery, limit: 100 },
    { enabled: searchQuery.length > 2 }
  );

  // Determine which data to display
  const displayNews = useMemo(() => {
    if (searchQuery.length > 2) return searchResults;
    if (selectedCategory !== "all") return categoryNews;
    return latestNews;
  }, [searchQuery, selectedCategory, searchResults, categoryNews, latestNews]);

  const isLoading = isLoadingLatest || isLoadingCategory || isLoadingSearch;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 section-dark overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-gold/5" />
        <div className="container relative z-10">
          <span className="inline-block text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">
            Portal de Noticias
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight mb-4">
            Noticias para{" "}
            <span className="gradient-text-primary">Inversionistas</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl leading-relaxed">
            Análisis editorial sobre visas, economía, bienes raíces, negocios e inversiones en Estados Unidos.
            Cada noticia explicada desde la perspectiva del inversionista latinoamericano.
          </p>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="sticky top-20 z-40 bg-[oklch(0.12_0.03_250/0.95)] backdrop-blur-xl border-b border-white/5">
        <div className="container py-4">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <Input
              placeholder="Buscar noticias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* News List */}
      <section className="py-12 section-darker">
        <div className="container">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin w-8 h-8 text-primary" />
            </div>
          ) : displayNews.length > 0 ? (
            <>
              <div className="mb-6">
                <p className="text-sm text-white/40">
                  {searchQuery.length > 2
                    ? `${displayNews.length} resultados para "${searchQuery}"`
                    : `Mostrando ${displayNews.length} artículos`}
                </p>
              </div>
              <NewsList articles={displayNews} />
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-white/40 font-serif mb-2">
                {searchQuery.length > 2
                  ? "No se encontraron resultados"
                  : "No hay noticias en esta categoría"}
              </p>
              <p className="text-sm text-white/30">
                Pronto publicaremos contenido nuevo. ¡Suscríbete para no perdértelo!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 section-dark">
        <div className="container max-w-2xl">
          <div className="bg-gradient-to-r from-primary/10 to-gold/10 border border-primary/20 rounded-2xl p-8 md:p-10">
            <NewsletterSignup />
          </div>
        </div>
      </section>

      {/* SEO Breadcrumb */}
      <div className="hidden" itemScope itemType="https://schema.org/BreadcrumbList">
        <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <a itemProp="item" href="https://comprandoamerica.com">
            <span itemProp="name">Inicio</span>
          </a>
          <meta itemProp="position" content="1" />
        </span>
        <span itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <a itemProp="item" href="https://comprandoamerica.com/news">
            <span itemProp="name">Noticias</span>
          </a>
          <meta itemProp="position" content="2" />
        </span>
      </div>

      <Footer />
    </div>
  );
}
