import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { IMAGES } from "@/lib/constants";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cldSrcSet, cldUrl } from "@/lib/cloudinary";
import { useParams } from "wouter";

function estimateReadTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = trpc.blogPosts.getBySlug.useQuery(
    { slug: params.slug || "" },
    { enabled: !!params.slug }
  );

  // ─── SEO: build per-post meta + JSON-LD when post is loaded ──────
  const seoNode = post && post.status === "published" ? (() => {
    const url = `https://comprandoamerica.com/blog/${post.slug}`;
    const img = post.featuredImage?.startsWith("http")
      ? post.featuredImage
      : "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439317/comprando-america/smuMGomxJclpEXzg.png";
    const desc = (post.excerpt || post.metaDescription || "").slice(0, 200) ||
      "Blog de Comprando América — análisis profundo de visa E-2, LLC, bienes raíces e inversión en EE.UU.";
    return (
      <SEOHead
        title={post.title}
        description={desc}
        path={`/blog/${post.slug}`}
        image={img}
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: desc,
            image: [img],
            datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
            dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
            author: { "@type": "Organization", name: "Equipo Comprando América" },
            publisher: {
              "@type": "Organization",
              name: "Comprando América",
              logo: {
                "@type": "ImageObject",
                url: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439317/comprando-america/smuMGomxJclpEXzg.png",
              },
            },
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            inLanguage: post.language === "en" ? "en-US" : "es-MX",
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: "https://comprandoamerica.com/" },
              { "@type": "ListItem", position: 2, name: "Blog", item: "https://comprandoamerica.com/blog" },
              { "@type": "ListItem", position: 3, name: post.title, item: url },
            ],
          },
        ]}
      />
    );
  })() : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {seoNode}
      <Navbar />

      {/* Hero / Header */}
      <section className="relative pt-28 pb-16 md:pt-32 md:pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.08_0.03_264)] via-[oklch(0.10_0.01_264)] to-background" />
        <div className="container relative z-10">
          <a href="/#blog">
            <Button
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-[#1E3A5F] mb-8 gap-2 -ml-2"
            >
              <ArrowLeft className="w-4 h-4" /> Volver al Blog
            </Button>
          </a>

          {isLoading && (
            <div className="max-w-3xl">
              <div className="h-8 w-3/4 bg-[#0F2847]/5 rounded animate-pulse mb-4" />
              <div className="h-4 w-1/2 bg-[#0F2847]/5 rounded animate-pulse mb-6" />
              <div className="h-4 w-1/3 bg-[#0F2847]/5 rounded animate-pulse" />
            </div>
          )}

          {error && (
            <div className="max-w-3xl text-center py-20">
              <h1 className="text-3xl font-serif text-white mb-4">Artículo no encontrado</h1>
              <p className="text-white/50 mb-8">
                El artículo que buscas no existe o ha sido removido.
              </p>
              <a href="/#blog">
                <Button className="bg-primary hover:bg-primary-blue-dark text-white gap-2">
                  <ArrowLeft className="w-4 h-4" /> Volver al Blog
                </Button>
              </a>
            </div>
          )}

          {post && (
            <div className="max-w-3xl">
              {post.status !== "published" && (
                <span className="inline-block bg-yellow-500/20 text-yellow-400 text-xs font-mono tracking-wider px-3 py-1 rounded-full mb-4">
                  BORRADOR
                </span>
              )}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white leading-tight mb-6">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-lg text-white/60 leading-relaxed mb-8 max-w-2xl">
                  {post.excerpt}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-6 text-sm text-white/50">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString("es-MX", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{estimateReadTime(post.content)} min de lectura</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Comprando América</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Image */}
      {post?.featuredImage && (
        <section className="container relative z-10 -mt-4 mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl overflow-hidden border border-[#1E3A5F]">
              <img
                src={cldUrl(post.featuredImage, { width: 1200 })}
                srcSet={cldSrcSet(post.featuredImage, [640, 960, 1200, 1600])}
                sizes="(max-width: 1024px) 100vw, 1024px"
                alt={post.title}
                fetchPriority="high"
                decoding="async"
                className="w-full h-auto max-h-[500px] object-contain bg-[#132D50]"
              />
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      {post && (
        <section className="container pb-24 md:pb-32">
          <div className="max-w-3xl mx-auto">
            <article
              className="blog-content prose prose-invert prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Divider */}
            <div className="border-t border-[#1E3A5F] mt-16 pt-12">
              <div className="bg-[oklch(0.14_0.02_264)] border border-[#1E3A5F] rounded-2xl p-8 md:p-10 text-center">
                <h3 className="text-2xl font-serif text-white mb-3">
                  ¿Te interesa invertir en Estados Unidos?
                </h3>
                <p className="text-white/50 mb-6 max-w-lg mx-auto">
                  Únete a nuestra comunidad exclusiva de inversionistas latinos y accede a oportunidades filtradas por expertos.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href="/#membresia">
                    <Button className="bg-primary hover:bg-primary-blue-dark text-white font-semibold px-8 py-5 gap-2">
                      Conoce el Club de Inversión
                    </Button>
                  </a>
                  <a href="/#blog">
                    <Button variant="outline" className="border-[#2A4A6B] text-white hover:bg-[#1E3A5F] px-8 py-5">
                      Ver más artículos
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
