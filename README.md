# 🗂 Tablero — MVP v1.1

> **Tableros colaborativos visuales. Gratis para todos, siempre.**

Tablero es una app de organización visual que combina lo mejor de Padlet, Wakelet y Miro — con templates inteligentes, tres vistas de visualización y una capa de IA simulada lista para conectar a Claude en v2.0.

---

## ✨ Funcionalidades

### 🏠 Pantalla de inicio
- Grilla de tableros en formato **3 columnas** (responsive: 2 en tablet, 1 en móvil)
- Cada tarjeta muestra **ícono**, **título**, **descripción**, contador de posts y badge de privacidad
- Menú contextual **⋯** en cada tarjeta con opciones: Abrir, Editar y Eliminar
- Modal de confirmación al eliminar — nunca se borra por accidente
- Botón **+ Nuevo tablero** siempre visible con acceso directo a templates
- Contador total de tableros en el encabezado

### 📋 Tableros
- **Crear** tableros con nombre, descripción, ícono, color de portada y privacidad
- **Editar** cualquier propiedad después de creado
- **Eliminar** desde el menú ⋯ del home o desde el modal de edición
- **32 íconos** disponibles: 💡📣🔍🗺📋🎯🚀📊✏️🌟📝🎨🧠🔥⚡🌈🎪🏆🦋🌸🎵🎬🧩📌🌍💎🔮🎉🛠📐🌱🦄
- **6 colores alegres** de portada: amarillo ☀️, verde menta 🌿, celeste 🩵, rosa 🌸, violeta 💜, verde agua 🌊
- **3 niveles de privacidad**: 🌐 Público · 👥 Solo equipo · 🔒 Privado
- Botón **← Mis tableros** siempre visible para volver al home

### 🃏 Posts / Tarjetas
Cada post contiene cuatro campos:

| Campo | Descripción |
|-------|-------------|
| **Título** | Texto principal en 15px bold — destaca visualmente |
| **Descripción** | Texto de apoyo en 12px — detalle de la idea |
| **🖼 Imagen** | URL de imagen (Unsplash, Pexels, Imgur, carpeta `/images`) |
| **🔗 Fuente** | Enlace a la fuente original — botón "Fuente" en la tarjeta |

- **10 colores de acento**: violet 💜 teal 🩵 amber 🟡 coral 🔴 pink 🩷 gray ⚫ blue 🔵 lime 🟢 orange 🟠 cyan 🩵
- **Columna de flujo** asignable según el template del tablero
- Crear, editar y eliminar desde cualquier vista

### 👁 Tres vistas de visualización

#### 🧱 Vista Muro
Grid de tarjetas visuales con imagen de portada, título, descripción breve y botón de fuente. Ideal para lluvia de ideas y colecciones visuales.

#### 📊 Vista Kanban
Columnas de flujo con tarjetas por estado. Las columnas cambian automáticamente según el template del tablero — ver sección de Templates más abajo.

#### 📅 Vista Línea de tiempo
Vista dinámica basada en los posts reales del tablero:
- Cada **fila** es un post con su título y color de acento
- La **barra** avanza horizontalmente según la columna asignada
- El **encabezado** muestra las columnas del template como eje X
- **Leyenda** de colores al pie
- Clic en cualquier fila abre el modal de edición

---

## 🎨 Templates disponibles

Al crear un tablero nuevo se presentan **6 templates** con columnas y posts de ejemplo incluidos. Al seleccionar uno, el ícono, color de portada y nombre se auto-completan, y la vista por defecto se aplica automáticamente al abrir el tablero.

### 📋 Kanban
> Flujo clásico de gestión de tareas

| Por hacer | En progreso | Revisión | Listo |
|-----------|-------------|----------|-------|

### 💡 Tormenta de ideas
> Muro libre para capturar y filtrar ideas

| Explorar | Profundizar | Seleccionada | Descartada |
|----------|-------------|--------------|------------|

### 🗂 Estructura jerárquica
> Organización por niveles de detalle

| Raíz | Rama | Hoja |
|------|------|------|

### 🎨 Canvas libre
> Espacio en blanco sin estructura predefinida

| Zona A | Zona B | Zona C | Zona D |
|--------|--------|--------|--------|

### 🗺 Roadmap
> Fases de un proyecto de principio a fin

| Planificación | Diseño | Implementación | Evaluación |
|---------------|--------|----------------|------------|

### ✦ En blanco
> Sin estructura, para que definas la tuya

| Columna 1 | Columna 2 | Columna 3 |
|-----------|-----------|-----------|

---

## 🤖 Sugerencias IA (simuladas)

Panel de chips en la parte inferior de cada tablero:

- 🔍 **Agrupa ideas similares** — detecta etiquetas comunes en el board
- 🏷 **Sugiere etiquetas** — *(v2.0: Claude API con NLP)*
- 📝 **Genera resumen del board** — título + conteo + temas detectados
- 🔄 **Detecta temas repetidos** — cruza etiquetas duplicadas
- ⚡ **Propón siguiente acción** — *(v2.0: Claude API contextual)*

