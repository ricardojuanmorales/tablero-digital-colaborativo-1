# Compendio de Sesión — Tablero v1.5
**Fecha:** 2026-05-11  
**Duración estimada:** ~3 horas  
**Rama:** `main`

---

## Objetivo de la sesión

Añadir gestión de colaboradores por correo electrónico y una guía de usuario accesible desde la topbar, sobre la base del backend Hono + Supabase integrado en sesiones anteriores.

---

## Estado al inicio de la sesión

| Elemento | Estado |
|---|---|
| Auth Google + Supabase | ✅ Funcionando |
| API en Render | ✅ Live (`https://tablero-api.onrender.com`) |
| Frontend en GitHub Pages | ✅ Live |
| Tabla `users` (pública) | ✅ Existía en Supabase pero vacía |
| Tabla `board_members` | ✅ Existía pero sin PK compuesta |
| Rutas de miembros | ❌ No existían |
| Rutas de usuarios | ❌ No existían |
| Datos en BD | ❌ 0 filas en todas las tablas (bug FK silencioso) |

---

## Trabajo realizado

### Bloque 1 — Backend

#### `api/src/routes/users.ts` (nuevo)
- `POST /api/users/me` — upsert de perfil al hacer login (usa `onConflictDoUpdate`)
- `GET /api/users/by-email?email=...` — busca usuario por correo para invitar colaboradores

#### `api/src/routes/members.ts` (nuevo)
- `GET /api/boards/:boardId/members` — lista miembros con JOIN a `users` (incluye owner al tope)
- `POST /api/boards/:boardId/members` — añade colaborador por email con verificación de ownership; roles `editor` / `viewer`
- `DELETE /api/boards/:boardId/members/:memberId` — quita colaborador con verificación de ownership

#### `api/src/index.ts` (modificado)
- Registradas dos rutas nuevas:
  ```typescript
  app.route('/api/users', usersRoute);
  app.route('/api/boards/:boardId/members', membersRoute);
  ```

### Bloque 2 — Frontend (`index.html`)

#### Upsert de perfil en login
- `iniciarConSesion()` ahora hace `await POST /api/users/me` **antes** de `cargarAPI()`
- Fix crítico: originalmente era fire-and-forget → race condition → FK violation silenciosa

#### Menú contextual de tableros
- `openCtxMenu()` muestra opción "👥 Colaboradores" únicamente cuando `b.role === 'owner'`
- Rutas al handler `openColaboradores(bid)`

#### Modal de colaboradores (nuevas funciones)
- `openColaboradores(boardId)` — abre modal con lista + formulario de añadir
- `renderColaboradores()` — fetch GET members, renderiza lista con avatar, nombre, email, badge de rol, botón ✕
- `addColaborador()` — fetch POST member; maneja 404 con mensaje "aún no tiene cuenta en Tablero"
- `removeColaborador(userId)` — fetch DELETE member, re-renderiza lista

#### Botón `?` y modal de Guía de usuario
- `renderTB()` — añadido `helpBtn` en home y board
- `openGuia()` — modal con 6 secciones `<details>` colapsables: ¿Qué es Tablero?, Tableros, Tarjetas, Colaboración, Tu cuenta, Atajos

### Bloque 3 — Documentación

- `README.md` reescrito completamente para reflejar v1.5
  - Arquitectura real (Hono · Drizzle · Supabase · Render · GitHub Pages)
  - Todas las features actuales documentadas
  - Roadmap actualizado (v1.5 marcado como completo)

---

## Bugs encontrados y corregidos

| Bug | Causa | Fix |
|---|---|---|
| Colaboradores devuelven 404 | `users` y `boards` en BD vacíos | Await `users/me` antes de `cargarAPI()` |
| FK violation silenciosa en `INSERT boards` | `users` table vacía al momento del insert | Fix de race condition (await) |
| `drizzle-kit push` no conecta localmente | Supabase bloquea IPs no autorizadas | Generado SQL manual en `drizzle/apply_in_supabase.sql` |

---

## Commits de esta sesión

| Hash | Mensaje |
|---|---|
| `97792d9` | fix: await users/me antes de cargar boards — evita violación de FK |
| `ad13542` | docs: actualizar README a v1.5 con arquitectura real y nuevas features |
| `c67789a` | feat: colaboradores por email + guía de usuario |

