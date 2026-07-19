# Plan de Mejoras Integral — jhonkarly.com

## Contexto

jhonkarly.com es el sitio web personal de Jhonkarly Alvarez, nadador paralímpico colombiano con meta en Los Ángeles 2028. Está construido con React 18 + TypeScript + Vite + Tailwind + Supabase + shadcn/ui y desplegado en Vercel. Tras una auditoría exhaustiva, se identificaron problemas críticos en seguridad de base de datos, SEO, rendimiento, testing, manejo de errores, y oportunidades de nuevas funcionalidades. Este plan prioriza las mejoras por impacto y urgencia.

---

## Registro de avances

### 2026-07-18 — Pulido integral de lanzamiento (rendimiento, SEO, accesibilidad, marca)
- **Imágenes optimizadas (−86 %)**: las fotos de `src/assets/` pasaron de ~11,6 MB a
  ~1,5 MB (redimensionadas al tamaño real de uso y recomprimidas respetando la
  orientación EXIF). Copias de seguridad de los originales guardadas fuera del
  proyecto antes de comprimir.
- **Carga más rápida**: fuentes de Google movidas de `@import` (bloqueante) a
  `<link rel="preconnect">` + `<link>` en `index.html`; hero de Inicio y Sobre mí
  con `fetchPriority="high"`; `decoding="async"` en imágenes; se quitó
  `TooltipProvider` (Radix Tooltip no se usaba) y el chunk `ui` del build;
  React Query ahora usa `staleTime: 60 s` para no repetir consultas.
- **SEO por página (`src/lib/seo.ts` — hook `usePageMeta`)**: título, descripción,
  canonical y Open Graph propios en cada ruta pública; `noindex` en login, panel,
  mi cuenta, kit de prensa y 404. Nuevo **`public/og-image.jpg` real (1200×630)**
  generado del hero para compartir en redes (antes se usaba el favicon).
  `sitemap.xml` con `lastmod`, `site.webmanifest` + iconos 192/512 (PWA básica),
  JSON-LD ampliado (Person + WebSite).
- **Accesibilidad**: nuevo token `--g500` (gris medio legible) y sustitución
  sistemática del gris `g700` (contraste 1,9:1, ilegible) en textos de contenido:
  fechas de prensa, etiquetas de formularios, estados del panel, etc. Estilos
  globales de `:focus-visible`, `::selection` invertida, `color-scheme: dark` y
  soporte de `prefers-reduced-motion` (apaga animaciones). Modales de compra y de
  restablecer contraseña con `role="dialog"`, `aria-modal` y cierre con Escape.
- **Marca y textos**: apellido unificado a **Alvarez** (sin tilde, decisión del
  atleta 2026-07-19) en logo del navbar, footer, títulos, metadatos, legales y schema;
  página **404 rediseñada** al sistema de diseño (antes en inglés y sin estilo);
  eslogan del footer reescrito; cita del Inicio etiquetada "Rumbo a Los Ángeles
  2028" (coherente con Trayectoria); comillas tipográficas en Prensa; estadísticas
  de la Tienda corregidas (la bandera emoji no se veía en Windows → "COL").
- **Animaciones**: hook compartido `src/hooks/use-reveal.ts` (antes duplicado en
  Trayectoria) + componente `src/components/Reveal.tsx`; aparición suave al hacer
  scroll en secciones del Inicio, proyectos de Sobre mí y cobertura de Prensa.
- **Seguridad (vercel.json)**: cabeceras `Referrer-Policy`, `Permissions-Policy`
  y `Strict-Transport-Security` añadidas a las existentes.
- **Limpieza**: eliminados `src/App.css` (boilerplate de Vite sin uso) y
  `src/components/NavLink.tsx` (sin imports).
- **Anclas de sección**: las secciones principales ahora tienen `id`
  (`/#explorar`, `/#libro`, `/sobre-mi#proyectos`, `#redes`, `#libro`,
  `/prensa#cobertura`, `#galeria`, `#contacto`, `/trayectoria#logros`,
  `#recorrido`, `#resultados`) con `scroll-margin-top` para el navbar fijo.
  **Bug corregido**: al entrar directo con `#ancla`, la página lazy aún no
  había montado y el scroll no ocurría — `ScrollToTop.tsx` ahora reintenta
  por frame (~2 s) hasta que la sección exista.
