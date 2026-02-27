# Comprando América - TODO

## Backend / Base de Datos
- [x] Crear esquema de base de datos para blogs
- [x] Crear esquema de base de datos para usuarios (roles: admin/user)
- [x] Crear API REST para CRUD de usuarios
- [x] Crear API REST para CRUD de blogs
- [x] Implementar autenticación con Manus OAuth
- [x] Crear panel de administración (admin)
- [x] Crear módulo de gestión de usuarios en admin
- [x] Crear módulo de gestión de blogs en admin
- [x] Integrar página de inicio para consumir blogs dinámicamente del CMS
- [x] Mantener diseño actual alineado con logo oficial

## Editor de Texto Enriquecido (TipTap)
- [x] Instalar dependencias de TipTap
- [x] Crear componente RichTextEditor con toolbar completo
- [x] Integrar editor en formulario de creación/edición de blogs
- [x] Renderizar contenido HTML en la página de blog

## Autenticación CMS con Email/Contraseña
- [x] Agregar campo passwordHash al esquema de usuarios
- [x] Crear API de login con email/contraseña
- [x] Crear API de registro de usuarios CMS
- [x] Crear página de login del CMS en /cms/login
- [x] Proteger rutas del CMS con autenticación

## Módulo de Gestión de Usuarios
- [x] Crear página de gestión de usuarios en /cms/users
- [x] CRUD completo de usuarios (crear, editar, eliminar)
- [x] Asignar roles admin/usuario
- [x] Mismo nivel de acceso para ambos roles (por ahora)

## Rutas CMS
- [x] Mover panel admin de /admin a /cms
- [x] Configurar layout del CMS con sidebar
- [x] Dashboard del CMS en /cms
- [x] Módulo blogs en /cms/blog-posts
- [x] Módulo usuarios en /cms/users

## Tests
- [x] Tests para autenticación email/contraseña
- [x] Tests para API de blogs con contenido enriquecido

## Página Individual de Blog
- [x] Crear página /blog/:slug con renderizado de contenido HTML
- [x] Agregar estilos para contenido de blog (headings, listas, citas, código)
- [x] Incluir CTA al final del artículo
- [x] Agregar metadatos (fecha, tiempo de lectura, autor)
- [x] Botón de volver al blog


## Integración WhatsApp
- [x] Crear función auxiliar para generar URL de WhatsApp con mensaje automático
- [x] Actualizar botón "Solicitar Información" en Home.tsx para redireccionar a WhatsApp
- [x] Actualizar botón "Solicitar Información" en Navbar.tsx para redireccionar a WhatsApp
- [x] Verificar funcionamiento del enlace en navegador


## Página de Membresía Detallada
- [x] Crear página /membresia/ con contenido extraído y adaptado
- [x] Implementar sección "¿Qué incluye tu membresía?" con 6 pilares
- [x] Implementar sección de planes (Entry, Growth, Legacy) con detalles
- [x] Implementar sección de inversiones estratégicas y áreas de inversión
- [x] Implementar sección de preguntas frecuentes
- [x] Verificar diseño responsive y consistencia visual


## Página de Listado de Blog
- [x] Crear página /blog/ con grid de artículos publicados
- [x] Implementar búsqueda de artículos por título y contenido
- [x] Mostrar fecha, imagen y título de cada artículo
- [x] Mostrar tiempo de lectura estimado
- [x] Integrar con CMS para mostrar blogs dinámicamente
- [x] Verificar diseño responsive y consistencia visual


## Favicon y Branding
- [x] Configurar favicon con logotipo de Comprando América en la pestaña del navegador


## Página de Bienes Raíces en USA
- [x] Crear página /bienes-raices-en-usa/ con contenido adaptado
- [x] Implementar sección de pilares de inversión (6 items)
- [x] Implementar sección de acompañamiento experto
- [x] Implementar sección de errores comunes
- [x] Implementar FAQ con 3 preguntas
- [x] Implementar sección de criterios de membresía
- [x] Implementar formulario de contacto con campos específicos
- [x] Verificar diseño responsive y consistencia visual


## Página de Formación
- [x] Crear página /formacion/ con contenido adaptado
- [x] Implementar sección hero con descripción de formación
- [x] Implementar 4 módulos de temario (Detección, Evaluación, Operación, Crecimiento)
- [x] Mostrar 6 temas por módulo con estructura clara
- [x] Integrar formulario de contacto con campos específicos
- [x] Verificar diseño responsive y consistencia visual


