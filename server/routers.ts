import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { NOT_ADMIN_ERR_MSG } from "@shared/const";
import bcrypt from "bcryptjs";
import { ENV } from "./_core/env";
import { sdk } from "./_core/sdk";

// Helper: create CMS session cookie using the SDK's signSession
// The SDK verifySession expects { openId, appId, name } in the JWT payload
async function createCmsSessionToken(user: { id: number; openId: string; email: string | null; name: string | null; role: string }) {
  const token = await sdk.signSession({
    openId: user.openId,
    appId: ENV.appId,
    name: user.name || user.email || "CMS User",
  }, { expiresInMs: 7 * 24 * 60 * 60 * 1000 }); // 7 days
  return token;
}

// Helper: check if user has CMS access (both admin and user roles have access for now)
function requireCmsAccess(role: string) {
  if (role !== "admin" && role !== "user") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Acceso denegado al CMS" });
  }
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ═══ CMS AUTH ROUTER ═══
  cmsAuth: router({
    login: publicProcedure
      .input(z.object({
        email: z.string().email("Email inválido"),
        password: z.string().min(1, "La contraseña es requerida"),
      }))
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserByEmail(input.email);
        if (!user || !user.passwordHash) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Email o contraseña incorrectos" });
        }

        const valid = await bcrypt.compare(input.password, user.passwordHash);
        if (!valid) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Email o contraseña incorrectos" });
        }

        // Update last signed in
        await db.updateUser(user.id, { lastSignedIn: new Date() });

        // Create session token and set cookie
        const token = await createCmsSessionToken(user);
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, {
          ...cookieOptions,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return {
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        };
      }),

    register: publicProcedure
      .input(z.object({
        name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
        email: z.string().email("Email inválido"),
        password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
        role: z.enum(["admin", "user"]).default("user"),
      }))
      .mutation(async ({ input }) => {
        // Check if email already exists
        const existing = await db.getUserByEmail(input.email);
        if (existing) {
          throw new TRPCError({ code: "CONFLICT", message: "Ya existe un usuario con este email" });
        }

        const passwordHash = await bcrypt.hash(input.password, 12);
        const result = await db.createCmsUser({
          name: input.name,
          email: input.email,
          passwordHash,
          role: input.role,
        });

        if (!result) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Error al crear usuario" });
        }

        return { success: true, userId: result.id };
      }),
  }),

  // ═══ USERS ROUTER ═══
  users: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      requireCmsAccess(ctx.user.role);
      const allUsers = await db.getAllUsers();
      // Remove passwordHash from response
      return allUsers.map(({ passwordHash, ...rest }) => rest);
    }),
    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
      requireCmsAccess(ctx.user.role);
      const user = await db.getUserById(input.id);
      if (user) {
        const { passwordHash, ...rest } = user;
        return rest;
      }
      return undefined;
    }),
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
        role: z.enum(["admin", "user"]).default("user"),
      }))
      .mutation(async ({ ctx, input }) => {
        requireCmsAccess(ctx.user.role);
        // Check if email already exists
        const existing = await db.getUserByEmail(input.email);
        if (existing) {
          throw new TRPCError({ code: "CONFLICT", message: "Ya existe un usuario con este email" });
        }
        const passwordHash = await bcrypt.hash(input.password, 12);
        const result = await db.createCmsUser({
          name: input.name,
          email: input.email,
          passwordHash,
          role: input.role,
        });
        if (!result) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Error al crear usuario" });
        }
        return { success: true, userId: result.id };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        role: z.enum(["user", "admin"]).optional(),
        password: z.string().min(6).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        requireCmsAccess(ctx.user.role);
        const { id, password, ...data } = input;
        const updateData: Record<string, unknown> = { ...data };
        if (password) {
          updateData.passwordHash = await bcrypt.hash(password, 12);
        }
        await db.updateUser(id, updateData as any);
        return { success: true };
      }),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
      requireCmsAccess(ctx.user.role);
      // Prevent self-deletion
      if (ctx.user.id === input.id) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "No puedes eliminar tu propia cuenta" });
      }
      await db.deleteUser(input.id);
      return { success: true };
    }),
  }),

  // ═══ BLOG POSTS ROUTER ═══
  blogPosts: router({
    // Public: list published posts
    listPublished: publicProcedure.query(async () => {
      return await db.getPublishedBlogPosts();
    }),
    // Public: get post by slug
    getBySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      return await db.getBlogPostBySlug(input.slug);
    }),
    // CMS: list all posts
    listAll: protectedProcedure.query(async ({ ctx }) => {
      requireCmsAccess(ctx.user.role);
      return await db.getAllBlogPosts();
    }),
    // CMS: get post by id
    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
      requireCmsAccess(ctx.user.role);
      return await db.getBlogPostById(input.id);
    }),
    // CMS: create post
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string(),
        excerpt: z.string().optional(),
        content: z.string(),
        featuredImage: z.string().optional(),
        status: z.enum(["draft", "published", "archived"]).default("draft"),
        publishedAt: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        requireCmsAccess(ctx.user.role);
        await db.createBlogPost({ ...input, createdBy: ctx.user.id });
        return { success: true };
      }),
    // CMS: update post
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        slug: z.string().optional(),
        excerpt: z.string().optional(),
        content: z.string().optional(),
        featuredImage: z.string().optional(),
        status: z.enum(["draft", "published", "archived"]).optional(),
        publishedAt: z.date().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        requireCmsAccess(ctx.user.role);
        const { id, ...data } = input;
        await db.updateBlogPost(id, data);
        return { success: true };
      }),
    // CMS: delete post
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
      requireCmsAccess(ctx.user.role);
      await db.deleteBlogPost(input.id);
      return { success: true };
    }),
  }),

  // ═══ NEWS ROUTER ═══
  news: router({
    // Public: get latest news
    getLatest: publicProcedure
      .input(z.object({ limit: z.number().default(20) }))
      .query(async ({ input }) => {
        return await db.getLatestNewsArticles(input.limit);
      }),
    // Public: get news by category
    getByCategory: publicProcedure
      .input(z.object({ category: z.string(), limit: z.number().default(20) }))
      .query(async ({ input }) => {
        return await db.getNewsArticlesByCategory(input.category, input.limit);
      }),
    // Public: search news
    search: publicProcedure
      .input(z.object({ query: z.string(), limit: z.number().default(20) }))
      .query(async ({ input }) => {
        return await db.searchNewsArticles(input.query, input.limit);
      }),
    // Public: get single article by id
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getNewsArticleById(input.id);
      }),
    // Public: get single article by slug
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getNewsArticleBySlug(input.slug);
      }),
    // Admin: create article (manual)
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string().optional(),
        description: z.string().optional(),
        content: z.string().optional(),
        body: z.string().optional(),
        url: z.string(),
        source: z.string(),
        author: z.string().optional(),
        category: z.string(),
        imageUrl: z.string().optional(),
        ctaType: z.string().optional(),
        publishedAt: z.date(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
        }
        // Auto-generate slug if not provided
        const slug = input.slug || input.title
          .toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        await db.createNewsArticle({ ...input, slug } as any);
        return { success: true };
      }),
    // Admin: delete article
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
        }
        await db.deleteNewsArticle(input.id);
        return { success: true };
      }),
    // Admin: get all feeds
    getFeeds: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
      }
      return await db.getAllNewsFeeds();
    }),
    // Admin: create feed
    createFeed: protectedProcedure
      .input(z.object({
        name: z.string(),
        url: z.string(),
        category: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
        }
        await db.createNewsFeed({ ...input, isActive: "true" } as any);
        return { success: true };
      }),
    // Admin: delete feed
    deleteFeed: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
        }
        await db.deleteNewsFeed(input.id);
        return { success: true };
      }),
  }),

  // NEWS SUBSCRIBERS ROUTER
  newsSubscriber: router({
    // Public: subscribe to news
    subscribe: publicProcedure
      .input(z.object({
        email: z.string().email("Email invalido"),
        name: z.string().optional(),
        categories: z.array(z.string()).default(["all"]),
      }))
      .mutation(async ({ input }) => {
        const existing = await db.getNewsSubscriber(input.email);
        if (existing) {
          throw new TRPCError({ code: "CONFLICT", message: "Este email ya esta suscrito" });
        }
        await db.createNewsSubscriber(input.email, input.name, input.categories);
        return { success: true, message: "Verifica tu email para confirmar la suscripcion" };
      }),
    // Public: verify subscription
    verify: publicProcedure
      .input(z.object({ token: z.string() }))
      .mutation(async ({ input }) => {
        const subscriber = await db.verifyNewsSubscriber(input.token);
        if (!subscriber) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Token de verificacion invalido" });
        }
        return { success: true, message: "Suscripcion verificada" };
      }),
    // Public: unsubscribe
    unsubscribe: publicProcedure
      .input(z.object({ token: z.string() }))
      .mutation(async ({ input }) => {
        const subscriber = await db.unsubscribeNewsSubscriber(input.token);
        if (!subscriber) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Token de desuscripcion invalido" });
        }
        return { success: true, message: "Te has desuscrito correctamente" };
      }),
  }),
});

export type AppRouter = typeof appRouter;