- **Verificación**: `npm run ci` en verde (lint + 34/34 tests + typecheck +
  build) y revisión visual con capturas de todas las páginas públicas en
  escritorio (1366px) y móvil (390px) — hero, tarjetas, cronología, galería,
  tienda, login y 404 renderizando correctamente.

### 2026-07-17 — Trayectoria completa: hitos, logros y panel de administración
- **Página /trayectoria v2**: contenido real del atleta — frase de apertura, biografía
  deportiva, estadísticas (14 años · 20 competencias · COL), cronología de 9 hitos
  (2010 Inicio → 2010–2020 Formación → 2021 Primera Competencia Oficial → 2022
  Proyección Nacional → 2023 VI Juegos Paranacionales → 2024 I Juegos Paranacionales
  Juveniles → 2025 Bloque de Entrenamiento → 2026 World Series Abu Dhabi → ★ 2028
  Juegos Paralímpicos Los Ángeles) y sección **Logros** (5 iniciales). Se conserva la
  sección de marcas oficiales (`competitions`).
- **Diseño de la cronología**: línea central con degradado, tarjetas alternadas
  izquierda/derecha (columna única con línea a la izquierda en móvil), años gigantes
  (etiqueta invertida en tarjetas derechas), chips de categoría, hover con elevación
  y sombra, punto con pulso animado para la meta futura 2028, y aparición suave al
  hacer scroll (IntersectionObserver, hook `useReveal`).
- **Backend (migración `008_trayectoria.sql`)**: tablas `trajectory_milestones`
  (año, título, categoría, descripción, viñetas, link, meta futura, orden) y
  `achievements` (título, evento, año, medalla 1/2/3 = oro/plata/bronce, ámbito
  nacional/internacional, imposición de récord, detalle, orden). RLS: lectura
  pública, escritura solo admin/master. Incluye los 9 hitos y 5 logros como datos
  iniciales. **Pendiente: ejecutarla una sola vez en Supabase → SQL Editor.**
- **Panel /dashboard/trayectoria**: nueva vista con pestañas "Hitos del recorrido" y
  "Logros · Medallas y récords" — crear, **editar** (el lápiz carga el ítem en el
  formulario) y eliminar. Registrada en `App.tsx` y en el menú del Dashboard
  (ícono de medalla). Capa de datos en `src/lib/api/trayectoria.ts` +
  `src/hooks/use-trayectoria.ts` (React Query, patrón Vista→Controlador→Modelo).
- **Datos de respaldo**: `DEFAULT_MILESTONES` / `DEFAULT_ACHIEVEMENTS` en
  `src/lib/api/trayectoria.ts` — la página pública muestra todo el contenido aunque
  Supabase no esté configurado o la migración no se haya ejecutado (soluciona la
  página vacía con `.env` sin credenciales). Cuando la BD responde, manda ella.
- **Tests**: `src/test/Trayectoria.test.tsx` (4 pruebas: descripción, hitos con
  próximas competencias, logros y estadísticas, en el escenario sin Supabase) +
  mock de `IntersectionObserver` en `src/test/setup.ts`. Suite total: 34 pruebas.
- Cubre el punto **4.6** (sección de resultados/competencias con medallas y logros
  en formato visual), sobre la ruta existente `/trayectoria` en lugar de
  `/resultados`.

### 2026-07-17 — Contenido real, sistema de imágenes y marca
- **Sobre mí v4**: biografía reemplazada por el texto real "¿Quién soy?" del atleta,
  con la frase insignia como cita destacada. Nueva sección "02 — Mis proyectos":
  **King of Pool** (tarjeta oscura decorada, badge "Próximamente anunciaré la fecha",
  botón al video del proyecto) y **Rumbo a Los Ángeles 2028** (3 espacios de foto +
  botón a YouTube). Los links de video se pegan en las constantes `VIDEO_KING_OF_POOL`
  y `VIDEO_LOS_ANGELES_2028` al inicio de `SobreMi.tsx` (vacías → "Próximamente").
