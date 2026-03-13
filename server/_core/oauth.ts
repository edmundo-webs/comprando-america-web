import type { Express, Request, Response } from "express";

/**
 * OAuth routes placeholder.
 * Manus OAuth has been removed. Authentication is handled via CMS email/password login.
 */
export function registerOAuthRoutes(app: Express) {
  app.get("/api/oauth/callback", (_req: Request, res: Response) => {
    res.redirect(302, "/cms/login");
  });
}
