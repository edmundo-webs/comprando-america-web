import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useParams, Link } from "wouter";
import { Streamdown } from "streamdown";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Calendar, User, ExternalLink, ArrowRight,
  Plane, TrendingUp, Building2, Briefcase, BarChart3, Clock
} from "lucide-react";

// CTA configurations based on article category
const CTA_CONFIG: Record<string, { title: string; description: string; buttonText: string; link: string; icon: React.ReactNode }> = {
  "visas-migracion": {
    title: "¿Estás considerando migrar a Estados Unidos?",
    description: "En Comprando América te asesoramos con el proceso de Visa E-2 de inversionista. Nuestro equipo de expertos te guía paso a paso para que logres tu objetivo de vivir y trabajar legalmente en USA.",
    buttonText: "Conoce la Visa E-2",
    link: "/visa-e2-inversionista-usa",
    icon: <Plane className="w-6 h-6" />,
  },
  "economia-finanzas": {
    title: "¿Quieres proteger tu patrimonio invirtiendo en USA?",
    description: "Únete a nuestra comunidad de inversionistas y accede a oportunidades exclusivas de inversión en Estados Unidos. Te ayudamos a diversificar tu portafolio con criterio y estructura.",
    buttonText: "Conoce el Club de Inversión",
    link: "/membresia",
    icon: <TrendingUp className="w-6 h-6" />,
  },
  "bienes-raices": {
    title: "¿Te interesa invertir en bienes raíces en USA?",
    description: "Accede a oportunidades de inversión inmobiliaria filtradas por nuestros expertos. Desde $100,000 USD, con estructura legal, fiscal y acompañamiento estratégico.",
    buttonText: "Ver Oportunidades",
    link: "/bienes-raices-en-usa",
    icon: <Building2 className="w-6 h-6" />,
  },
  "llc-negocios": {
    title: "¿Necesitas estructurar tu inversión en USA?",
    description: "Te ayudamos a crear tu LLC, abrir cuentas bancarias y estructurar tu inversión de forma correcta desde el primer día. Evita errores costosos con nuestra asesoría.",
    buttonText: "Estructura tu Inversión",
    link: "/estructura-de-inversion-en-usa",
    icon: <Briefcase className="w-6 h-6" />,
  },
  "inversiones": {
    title: "¿Listo para dar el siguiente paso como inversionista?",
    description: "Nuestra comunidad te da acceso a formación, oportunidades exclusivas y una red de inversionistas con experiencia. Aprende a invertir con criterio en el mercado más grande del mundo.",
    buttonText: "Conoce el Programa",
    link: "/formacion",
    icon: <BarChart3 className="w-6 h-6" />,
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  "visas-migracion": "Visas y Migración",
  "economia-finanzas": "Economía y Finanzas",
  "bienes-raices": "Bienes Raíces",
  "llc-negocios": "LLC y Negocios",
  "inversiones": "Inversiones",
};

export default function NewsArticle() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, error } = trpc.news.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  // Get related articles from same category
  const { data: relatedArticles } = trpc.news.getByCategory.useQuery(
    { category: article?.category || "", limit: 4 },
    { enabled: !!article?.category }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container pt-28 pb-20">
          <div className="max-w-3xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-4 bg-[#0F2847]/10 rounded w-32" />
              <div className="h-10 bg-[#0F2847]/10 rounded w-3/4" />
              <div className="h-64 bg-[#0F2847]/10 rounded" />
              <div className="space-y-3">
                <div className="h-4 bg-[#0F2847]/10 rounded" />
                <div className="h-4 bg-[#0F2847]/10 rounded w-5/6" />
                <div className="h-4 bg-[#0F2847]/10 rounded w-4/6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container pt-28 pb-20 text-center">
          <h1 className="text-3xl font-serif text-white mb-4">Artículo no encontrado</h1>
          <p className="text-white/60 mb-8">Lo sentimos, este artículo no existe o ha sido eliminado.</p>
          <Link href="/news">
            <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
              <ArrowLeft className="w-4 h-4" /> Volver a Noticias
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const cta = CTA_CONFIG[article.category] || CTA_CONFIG["inversiones"];
  const filteredRelated = relatedArticles?.filter(a => a.slug !== article.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Article Header */}
      <section className="pt-28 pb-12 section-dark">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Back link */}
            <Link href="/news" className="inline-flex items-center gap-2 text-white/50 hover:text-primary transition-colors mb-6 text-sm">
              <ArrowLeft className="w-4 h-4" /> Volver a Noticias
            </Link>

            {/* Category badge */}
            <Link href={`/news?category=${article.category}`}>
              <span className="inline-block bg-blue-500/15 text-primary text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full mb-4 hover:bg-primary/30 transition-colors cursor-pointer">
                {CATEGORY_LABELS[article.category] || article.category}
              </span>
            </Link>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white leading-tight mb-6">
              {article.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-white/50 text-sm mb-8">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.author || "Equipo Comprando América"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(article.publishedAt).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{Math.max(3, Math.ceil((article.body?.length || article.content?.length || 500) / 1000))} min de lectura</span>
              </div>
            </div>

            {/* Description */}
            {article.description && (
              <p className="text-lg text-white/60 leading-relaxed border-l-4 border-primary pl-4 mb-8">
                {article.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {article.imageUrl && (
        <div className="container">
          <div className="max-w-3xl mx-auto -mt-4 mb-12">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-[300px] md:h-[400px] object-cover rounded-xl"
            />
          </div>
        </div>
      )}

      {/* Article Body */}
      <section className="pb-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <article className="prose prose-invert prose-lg max-w-none
              prose-headings:font-serif prose-headings:text-white
              prose-p:text-white/80 prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white
              prose-blockquote:border-primary prose-blockquote:text-white/60
              prose-li:text-white/80
            ">
              {article.body ? (
                <Streamdown>{article.body}</Streamdown>
              ) : article.content ? (
                <Streamdown>{article.content}</Streamdown>
              ) : (
                <p className="text-white/60">Contenido no disponible.</p>
              )}
            </article>

            {/* Source reference */}
            {article.source && article.url && (
              <div className="mt-10 pt-6 border-t border-[#1E3A5F]">
                <p className="text-white/50 text-sm">
                  Fuente original:{" "}
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary/70 hover:text-primary transition-colors inline-flex items-center gap-1"
                  >
                    {article.source} <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>
            )}

            {/* CTA Section */}
            <div className="mt-12 bg-gradient-to-r from-primary/10 to-gold/10 border border-blue-500/20 rounded-2xl p-8 md:p-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/15 text-primary flex items-center justify-center shrink-0">
                  {cta.icon}
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-serif text-white mb-3">{cta.title}</h3>
                  <p className="text-white/60 leading-relaxed mb-6">{cta.description}</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href={cta.link}>
                      <Button className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-5 text-base gap-2">
                        {cta.buttonText} <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                    <a href="https://wa.me/14696134741?text=Hola%2C%20me%20interesa%20obtener%20m%C3%A1s%20informaci%C3%B3n" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="border-[#2A4A6B] text-white hover:bg-[#1E3A5F] px-6 py-5 text-base">
                        Solicitar Información
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {filteredRelated && filteredRelated.length > 0 && (
        <section className="py-16 section-darker">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-serif text-white mb-8">Artículos Relacionados</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {filteredRelated.map((related) => (
                  <Link key={related.id} href={`/news/${related.slug}`}>
                    <div className="group bg-[#132D50] border border-[#1E3A5F] rounded-xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 cursor-pointer h-full">
                      {related.imageUrl && (
                        <img
                          src={related.imageUrl}
                          alt={related.title}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <div className="p-5">
                        <span className="text-primary text-xs font-semibold tracking-wider uppercase">
                          {CATEGORY_LABELS[related.category] || related.category}
                        </span>
                        <h3 className="text-white text-lg mt-2 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {related.title}
                        </h3>
                        <p className="text-white/50 text-sm line-clamp-2">{related.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