- **Prensa**: cobertura destacada fija con 2 notas reales (Gobernación del Quindío
  17-nov-2024 y El Quindiano 16-nov-2024) en `COBERTURA_DESTACADA` dentro de
  `Prensa.tsx`; tarjetas clicables con isotipo (logo desde `src/assets/prensa/logos/`
  o iniciales de respaldo). Galería en mosaico que mezcla la carpeta local
  `src/assets/prensa/galeria/` con las fotos de Supabase.
- **Sistema de imágenes por carpetas** (`src/lib/imagenes.ts`): TODA imagen local se
  cambia pegando/quitando el archivo en su subcarpeta de `src/assets/` — Inicio,
  Sobre mí (perfil/proyectos), Prensa (galería/logos), libro y sponsors (marquesina
  automática). Robusto ante extensiones en mayúsculas y archivos basura (probado).
  Cubre parcialmente los puntos 3.2 (lazy loading en tarjetas) y 4.4 (galería local).
- **Marca**: favicon propio (hacha nórdica) en `public/favicon.svg`; foto real del
  atleta como hero de Sobre mí. Pendiente: regenerar `favicon.ico` y
  `apple-touch-icon.png` con el hacha.
- **Robustez de imágenes**: las fotos con extensión en mayúsculas (`.JPEG` del
  iPhone) tumbaban el servidor; ahora `lib/imagenes.ts` carga todo con
  `query: "?url"` + filtro por extensión y `vite.config.ts` tiene `assetsInclude`.
  Probado con archivos basura (Thumbs.db, .HEIC, .txt): se ignoran sin romper.
- **Navbar**: enlace "Panel" → `/dashboard` visible para cuentas admin/master
  (escritorio y móvil). Aclaración de soporte: con `VITE_DEMO_ADMIN=true` en
  `.env` se entra automáticamente como master, por lo que "Inicio de sesión" NO
  aparece en el menú (solo se muestra al estar deslogueado) — no es un bug.
- **Scroll al tope en cada navegación (2026-07-18)**: nuevo componente
  `src/components/ScrollToTop.tsx` montado en el router — en cada cambio de ruta
  la página vuelve al inicio (instantáneo, sin verse afectado por el
  `scroll-behavior: smooth` global; las anclas `#seccion` se respetan). El
  contenido del dashboard scrollea en su propio contenedor, así que
  `Dashboard.tsx` hace su propio reset al cambiar de sección del panel.
- **Patrocinadores desde el panel (2026-07-18)**: nuevo módulo completo —
  migración `009_sponsors.sql` (tabla sponsors con RLS: lectura pública,
  escritura staff; incluye fix de lectura pública de `press_kit_files` para que
  las descargas del kit en /prensa funcionen sin sesión), `lib/api/sponsors.ts`,
  `hooks/use-sponsors.ts` y panel `/dashboard/sponsors` (subir logo + nombre +
  link opcional, listar y eliminar). La marquesina del Inicio combina los logos
  del panel con los de la carpeta `src/assets/sponsors/`. **Requiere ejecutar la
  migración 009 en el SQL Editor de Supabase.**
- **Navegación de acceso (2026-07-18)**: el menú público solo ofrece "Inicio de
  sesión" (se quitaron "Mi cuenta" y "Panel"); tras el login, el rol decide el
  destino. "Mi cuenta" ahora vive dentro del panel (`/dashboard/mi-cuenta` en el
  menú lateral); la ruta `/mi-cuenta` sigue activa para clientes de la tienda.
  En /prensa, la caja del kit muestra las 3 descargas directas (antes pedía
  solicitar acceso por correo). La página protegida `/prensa/kit` quedó
  redundante — decidir si se elimina.
- **Login y Dashboard con avisos claros (2026-07-18)**: cuando Supabase no está
  configurado (`supabaseReady === false`), `/login` muestra un aviso de "base de
  datos no conectada" en lugar de fallar en silencio, y si ya hay sesión activa
  (vista previa) ofrece atajos "Ir al panel" / "Mi cuenta". El layout del
  dashboard muestra un banner permanente "Vista previa sin base de datos" para
  que ningún panel parezca roto cuando en realidad falta el `.env`.

