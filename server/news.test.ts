import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the db module to avoid real database dependency
vi.mock("./db", () => {
  const mockArticles = [
    {
      id: 1,
      title: "Visa E-2 en 2026: Lo Que Todo Inversionista Latino Debe Saber",
      slug: "visa-e2-2026-guia-inversionista-latino",
      description: "Las aprobaciones de visa E-2 siguen siendo fuertes en 2026.",
      content: "Las aprobaciones de visa E-2 siguen siendo fuertes en 2026.",
      body: "## La Visa E-2 Sigue Siendo la Ruta Favorita\n\nContenido completo del artículo editorial...",
      url: "https://comprandoamerica.com/news/visa-e2-2026",
      source: "Global Immigration Partners",
      author: "Equipo Comprando América",
      category: "visas-migracion",
      imageUrl: "https://images.unsplash.com/photo-1569974507005.jpg",
      ctaType: "visa-e2",
      publishedAt: new Date("2026-02-20T10:00:00Z"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      title: "Hispanos Rompen Récord: 441,000 Nuevos Propietarios",
      slug: "hispanos-record-propietarios-2025",
      description: "Sin compradores hispanos, el número total habría caído.",
      content: "Sin compradores hispanos, el número total habría caído.",
      body: "## Los Latinos Están Sosteniendo el Mercado\n\nContenido editorial completo...",
      url: "https://comprandoamerica.com/news/hispanos-record",
      source: "NAHREP / U.S. Census Bureau",
      author: "Equipo Comprando América",
      category: "bienes-raices",
      imageUrl: "https://images.unsplash.com/photo-1560518883.jpg",
      ctaType: "bienes-raices",
      publishedAt: new Date("2026-02-21T10:00:00Z"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      title: "La Fed Mantiene Tasas en 3.5%-3.75%",
      slug: "fed-mantiene-tasas-enero-2026",
      description: "La Reserva Federal decidió mantener las tasas sin cambios.",
      content: "La Reserva Federal decidió mantener las tasas sin cambios.",
      body: "## La Fed Presiona el Botón de Pausa\n\nAnálisis editorial completo...",
      url: "https://comprandoamerica.com/news/fed-tasas-2026",
      source: "Federal Reserve / JP Morgan",
      author: "Equipo Comprando América",
      category: "economia-finanzas",
      imageUrl: "https://images.unsplash.com/photo-1611974789855.jpg",
      ctaType: "membresia",
      publishedAt: new Date("2026-02-19T11:00:00Z"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return {
    getLatestNewsArticles: vi.fn(async (limit: number) =>
      mockArticles.slice(0, limit)
    ),
    getNewsArticlesByCategory: vi.fn(async (category: string, limit: number) =>
      mockArticles.filter((a) => a.category === category).slice(0, limit)
    ),
    searchNewsArticles: vi.fn(async (query: string, limit: number) =>
      mockArticles
        .filter((a) => a.title.toLowerCase().includes(query.toLowerCase()))
        .slice(0, limit)
    ),
    getNewsArticleById: vi.fn(async (id: number) =>
      mockArticles.find((a) => a.id === id)
    ),
    getNewsArticleBySlug: vi.fn(async (slug: string) =>
      mockArticles.find((a) => a.slug === slug)
    ),
    createNewsArticle: vi.fn(async (data: any) => ({ id: 99, ...data })),
    deleteNewsArticle: vi.fn(async () => {}),
    // Other db exports needed by routers.ts
    getLatestBlogPosts: vi.fn(async () => []),
    getBlogPostBySlug: vi.fn(async () => undefined),
    createBlogPost: vi.fn(async () => undefined),
    deleteBlogPost: vi.fn(async () => {}),
    getProspects: vi.fn(async () => []),
    createProspect: vi.fn(async () => undefined),
    updateProspectStatus: vi.fn(async () => {}),
    getAllNewsFeeds: vi.fn(async () => []),
    getNewsFeeds: vi.fn(async () => []),
    createNewsFeed: vi.fn(async () => undefined),
    updateNewsFeed: vi.fn(async () => {}),
    deleteNewsFeed: vi.fn(async () => {}),
    getActiveNewsFeeds: vi.fn(async () => []),
    deleteOldNewsArticles: vi.fn(async () => {}),
  };
});

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@comprandoamerica.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  return {
    user: {
      id: 2,
      openId: "regular-user",
      email: "user@example.com",
      name: "Regular User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

describe("News Router — Editorial Content", () => {
  describe("getLatest (public)", () => {
    it("returns latest news articles with editorial fields", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const result = await caller.news.getLatest({ limit: 20 });

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);

      const article = result[0];
      expect(article).toHaveProperty("title");
      expect(article).toHaveProperty("slug");
      expect(article).toHaveProperty("category");
      expect(article).toHaveProperty("body");
      expect(article).toHaveProperty("author");
      expect(article).toHaveProperty("ctaType");
      expect(article).toHaveProperty("source");
    });

    it("respects the limit parameter", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const result = await caller.news.getLatest({ limit: 1 });
      expect(result.length).toBeLessThanOrEqual(1);
    });
  });

  describe("getByCategory (public)", () => {
    it("returns articles filtered by category", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const result = await caller.news.getByCategory({
        category: "visas-migracion",
        limit: 20,
      });

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      result.forEach((article) => {
        expect(article.category).toBe("visas-migracion");
      });
    });

    it("returns empty array for non-existent category", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const result = await caller.news.getByCategory({
        category: "non-existent",
        limit: 20,
      });
      expect(result).toEqual([]);
    });
  });

  describe("search (public)", () => {
    it("returns articles matching search query", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const result = await caller.news.search({ query: "Visa", limit: 20 });

      expect(result.length).toBeGreaterThan(0);
      result.forEach((article) => {
        expect(article.title.toLowerCase()).toContain("visa");
      });
    });

    it("returns empty array for non-matching query", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const result = await caller.news.search({
        query: "xyznonexistent",
        limit: 20,
      });
      expect(result).toEqual([]);
    });
  });

  describe("getBySlug (public)", () => {
    it("returns a single article by slug with full editorial content", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const result = await caller.news.getBySlug({
        slug: "visa-e2-2026-guia-inversionista-latino",
      });

      expect(result).toBeDefined();
      expect(result?.slug).toBe("visa-e2-2026-guia-inversionista-latino");
      expect(result?.title).toContain("Visa E-2");
      expect(result?.body).toContain("##");
      expect(result?.author).toBe("Equipo Comprando América");
      expect(result?.ctaType).toBe("visa-e2");
      expect(result?.source).toBe("Global Immigration Partners");
    });

    it("returns undefined for non-existent slug", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const result = await caller.news.getBySlug({ slug: "non-existent" });
      expect(result).toBeUndefined();
    });
  });

  describe("getById (public)", () => {
    it("returns a single article by id", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const result = await caller.news.getById({ id: 2 });

      expect(result).toBeDefined();
      expect(result?.id).toBe(2);
      expect(result?.category).toBe("bienes-raices");
      expect(result?.ctaType).toBe("bienes-raices");
    });

    it("returns undefined for non-existent id", async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const result = await caller.news.getById({ id: 9999 });
      expect(result).toBeUndefined();
    });
  });

  describe("create (admin only)", () => {
    it("allows admin to create an editorial article with all fields", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      const result = await caller.news.create({
        title: "Nuevo Artículo Editorial",
        description: "Descripción del artículo",
        body: "## Contenido Editorial\n\nAnálisis completo...",
        url: "https://comprandoamerica.com/news/nuevo-articulo",
        source: "Fuente Original",
        author: "Equipo Comprando América",
        category: "inversiones",
        ctaType: "membresia",
        publishedAt: new Date("2026-02-22T10:00:00Z"),
      });

      expect(result).toEqual({ success: true });
    });

    it("auto-generates slug when not provided", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      // The slug generation happens inside the mutation, so we just verify it doesn't throw
      const result = await caller.news.create({
        title: "Artículo Sin Slug Explícito",
        url: "https://comprandoamerica.com/news/sin-slug",
        source: "Test",
        category: "inversiones",
        publishedAt: new Date(),
      });

      expect(result).toEqual({ success: true });
    });

    it("rejects non-admin users from creating articles", async () => {
      const caller = appRouter.createCaller(createUserContext());

      await expect(
        caller.news.create({
          title: "Unauthorized Article",
          url: "https://comprandoamerica.com/news/unauthorized",
          source: "Test",
          category: "inversiones",
          publishedAt: new Date(),
        })
      ).rejects.toThrow();
    });
  });

  describe("delete (admin only)", () => {
    it("allows admin to delete an article", async () => {
      const caller = appRouter.createCaller(createAdminContext());
      const result = await caller.news.delete({ id: 1 });
      expect(result).toEqual({ success: true });
    });

    it("rejects non-admin users from deleting articles", async () => {
      const caller = appRouter.createCaller(createUserContext());
      await expect(caller.news.delete({ id: 1 })).rejects.toThrow();
    });
  });
});
