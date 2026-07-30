# Roadmap de Mejoras — Comprando América Web

## Cómo usar este archivo
Cada mejora se planea en **Claude Chat** y se ejecuta en **Claude Code**.
Mover tareas entre secciones conforme avanzan.

---

## 🔴 Alta Prioridad (próximas sesiones)
- [ ] Analizar y estructurar CMS_ComprandoAmerica

## 🟡 Media Prioridad
- [ ] **Página por estado (Texas / Florida)** — destino natural de los argumentos que salieron del
      bloque "Texas o Florida" de la página de LLC, que ahora solo explica el criterio de decisión.
      Los cuatro argumentos siguen guardados en `ESTADO_INFO[estado].argumentos` (`lib/diagnostico.ts`):
      ecosistema empresarial sólido, comunidad latina activa, fuerte conexión con Latinoamérica y
      mercado inmobiliario activo. Su lugar es después de que el diagnóstico rutea, no antes de decidir.
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
- [x] Motor de Recomendación de Ruta (antes "calificación de leads"): el sistema clasifica necesidades y
      recomienda una de cuatro rutas, no aprueba ni rechaza personas. Eliminada la pantalla "hoy no
      calificas para el club de inversión" y toda la lógica de descalificación por capital
- [x] Resultado del diagnóstico en tres capas de visibilidad: Capa A (visible para todos, antes de pedir
      contacto), Capa B (ampliación post-contacto) y Capa C (interno al CRM: nivel de ruta, banderas,
      guion de llamada, recomendación técnica)
- [x] Preguntas nuevas del diagnóstico: proyecto que sostiene la estrategia migratoria (rama Visa),
      inversión identificada y participación buscada (rama Invertir), y microdiagnóstico E1-E3 con
      reasignación de rama para "sigo sin tenerlo claro" (rama Explorando)
- [x] Único límite que queda del servicio en línea: el checkout abre en Texas y Florida (con referido
      externo). Dentro del diagnóstico, "otro estado" solo cambia la ruta recomendada
- [x] Personalización condicionada a señal real y reciente (ventana de continuidad)

---
*Última actualización: 30 julio 2026*
