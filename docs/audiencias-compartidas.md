# Base de audiencias compartida (newsletter de los 3 sitios)

Los tres sitios — **comprando-america**, **edmundo-trevino** y
**garantias-extraordinarias** — escriben sus suscriptores, leads y contactos
en una misma base MySQL/TiDB, marcando el sitio y el formulario de origen
para poder enviar correos a audiencias segmentadas.

## Arquitectura

- Cada sitio conserva su base de datos propia (blog, noticias, etc.).
- Además, cada sitio abre un segundo pool hacia la base compartida
  (`MARKETING_DATABASE_URL`) mediante el módulo `server/marketing.ts`
  (mismo archivo en los 3 repos; solo cambian las constantes
  `MARKETING_SITE` / `MARKETING_SITE_NAME`).
- Las tablas se crean solas al arrancar el servidor (DDL idempotente,
  `ensureMarketingTables()`); no hay migraciones que coordinar entre repos.
- Si `MARKETING_DATABASE_URL` no está configurada o la base falla, el sitio
  sigue funcionando: la captura local nunca se bloquea por la compartida.

## Tablas

### `mk_subscribers` — maestro de contactos (dedupe por email)

| Columna | Descripción |
|---|---|
| `email` (único) | Identidad del contacto, en minúsculas |
| `name`, `whatsapp` | Se rellenan con el primer valor no vacío que llegue |
| `firstSite`, `firstForm` | Primer origen del contacto |
| `sites` (JSON) | Todos los sitios donde ha aparecido, ej. `["comprando-america","edmundo-trevino"]` |
| `interests` (JSON) | Categorías acumuladas (las del newsletter de comprando-america) |
| `status` | `active` / `unsubscribed` — la baja es global para los 3 sitios |
| `isVerified` | `true` tras confirmar el doble opt-in |
| `verificationToken`, `unsubscribeToken` | Tokens de los links del correo |
| `utmSource/Medium/Campaign` | UTM de la primera captura |

### `mk_events` — bitácora de capturas

Cada alta, lead, contacto, verificación o baja queda registrada con
`site`, `form`, `eventType` (`subscribe` / `lead` / `contact` / `verify` /
`unsubscribe`) y el `payload` completo del formulario en JSON. Esto permite
segmentar por "llegó por X" sin perder historial cuando un email se repite
entre sitios.

## Qué formulario alimenta qué

| Sitio | Formulario | `form` | `eventType` | Doble opt-in |
|---|---|---|---|---|
| comprando-america | Newsletter (categorías) | `newsletter` | subscribe | Sí |
| comprando-america | Landings de leads (cumbre, GPS…) | la `fuente` del lead | lead | No |
| comprando-america | ProspectForm ("Solicita más información") | `prospecto` | lead | No |
| comprando-america | Diagnóstico GPS Estratégico | `diagnostico` | lead | No |
| edmundo-trevino | LeadForm (newsletter / lead magnets) | el `source` del form | subscribe | Sí |
| edmundo-trevino | Contacto | `contacto` | contact | No |
| edmundo-trevino | Conferencista | `conferencista` | contact | No |
| garantias-extraordinarias | Newsletter | `newsletter` | subscribe | Sí |
| garantias-extraordinarias | Idea de lector (con email) | `idea-lector` | contact | No |
| garantias-extraordinarias | Comentario de blog (con email) | `comentario-blog` | contact | No |

Regla de reactivación: una re-suscripción explícita (`subscribe`) reactiva a
un dado de baja; un lead o contacto NO revierte la baja.

## Doble opt-in y bajas (Resend)

- Al suscribirse al newsletter se envía un correo de confirmación vía
  Resend con un link a `GET /api/marketing/verify?token=...` del sitio
  donde se suscribió.
- Todo correo debe incluir el link de baja
  `GET /api/marketing/unsubscribe?token=...` (token en
  `mk_subscribers.unsubscribeToken`). La baja marca `status='unsubscribed'`
  y aplica a los envíos de los 3 sitios.

## Variables de entorno (en cada sitio)

```
MARKETING_DATABASE_URL=mysql://user:pass@host:4000/marketing   # la MISMA en los 3
RESEND_API_KEY=re_...
RESEND_FROM="Nombre del sitio <news@dominio-verificado.com>"   # dominio verificado en Resend
SITE_BASE_URL=https://dominio-del-sitio.com                    # para los links del correo
```

En TiDB Cloud basta con crear una base `marketing` en el cluster existente
y un usuario con permisos sobre ella; las tablas se crean solas.

## Segmentación — ejemplos

```sql
-- Audiencia lista para campañas (verificada y activa) de un sitio
SELECT email, name FROM mk_subscribers
WHERE status='active' AND isVerified='true'
  AND JSON_CONTAINS(sites, '"comprando-america"');

-- Interesados en bienes raíces, sin importar el sitio
SELECT email FROM mk_subscribers
WHERE status='active' AND isVerified='true'
  AND JSON_CONTAINS(interests, '"bienes-raices"');

-- Todos los que pidieron informes de conferencias
SELECT DISTINCT email FROM mk_events WHERE form='conferencista';

-- Presentes en dos sitios (audiencia cruzada)
SELECT email FROM mk_subscribers
WHERE JSON_CONTAINS(sites, '"comprando-america"')
  AND JSON_CONTAINS(sites, '"edmundo-trevino"');
```

Nota de cumplimiento: los contactos de formularios (`lead` / `contact`) no
pasaron por doble opt-in. Para campañas masivas conviene segmentar con
`isVerified='true'`, o enviarles primero una invitación a confirmar.

## Migración de datos históricos (pendiente, manual)

Los suscriptores previos viven en `ca_news_subscribers` (comprando-america)
y `newsletter_subscribers` (garantias). Para volcarlos a la base compartida:

```sql
-- Desde la base de comprando-america (ajustar nombres de schema):
INSERT IGNORE INTO marketing.mk_subscribers
  (email, name, firstSite, firstForm, sites, interests, status, isVerified, unsubscribeToken)
SELECT LOWER(email), name, 'comprando-america', 'newsletter',
       '["comprando-america"]', categories,
       IF(isActive='true','active','unsubscribed'), isVerified,
       COALESCE(unsubscribeToken, SUBSTRING(MD5(RAND()) FROM 1 FOR 32))
FROM comprando.ca_news_subscribers;

-- Desde la base de garantias:
INSERT IGNORE INTO marketing.mk_subscribers
  (email, name, firstSite, firstForm, sites, status, isVerified, unsubscribeToken)
SELECT LOWER(email), name, 'garantias-extraordinarias', 'newsletter',
       '["garantias-extraordinarias"]',
       IF(status='active','active','unsubscribed'), 'false',
       SUBSTRING(MD5(RAND()) FROM 1 FOR 32)
FROM garantias.newsletter_subscribers;
```

(`INSERT IGNORE` respeta el dedupe por email: el primero que entra fija el
`firstSite`.)

## Próximos pasos sugeridos

1. Crear la base `marketing` en TiDB Cloud y configurar las 4 env vars en
   los 3 despliegues.
2. Verificar el dominio remitente en Resend y poner `RESEND_FROM`.
3. Ejecutar la migración de históricos (arriba).
4. Construir el envío de campañas segmentadas (leer `mk_subscribers`,
   enviar por lotes vía Resend con el link de baja de cada contacto).
5. Extender el admin de comprando-america para ver/exportar segmentos.
