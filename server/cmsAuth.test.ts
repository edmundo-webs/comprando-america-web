import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext; setCookies: { name: string; value: string; options: Record<string, unknown> }[] } {
  const setCookies: { name: string; value: string; options: Record<string, unknown> }[] = [];

  const user: AuthenticatedUser = {
    id: 1,
    openId: "cms-admin-test",
    name: "Test Admin",
    email: "admin@test.com",
    loginMethod: "email",
    role: "admin",
    passwordHash: "hashed",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      cookie: (name: string, value: string, options: Record<string, unknown>) => {
        setCookies.push({ name, value, options });
      },
      clearCookie: () => {},
    } as unknown as TrpcContext["res"],
  };

  return { ctx, setCookies };
}

function createUnauthContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      cookie: () => {},
      clearCookie: () => {},
    } as unknown as TrpcContext["res"],
  };
}

describe("CMS Auth", () => {
  it("auth.me returns null for unauthenticated users", async () => {
    const ctx = createUnauthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("auth.me returns user for authenticated users", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).not.toBeNull();
    expect(result?.email).toBe("admin@test.com");
    expect(result?.role).toBe("admin");
  });

  it("auth.logout clears session cookie", async () => {
    const { ctx } = createAdminContext();
    const clearedCookies: { name: string }[] = [];
    ctx.res.clearCookie = (name: string, _options: Record<string, unknown>) => {
      clearedCookies.push({ name });
    };
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
    expect(clearedCookies).toHaveLength(1);
    expect(clearedCookies[0]?.name).toBe(COOKIE_NAME);
  });
});

describe("Blog Posts API", () => {
  it("blogPosts.listAll returns array for authenticated users", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.blogPosts.listAll();
    expect(Array.isArray(result)).toBe(true);
  });

  it("blogPosts.listPublished returns array for public access", async () => {
    const ctx = createUnauthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.blogPosts.listPublished();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Users API", () => {
  it("users.list returns array for authenticated users", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.users.list();
    expect(Array.isArray(result)).toBe(true);
  });
});
