# Prompt de Activación — Tablero v1.5
**Copiar y pegar al inicio de la próxima sesión con Claude Code**

---

```
Continuamos el desarrollo de "Tablero" — app de organización visual colaborativa 
(estilo Padlet/Miro). Lee el archivo docs/primer-continuidad.md antes de comenzar.

## Estado actual del proyecto (2026-05-11)

Stack: HTML + CSS + JS vanilla (index.html monolito ~1,500 líneas) + API Hono v4 + 
Drizzle ORM + Supabase PostgreSQL. Deploy: API en Render, frontend en GitHub Pages.

URLs en producción:
- Frontend: https://ricardojuanmorales.github.io/tablero-digital-colaborativo-1
- API: https://tablero-api.onrender.com

## Lo que está completado (v1.5)

✅ Auth Google OAuth via Supabase (JWT validado en API middleware)
✅ CRUD completo de tableros y posts sincronizado en Supabase
✅ 3 vistas: Muro, Kanban, Línea de tiempo
✅ 6 templates con columnas predefinidas
✅ Hasta 5 etiquetas por tarjeta, 2 enlaces externos
✅ Export/import JSON (individual o todos), detección de conflicto de versión
✅ Sistema de colaboradores por email (roles: editor / solo lectura)
✅ Modal de Guía de usuario con secciones colapsables
✅ Home con sección "Creados por mí" y "En colaboración"
✅ README actualizado a v1.5

## Pendiente inmediato

⚠️ La BD tiene 0 filas porque el usuario principal (ricardo.morales1@upr.edu) 
   no ha hecho re-login desde el fix del race condition (await users/me).
   Verificar primero: hacer logout + login → aceptar migración de datos locales.

⚠️ Probar end-to-end los colaboradores con dos cuentas reales (@upr.edu).

## Archivos clave

- index.html — todo el frontend
- api/src/index.ts — servidor y rutas
- api/src/schema.ts — schema Drizzle
- api/src/routes/members.ts — colaboradores (GET/POST/DELETE)
- api/src/routes/users.ts — upsert perfil + by-email
- docs/primer-continuidad.md — contexto completo del proyecto
- docs/sesion-compendio.md — historial detallado de esta sesión

## Próximas features candidatas (v2.0)

1. Notificación por email al invitar colaborador (Resend API)
2. Edición colaborativa en tiempo real (WebSockets / Partykit)
3. Row-Level Security en Supabase (actualmente sin RLS)
4. Subida de imágenes drag & drop (Cloudflare R2)
5. Comentarios en tarjetas

¿Por dónde empezamos?
```
