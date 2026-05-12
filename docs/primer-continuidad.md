# Primer de Continuidad — Tablero v1.5
**Última actualización:** 2026-05-12

Este documento es el punto de partida para cualquier sesión futura. Léelo antes de tocar código.

---

## ¿Qué es Tablero?

App de organización visual colaborativa (estilo Padlet/Miro). Frontend vanilla JS monolítico en GitHub Pages, API REST en Render, base de datos PostgreSQL en Supabase.

**URLs en producción:**
- Frontend: `https://ricardojuanmorales.github.io/tablero-digital-colaborativo-1`
- API: `https://tablero-api.onrender.com`
- Supabase: proyecto `azklaodfcesmhaidvmwm`

---

## Stack técnico

| Capa | Tecnología |
|---|---|
| Frontend | HTML + CSS + JS vanilla (monolito ~1,500 líneas) |
| API | Hono v4 + Node.js (tsx) |
| ORM | Drizzle ORM |
| Base de datos | Supabase PostgreSQL |
| Auth | Supabase Auth + Google OAuth |
| Deploy API | Render (auto-deploy desde `main`) |
| Deploy Frontend | GitHub Pages (rama `main`, raíz `/`) |

---

## Estructura de archivos clave

```
/
├── index.html                    ← Toda la app frontend
├── docs/
│   ├── sesion-compendio.md       ← Historial de sesiones
│   ├── primer-continuidad.md     ← Este archivo
│   └── prompt-activacion.md     ← Prompt para nueva sesión
└── api/
    ├── src/
    │   ├── index.ts              ← Servidor, CORS, middleware JWT
    │   ├── db.ts                 ← Conexión Drizzle ↔ Supabase (ssl:require)
    │   ├── schema.ts             ← Definición de tablas
    │   └── routes/
    │       ├── boards.ts         ← CRUD tableros
    │       ├── posts.ts          ← CRUD posts
    │       ├── users.ts          ← Upsert perfil + búsqueda email
    │       └── members.ts        ← Gestión colaboradores
    ├── drizzle/
    │   └── apply_in_supabase.sql ← SQL para aplicar schema manualmente
    ├── drizzle.config.ts
    └── .env                      ← No está en git (SUPABASE_URL, DATABASE_URL, etc.)
```

---

## Schema de base de datos (Supabase)

```sql
users        (id uuid PK, email text, name text, avatar_color text, role text, created_at)
boards       (id uuid PK, user_id → users.id, title, description, icon, color, privacy,
              tmpl, default_layout, version int, order_index int, created_at, updated_at)
board_members(board_id → boards.id, user_id → users.id,  ← PK compuesta
              role text default 'editor')
posts        (id uuid PK, board_id → boards.id, user_id → users.id,
              title, content, tag, tags text[], image, source_url, source_url_2,
              color, kanban_col, created_at)
```

**Nota importante:** `boards.user_id` y `posts.user_id` referencian `public.users.id`, NO `auth.users.id`. Ambas usan el mismo UUID de Supabase Auth, pero son tablas distintas.

---

## Flujo de autenticación

```
Usuario → Login Google → Supabase Auth devuelve JWT
  ↓
Frontend: S.token = session.access_token
  ↓
await POST /api/users/me  ← crea/actualiza fila en public.users (FK dependency)
  ↓
await cargarAPI()         ← carga boards y posts desde Supabase
  ↓
Si boards vacíos + hay datos en localStorage → modal migración
```

El middleware de la API extrae `userId` del JWT via `supabase.auth.getUser(token)`.

---

## Configuración crítica (Supabase dashboard)

- **Site URL:** `https://ricardojuanmorales.github.io/tablero-digital-colaborativo-1/`
- **Redirect URLs:** `https://ricardojuanmorales.github.io/tablero-digital-colaborativo-1/`
- Estas deben estar en **Authentication → URL Configuration**

## Configuración crítica (Render dashboard)

Las siguientes env vars deben estar seteadas en el servicio `tablero-api`:

| Variable | Valor |
|---|---|
| `SUPABASE_URL` | `https://azklaodfcesmhaidvmwm.supabase.co` |
| `SUPABASE_ANON_KEY` | (ver api/.env local) |
| `DATABASE_URL` | `postgresql://postgres:[password]@db.azklaodfcesmhaidvmwm.supabase.co:5432/postgres` |