---

## 💾 Exportar / Importar

Botón **⬇ Exportar / Importar** disponible en la barra superior tanto en el home como dentro de cualquier tablero.

**⬇ Exportar:**
- Descarga `tablero-backup-YYYY-MM-DD.json` con todos tus tableros, posts y perfil
- Preview del JSON antes de confirmar con peso estimado en KB

**⬆ Importar:**
- Zona de drag & drop o selector de archivo `.json`
- Valida el formato antes de habilitar el botón
- Dos modos:
  - 🔀 **Combinar** — agrega tableros sin borrar los actuales (evita duplicados por ID)
  - 🔄 **Reemplazar** — sustituye todo con el contenido del backup

> Para sincronizar entre dispositivos en el MVP, exporta en un equipo e importa en el otro. En v2.0 esto será automático con el backend.

---

## 🧭 Onboarding (primera visita)

Flujo guiado de **5 pasos** al abrir la app por primera vez:

| Paso | Acción |
|------|--------|
| 1️⃣ **Rol** | Educador · Equipo · Creativo · Personal |
| 2️⃣ **Perfil** | Nombre y color de avatar con preview en tiempo real |
| 3️⃣ **Template** | Elige el tipo de tablero inicial |
| 4️⃣ **Privacidad** | Público · Solo equipo · Privado |
| 5️⃣ **Invitar** | Email de colaboradores *(simulado en MVP)* |

---

## 🖼 Imágenes en los posts

El campo de imagen acepta cualquier URL pública:

| Fuente | Ejemplo de URL | Notas |
|--------|---------------|-------|
| **Unsplash** | `https://images.unsplash.com/photo-ID?w=400&q=80` | ⭐ Recomendado — parámetros de tamaño y calidad |
| **Pexels** | `https://images.pexels.com/photos/ID/...` | Gratuito, alta calidad |
| **Imgur** | `https://i.imgur.com/ID.jpg` | Sin cuenta requerida |
| **Carpeta local** | `images/mi-foto.jpg` | Para uso con servidor local o GitHub Pages |
| **Cloudinary** | URL de Cloudinary | Recomendado para v2.0 |

> **Tip Unsplash:** añade `?w=400&q=80` al final de cualquier URL de Unsplash para obtener una imagen de 400px de ancho con 80% de calidad — ideal para las tarjetas.

---

## 🏗 Arquitectura del MVP

```
tablero-mvp/
├── index.html       ← App completa (HTML + CSS + JS, sin dependencias)
├── data.json        ← Datos de ejemplo + esquema de referencia
├── images/          ← (opcional) Imágenes locales para posts
└── README.md        ← Esta documentación
```

### 💿 Almacenamiento en localStorage

| Clave | Tipo | Descripción |
|-------|------|-------------|
| `tb_boards` | `Board[]` | Lista de tableros del usuario |
| `tb_posts` | `Record<boardId, Post[]>` | Posts indexados por tablero |
| `tb_user` | `User` | Perfil del usuario |
| `tb_onboarded` | `boolean` | Si completó el onboarding |

### 📐 Esquema de datos

```typescript
interface Board {
  id: string;             // 'b' + Date.now()
  title: string;
  description: string;   // Descripción breve visible en el home
  icon: string;           // Emoji (32 opciones)
  color: string;          // Hex — 6 colores alegres de portada
  privacy: 'public' | 'team' | 'private';
  tmpl: string;           // 'kanban' | 'brainstorm' | 'hierarchy' | 'canvas' | 'roadmap' | 'blank'
  defaultLayout: string;  // 'wall' | 'kanban' | 'timeline'
  ca: string;             // createdAt ISO 8601
  ua: string;             // updatedAt ISO 8601
}

interface Post {
  id: string;             // 'p' + Date.now()
  bid: string;            // boardId de referencia
  title: string;          // Título principal (bold)
  content: string;        // Descripción breve
  tag: string;            // Etiqueta libre
  image: string;          // URL de imagen (opcional)
  src: string;            // URL de fuente original (opcional)
  color: 'violet' | 'teal' | 'amber' | 'coral' | 'pink' |
         'gray' | 'blue' | 'lime' | 'orange' | 'cyan';
  kc: string;             // ID de columna según template del tablero
  ca: string;             // createdAt ISO 8601
}

interface User {
  name: string;
  avatarColor: string;    // Hex
  role: 'edu' | 'team' | 'creative' | 'personal';
}
```

---

## 🚀 Cómo ejecutar

### Opción 1 — Abrir directamente (más simple)
```bash
open index.html
```
Funciona en cualquier navegador moderno sin necesidad de servidor.

### Opción 2 — Servidor local (recomendado para imágenes locales)
```bash
# Python
python3 -m http.server 3000

# Node.js
npx serve .

# VS Code → extensión "Live Server" → clic en "Go Live"
```
Luego abrir `http://localhost:3000`

