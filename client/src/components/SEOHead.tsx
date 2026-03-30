import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  schema?: Record<string, unknown> | Record<string, unknown>[];
}

const BASE_URL = "https://comprandoamerica.com";
const DEFAULT_IMAGE = "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439317/comprando-america/smuMGomxJclpEXzg.png";

export default function SEOHead({ title, description, path, image, schema }: SEOHeadProps) {
  const fullUrl = `${BASE_URL}${path}`;
  const ogImage = image || DEFAULT_IMAGE;
  const fullTitle = title.includes("Comprando América") ? title : `${title} | Comprando América`;

  useEffect(() => {
    // Title
    document.title = fullTitle;

    // Meta tags
    const metas: Record<string, string> = {
      description,
      "og:title": fullTitle,
      "og:description": description,
      "og:url": fullUrl,
      "og:image": ogImage,
      "og:type": "website",
      "og:site_name": "Comprando América",
      "og:locale": "es_MX",
      "twitter:card": "summary_large_image",
      "twitter:title": fullTitle,
      "twitter:description": description,
      "twitter:image": ogImage,
      "twitter:url": fullUrl,
    };

    for (const [key, value] of Object.entries(metas)) {
      const isOg = key.startsWith("og:") || key.startsWith("twitter:");
      const attr = isOg ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    }

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = fullUrl;

    // Schema.org JSON-LD
    const existingSchemas = document.querySelectorAll('script[data-page-schema="true"]');
    existingSchemas.forEach((el) => el.remove());

    if (schema) {
      const schemas = Array.isArray(schema) ? schema : [schema];
      for (const s of schemas) {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-page-schema", "true");
        script.textContent = JSON.stringify(s);
        document.head.appendChild(script);
      }
    }

    return () => {
      const pageSchemas = document.querySelectorAll('script[data-page-schema="true"]');
      pageSchemas.forEach((el) => el.remove());
    };
  }, [fullTitle, description, fullUrl, ogImage, schema]);

  return null;
}
