import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import { useInView } from "@/hooks/useInView";
import { IMAGES } from "@/lib/constants";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, Search } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { Link } from "wouter";

// ─── Animated wrapper ───
function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isInView } = useInView();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Format date ───
function formatDate(date: Date | string): string {
  const d = new Date(date);
  const months = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

// ─── Calculate reading time ───
function calculateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, "");
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / 200);
}

export default function BlogList() {
  const { data: blogs, isLoading } = trpc.blogPosts.listPublished.useQuery();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and sort blogs
  const filteredBlogs = useMemo(() => {
    if (!blogs) return [];
    
    let filtered = [...blogs];
    
    // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          blog =>
            blog.title.toLowerCase().includes(query) ||
            (blog.excerpt && blog.excerpt.toLowerCase().includes(query))
        );
      }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return filtered;
  }, [blogs, searchQuery]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[50vh] flex items-center pt-32 pb-20">
        <div className="absolute inset-0 -z-10">
          <img src={IMAGES.hero} alt="Blog" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.08_0.03_250/0.92)] via-[oklch(0.10_0.03_250/0.85)] to-[oklch(0.08_0.03_250/0.70)]" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-block text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
                Recursos
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-[1.1] mb-6">
                Blog de Inversión en <span className="gradient-text-primary">Estados Unidos</span>
              </h1>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-10 max-w-2xl">
                Estrategias, análisis y consejos de expertos para inversionistas que buscan oportunidades en el mercado estadounidense.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ SEARCH ═══ */}
      <section className="section-darker py-12">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Buscar artículos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[oklch(0.15_0.03_250)] border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ BLOG GRID ═══ */}
      <section className="section-dark py-24 md:py-32">
        <div className="container">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-white/60 mt-4">Cargando artículos...</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/60 text-lg mb-4">
                {searchQuery ? "No se encontraron artículos que coincidan con tu búsqueda." : "No hay artículos publicados aún."}
              </p>
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery("")}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/5"
                >
                  Limpiar búsqueda
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-8">
                <p className="text-white/60 text-sm">
                  Mostrando <span className="text-primary font-semibold">{filteredBlogs.length}</span> artículos
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBlogs.map((blog, i) => {
                  const readingTime = calculateReadingTime(blog.content);
                  return (
                    <FadeIn key={blog.id} delay={i * 0.05}>
                      <Link href={`/blog/${blog.slug}`}>
                        <a className="group h-full block">
                          <div className="relative bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-500 h-full flex flex-col">
                            {/* Image */}
                            {blog.featuredImage && (
                              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-transparent">
                                <img
                                  src={blog.featuredImage}
                                  alt={blog.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.10_0.03_250)] to-transparent" />
                              </div>
                            )}

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-grow">
                              {/* Date and reading time */}
                              <div className="flex items-center gap-4 mb-4 text-white/50 text-sm">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {formatDate(blog.createdAt)}
                                </div>
                                <span>•</span>
                                <span>{readingTime} min de lectura</span>
                              </div>

                              {/* Title */}
                              <h3 className="text-xl font-serif text-white mb-3 group-hover:text-primary transition-colors line-clamp-3">
                                {blog.title}
                              </h3>

                              {/* Excerpt */}
                              {blog.excerpt && (
                                <p className="text-white/60 text-sm leading-relaxed mb-6 flex-grow line-clamp-2">
                                  {blog.excerpt}
                                </p>
                              )}

                              {/* Read more link */}
                              <div className="flex items-center gap-2 text-primary group-hover:gap-3 transition-all">
                                <span className="text-sm font-semibold">Leer más</span>
                                <ArrowRight className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        </a>
                      </Link>
                    </FadeIn>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="section-darker py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
                ¿Quieres Acceso a Más Contenido Exclusivo?
              </h2>
              <p className="text-white/60 text-lg mb-10 leading-relaxed">
                Únete a nuestra comunidad de inversionistas y accede a análisis profundos, estrategias probadas y oportunidades filtradas.
              </p>
              <Link href="/membresia">
                <a>
                  <Button className="bg-primary hover:bg-primary-dark text-white font-semibold px-10 py-6 text-lg gap-2">
                    Conocer Membresía <ArrowRight className="w-5 h-5" />
                  </Button>
                </a>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
