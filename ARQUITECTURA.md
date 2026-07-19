# Arquitectura del Proyecto — jhonkarly.com

> Documento de referencia del CTO. Define dónde vive cada cosa y dónde crear archivos nuevos.

## Visión general

Este proyecto es una **SPA (Single Page Application)** con **backend serverless**:

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS (carpeta `src/`)
- **Backend:** Supabase — base de datos PostgreSQL, autenticación y API autogenerada
  (carpeta `supabase/`). No hay servidor Express propio: la "API" son las consultas
  de `@supabase/supabase-js` protegidas por políticas RLS en la base de datos.
- **Hosting:** Vercel (`vercel.json`).

## Jerarquía de carpetas

```
2-jhonkarly.com-main/
│
├── index.html                  # Entrada HTML: meta tags, SEO, Schema.org
├── vercel.json                 # Rewrites SPA, headers de seguridad y caché
├── vite.config.ts              # Build, alias "@" → src/, chunks
├── tailwind.config.ts          # Design tokens (colores g100–g900, fuentes)
├── ARQUITECTURA.md             # ← este documento
│
├── public/                     # Archivos servidos tal cual (NO procesados por Vite)
│   ├── robots.txt / sitemap.xml
│   ├── favicon.svg             # Ícono de marca: hacha nórdica (el que usan los navegadores)
│   ├── favicon.ico / apple-touch-icon.png   # Versiones antiguas, pendiente regenerarlas
│   └── (nunca poner aquí código ni contenido duplicado)
│
├── legacy/                     # Archivos históricos fuera de producción
│
├── src/                        # ══════════ FRONTEND ══════════
│   ├── main.tsx                # Bootstrap de React
│   ├── App.tsx                 # ROUTER PRINCIPAL: aquí se registran las rutas
│   ├── index.css               # Design system global (variables, utilidades)
│   │
│   ├── pages/                  # VISTAS — un archivo por ruta
│   │   ├── Index.tsx           #   /
│   │   ├── SobreMi.tsx         #   /sobre-mi
│   │   ├── Prensa.tsx          #   /prensa
│   │   ├── Trayectoria.tsx     #   /trayectoria — hitos, logros y marcas oficiales
│   │   ├── ...
│   │   └── dashboard/          #   Vistas anidadas de /dashboard/*
│   │       ├── TrayectoriaAdminPage.tsx  # CRUD hitos + logros (medallas/récords)
│   │       ├── CompetenciasAdminPage.tsx # CRUD marcas oficiales
│   │       └── ...
│   │
│   ├── components/             # COMPONENTES reutilizables
│   │   ├── Navbar.tsx / Footer.tsx / ProtectedRoute.tsx / ...
│   │   └── ui/                 #   Primitivas shadcn/ui (no editar a mano)
│   │
│   ├── hooks/                  # LÓGICA DE DATOS (equivale a "controladores")
│   │   ├── use-auth.ts         #   Sesión y rol del usuario
│   │   ├── use-prensa.ts       #   Notas de prensa y galería (React Query)
│   │   ├── use-competencias.ts #   Marcas oficiales de /trayectoria
│   │   └── use-trayectoria.ts  #   Hitos + logros de /trayectoria (CRUD completo)
│   │
│   ├── lib/                    # SERVICIOS / ACCESO A DATOS (equivale a "modelos")
│   │   ├── supabase.ts         #   Cliente único de Supabase (+ supabaseReady)
│   │   ├── imagenes.ts         #   SISTEMA DE IMÁGENES: carga automática por carpeta
│   │   ├── api/                #   Funciones de consulta por dominio
│   │   │   ├── prensa.ts       #   getNotas / crearNota / eliminarNota / fotos
│   │   │   ├── competencias.ts #   Marcas oficiales (competitions)
│   │   │   ├── trayectoria.ts  #   Hitos + logros, con DATOS DE RESPALDO integrados
│   │   │   └── ...             #   tienda / pedidos / facturas / kit / storage
│   │   └── utils.ts
│   │
│   ├── context/                # Estado global (AuthContext)
│   ├── assets/                 # IMÁGENES — una subcarpeta por sección de la web
│   │   ├── LEEME-IMAGENES.md   #   Guía: qué carpeta gobierna cada imagen
│   │   ├── inicio/             #   Foto grande del Inicio
│   │   ├── sobre-mi/           #   perfil/ · king-of-pool/ · los-angeles-2028/
│   │   ├── prensa/             #   galeria/ (mosaico) · logos/ (medios)
│   │   ├── libro/              #   Portada del libro
│   │   └── sponsors/           #   Marquesina de patrocinadores (además se pueden
│   │                           #   subir desde /dashboard/sponsors; se combinan)
│   └── test/                   # Tests (Vitest + Testing Library)
│
├── supabase/                   # ══════════ BACKEND ══════════
│   ├── functions/              # Edge Functions (enviar-factura)
│   └── migrations/             # Esquema de BD versionado (ejecutar en SQL Editor)
│       ├── 001_rls_policies.sql    # Tabla profiles + políticas RLS
│       ├── 002_prensa.sql          # Tablas press_notes + press_photos + RLS
│       ├── 003_tienda.sql          # Productos de la tienda
│       ├── 004_pedidos_y_roles.sql # Pedidos + roles admin/master
│       ├── 005_competencias.sql    # Tabla competitions (marcas de /trayectoria)
│       ├── 006_storage_y_kit.sql   # Storage + kit de prensa
│       ├── 007_facturacion.sql     # Facturación
│       ├── 008_trayectoria.sql     # Tablas trajectory_milestones + achievements
│       │                           # con datos iniciales (hitos 2010→2028 y logros)
│       └── 009_sponsors.sql        # Tabla sponsors (marquesina del Inicio)
│                                   # + lectura pública de press_kit_files
│
└── .github/workflows/          # CI: lint + typecheck + tests + build
```