---

## Pendientes (requieren acción del usuario)

**Para que el sitio funcione en producción:**
- [ ] Pegar las claves reales de Supabase en `.env` local (`VITE_SUPABASE_URL`,
      `VITE_SUPABASE_ANON_KEY`) y apagar `VITE_DEMO_ADMIN` (ponerla en `false`).
- [ ] Configurar esas mismas variables en Vercel y hacer redeploy — la producción
      actual fue compilada sin ellas y el login NO funciona en jhonkarly.com.
- [ ] Ejecutar en el SQL Editor de Supabase las migraciones pendientes de
      `supabase/migrations/` (002 en adelante) y crear el bucket de Storage "media".
- [ ] Desplegar la Edge Function `enviar-factura` y configurar el secret
      `RESEND_API_KEY` (envío de facturas por correo).

**Contenido que solo el usuario puede aportar:**
- [ ] Links de los videos: `VIDEO_KING_OF_POOL` y `VIDEO_LOS_ANGELES_2028` en
      `src/pages/SobreMi.tsx`, y los de las tarjetas de YouTube/Instagram/TikTok.
- [ ] Logos de los medios de prensa: `src/assets/prensa/logos/quindio-gov.png`
      y `el-quindiano.png` (mientras no estén se muestran las iniciales).
- [ ] Logos de patrocinadores en `src/assets/sponsors/` (+ links en
      `SponsorsMarquee.tsx` si deben ser clicables).
- [ ] Fotos: proyecto King of Pool, camino a LA 2028 (3), portada del libro.
- [ ] Handle real de TikTok (hoy `@nuvakii` en Footer, index.html y SobreMi).
- [ ] URL de compra del libro cuando esté a la venta (hoy es un mailto).

**Mejoras técnicas aplazadas:**
- [ ] Regenerar `favicon.ico` y `apple-touch-icon.png` con el hacha nórdica.
- [ ] Pasarela de pago real (Wompi/MercadoPago) — requiere cuenta de comercio.
- [ ] Facturación electrónica ante la DIAN — requiere habilitación como
      facturador electrónico.
- [ ] 2FA en Supabase (requiere conexión activa con claves reales).

---

## Fase 1: Correcciones Críticas y Seguridad (Prioridad ALTA)

### 1.1 Base de Datos — Row Level Security (RLS)
**Problema:** No hay políticas RLS en Supabase. Cualquier usuario con el `anon_key` podría leer/modificar la tabla `profiles` directamente.
- [ ] Crear script SQL con políticas RLS para la tabla `profiles`:
  - `SELECT`: Solo el propio usuario puede leer su perfil, admins pueden leer todos
  - `UPDATE`: Solo admins pueden cambiar roles; usuarios pueden editar su propio `full_name`
  - `DELETE`: Solo admins
  - `INSERT`: Solo durante registro (service_role o trigger)
- [ ] Documentar políticas en un archivo `supabase/migrations/001_rls_policies.sql`
- [ ] Verificar que RLS esté habilitado en la tabla `profiles` en el dashboard de Supabase

### 1.2 Manejo de Errores en AuthContext
**Archivo:** `src/context/AuthContext.tsx`
- [ ] Agregar `try-catch` al `fetchProfile()` — actualmente falla silenciosamente
- [ ] Distinguir tipos de error en `signIn()`: credenciales incorrectas vs error de red
- [ ] Agregar manejo de sesión expirada con redirect a `/login`

### 1.3 Confirmaciones de Eliminación
**Archivo:** `src/pages/dashboard/UsersPage.tsx`
- [ ] Agregar diálogo de confirmación antes de eliminar usuario individual
- [ ] Agregar diálogo de confirmación antes de eliminación masiva (bulk delete)
- [ ] Usar componente `AlertDialog` de shadcn/ui (ya disponible en el proyecto)

