# Jhonkarly Website

Sitio web construido con Vite + React + TypeScript.

## Requisitos

- Node.js 18+
- npm o bun

## Desarrollo local

### npm

```sh
npm install
npm run dev
```

### bun

```sh
bun install --frozen-lockfile
bun run dev
```

## Build de producción

### npm

```sh
npm run build
npm run preview
```

### bun

```sh
bun run build:bun
bun run preview
```

## Vercel (Bun recomendado)

- **Install Command:** `bun install --frozen-lockfile`
- **Build Command:** `bun run build:bun`
- **Output Directory:** `dist`

## Imágenes de la web

Todas las imágenes locales se gobiernan por carpetas: para cambiar cualquier
imagen basta con pegar o quitar el archivo en su subcarpeta de `src/assets/`
(sin tocar código). El sistema vive en `src/lib/imagenes.ts` y la guía de qué
carpeta gobierna cada imagen está en
[`src/assets/LEEME-IMAGENES.md`](src/assets/LEEME-IMAGENES.md).

El ícono de la pestaña (hacha nórdica) está en `public/favicon.svg`.

## Contenido de Trayectoria

La página `/trayectoria` muestra tres bloques administrables:

- **Logros** — medallas (1er/2º/3er lugar), récords (nacionales o internacionales)
  y participaciones destacadas.
- **El recorrido** — cronología de hitos (2010 → Los Ángeles 2028).
- **Resultados oficiales** — competencias con marca y puesto.

Todo se edita desde el panel **`/dashboard/trayectoria`** (hitos y logros, con
crear/editar/eliminar) y **`/dashboard/competencias`** (marcas oficiales). Se
necesita una cuenta con rol `admin` o `master`.

**Requisito único (una sola vez):** ejecutar la migración
`supabase/migrations/008_trayectoria.sql` en Supabase Dashboard → SQL Editor.
Crea las tablas `trajectory_milestones` y `achievements` con el contenido
inicial (9 hitos + 5 logros). No la ejecutes dos veces o los datos se duplican.

Mientras Supabase no esté configurado (o la migración no se haya ejecutado), la
página pública muestra automáticamente los **datos de respaldo** integrados en
`src/lib/api/trayectoria.ts` (`DEFAULT_MILESTONES` / `DEFAULT_ACHIEVEMENTS`),
así nunca se ve vacía. El panel admin sí requiere Supabase para guardar cambios.

## Variables de entorno

Copia `.env.example` a `.env` y rellena (Supabase Dashboard → Settings → API):

| Variable | Descripción |
| --- | --- |
| `VITE_SUPABASE_URL` | URL del proyecto Supabase (`https://….supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Clave pública `anon` (nunca la `service_role`) |
| `VITE_DEMO_ADMIN` | `true` = vista previa del dashboard sin login (solo desarrollo) |

Tras editar `.env`, reinicia el servidor de desarrollo.

## Stack

- Vite
- React
- TypeScript (strict)
- Tailwind CSS
- shadcn/ui

## Dominio

Este proyecto está preparado para desplegarse en:

- https://jhonkarly.com
