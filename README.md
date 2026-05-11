# 🗂 Tablero — v1.5

> **Tableros colaborativos visuales. Gratis para todos, siempre.**

Tablero es una app de organización visual que combina lo mejor de Padlet, Wakelet y Miro — con templates inteligentes, tres vistas de visualización y colaboración real por email.

🌐 **Demo en vivo:** [ricardojuanmorales.github.io/tablero-digital-colaborativo-1](https://ricardojuanmorales.github.io/tablero-digital-colaborativo-1)

---

## ✨ Funcionalidades

### 🔐 Autenticación
- Inicio de sesión con **Google OAuth** via Supabase Auth
- Sesión persistente — el token se refresca automáticamente
- Modo local sin cuenta (datos solo en el navegador)

### 🏠 Pantalla de inicio
- Dos secciones: **Creados por mí** y **En colaboración**
- Grilla de tableros con ícono, título, descripción, contador de posts y badge de privacidad
- Menú contextual **⋯** con opciones: Abrir, Editar, Colaboradores, Eliminar
- Modal de confirmación al eliminar — nunca se borra por accidente
- Botón **+ Nuevo tablero** siempre visible con acceso directo a templates
- Ordenar A→Z con un clic

### 📋 Tableros
- Crear con nombre, descripción, ícono, color de portada y privacidad
- **Versión automática** — cada edición incrementa el número de versión (útil para import/export)
- 32 íconos · 6 colores de portada · 3 niveles de privacidad (Personal · Equipo · Público)
- Exportar tablero individual como JSON

### 🃏 Posts / Tarjetas

| Campo | Descripción |
|-------|-------------|
| **Título** | Texto principal |
| **Contenido** | Descripción de apoyo |
| **Etiquetas** | Hasta **5 etiquetas** por tarjeta |
| **Imagen** | URL de imagen (Unsplash, Pexels, Imgur, etc.) |
| **Fuente 1 / Fuente 2** | Dos enlaces externos por tarjeta |
| **Color de borde** | 10 colores de acento |
| **Columna Kanban** | Asignable según el template del tablero |

### 👁 Tres vistas
- **🧱 Muro** — Grid visual con imagen, título y descripción
- **📊 Kanban** — Columnas de flujo según template, con drag entre columnas
- **📅 Línea de tiempo** — Barra horizontal dinámica por columna

### 👥 Colaboradores
- Invitar colaboradores por **correo electrónico** desde el menú ⋯ del tablero
- Dos roles: **Editor** (puede añadir/editar posts) y **Solo lectura**
- El colaborador ve el tablero en su sección "En colaboración" al iniciar sesión
- El dueño puede quitar colaboradores en cualquier momento

### 💾 Exportar / Importar
- Exportar todos los tableros o un tablero individual como JSON
- Importar con modo **Combinar** (sin borrar los actuales) o **Reemplazar**
- Detección de conflicto de versión al importar un tablero que ya existe

### ❓ Guía de usuario
- Botón **?** en la barra superior abre un modal con secciones colapsables
- Cubre: tableros, tarjetas, colaboración, cuenta, atajos

---

## 🎨 Templates disponibles

Al crear un tablero se presentan **6 templates** con columnas y posts de ejemplo:

| Template | Columnas |
|----------|---------|
| 📋 Kanban | Por hacer · En progreso · Revisión · Listo |
| 💡 Tormenta de ideas | Explorar · Profundizar · Seleccionada · Descartada |
| 🗂 Estructura jerárquica | Raíz · Rama · Hoja |
| 🎨 Canvas libre | Zona A · Zona B · Zona C · Zona D |
| 🗺 Roadmap | Planificación · Diseño · Implementación · Evaluación |
| ✦ En blanco | Sin estructura predefinida |

---

## 🏗 Arquitectura

```
tablero-digital-colaborativo-1/
├── index.html            ← Frontend completo (HTML + CSS + JS vanilla)
├── api/                  ← API REST (Hono + Drizzle + Node.js)
│   ├── src/
│   │   ├── index.ts      ← Servidor, CORS, middleware JWT
│   │   ├── db.ts         ← Conexión a Supabase PostgreSQL vía Drizzle
│   │   ├── schema.ts     ← Tablas: users, boards, boardMembers, posts
│   │   └── routes/
│   │       ├── boards.ts    ← CRUD de tableros
│   │       ├── posts.ts     ← CRUD de posts
│   │       ├── users.ts     ← Upsert de perfil + búsqueda por email
│   │       └── members.ts   ← Gestión de colaboradores
│   └── package.json
└── README.md
```

### ☁️ Infraestructura

| Capa | Servicio |
|------|---------|
| Frontend | GitHub Pages |
| API REST | Render (Node.js) |
| Base de datos | Supabase PostgreSQL |
| Autenticación | Supabase Auth + Google OAuth |

### 🗄 Esquema de base de datos

```
users        — id, email, name, avatar_color, role, created_at
boards       — id, user_id, title, description, icon, color, privacy,
               tmpl, default_layout, version, order_index, created_at, updated_at
board_members — board_id, user_id, role   (PK compuesto)
posts        — id, board_id, user_id, title, content, tags[], tag, image,
               source_url, source_url_2, color, kanban_col, created_at
```

### 🔑 Autenticación y autorización

- El frontend obtiene un JWT de Supabase Auth al iniciar sesión con Google
- Cada petición a la API envía `Authorization: Bearer <token>`
- El middleware valida el token con `supabase.auth.getUser(token)` e inyecta `userId` en el contexto
- Las rutas de escritura verifican que el `userId` sea el dueño del recurso

---

## 🚀 Cómo ejecutar localmente

### Frontend
```bash
# Simplemente abre index.html con un servidor local:
npx serve .
# o con VS Code → extensión "Live Server" → "Go Live"
```

### API
```bash
cd api
cp .env.example .env   # Añade SUPABASE_URL, SUPABASE_ANON_KEY, DATABASE_URL
npm install
npm run dev
```

Variables de entorno necesarias en `api/.env`:
```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
DATABASE_URL=postgresql://postgres:password@xxxx.supabase.co:5432/postgres
PORT=3000
```

---

## 🗺 Roadmap

### ✅ v1.0 — Prototipo local
- [x] CRUD de tableros y posts en localStorage
- [x] 3 vistas: Muro · Kanban · Línea de tiempo
- [x] 6 templates con columnas por tipo
- [x] Onboarding de 5 pasos
- [x] Exportar / Importar JSON

### ✅ v1.5 — Backend + Colaboración (actual)
- [x] API REST con Hono + Drizzle + PostgreSQL (Supabase)
- [x] Autenticación con Google OAuth
- [x] Datos sincronizados en la nube
- [x] Hasta 5 etiquetas por tarjeta
- [x] Dos enlaces externos por tarjeta
- [x] Borders de acento en tarjetas
- [x] Versionado de tableros + import con detección de conflictos
- [x] Export de tablero individual
- [x] Home con sección "Creados por mí" y "En colaboración"
- [x] Invitar colaboradores por correo (roles Editor / Solo lectura)
- [x] Guía de usuario accesible desde la topbar

### 🔧 v2.0 — Colaboración en tiempo real e IA
- [ ] WebSockets para edición simultánea (Partykit / Liveblocks)
- [ ] Notificaciones de invitación por email (Resend)
- [ ] Claude API para sugerencias y agrupación semántica real
- [ ] Upload de imágenes con drag & drop (Cloudflare R2)
- [ ] Comentarios en tarjetas

### 🌐 v3.0 — Plataforma
- [ ] Panel educativo institucional (FERPA · COPPA compliant)
- [ ] API pública documentada
- [ ] App móvil nativa
- [ ] Marketplace de templates de la comunidad

---

## 📄 Licencia

MIT — Libre para usar, modificar y distribuir.

---

*Construido con HTML · CSS · JS vanilla · Hono · Drizzle · Supabase — Diseñado con 💜*