### 1.4 Corrección de Bugs y Typos
- [ ] Corregir email: `contac@jhonkarly.com` → `contact@jhonkarly.com` en `src/components/Footer.tsx` y `src/pages/MiCuenta.tsx`
- [ ] Corregir link TikTok: `@nuvakii` → handle correcto de Jhonkarly en `src/components/Footer.tsx`
- [ ] Eliminar ternario redundante en Navbar: `role === "admin" ? "/mi-cuenta" : "/mi-cuenta"` → simplificar a `"/mi-cuenta"` en `src/components/Navbar.tsx`
- [ ] Eliminar `cursor: none` en `src/pages/SobreMi.tsx` (violación de accesibilidad)

---

## Fase 2: SEO y Visibilidad Web (Prioridad ALTA)

### 2.1 Meta Tags Dinámicos
- [ ] Instalar `react-helmet-async` para meta tags por ruta
- [ ] Configurar `<title>` descriptivo por página:
  - Inicio: "Jhonkarly Alvarez — Nadador Paralímpico Colombiano | LA 2028"
  - Sobre mí: "Sobre Jhonkarly Alvarez — Historia y Trayectoria"
  - Tienda: "Tienda Jhonkarly — Merchandising Oficial"
  - Prensa: "Prensa — Kit de Medios Jhonkarly Alvarez"
  - Trayectoria: "Trayectoria Deportiva — Jhonkarly Alvarez"
- [ ] Agregar `og:image` con foto profesional del atleta en `index.html`
- [ ] Agregar URL canónica por página
- [ ] Reemplazar favicon como `twitter:image` por imagen real

### 2.2 Sitemap y Structured Data
- [ ] Crear `public/sitemap.xml` con todas las rutas públicas
- [ ] Agregar Schema.org JSON-LD en `index.html`:
  - Tipo `Person` (atleta)
  - Tipo `WebSite`
  - Tipo `SportsTeam` o `Athlete`
- [ ] Quitar `noindex, nofollow` de `public/tienda/index.html` cuando la tienda esté lista

### 2.3 Pre-rendering para SEO
- [ ] Evaluar e implementar `vite-plugin-prerender` o similar para generar HTML estático de las rutas principales
- [ ] Alternativa: configurar Vercel ISR o usar `@prerender.io` para servir HTML a crawlers

---

## Fase 3: Rendimiento y Arquitectura (Prioridad MEDIA-ALTA)

### 3.1 Code Splitting y Lazy Loading
**Archivo:** `src/App.tsx`
- [ ] Implementar `React.lazy()` + `Suspense` para todas las páginas:
  ```
  const Dashboard = lazy(() => import("./pages/Dashboard"))
  const Login = lazy(() => import("./pages/Login"))
  // etc.
  ```
- [ ] Agregar componente `Suspense` con fallback de loading
- [ ] Separar vendor chunks en `vite.config.ts`:
  ```
  build.rollupOptions.output.manualChunks para react, supabase, recharts
  ```

### 3.2 Optimización de Imágenes
**Archivos:** subcarpetas de `src/assets/` (sistema central en `src/lib/imagenes.ts` — ver ARQUITECTURA.md regla 6)
- [ ] Convertir imágenes a WebP (mantener JPEG como fallback)
- [ ] Implementar `<picture>` con `<source>` WebP + JPEG fallback
- [ ] Agregar `loading="lazy"` a imágenes no-hero
- [ ] Agregar atributos `width` y `height` para evitar CLS (Cumulative Layout Shift)
- [ ] Considerar responsive images con `srcset` para diferentes viewports

### 3.3 Migrar Páginas Iframe a Componentes React
**Archivos:** `src/pages/Tienda.tsx`, `src/pages/Prensa.tsx`, `src/pages/Trayectoria.tsx`
- [ ] Migrar `public/trayectoria/index.html` (timeline) a componente React nativo
- [ ] Migrar `public/prensa/index.html` (kit de prensa) a componente React nativo
- [ ] Migrar `public/tienda/index.html` (coming soon) a componente React nativo
- [ ] Eliminar los iframes — mejora SEO, accesibilidad, rendimiento y UX
- [ ] Reutilizar el sistema de diseño existente (Tailwind + shadcn/ui)

