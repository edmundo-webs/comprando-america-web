import { useState, useMemo, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { NewsFilter } from "@/components/NewsFilter";
import { NewsList } from "@/components/NewsList";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { Loader2, Globe, Plane, TrendingUp, Home, Building2, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // SEO Meta Tags - Update on mount and category change
  useEffect(() => {
    const categoryName = categories.find(c => c.id === selectedCategory)?.label || "Noticias";
    document.title = `${categoryName} | Comprando América - Portal de Noticias`;
    
    // Update meta description
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

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      const keywords: Record<string, string> = {
        all: "visas E-2, economía USA, bienes raíces, LLC, inversiones, migraciones, emprendimiento",
        "visas-migracion": "visa E-2, EB-5, trámites migratorios, USCIS, inversionista extranjero",
        "economia-finanzas": "economía USA, inflación, tipo de cambio, PIB, Reserva Federal",
        "bienes-raices": "bienes raíces USA, precios vivienda, hipotecas, inversión inmobiliaria",
        "llc-negocios": "LLC, Delaware, estructura empresarial, impuestos, responsabilidad limitada",
        "inversiones": "inversiones USA, bolsa de valores, S&P 500, REITs, portafolio",
      };
      metaKeywords.setAttribute('content', keywords[selectedCategory] || keywords.all);
    }

    // Add canonical URL
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

  // Inject Schema.org markup for SEO
  useEffect(() => {
    const schemaScript = document.getElementById('news-schema');
    if (schemaScript) {
      schemaScript.remove();
    }

    const schema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Portal de Noticias - Comprando América",
      "description": "Noticias sobre visas, economía, bienes raíces, LLC e inversiones en Estados Unidos",
      "url": "https://comprandoamerica.com/news",
      "image": "https://comprandoamerica.com/logo.png",
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

  const categories = [
    { id: "all", label: "Todas", icon: Globe },
    { id: "visas-migracion", label: "Visas y Migraciones", icon: Plane },
    { id: "economia-finanzas", label: "Economía y Finanzas", icon: TrendingUp },
    { id: "bienes-raices", label: "Bienes Raíces", icon: Home },
    { id: "llc-negocios", label: "LLC y Negocios", icon: Building2 },
    { id: "inversiones", label: "Inversiones", icon: DollarSign },
  ];

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-12 md:py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Noticias y Actualizaciones
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl">
            Mantente informado sobre visas, economía, bienes raíces, LLC e inversiones en Estados Unidos.
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-8 border-b border-border">
        <div className="container">
          <div className="flex gap-2">
            <Input
              placeholder="Buscar noticias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Limpiar
            </Button>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-border">
        <div className="container">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="gap-2"
                >
                  <IconComponent className="w-4 h-4" />
                  {category.label}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* News List */}
      <section className="py-12">
        <div className="container">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin w-8 h-8 text-primary" />
            </div>
          ) : displayNews.length > 0 ? (
            <>
              <div className="mb-6">
                <p className="text-sm text-foreground/60">
                  Mostrando {displayNews.length} artículos
                </p>
              </div>
              <NewsList articles={displayNews} />
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-foreground/60">
                No se encontraron noticias en esta categoría.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-12 bg-foreground/5">
        <div className="container max-w-2xl">
          <NewsletterSignup />
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
    </div>
  );
}