## Página de Estructura de Inversión en USA
- [x] Crear página /estructura-de-inversion-en-usa/ con contenido adaptado
- [x] Implementar sección hero con descripción de estructuración legal
- [x] Implementar sección "Por qué muchos fallan" con 3 puntos clave
- [x] Implementar sección "Qué incluye nuestro acompañamiento" con 5 items
- [x] Implementar sección "¿Para quién es este servicio?" con criterios
- [x] Implementar FAQ con 3 preguntas expandibles
- [x] Integrar formulario de contacto con campos específicos
- [x] Verificar diseño responsive y consistencia visual


## Página de Visa E-2 Inversionista USA
- [x] Crear página /visa-e2-inversionista-usa/ con contenido adaptado
- [x] Implementar sección hero con descripción de asesoría migratoria
- [x] Implementar sección "Errores que evitamos" con 4 puntos clave
- [x] Implementar sección "Qué incluye la asesoría" con 6 items
- [x] Implementar sección "¿Por qué elegir Comprando América?" con 4 puntos
- [x] Implementar FAQ con 4 preguntas expandibles
- [x] Integrar formulario de contacto con campos específicos
- [x] Verificar diseño responsive y consistencia visual


## Foto de Edmundo Treviño
- [x] Copiar foto de Edmundo Treviño a carpeta pública
- [x] Actualizar sección "Dedicación. Experiencia. Pasión" con foto de Edmundo
- [x] Verificar que la foto se muestre correctamente en la página de inicio


## Página de Expansión Internacional de Empresas
- [x] Crear página /expansion-internacional-empresas/ con contenido adaptado
- [x] Implementar sección hero con imagen y descripción de expansión
- [x] Implementar sección "¿Por qué apostar por la expansión internacional?" con 4 puntos
- [x] Implementar sección "Estrategias de expansión internacional" con 4 items
- [x] Implementar sección "Cómo internacionalizar una empresa paso a paso" con 5 pasos
- [x] Implementar sección "Inversionistas: conviertan la expansión en su ventaja"
- [x] Implementar FAQ con 3 preguntas expandibles
- [x] Integrar formulario de contacto con campos específicos
- [x] Verificar diseño responsive y consistencia visual


