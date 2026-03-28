import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useInView } from "@/hooks/useInView";
import { openWhatsApp, WHATSAPP_PHONE } from "@/lib/whatsapp";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import {
  ArrowRight,
  Mic,
  Newspaper,
  BookOpen,
  Play,
  Calendar,
  CheckCircle2,
  Search,
  ExternalLink,
} from "lucide-react";

/* ─── FadeIn ─── */
function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
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

/* ─── SEO ─── */
function SEOHead() {
  useEffect(() => {
    document.title =
      "Recursos Educativos para Inversionistas | Comprando América";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Accede a podcast, artículos y noticias estratégicas para empresarios e inversionistas que quieren expandirse hacia Estados Unidos."
      );
    }
  }, []);
  return null;
}

/* ─── Episode data ─── */
const episodes = [
  {
    title: "VISA E-1 de COMERCIANTE | La Visa que NADIE conoce",
    videoId: "iFx3QusSR90",
    duration: "40:09",
  },
  {
    title: "BRRRR vs. Flipping: ¿Cuál es la mejor estrategia?",
    videoId: "asOMFCvUZNc",
    duration: "25:16",
  },
  {
    title: "Brian Tracy: ¿Quieres invertir en EE.UU.?",
    videoId: "HAZVutSO7cI",
    duration: "~25:00",
  },
  {
    title: "Deberías COMPRAR un negocio en Estados Unidos",
    videoId: "VZH2JzhVaCk",
    duration: "~35:00",
  },
  {
    title: "¿Cuánto dinero necesitas para la visa E2?",
    videoId: "MVweDe87IEA",
    duration: "35:01",
  },
  {
    title: "Impuestos en la era Trump: Nueva reforma del ISR",
    videoId: "aZwXyxaEWKc",
    duration: "20:03",
  },
];

type Tab = "podcast" | "noticias" | "blog";

/* ─── Format date ─── */
function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* ═══════════════════════════════════════════════════════ */

