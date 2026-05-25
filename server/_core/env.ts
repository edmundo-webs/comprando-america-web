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
  // News publishing pipeline — LLM (OpenAI-compatible: Ollama / GLM cloud).
  // If LLM_BASE_URL is set, the pipeline routes all text generation through it.
  // Otherwise it falls back to GEMINI_API_KEY (legacy path).
  llmBaseUrl: process.env.LLM_BASE_URL ?? "",
  llmApiKey: process.env.LLM_API_KEY ?? "",
  llmDefaultModel: process.env.LLM_DEFAULT_MODEL ?? "glm-5.1:cloud",
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  pexelsApiKey: process.env.PEXELS_API_KEY ?? "",
  // Admin REST API token for the external editor agent (OpenClaw / Yael)
  adminToken: process.env.ADMIN_TOKEN ?? "",
  // Metricool — social distribution
  metricoolApiKey: process.env.METRICOOL_API_KEY ?? "",
  metricoolUserId: process.env.METRICOOL_USER_ID ?? "1748825",
  metricoolBlogId: process.env.METRICOOL_BLOG_ID ?? "4294668",
  // SMTP — outbound email (nodemailer)
  smtpHost: process.env.SMTP_HOST ?? "",
  smtpPort: parseInt(process.env.SMTP_PORT ?? "587", 10),
  smtpUser: process.env.SMTP_USER ?? "",
  smtpPass: process.env.SMTP_PASS ?? "",
  smtpFrom: process.env.SMTP_FROM ?? "",
};
