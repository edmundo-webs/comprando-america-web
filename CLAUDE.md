# CLAUDE.md: sitio web comprandoamerica.com

Guía permanente de este repositorio (`edmundo-webs/comprando-america-web`, en Render como `comprando-america-web`). Léela completa al inicio de cada sesión.

## 1. La regla principal

* Este sitio no tiene base de datos de negocio. Todos los datos (leads, miembros, contenido del portal) viven en la base de datos única del CMS, que es otro repositorio.
* El sitio solo envía datos al CMS (formularios → `POST /api/leads`) y lee información pública del CMS (`/api/public/*`).
* Prohibido:
  * Crear tablas, archivos JSON u hojas de cálculo para guardar leads o miembros.
  * Conectarse directo a la base de datos del CMS.
  * Duplicar lógica del portal de miembros aquí.

## 2. Qué hay en este sitio

* Las páginas públicas de Comprando América.
* Los formularios, que envían a `CMS_API_URL/api/leads` con `fuente: "web"`, la página de origen y los UTM.
  * Si el CMS no responde: reintento y aviso al visitante de que su mensaje se recibió. El envío fallido queda en el registro del servidor, no en una base de datos.
* El botón "Acceso miembros" (menú y pie de página), que lleva a `MIEMBROS_URL` (miembros.comprandoamerica.com).
* La página /sesiones: vitrina con los datos de `CMS_API_URL/api/public/colecciones`.
  * Caché de 10 minutos.
  * Si la API falla, se muestra sin tarjetas, sin error.
  * Se indexa y va en el sitemap.

## 3. Variables de entorno

* `CMS_API_URL`: dirección de la API del CMS.
* `CMS_LEADS_TOKEN`: token para enviar leads. Solo en el servidor, nunca en el navegador.
* `MIEMBROS_URL`: https://miembros.comprandoamerica.com

## 4. Cómo trabajar

1. Haz solo lo que se pide en el chat. Antes de cambiar, di qué archivos vas a tocar y espera un "sí".
2. Trabaja en una rama y prueba en la vista previa de Render antes de producción.
3. No cambies diseño, textos ni páginas que no se pidieron.
4. Mide con la analítica que ya tiene el sitio: envíos de formularios y clics en "Acceso miembros", "Ya soy miembro: entrar" y "Quiero unirme al Grupo Empresarial".
5. Diseño: usa los estilos existentes del sitio (azul marino `#0B1F3A`, acento azul aproximadamente `#3D7FF0`, Playfair Display e Inter).
6. Al terminar, entrega un reporte corto: qué cambió, cómo probarlo y qué variables faltan.

---

## Nota: estado actual del código (septiembre 2026)

Las reglas de arriba son el objetivo. Hoy el código todavía no las cumple del todo. No se corrige nada de esto sin que se pida en el chat; esta nota solo evita que una sesión suponga que ya está hecho.

**Base de datos propia (MySQL, `DATABASE_URL`, esquema en `drizzle/schema.ts`):**

* De contenido y operación del sitio: `users` (panel `/cms`), `blog_posts`, `ca_news_articles`, `ca_news_feeds`, `ca_social_posts`, `ca_ingestion_runs`.
* De negocio, que la regla 1 manda al CMS: `ca_leads`, `ca_news_subscribers`, `ca_diagnostic_responses` (GPS Estratégico).
* De analítica: `ca_cta_clicks`. Es la analítica que ya tiene el sitio (regla 4.4): `client/src/lib/tracking.ts` (`sendCtaClick`, `trackedRedirect`) → `server/routes/track.ts` → se consulta en `/cms/analytics`.
* No se crean tablas nuevas de negocio.

**Tres formas de enviar leads hoy:**

1. Del navegador al CMS: `client/src/lib/crm.ts` (`postCrmLead`) → `VITE_CRM_API_URL/api/public/leads`, sin token. La usan GPS, estructura, LLC, diagnóstico y Cumbre.
2. Del servidor al CMS: `server/_core/cmsLead.ts` (`forwardLeadToCms`) → `CMS_API_URL/api/public/v1/leads`, con `CMS_API_KEY` en el encabezado `x-api-key`.
3. A la tabla local `ca_leads` (tRPC, `server/db.ts`).

**Nombres de variables en uso que difieren de la sección 3:** `VITE_CRM_API_URL` (dirección del CMS en el navegador, por defecto `https://ca-cms.onrender.com`) y `CMS_API_KEY` (el token que la sección 3 llama `CMS_LEADS_TOKEN`).

**Acceso de miembros que ya existe:** `/acceso` (`client/src/pages/Acceso.tsx`, `client/src/lib/portafolio.ts`). Enlace mágico por correo contra `VITE_CRM_API_URL/api/public/portafolio/acceso/*`; el token se guarda en `localStorage` y desbloquea las cifras de `/activos-disponibles`. Es distinto del portal "Mi espacio" en `MIEMBROS_URL`.
