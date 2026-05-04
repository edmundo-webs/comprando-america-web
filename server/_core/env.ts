export const ENV = {
  appId: process.env.VITE_APP_ID ?? "comprando-america",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  // Cloudinary
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ?? "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
  // OpenAI (for AI image generation in CMS — separate from the news pipeline)
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  // News publishing pipeline (shared credentials with Web-News-TTS)
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  pexelsApiKey: process.env.PEXELS_API_KEY ?? "",
  // Metricool — social distribution
  metricoolApiKey: process.env.METRICOOL_API_KEY ?? "",
  metricoolUserId: process.env.METRICOOL_USER_ID ?? "1748825",
  metricoolBlogId: process.env.METRICOOL_BLOG_ID ?? "4294668",
};