### 3.4 Limpiar Dependencias Redundantes
- [ ] Elegir UN sistema de toast: Sonner O shadcn Toaster (no ambos) — `src/App.tsx`
- [ ] Evaluar si `next-themes` es necesario (el tema oscuro está hardcodeado en CSS)
- [ ] Eliminar hook `useIsMobile` si no se usa, o integrarlo donde haga falta

---

## Fase 4: Funcionalidades Nuevas (Prioridad MEDIA)

### 4.1 Implementar Password Reset
**Archivo:** `src/pages/Login.tsx`
- [ ] Crear flujo de "Olvidé mi contraseña" usando `supabase.auth.resetPasswordForEmail()`
- [ ] Crear página `/reset-password` para el callback
- [ ] Agregar validación de nueva contraseña con requisitos de complejidad

### 4.2 Completar Páginas en Construcción
- [ ] Implementar `/prensa/kit` — página de Kit de Prensa descargable (fotos, bio, logotipos)
- [ ] Implementar `/exclusivo` — contenido premium para suscriptores
- [ ] Agregar contenido real a `public/privacidad/index.html` (Política de Privacidad)
- [ ] Agregar contenido real a `public/terminos/index.html` (Términos de Uso)

### 4.3 Formulario de Contacto
- [ ] Crear página/sección de contacto con formulario (nombre, email, mensaje)
- [ ] Integrar con Supabase (tabla `messages`) o servicio externo (Resend, SendGrid)
- [ ] Reemplazar el link `mailto:` actual por el formulario

### 4.4 Galería de Medios
- [ ] Crear sección de galería con fotos y videos del atleta
- [ ] Integrar con almacenamiento de Supabase Storage para subir medios
- [ ] Implementar lightbox para visualización

### 4.5 Dashboard con Datos Reales
**Archivo:** `src/pages/dashboard/OverviewPage.tsx`
- [ ] Reemplazar datos mock (MONTHLY_GROWTH, ENGAGEMENT_DATA, ACTIVITY_HOURS) con datos reales
- [ ] Crear tabla `analytics` en Supabase para trackear visitas
- [ ] Implementar React Query (`useQuery`) para todas las consultas de datos — ya está instalado pero sin usar

### 4.6 Sección de Resultados/Competencias ✅ (2026-07-17)
- [x] Crear tabla `competitions` en Supabase (fecha, evento, resultado, categoría) — migración 005
- [x] Historial de competencias — implementado en la ruta existente `/trayectoria` (en lugar de `/resultados`): cronología de hitos + marcas oficiales
- [x] Mostrar medallas y logros en un formato visual atractivo — tablas `trajectory_milestones` + `achievements` (migración 008), sección "Logros" con medallas 🥇🥈🥉, ámbito nacional/internacional y récords; administrable en `/dashboard/trayectoria`

---

## Fase 5: Calidad de Código y DevOps (Prioridad MEDIA)

### 5.1 Testing
- [ ] Escribir tests para `AuthContext` (signIn, signOut, role detection)
- [ ] Escribir tests para `ProtectedRoute` (redirect logic, role-based access)
- [ ] Escribir tests para componentes de página principales (Index, Login, MiCuenta)
- [ ] Configurar coverage mínimo en vitest.config.ts
- [ ] Eliminar `src/test/example.test.ts` (placeholder)

### 5.2 Error Boundaries
**Archivo nuevo:** `src/components/ErrorBoundary.tsx`
- [ ] Crear componente Error Boundary global
- [ ] Envolver la app en `<ErrorBoundary>` en `src/App.tsx`
- [ ] Diseñar UI de error amigable en español
- [ ] Opcional: integrar servicio de error reporting (Sentry)

### 5.3 CI/CD Pipeline
- [ ] Crear `.github/workflows/ci.yml` con:
  - Lint (`npm run lint`)
  - Type check (`npm run typecheck`)
  - Tests (`npm run test`)
  - Build (`npm run build`)
- [ ] Configurar deploy automático a Vercel en push a `main`

### 5.4 README Profesional
**Archivo:** `README.md`
- [ ] Reescribir con: descripción del proyecto, stack, setup local, variables de entorno, estructura de carpetas, scripts disponibles

