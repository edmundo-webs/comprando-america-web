# Roadmap de Mejoras — Comprando América Web

## Cómo usar este archivo
Cada mejora se planea en **Claude Chat** y se ejecuta en **Claude Code**.
Mover tareas entre secciones conforme avanzan.

---

## 🔴 Alta Prioridad (próximas sesiones)
- [ ] Analizar y estructurar CMS_ComprandoAmerica

## 🟡 Media Prioridad
- [ ] Revisar y optimizar SEO en páginas principales (meta tags, OG tags)
- [ ] Mejorar velocidad de carga (lazy loading de imágenes, code splitting)
- [ ] Asegurar que el sitio sea completamente responsivo en móvil

## 🟢 Baja Prioridad / Futuro
- [ ] **Venta de consultorías** — Agregar sección/página para contratar consultorías (requiere integración de pagos)
- [ ] Integración más visible con portal de miembros
- [ ] Página de testimonios expandida
- [ ] Sistema de leads / captura de contactos mejorado

## ✅ Completado
- [x] Migrar DiagnosticoPage al sitio principal con ruta `/diagnostico`
- [x] Conexión de `/estructura-de-inversion-en-usa` al CRM (diagnóstico interactivo + formulario)
- [x] Centralización de `postCrmLead` en `client/src/lib/crm.ts` (deuda técnica: ya no está duplicado)
- [x] Selector de intención cruzado entre las dos páginas de estructura (LLC e Inversión)
- [x] Consolidación de los 3 mecanismos de "no sé qué necesito" en un solo diagnóstico (LLC)
- [x] Corrección de la pregunta de estado y nueva rama de derivación a despacho asociado
- [x] Ficha unificada WhatsApp + CRM para las ramas de resultado del diagnóstico de LLC
- [x] Punto de entrada único de dos puertas (compra directa / diagnóstico integral) en ambas guías de estructura
- [x] Contenido educativo embebido en los pasos del diagnóstico, en lugar de entrega de PDF
- [x] Reglas de descalificación: estado no cubierto (con referido) y capital menor al mínimo
- [x] Personalización condicionada a señal real y reciente (ventana de continuidad)

---
*Última actualización: 28 julio 2026*
