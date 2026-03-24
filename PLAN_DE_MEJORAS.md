# Plan de Mejoras Integral — jhonkarly.com

## Contexto

jhonkarly.com es el sitio web personal de Jhonkarly Alvarez, nadador paralímpico colombiano con meta en Los Ángeles 2028. Está construido con React 18 + TypeScript + Vite + Tailwind + Supabase + shadcn/ui y desplegado en Vercel. Tras una auditoría exhaustiva, se identificaron problemas críticos en seguridad de base de datos, SEO, rendimiento, testing, manejo de errores, y oportunidades de nuevas funcionalidades. Este plan prioriza las mejoras por impacto y urgencia.

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
**Archivos:** `src/assets/hero-inicio.jpg`, `src/assets/sobre-mi-hero.jpg`
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

### 4.6 Sección de Resultados/Competencias
- [ ] Crear tabla `competitions` en Supabase (fecha, evento, resultado, categoría)
- [ ] Crear página `/resultados` con historial de competencias
- [ ] Mostrar medallas y logros en un formato visual atractivo

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

### Tablas nuevas sugeridas:
- `competitions` (id, date, event_name, location, result, category, medal, created_at)
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
