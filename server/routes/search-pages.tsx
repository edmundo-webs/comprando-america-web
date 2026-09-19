import type { Request, Response, NextFunction } from "express";
import React from "react";
import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const escape = (v: string) => v.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const cache = new Map<string,string>();
export function searchPages(req: Request, res: Response, next: NextFunction) {
 if (req.method !== "GET" && req.method !== "HEAD") return next();
 const route = req.path.replace(/\/$/, "") || "/";
 if (route === "/visa-e2-inversion-en-estados-unidos") return res.redirect(301, "/visa-e2-inversionista-usa");
 const entry = PAGES[route];
 if (!entry) return next();
 // Same complete component tree for visitors and crawlers, without UA sniffing.
 try {
  if (!cache.has(route)) {
   const filename = process.env.NODE_ENV === "production"
    ? path.join(path.dirname(fileURLToPath(import.meta.url)), "public/index.html")
    : path.join(process.cwd(), "dist/public/index.html");
   if (!fs.existsSync(filename)) return next();
   const queryClient = new QueryClient({defaultOptions:{queries:{retry:false}}});
   const body = renderToString(<QueryClientProvider client={queryClient}><Router ssrPath={route}>{entry.element}</Router></QueryClientProvider>);
   queryClient.clear();
   let html = fs.readFileSync(filename, "utf8");
   html = html.replace(/<title>[\s\S]*?<\/title>/gi, "").replace(/<meta\b[^>]*(?:name|property)=["'](?:description|keywords|og:[^"']*|twitter:[^"']*)["'][^>]*>/gi, "")
    .replace(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi, "")
    .replace(/<link\b[^>]*hreflang=["'][^"']*["'][^>]*>/gi, "")
    .replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, "");
   const canonical=SITE+route;
   const schema=[{"@context":"https://schema.org","@type":"Organization",name:BRAND,url:SITE}, ...(entry.schema ? [entry.schema] : [])];
   const head=`<title>${escape(entry.title)}</title><meta name="description" content="${escape(entry.description)}"><link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:site_name" content="${BRAND}"><meta property="og:title" content="${escape(entry.title)}"><meta property="og:description" content="${escape(entry.description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${IMAGE}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(entry.title)}"><meta name="twitter:description" content="${escape(entry.description)}"><meta name="twitter:image" content="${IMAGE}"><script type="application/ld+json" data-page-schema="true">${JSON.stringify(schema).replace(/</g,"\\u003c")}</script>`;
   html=html.replace("</head>",head+"</head>").replace(/<div id="root">\s*<\/div>/,()=>`<div id="root">${body}</div>`);
   if (!html.includes(body)) throw new Error("SPA root not found");
   cache.set(route,html);
  }
  res.type("html").send(cache.get(route));
 } catch(error) { console.error("[search-pages] render failed",error);next(error); }
}

import Home, { PAGE_SEO } from "../../client/src/pages/Home";
import VisaE2 from "../../client/src/pages/VisaE2";
import { INVESTOR_SEO, INVESTOR_SCHEMA } from "../../shared/investor-search";
const SITE="https://comprandoamerica.com", BRAND="Comprando América", IMAGE="https://res.cloudinary.com/dgruohz6f/image/upload/v1773439317/comprando-america/smuMGomxJclpEXzg.png";
const PAGES: Record<string,{title:string;description:string;schema?:object;element:React.ReactNode}> = {
 "/": {...PAGE_SEO,element:<Home/>},
 [INVESTOR_SEO.path]: {...INVESTOR_SEO,schema:INVESTOR_SCHEMA,element:<VisaE2/>}
};
