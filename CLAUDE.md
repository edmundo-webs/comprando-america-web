# CLAUDE.md: sitio web comprandoamerica.com

Guía permanente de este repositorio (`edmundo-webs/comprando-america-web`, en Render como `comprando-america-web`). Léela completa al inicio de cada sesión.

## 1. La regla principal

* Este sitio no tiene base de datos de negocio. Todos los datos (leads, miembros, contenido del portal) viven en la base de datos única del CMS, que es otro repositorio.
* El sitio solo envía datos al CMS (formularios → `POST /api/leads`) y lee información pública del CMS (`/api/public/*`).
* Prohibido:
  * Crear tablas, archivos JSON u hojas de cálculo para guardar leads o miembros.
  * Conectarse directo a la base de datos del CMS.
  * Duplicar lógica del portal de miembros aquí.
* Excepción permitida: `ca_cta_clicks`. Es la analítica de clics del sitio (qué botón, en qué página, a dónde llevaba, un identificador de visita al azar y los UTM). No guarda nombre, email ni teléfono, así que se queda en la base del sitio.

## 2. Qué hay en este sitio

* Las páginas públicas de Comprando América.
* Los formularios, que envían del servidor a `CMS_API_URL` con el token `CMS_API_KEY`, con `fuente: "web"`, la página de origen y los UTM.
  * Si el CMS no responde: reintento y aviso al visitante de que su mensaje se recibió. El envío fallido queda en el registro del servidor, no en una base de datos.
* El botón "Acceso miembros" (menú y pie de página), que lleva a `MIEMBROS_URL` (miembros.comprandoamerica.com). Pendiente: el portal aún no existe.
* La página /sesiones (pendiente, cuando exista el portal): vitrina con los datos de `CMS_API_URL/api/public/colecciones`.
  * Caché de 10 minutos.
  * Si la API falla, se muestra sin tarjetas, sin error.
  * Se indexa y va en el sitemap.

## 3. Variables de entorno

* `CMS_API_URL`: dirección de la API del CMS, usada por el servidor.
* `CMS_API_KEY`: token para enviar leads (encabezado `x-api-key`). Solo en el servidor, nunca en el navegador.
* `VITE_CRM_API_URL`: dirección del CMS para lecturas públicas desde el navegador (por ejemplo, el portafolio). Por defecto `https://ca-cms.onrender.com`. Nunca lleva tokens.
* `MIEMBROS_URL`: https://miembros.comprandoamerica.com

## 4. Cómo trabajar

1. Haz solo lo que se pide en el chat. Antes de cambiar, di qué archivos vas a tocar y espera un "sí".
2. Trabaja en una rama y prueba en la vista previa de Render antes de producción.
3. No cambies diseño, textos ni páginas que no se pidieron.
4. Mide con la analítica que ya tiene el sitio: envíos de formularios y clics en "Acceso miembros", "Ya soy miembro: entrar" y "Quiero unirme al Grupo Empresarial".
5. Diseño: usa los estilos existentes del sitio (azul marino `#0B1F3A`, acento azul aproximadamente `#3D7FF0`, Playfair Display e Inter).
6. Al terminar, entrega un reporte corto: qué cambió, cómo probarlo y qué variables faltan.

## 5. Regla: teléfonos siempre con código de país

* Todo campo de teléfono, en cualquier formulario del sitio web, del CMS o del portal, lleva un selector de país obligatorio (bandera, nombre y código, con búsqueda) separado del número.
* Prohibido adivinar el país: no se asume México ni ningún otro por defecto de forma oculta. Sin país elegido, el formulario no se envía y muestra "Selecciona el código de tu país".
* Valida el número según el país elegido con `libphonenumber-js`.
* Se guarda solo en formato internacional E.164 (ejemplo: `+523346766178`). Este formato se usa para comparar duplicados, armar ligas de WhatsApp y mostrar el número.
* La API del CMS (`/api/public/v1/leads` y cualquier otra que reciba teléfonos):
  * Acepta números en E.164.
  * Si llega uno sin código de país, no lo rechaza (para no perder el lead): lo guarda como llegó y lo marca como "código de país pendiente".
  * Nunca lo completa adivinando.
* Los teléfonos ya guardados sin código se marcan como "código de país pendiente" y aparecen en una lista del CMS para que el equipo los confirme. No se corrigen automáticamente.

---

## Nota: estado actual del código (septiembre 2026)

Las reglas de arriba son el objetivo. Hoy el código todavía no las cumple del todo. No se corrige nada de esto sin que se pida en el chat; esta nota solo evita que una sesión suponga que ya está hecho.

**Base de datos propia (MySQL, `DATABASE_URL`, esquema en `drizzle/schema.ts`):**

* De contenido y operación del sitio: `users` (panel `/cms`), `blog_posts`, `ca_news_articles`, `ca_news_feeds`, `ca_social_posts`, `ca_ingestion_runs`.
* De negocio: `ca_leads`, `ca_news_subscribers`, `ca_diagnostic_responses`. **Desde la Tanda 1 ya no se escriben**; se conservan con lo que tenían. `scripts/contar-registros.mjs` las cuenta (solo lectura) y `scripts/exportar-leads-a-cms.mjs` las exporta al CMS (sin `--enviar` no manda nada).
* De analítica: `ca_cta_clicks`, la excepción permitida de la regla 1: `client/src/lib/tracking.ts` (`sendCtaClick`, `trackedRedirect`) → `server/routes/track.ts` → se consulta en `/cms/analytics`.
* No se crean tablas nuevas de negocio.

**Un solo camino para los leads (desde la Tanda 1):**

* Navegador → `POST /api/leads` de este sitio (`client/src/lib/crm.ts`, `postCrmLead`) → servidor (`server/routes/leads.ts`) → CMS con `CMS_API_KEY` (`server/_core/cmsLead.ts`).
* Formularios y cuestionarios van a `CMS_API_URL/api/public/leads`, que guarda la ficha del GPS y los datos del formulario como notas visibles. Hoy esa dirección no revisa el token; se manda igual para cuando el CMS lo exija.
* El boletín de `/news` va a `CMS_API_URL/api/public/v1/leads`, que sí exige el token.
* Si un teléfono no llega en E.164, se manda como llegó y se anota "Código de país del teléfono: pendiente" en los datos del formulario (la API del CMS aún no tiene un campo para esa marca).
* Si el CMS no responde, el servidor reintenta en segundo plano; si al final no entra, el envío completo queda en el registro de Render (buscar `ENVIO FALLIDO`).
* Ya no existe la conexión directa a la base del CRM (`CRM_DATABASE_URL`).
* El número de WhatsApp del sitio vive solo en `client/src/lib/whatsapp.ts` (`WHATSAPP_E164`).

**Acceso de miembros que ya existe:** `/acceso` (`client/src/pages/Acceso.tsx`, `client/src/lib/portafolio.ts`). Enlace mágico por correo contra `VITE_CRM_API_URL/api/public/portafolio/acceso/*`; el token se guarda en `localStorage` y desbloquea las cifras de `/activos-disponibles`. Es distinto del portal "Mi espacio" en `MIEMBROS_URL`.