export default function Recursos() {
  const [activeTab, setActiveTab] = useState<Tab>("podcast");

  // Fetch blog posts
  const { data: blogs = [], isLoading: loadingBlogs } =
    trpc.blogPosts.listPublished.useQuery();

  // Fetch news
  const { data: news = [], isLoading: loadingNews } =
    trpc.news.getLatest.useQuery({ limit: 12 });

  const tabs: { id: Tab; label: string; icon: typeof Mic }[] = [
    { id: "podcast", label: "Podcast", icon: Mic },
    { id: "noticias", label: "Noticias", icon: Newspaper },
    { id: "blog", label: "Blog", icon: BookOpen },
  ];

  const WA_MSG =
    "Hola, vi los recursos en Comprando América y me interesa saber más.";

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead />
      <Navbar />

      {/* ═══ 1. HERO ═══ */}
      <section className="relative isolate pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3A] via-[#0B1F3A] to-[#0E2544]" />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-3xl" />

        <div className="container relative z-10">
          <FadeIn>
            <div className="max-w-3xl">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
                Centro de Recursos
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
                Información estratégica para empresarios que quieren expandirse
                hacia Estados Unidos
              </h1>
              <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-2xl">
                Accede a contenido diseñado para ayudarte a entender cómo
                estructurar, invertir y tomar decisiones empresariales en
                Estados Unidos.
              </p>

              <div className="flex flex-wrap gap-6 text-white/50 text-sm">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Contenido
                  educativo
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Enfoque
                  estratégico
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Sin
                  promesas irreales
                </span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 2. TABS SELECTOR ═══ */}
      <section className="section-darker py-12 md:py-16 sticky top-0 z-30 backdrop-blur-lg bg-[#132D50]/90 border-b border-[#1E3A5F]">
        <div className="container">
          <div className="flex justify-center gap-2 md:gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-lg shadow-blue-600/20"
                    : "bg-[#0F2847]/5 text-white/50 hover:bg-[#1E3A5F] hover:text-white/60"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3-5. CONTENT AREA ═══ */}
      <section className="section-dark py-16 md:py-24 min-h-[60vh]">
        <div className="container">
          <AnimatePresence mode="wait">
            {/* ─── PODCAST ─── */}
            {activeTab === "podcast" && (
              <motion.div
                key="podcast"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="max-w-5xl mx-auto">
                  <div className="mb-10">
                    <h2 className="text-3xl md:text-4xl text-white mb-4">
                      Conversaciones estratégicas para empresarios e
                      inversionistas
                    </h2>
                    <p className="text-white/60 text-lg leading-relaxed max-w-2xl">
                      En el podcast de Comprando América exploramos temas
                      relacionados con inversión, estructura empresarial y
                      expansión hacia Estados Unidos.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {episodes.map((ep, i) => (
                      <a
                        key={i}
                        href={`https://www.youtube.com/watch?v=${ep.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="group bg-[#0F2847] border border-[#1E3A5F] rounded-xl overflow-hidden hover:border-blue-500/30 transition-all">
                          <div className="relative aspect-video bg-black overflow-hidden">
                            <img
                              src={`https://img.youtube.com/vi/${ep.videoId}/mqdefault.jpg`}
                              alt={ep.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                              </div>
                            </div>
                            {ep.duration && (
                              <span className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-white text-xs">
                                {ep.duration}
                              </span>
                            )}
                          </div>
                          <div className="p-4">
                            <p className="text-white/80 text-sm font-medium line-clamp-2 group-hover:text-white transition-colors">
                              {ep.title}
                            </p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>

                  <div className="text-center">
                    <a href="/podcast">
                      <Button
                        variant="outline"
                        className="border-[#2A4A6B] text-white hover:bg-[#1E3A5F] gap-2"
                      >
                        Ver todos los episodios{" "}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── NOTICIAS ─── */}
            {activeTab === "noticias" && (
              <motion.div
                key="noticias"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="max-w-5xl mx-auto">
                  <div className="mb-10">
                    <h2 className="text-3xl md:text-4xl text-white mb-4">
                      Lo que está pasando en Estados Unidos y cómo puede
                      impactarte
                    </h2>
                    <p className="text-white/60 text-lg leading-relaxed max-w-2xl">
                      Análisis de tendencias, cambios y noticias relevantes que
                      pueden influir en decisiones de inversión y expansión
                      empresarial.
                    </p>
                  </div>

                  {loadingNews ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          className="bg-[#0F2847] border border-[#1E3A5F] rounded-xl h-64 animate-pulse"
                        />
                      ))}
                    </div>
                  ) : news.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                      {news.map((article: any) => (
                        <Link key={article.id} href={`/news/${article.slug}`}>
                          <div className="group bg-[#0F2847] border border-[#1E3A5F] rounded-xl overflow-hidden hover:border-blue-500/30 transition-all h-full cursor-pointer">
                            {article.imageUrl && (
                              <div className="aspect-video overflow-hidden bg-black">
                                <img
                                  src={article.imageUrl}
                                  alt={article.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                            )}
                            <div className="p-5">
                              {article.category && (
                                <p className="text-primary text-xs font-semibold uppercase tracking-wider mb-2">
                                  {article.category}
                                </p>
                              )}
                              <h3 className="text-white text-base font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                {article.title}
                              </h3>
                              {article.summary && (
                                <p className="text-white/50 text-sm line-clamp-2 mb-3">
                                  {article.summary}
                                </p>
                              )}
                              <div className="flex items-center gap-2 text-white/40 text-xs">
                                <Calendar className="w-3 h-3" />
                                {formatDate(article.publishedAt || article.createdAt)}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <Newspaper className="w-12 h-12 text-white/30 mx-auto mb-4" />
                      <p className="text-white/50">
                        Próximamente publicaremos noticias y análisis.
                      </p>
                    </div>
                  )}

                  {news.length > 0 && (
                    <div className="text-center">
                      <a href="/news">
                        <Button
                          variant="outline"
                          className="border-[#2A4A6B] text-white hover:bg-[#1E3A5F] gap-2"
                        >
                          Ver todas las noticias{" "}
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ─── BLOG ─── */}
            {activeTab === "blog" && (
              <motion.div
                key="blog"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="max-w-5xl mx-auto">
                  <div className="mb-10">
                    <h2 className="text-3xl md:text-4xl text-white mb-4">
                      Contenido escrito para entender mejor el proceso
                    </h2>
                    <p className="text-white/60 text-lg leading-relaxed max-w-2xl">
                      Artículos desarrollados por el equipo de Comprando América
                      para ayudarte a comprender aspectos clave de inversión,
                      estructura empresarial y estrategia.
                    </p>
                  </div>

                  {loadingBlogs ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          className="bg-[#0F2847] border border-[#1E3A5F] rounded-xl h-64 animate-pulse"
                        />
                      ))}
                    </div>
                  ) : blogs.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                      {blogs.map((post: any) => (
                        <Link key={post.id} href={`/blog/${post.slug}`}>
                          <div className="group bg-[#0F2847] border border-[#1E3A5F] rounded-xl overflow-hidden hover:border-blue-500/30 transition-all h-full cursor-pointer">
                            {post.featuredImage && (
                              <div className="aspect-video overflow-hidden bg-black">
                                <img
                                  src={post.featuredImage}
                                  alt={post.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                            )}
                            <div className="p-5">
                              {post.category && (
                                <p className="text-primary text-xs font-semibold uppercase tracking-wider mb-2">
                                  {post.category}
                                </p>
                              )}
                              <h3 className="text-white text-base font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                {post.title}
                              </h3>
                              {post.excerpt && (
                                <p className="text-white/50 text-sm line-clamp-2 mb-3">
                                  {post.excerpt}
                                </p>
                              )}
                              <div className="flex items-center gap-2 text-white/40 text-xs">
                                <Calendar className="w-3 h-3" />
                                {formatDate(post.publishedAt || post.createdAt)}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <BookOpen className="w-12 h-12 text-white/30 mx-auto mb-4" />
                      <p className="text-white/50">
                        Próximamente publicaremos artículos.
                      </p>
                    </div>
                  )}

                  {blogs.length > 0 && (
                    <div className="text-center">
                      <a href="/blog">
                        <Button
                          variant="outline"
                          className="border-[#2A4A6B] text-white hover:bg-[#1E3A5F] gap-2"
                        >
                          Ver todos los artículos{" "}
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ═══ 6. BLOQUE DE CONVERSIÓN ═══ */}
      <section className="section-darker py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                ¿Estás listo para llevar esto a acción?
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-10">
                El contenido es solo el primer paso. La verdadera diferencia
                está en cómo aplicas esta información.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/perfil">
                  <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/20">
                    Evaluar mi perfil <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <Button
                  variant="outline"
                  onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_MSG)}
                  className="border-[#2A4A6B] text-white hover:bg-[#1E3A5F] px-8 py-6 text-base gap-2"
                >
                  Hablar con un asesor
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 7. CONEXIÓN ECOSISTEMA ═══ */}
      <section className="section-dark py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">
                Ecosistema
              </p>
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                Este contenido es parte de un sistema más grande
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-10">
                Comprando América no solo comparte información. Conecta
                empresarios con oportunidades, comunidad y estructura.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <a href="/membresia">
                  <div className="bg-[#132D50] border border-[#1E3A5F] rounded-xl p-5 hover:border-blue-500/20 transition-all text-center">
                    <p className="text-primary text-sm font-semibold mb-1">
                      Membresía
                    </p>
                    <p className="text-white/50 text-xs">Comunidad privada</p>
                  </div>
                </a>
                <a href="/oportunidades-de-inversion-en-estados-unidos">
                  <div className="bg-[#132D50] border border-[#1E3A5F] rounded-xl p-5 hover:border-blue-500/20 transition-all text-center">
                    <p className="text-primary text-sm font-semibold mb-1">
                      Oportunidades
                    </p>
                    <p className="text-white/50 text-xs">Acceso filtrado</p>
                  </div>
                </a>
                <a href="/llc">
                  <div className="bg-[#132D50] border border-[#1E3A5F] rounded-xl p-5 hover:border-blue-500/20 transition-all text-center">
                    <p className="text-primary text-sm font-semibold mb-1">
                      Estructura
                    </p>
                    <p className="text-white/50 text-xs">LLC en EE.UU.</p>
                  </div>
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 8. CTA FINAL ═══ */}
      <section className="section-darker py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                Empieza a tomar decisiones con más claridad
              </h2>
              <p className="text-white/50 text-sm mb-10">
                Antes de invertir o expandirte… necesitas criterio.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/perfil">
                  <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/20">
                    Evaluar perfil <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <Button
                  variant="outline"
                  onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_MSG)}
                  className="border-[#2A4A6B] text-white hover:bg-[#1E3A5F] px-8 py-6 text-base gap-2"
                >
                  WhatsApp
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
