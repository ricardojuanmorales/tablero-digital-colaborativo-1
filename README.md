# Tablero — MVP v1.0

> Aplicación de tablero colaborativo. Gratis para todos, siempre.

---

## Descripción

Tablero es una app de tablero digital que permite organizar ideas, posts e información en múltiples formatos visuales. Combina lo mejor de Padlet (layouts visuales), Wakelet (sin límites gratis) y Miro (colaboración fluida), con una capa de inteligencia artificial para organizar el contenido automáticamente.

Esta versión **MVP v1.0** es un monolito HTML + JSON pensado para validar el producto rápidamente antes de construir el backend completo.

---

## Funcionalidades del MVP

### Tableros
- Crear, editar y eliminar boards
- Tres niveles de privacidad: `público`, `equipo`, `privado`
- Personalización de ícono y color de portada

### Posts / Tarjetas
- Crear, editar y eliminar posts dentro de cada board
- Campos: título, contenido, etiqueta y color de acento
- Columna Kanban asignable por post

### Layouts
| Layout | Descripción |
|--------|-------------|
| `Muro` | Grid libre de tarjetas con color de acento |
| `Kanban` | Columnas de flujo: Por hacer → En progreso → Revisión → Listo |
| `Línea de tiempo` | Vista de fases del proyecto en barras horizontales |

### Onboarding
- Flujo de 5 pasos en la primera visita
- Selección de rol, nombre, avatar, plantilla inicial, privacidad e invitaciones
- Datos guardados en `localStorage`

### Sugerencias IA (simuladas)
- Panel de chips en la parte inferior del board
- En el MVP: las sugerencias son estáticas y abren prompts guiados
- En v2.0: conectar a Claude API para agrupación semántica real

---

## Arquitectura del MVP (Monolito)

```
tablero-mvp/
├── index.html       ← App completa (HTML + CSS + JS inline)
├── data.json        ← Datos de ejemplo + esquema de referencia
└── README.md        ← Esta documentación
```

### Almacenamiento

El MVP utiliza `localStorage` como base de datos del cliente:

| Clave | Tipo | Descripción |
|-------|------|-------------|
| `tablero_boards` | `Board[]` | Lista de boards del usuario |
| `tablero_posts` | `Record<boardId, Post[]>` | Posts indexados por board |
| `tablero_user` | `User` | Perfil del usuario (onboarding) |
| `tablero_onboarded` | `boolean` | Si el usuario completó el onboarding |

### Esquema de datos

```ts
interface Board {
  id: string;           // UUID generado en cliente
  title: string;
  icon: string;         // Emoji
  color: string;        // Hex (#RRGGBB)
  privacy: 'public' | 'team' | 'private';
  createdAt: string;    // ISO 8601
  updatedAt: string;
}

interface Post {
  id: string;
  boardId: string;
  title: string;
  content: string;
  tag: string;
  color: 'purple' | 'teal' | 'amber' | 'coral' | 'pink' | 'gray';
  kanbanCol: 'todo' | 'in-progress' | 'review' | 'done';
  createdAt: string;
}

interface User {
  name: string;
  avatarColor: string;
  role: 'edu' | 'team' | 'creative' | 'personal';
}
```

---

## Cómo ejecutar

### Opción 1 — Abrir directamente
```bash
open index.html
```
> Funciona en cualquier navegador moderno sin servidor.

### Opción 2 — Con servidor local (recomendado)
```bash
# Python
python3 -m http.server 3000

# Node.js
npx serve .

# VS Code
# Instalar extensión "Live Server" y hacer clic en "Go Live"
```

Luego abrir `http://localhost:3000` en el navegador.

---

## Decisiones de diseño del MVP

### Por qué monolito HTML
- Cero dependencias, cero configuración
- Desplegable en cualquier CDN estático (GitHub Pages, Netlify, Vercel)
- Permite validar el producto con usuarios reales en horas, no semanas
- Migración limpia a Next.js cuando se necesite backend

### Por qué localStorage y no una API
- El MVP valida flujos de UX, no infraestructura
- No requiere backend, base de datos ni autenticación
- Los datos de prueba se pueden sembrar desde `data.json`
- En v2.0 se reemplaza por llamadas a la API REST

### Limitaciones conocidas
| Limitación | Solución en v2.0 |
|------------|-----------------|
| Datos solo en el dispositivo actual | API REST + PostgreSQL |
| Sin colaboración en tiempo real | WebSockets (Partykit / Liveblocks) |
| IA simulada (chips estáticos) | Claude API con embeddings |
| Sin autenticación real | Auth con JWT + OAuth |
| Sin upload de archivos | Upload directo a S3 |

---

## Roadmap

### v1.0 — MVP (este archivo)
- [x] Onboarding de 5 pasos
- [x] CRUD de boards y posts
- [x] 3 layouts: muro, kanban, línea de tiempo
- [x] Persistencia en localStorage
- [x] Sugerencias IA simuladas
- [x] Privacidad configurable por board

### v1.5 — Backend básico
- [ ] API REST con Node.js + Hono
- [ ] PostgreSQL con Drizzle ORM
- [ ] Autenticación con Google OAuth
- [ ] Deploy en Railway / Render

### v2.0 — Colaboración e IA real
- [ ] WebSockets para edición simultánea
- [ ] Claude API para agrupación semántica
- [ ] Upload de imágenes a S3 / R2
- [ ] Notificaciones por email (Resend)

### v3.0 — Plataforma
- [ ] Panel educativo institucional
- [ ] API pública documentada
- [ ] App móvil (React Native)
- [ ] Extensión de navegador

---

## Convenciones de código

- **Nombres de funciones**: `camelCase` en español descriptivo (`crearBoard`, `eliminarPost`)
- **IDs**: prefijo por tipo + timestamp (`board-${Date.now()}`, `post-${Date.now()}`)
- **Estado**: objeto global `state` con una sola fuente de verdad
- **Renderizado**: funciones `render*()` que actualizan el DOM completo del componente
- **Persistencia**: función `guardar()` que sincroniza `state` con `localStorage`

---

## Contribuir

1. Clona el repositorio
2. Edita `index.html` directamente
3. Prueba en el navegador con Live Server
4. Abre un PR con la descripción del cambio

No se necesitan herramientas de build, bundlers ni package managers para el MVP.

---

## Licencia

MIT — Libre para usar, modificar y distribuir.

---

*Construido con HTML, CSS, JavaScript vanilla y muchas ganas.*