### 5.5 ESLint Estricto
**Archivo:** `eslint.config.js`
- [ ] Re-habilitar `@typescript-eslint/no-unused-vars` como warning
- [ ] Habilitar `noUnusedLocals: true` en `tsconfig.app.json`
- [ ] Limpiar variables no usadas resultantes

---

## Fase 6: Mejoras de UX y Accesibilidad (Prioridad MEDIA)

### 6.1 Accesibilidad
- [ ] Agregar link "Saltar al contenido" (skip-to-content) en `Navbar.tsx`
- [ ] Agregar `aria-live="polite"` para estados de carga
- [ ] Agregar indicadores de foco visibles en botones/links personalizados
- [ ] Verificar contraste de colores (WCAG AA mínimo)

### 6.2 PWA (Progressive Web App)
- [ ] Crear `manifest.json` con iconos, nombre, colores
- [ ] Configurar service worker básico para offline
- [ ] Agregar meta tag `theme-color`

### 6.3 Internacionalización (i18n)
- [ ] Evaluar `react-i18next` para soporte español/inglés
- [ ] Crear archivos de traducción `es.json` / `en.json`
- [ ] Importante para audiencia internacional (Paralímpicos LA 2028)

### 6.4 Newsletter / Suscripción
- [ ] Agregar formulario de suscripción en Footer o página dedicada
- [ ] Integrar con servicio de email marketing (Mailchimp, Resend, etc.)
- [ ] Crear tabla `subscribers` en Supabase

---

## Modelo de Base de Datos Propuesto

### Tablas actuales:
- `profiles` (id, role, full_name, email, created_at) ✅
- `competitions` (id, event_name, location, event_date, race, mark, placement, result_url, created_at) ✅ — migración 005
- `trajectory_milestones` (id, year_label, title, category, description, details[], link_url, link_label, is_future, sort_order, created_at) ✅ — migración 008
- `achievements` (id, title, event_name, year_label, medal 1|2|3, scope nacional|internacional, is_record, description, sort_order, created_at) ✅ — migración 008

### Tablas nuevas sugeridas:
- `media` (id, type [photo/video], url, caption, is_public, created_at)
- `messages` (id, sender_name, sender_email, message, read, created_at)
- `subscribers` (id, email, active, created_at)
- `analytics` (id, page, referrer, user_agent, created_at)
- `press_assets` (id, title, file_url, type [photo/logo/document], created_at)

### RLS recomendado para `profiles`:
```sql
-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Los usuarios pueden leer su propio perfil
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Los admins pueden leer todos los perfiles
CREATE POLICY "Admins can read all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Los admins pueden actualizar roles
CREATE POLICY "Admins can update profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Los admins pueden eliminar perfiles
CREATE POLICY "Admins can delete profiles" ON profiles
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

---

## Orden de Ejecución Recomendado

| # | Fase | Impacto | Esfuerzo |
|---|------|---------|----------|
| 1 | Fase 1: Seguridad y bugs | Crítico | Bajo-Medio |
| 2 | Fase 2: SEO | Alto | Medio |
| 3 | Fase 3: Rendimiento | Alto | Medio-Alto |
| 4 | Fase 5: Testing/CI | Medio | Medio |
| 5 | Fase 4: Nuevas funcionalidades | Medio | Alto |
| 6 | Fase 6: UX/Accesibilidad/PWA | Medio | Alto |

---

## Verificación

Para validar las mejoras:
1. **Seguridad:** Intentar acceder a la API de Supabase directamente con anon_key — las políticas RLS deben bloquear acceso no autorizado
2. **SEO:** Usar Google Lighthouse para verificar score > 80 en SEO
3. **Rendimiento:** Lighthouse Performance score > 80, verificar bundle size con `npx vite-bundle-visualizer`
4. **Tests:** `npm run test` debe pasar con cobertura > 60%
5. **Build:** `npm run ci` (lint + test + build) debe completar sin errores
6. **Accesibilidad:** Lighthouse Accessibility score > 90
7. **Links:** Verificar que todos los links sociales apuntan a los perfiles correctos