---

## Estado al final de la sesión

| Elemento | Estado |
|---|---|
| Código en GitHub | ✅ Actualizado (`main`, limpio) |
| API en Render | ✅ Desplegada con nuevas rutas |
| Frontend en GitHub Pages | ✅ Actualizado |
| Schema en Supabase | ✅ Completo (4 tablas, todas las columnas) |
| Datos en BD | ⚠️ 0 filas — requiere re-login del usuario para poblar |
| Colaboradores | ⚠️ Funcional en código; activar con re-login |

---

## Pendiente para próxima sesión

1. **Re-login del usuario** para poblar `users` + migrar boards a Supabase
2. Verificar que colaboradores funcionan end-to-end con dos cuentas reales
3. Considerar notificaciones por email al invitar colaboradores (Resend)
4. Considerar edición colaborativa en tiempo real (WebSockets)

---

---

# Compendio de Sesión — Tablero v1.5 (continuación)
**Fecha:** 2026-05-12  
**Duración estimada:** ~1.5 horas  
**Rama:** `main`

---

## Objetivo de la sesión

Diagnosticar y corregir el problema de login con Google OAuth que impedía entrar al tablero.

---

## Estado al inicio de la sesión

| Elemento | Estado |
|---|---|
| Tablas en Supabase | ✅ Verificadas — todas vacías (0 filas) |
| Google OAuth | ❌ No redirigía al hacer clic |
| API en Render | ❌ Devolvía 500 en `/api/boards` |
| Frontend en GitHub Pages | ✅ Cargando (v1.5) |

---

## Diagnóstico realizado

### Problema 1 — OAuth redirect a 404
- Supabase redirigía a `https://ricardojuanmorales.github.io/` (raíz) → 404
- **Causa:** Site URL en Supabase configurado sin el path del repo
- **Fix (manual en dashboard):** Site URL → `https://ricardojuanmorales.github.io/tablero-digital-colaborativo-1/`

### Problema 2 — Render API devuelve 500
- `GET /api/boards` devolvía 500 con token válido
- **Causa A:** Variables de entorno en Render apuntaban a BD/proyecto Supabase viejo
- **Fix (manual en Render dashboard):** Actualizar `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- **Causa B:** `db.ts` no pasaba `ssl: 'require'` al cliente postgres — Supabase lo exige
- **Fix (código):** `postgres(DATABASE_URL, { ssl: 'require' })`

### Problema 3 — Typo en `api/.env`
- `DATABASE_URL` tenía `ppostgresql://` (doble `p`)
- **Fix:** Corregido a `postgresql://`

---

## Trabajo realizado

### `api/src/db.ts`
```typescript
// Antes:
const client = postgres(process.env.DATABASE_URL!);
// Después:
const client = postgres(process.env.DATABASE_URL!, { ssl: 'require' });
```

### `api/.env`
- Corregido typo: `ppostgresql://` → `postgresql://`

### Render dashboard (manual)
- Actualizadas env vars: `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`

### Supabase dashboard (manual)
- Site URL corregido a `https://ricardojuanmorales.github.io/tablero-digital-colaborativo-1/`
- Redirect URLs añadida: `https://ricardojuanmorales.github.io/tablero-digital-colaborativo-1/`

---

## Commits de esta sesión

| Hash | Mensaje |
|---|---|
| `75b9ba2` | fix: añadir ssl:require al cliente de postgres para Supabase |

---

## Estado al final de la sesión

| Elemento | Estado |
|---|---|
| Código en GitHub | ✅ Actualizado |
| API en Render | ✅ Respondiendo 401 sin token (DB conecta) |
| OAuth redirect | ✅ Site URL corregido en Supabase |
| Login end-to-end | ⚠️ No verificado — sesión cerrada antes de confirmar |
| Datos en BD | ⚠️ 0 filas — el login poblará `users` al completarse |

---

## Pendiente para próxima sesión

1. **Verificar login end-to-end**: hacer login con Google → confirmar que entra al home
2. Confirmar que `public.users` se pobla tras el primer login
3. Confirmar que boards se crean vía API correctamente
4. Verificar colaboradores end-to-end con dos cuentas