---

## Variables de estado global (frontend)

```javascript
const S = {
  boards: [],      // Board[]  — cargado desde API o localStorage
  posts:  {},      // { boardId: Post[] }
  user:   {},      // { name, avatarColor, role }
  token:  null,    // JWT string | null
  screen: 'home',  // 'home' | 'board' | 'login'
  boardId: null,   // UUID del tablero activo
};
```

---

## Funciones principales del frontend

| Función | Línea aprox. | Descripción |
|---|---|---|
| `iniciarConSesion(session)` | ~505 | Entry point post-login Google |
| `cargarAPI()` | ~411 | Carga boards+posts desde API |
| `renderHome()` | ~651 | Renderiza pantalla home con 2 secciones |
| `renderTB()` | ~602 | Renderiza topbar (botones, avatar, ?) |
| `openCtxMenu(e, id)` | ~949 | Menú contextual ⋯ de tablero |
| `openColaboradores(boardId)` | ~1406 | Modal de colaboradores |
| `openGuia()` | ~1482 | Modal de guía de usuario |
| `saveBoard(e)` | ~916 | Guardar tablero (local + API) |
| `savePost(e)` | ~1099 | Guardar post (local + API) |
| `migrarLocalAAPI()` | ~463 | Migrar datos localStorage → Supabase |
| `openEI(boardId?)` | ~1126 | Modal export/import |

---

## Rutas de la API

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Health check |
| GET | `/api/boards` | Tableros propios + en colaboración |
| POST | `/api/boards` | Crear tablero |
| PUT | `/api/boards/:id` | Editar tablero (solo owner) |
| DELETE | `/api/boards/:id` | Eliminar tablero (solo owner) |
| GET | `/api/boards/:boardId/posts` | Posts del tablero |
| POST | `/api/boards/:boardId/posts` | Crear post |
| PUT | `/api/boards/:boardId/posts/:id` | Editar post (solo autor) |
| DELETE | `/api/boards/:boardId/posts/:id` | Eliminar post (solo autor) |
| POST | `/api/users/me` | Upsert perfil de usuario |
| GET | `/api/users/by-email` | Buscar usuario por email |
| GET | `/api/boards/:boardId/members` | Listar colaboradores |
| POST | `/api/boards/:boardId/members` | Añadir colaborador (solo owner) |
| DELETE | `/api/boards/:boardId/members/:memberId` | Quitar colaborador (solo owner) |

---

## Estado actual de la BD

- **Schema:** ✅ Completo y sincronizado
- **Datos:** ⚠️ 0 filas — el primer login post-fix poblará `public.users` y permitirá usar la app

---

## Convenciones de código

- **Sin `await` en los saves a API** (excepto `users/me`): son fire-and-forget en background para no bloquear la UI
- **localStorage como caché**: siempre se escribe localmente primero, API en background
- **IDs en Supabase**: UUIDs generados por Postgres. Los IDs antiguos del localStorage (`'b' + Date.now()`) son incompatibles con las FKs
- **Modal pattern**: `document.getElementById('modal-root').innerHTML = '<div class="mbk">...</div>'`; `closeModal(event)` cierra al hacer click en el backdrop
- **No usar `confirm()` nativo**: siempre usar el patrón de modal propio (`.confirm-overlay`)

---

## Problemas conocidos / Deuda técnica

| Problema | Impacto | Prioridad |
|---|---|---|
| `drizzle-kit push` no conecta localmente | Bajo (usar SQL manual en Supabase) | Baja |
| Sin notificación al colaborador invitado | El colaborador no sabe que fue invitado | Media |
| Sin edición en tiempo real | Colaboradores no ven cambios del otro en vivo | Alta (v2.0) |
| Sin RLS en Supabase | Cualquier request autenticado puede leer otras tablas vía PostgREST directo | Media |
| Render cold start ~30s | Primera petición después de inactividad es lenta | Baja |

---

## Cómo hacer deploy

```bash
# Todo se despliega con un push a main:
git add .
git commit -m "descripción"
git push origin main

# Render detecta cambios en api/ → redeploy automático (~2 min)
# GitHub Pages detecta cambios en index.html → actualización (~1 min)
```

Para cambios en el schema de BD: ejecutar el SQL en **Supabase → SQL Editor** manualmente (ver `api/drizzle/apply_in_supabase.sql`).