## Reglas del equipo

1. **Una ruta nueva** = archivo en `src/pages/` + registro en `src/App.tsx` + (si es pública) enlace en `Navbar.tsx`/`Footer.tsx` y entrada en `public/sitemap.xml`.
2. **Una tabla nueva** = archivo `supabase/migrations/NNN_nombre.sql` con RLS **siempre** habilitado, + funciones de acceso en `src/lib/api/` + hook en `src/hooks/`.
3. Los componentes de página **no llaman a Supabase directamente**: usan hooks de `src/hooks/`, que a su vez usan `src/lib/api/`. (Vista → Controlador → Modelo).
4. `src/components/ui/` es generado por shadcn: se regenera, no se edita.
5. Nada de contenido servible en `public/` que compita con las rutas de React.
6. **Imágenes locales**: nunca se importan con `import foto from "..."` en los
   componentes. Todas se gobiernan por carpeta: se pega el archivo en la
   subcarpeta de `src/assets/` que corresponde y `src/lib/imagenes.ts` lo
   detecta solo (glob con `query: "?url"`, opciones SIEMPRE en línea — Vite no
   acepta pasarlas en una variable). Una sección nueva con imágenes = crear la
   carpeta + copiar un `export` en `imagenes.ts`. Extensiones en mayúsculas
   (.JPEG del iPhone) y archivos basura (Thumbs.db) están contemplados: se
   aceptan o ignoran sin romper el build (`assetsInclude` en `vite.config.ts` +
   filtro `ES_IMAGEN`). Guía de usuario: `src/assets/LEEME-IMAGENES.md`.
   Excepciones: imágenes que viven en Supabase (productos de Tienda, fotos
   subidas desde `/dashboard`) y `public/favicon.svg`.
7. **Datos de respaldo (fallback)**: el contenido de `/trayectoria` (hitos y
   logros) vive en Supabase, pero `src/lib/api/trayectoria.ts` incluye
   `DEFAULT_MILESTONES` y `DEFAULT_ACHIEVEMENTS` — copias del contenido inicial
   que la página muestra automáticamente cuando Supabase no está configurado
   (`supabaseReady === false`) o la tabla aún no existe (migración 008 sin
   ejecutar). Así la página pública nunca queda vacía. En cuanto la base de
   datos responde, manda ella; si editas el contenido desde `/dashboard/
   trayectoria`, considera reflejar los cambios importantes en esas constantes.

## Autenticación y acceso al panel

- **Roles** (`AuthContext`): `master` (poder total) > `admin` (contenido) >
  `prensa` / `premium` / `public`. Las rutas se protegen con `ProtectedRoute`.
- **Enlace "Panel"**: el `Navbar` muestra un enlace directo a `/dashboard`
  (escritorio y móvil) cuando el rol de la sesión es `admin` o `master`.
- **"Inicio de sesión" vs "Mi cuenta"**: el menú muestra "Inicio de sesión"
  SOLO si no hay sesión activa; con sesión muestra "Mi cuenta". No es un bug
  que desaparezca el login estando dentro.
- **Modo vista previa (solo desarrollo)**: con `VITE_DEMO_ADMIN=true` en `.env`
  se entra automáticamente como `master` sin login (para revisar el dashboard
  sin claves de Supabase). Consecuencia visible: nunca verás "Inicio de sesión"
  en el menú mientras esté activo. Se apaga poniéndola en `false` (requiere
  reiniciar el servidor). El build de producción lo ignora siempre
  (`import.meta.env.DEV`).
