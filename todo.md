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
- [x] Agregar perfil de Tomás Resendez (Abogado inmigración)
- [x] Agregar perfil de John Mckee (Consultor comercial)
- [x] Agregar perfil de Destiny Bounds (Abogada corporativa y propiedad intelectual)
- [x] Agregar perfil de Aubrey Dwyer (Abogada corporativa)
- [x] Agregar perfil de Daniel Palacios (Contador público certificado)
- [x] Agregar perfil de Sebastián Jara (Consultor de marketing digital)
- [x] Agregar perfil de Joe Faraci (Inversionista en bienes raíces)
- [x] Verificar que todos los expertos se muestren correctamente en la página