### Opción 3 — GitHub Pages (producción MVP)
1. Sube el repositorio a GitHub
2. Ve a **Settings → Pages → Branch: main / root**
3. La app queda disponible en `https://usuario.github.io/tablero-mvp`

---

## ⚙️ Decisiones de diseño

### Por qué monolito HTML
- ✅ Cero dependencias, cero configuración, cero build step
- ✅ Desplegable en GitHub Pages, Netlify o Vercel en segundos
- ✅ Valida el producto con usuarios reales en horas, no semanas
- ✅ Migración limpia a Next.js cuando se necesite backend real

### Por qué localStorage y no una API
- ✅ El MVP valida flujos de UX, no infraestructura
- ✅ Sin backend, sin base de datos, sin autenticación
- ✅ Exportar / Importar JSON cubre sincronización básica entre dispositivos
- 🔄 Se reemplaza en v2.0 tocando únicamente `guardar()` y `cargar()`

### ⚠️ Limitaciones conocidas

| Limitación | Solución en v2.0 |
|------------|-----------------|
| 💾 Datos solo en el navegador actual | API REST + PostgreSQL |
| 👥 Sin colaboración en tiempo real | WebSockets (Partykit / Liveblocks) |
| 📧 Invitaciones simuladas | Sistema real con email (Resend) |
| 🤖 IA simulada con chips estáticos | Claude API con embeddings semánticos |
| 🖼 Sin subida de imágenes | Upload drag & drop a Cloudflare R2 |
| 🔐 Sin autenticación real | Google OAuth + JWT |

---

## 🗺 Roadmap

### ✅ v1.1 — MVP actual
- [x] Onboarding guiado de 5 pasos
- [x] CRUD completo de tableros y posts
- [x] 3 vistas: Muro · Kanban · Línea de tiempo dinámica
- [x] 6 templates con columnas específicas por tipo
- [x] Posts con imagen, descripción, etiqueta y enlace a fuente
- [x] 10 colores de acento · 32 íconos · 6 colores alegres de portada
- [x] Menú contextual ⋯ con opciones Abrir, Editar, Eliminar
- [x] Modal de confirmación para eliminar tableros
- [x] Exportar / Importar JSON (combinar o reemplazar)
- [x] Botón ← Mis tableros en todos los tableros
- [x] Pantalla home con grilla 3×2 y descripción de tableros
- [x] Panel de sugerencias IA simulado
- [x] Persistencia completa en localStorage

### 🔧 v1.5 — Backend básico
- [ ] API REST con Node.js + Hono
- [ ] PostgreSQL con Drizzle ORM + pgvector
- [ ] Autenticación con Google OAuth
- [ ] Row-Level Security para privacidad de tableros
- [ ] Deploy en Railway / Render / Fly.io

### 🤝 v2.0 — Colaboración e IA real
- [ ] WebSockets para edición simultánea en tiempo real
- [ ] Sistema de invitaciones por email con Resend
- [ ] Claude API para sugerencias y agrupación semántica real
- [ ] Upload de imágenes con drag & drop a Cloudflare R2
- [ ] Notificaciones push en tiempo real

### 🌐 v3.0 — Plataforma
- [ ] Panel educativo institucional (FERPA · COPPA compliant)
- [ ] API pública documentada (pay-as-you-go)
- [ ] App móvil nativa (React Native — código compartido con web)
- [ ] Extensión de navegador Chrome / Firefox
- [ ] Marketplace de templates de la comunidad

---

## 🧑‍💻 Convenciones de código

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Funciones | camelCase descriptivo | `renderHome()`, `guardarPost()` |
| IDs | prefijo + timestamp | `'b' + Date.now()` |
| Estado global | objeto `S` | `S.boards`, `S.posts`, `S.user` |
| Renderizado | funciones `render*()` | `renderBoard()`, `renderLayout()` |
| Persistencia | `guardar()` / `cargar()` | Único punto de contacto con localStorage |
| Modales | `closeModal(event)` | Click en backdrop cierra el modal |
| Notificaciones | `toast(msg)` | Mensaje flotante de 3.2 segundos |
| Menús contextuales | `openCtxMenu(e, id)` | Se cierra al hacer click afuera |

---

## 🤝 Contribuir

1. Clona el repositorio: `git clone https://github.com/usuario/tablero-mvp`
2. Abre `index.html` con Live Server en VS Code
3. Edita el archivo directamente — no hay build step
4. Prueba en Chrome y Firefox antes de hacer PR
5. Abre un Pull Request con descripción del cambio y capturas de pantalla

> No se necesitan npm, bundlers ni herramientas de build. Todo vive en un solo archivo HTML de ~1,100 líneas.

---

## 📄 Licencia

MIT — Libre para usar, modificar y distribuir.

---

*Construido con HTML · CSS · JavaScript vanilla — Diseñado con 💜 y muchas iteraciones*
