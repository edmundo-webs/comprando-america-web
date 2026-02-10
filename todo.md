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