## Sección de Podcast
- [x] Agregar botón YouTube en sección de Podcast (https://www.youtube.com/playlist?list=PLRSYRwqvqDN_T6CzDxD041FCUyyMmMyV9)
- [x] Agregar botón Spotify en sección de Podcast (https://open.spotify.com/show/1pYUGyRRFXgA0c9xpaEtw7)
- [x] Verificar que los botones se muestren correctamente


## Sección de Expertos Adicionales
- [x] Agregar perfil de Tomás Resendez (Abogado inmigración) con foto profesional
- [x] Agregar perfil de John Mckee (Consultor comercial)
- [x] Agregar perfil de Destiny Bounds (Abogada corporativa y propiedad intelectual)
- [x] Agregar perfil de Aubrey Dwyer (Abogada corporativa)
- [x] Agregar perfil de Daniel Palacios (Contador público certificado)
- [x] Agregar perfil de Sebastián Jara (Consultor de marketing digital)
- [x] Agregar perfil de Joe Faraci (Inversionista en bienes raíces)
- [x] Verificar que todos los expertos se muestren correctamente en la página


## Actualizacion de Imagenes - Sesion Febrero 2026
- [x] Cambiar imagen de pagina de Formacion por foto de mujer con graficos de analisis financiero
- [x] Subir nueva imagen a S3 (gIkDHHfSsRMuETsG.png)
- [x] Actualizar Formacion.tsx con nueva URL de CDN

## Actualizacion de Fondos de Paginas - Sesion Febrero 2026
- [x] Agregar imagen de bienes raices como fondo del hero de Bienes Raices en USA
- [x] Subir imagen a S3 (UEcLjYyFixTUEbdp.jpeg)
- [x] Actualizar BienesRaices.tsx con imagen de fondo


## Portal de Noticias Automatizado - Febrero 2026
- [x] Actualizar schema de base de datos para tabla de artículos de noticias
- [x] Crear tabla news_articles con campos: id, title, description, url, source, category, published_at, image_url, content
- [x] Crear tabla news_feeds con URLs de feeds RSS por categoría
- [x] Crear procedimientos tRPC para gestionar noticias (getByCategory, getLatest, search)
- [x] Implementar RSS parser con librería rss-parser
- [x] Crear cron job para sincronizar feeds cada 4 horas
- [x] Crear componentes React: NewsCard, NewsFilter, NewsList
- [x] Implementar página /news con layout de categorías
- [x] Agregar filtros por categoría (visas, economía, bienes-raices, llc, inversiones)
- [x] Implementar búsqueda de noticias
- [x] Agregar paginación a lista de noticias
- [ ] Optimizar para SEO (meta tags, keywords, sitemap)
- [x] Crear tests para sincronización de feeds
- [x] Crear tests para procedimientos tRPC de noticias


## Mejoras del Portal de Noticias - Fase 2
- [x] Poblar base de datos con noticias reales de cada categoría
- [x] Crear script seed-news.mjs para insertar noticias iniciales
- [x] Agregar meta tags dinámicos a página /news para SEO
- [x] Implementar schema.org markup (NewsArticle, BreadcrumbList)
- [ ] Crear sitemap XML para noticias
- [x] Agregar sección "Noticias Destacadas" en página de inicio
- [x] Crear componente NewsHighlights para mostrar 3 noticias por categoría
- [x] Implementar tabla news_subscribers en base de datos
- [x] Crear procedimiento tRPC para suscribirse a notificaciones
- [ ] Implementar servicio de envío de emails
- [ ] Crear email template para notificaciones de noticias
- [ ] Configurar cron job para enviar notificaciones diarias


## Reestructuración Portal de Noticias - Febrero 2026
- [x] Borrar todas las noticias actuales de la base de datos
- [x] Actualizar schema para soportar contenido editorial completo (body HTML)
- [x] Crear página de detalle de artículo /news/:slug con contenido completo
- [x] Agregar CTA al final de cada artículo según categoría
- [x] Agregar navbar de Comprando América al portal de noticias
- [x] Investigar noticias reales recientes para cada categoría
- [x] Redactar contenido editorial con tono casual-profesional
- [x] Incluir mención de fuente original en la redacción
- [x] Agregar perspectiva de Comprando América en cada nota
- [x] Poblar base de datos con artículos editoriales completos
- [x] Actualizar tests para nueva estructura


## Página de Ruta Inmobiliaria en Estados Unidos - Febrero 2026
- [x] Crear nueva página /ruta-inmobiliaria-en-estados-unidos con contenido de evento privado
- [x] Implementar sección hero con información del evento (fecha, hora, ubicación, cupo)
- [x] Agregar descripción de qué trata el evento y a quién está dirigido
- [x] Implementar sección de agenda (mañana y tarde)
- [x] Agregar sección de oportunidades (Fondo de Tierra + Single Family Homes)
- [x] Implementar sección de precios con descuento por fecha
- [x] Integrar botón de registro por WhatsApp
- [x] Integrar botón de pago con Clover
- [x] Agregar sección FAQ con preguntas frecuentes expandibles
- [ ] Incluir perfil de Edmundo Treviño con foto (placeholder)
- [ ] Agregar sección de evidencia/testimonios de eventos anteriores
- [ ] Implementar sección de "Por qué asistir" con beneficios clave
- [x] Agregar sección de requisitos y perfil ideal del inversionista
- [ ] Crear componente de contador de cupos disponibles
- [x] Verificar diseño responsive y consistencia visual


## Reorganización de Navegación - Febrero 2026
- [x] Actualizar componente Navbar con nueva estructura de menú
- [x] Mover "Formación" dentro del desplegable de "Recursos"
- [x] Crear nuevo botón "Próximos Eventos" con desplegable
- [x] Agregar "Ruta Inmobiliaria" dentro del desplegable de "Próximos Eventos"
- [x] Eliminar sección "Noticias Destacadas" de la página Home
- [x] Verificar todos los enlaces de navegación funcionan correctamente


## Agregar Imágenes a Ruta Inmobiliaria - Febrero 2026
- [x] Agregar imagen de Fondo de Tierra Estratégica a la sección de Oportunidades
