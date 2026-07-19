# 📷 Imágenes de la web — guía rápida

**TODAS las imágenes de la web se gobiernan desde estas carpetas.** Para
cambiar cualquier imagen solo tienes que pegar el archivo (jpg, png o webp)
en la carpeta correcta o quitarlo de ahí — la web se actualiza sola, sin
tocar código. Da igual si la extensión va en mayúsculas (.JPEG) y los
archivos que no son imágenes se ignoran sin romper nada.

*(Únicas excepciones: las fotos de productos de la Tienda y las que subas a
la galería desde el panel — esas viven en Supabase y se administran desde
`/dashboard`. El ícono de la pestaña está en `public/favicon.svg`.)*

| Carpeta                              | Qué va ahí                                  |
| ------------------------------------ | ------------------------------------------- |
| `inicio/`                            | Foto grande de la página de inicio          |
| `sobre-mi/perfil/`                   | Tu foto principal de "Sobre mí"             |
| `sobre-mi/king-of-pool/`             | Foto del proyecto King of Pool              |
| `sobre-mi/los-angeles-2028/`         | Fotos del camino a LA 2028 (3 espacios)     |
| `prensa/galeria/`                    | Fotos de la galería de Prensa (mosaico automático) |
| `prensa/logos/`                      | Logos de medios: el nombre del archivo es la clave (ej. `el-quindiano.png`) |
| `libro/`                             | Portada del libro                           |
| `sponsors/`                          | Logos de patrocinadores (PNG/SVG sin fondo) — aparecen solos en la marquesina del Inicio; para hacer un logo clicable, registra su link en `src/components/SponsorsMarquee.tsx` |

Consejos:

- Si una carpeta tiene varias fotos, se muestran **ordenadas por nombre**:
  usa `01-foto.jpg`, `02-foto.jpg`, `03-foto.jpg` para elegir el orden.
- Si la carpeta está vacía, la web muestra un recuadro punteado que dice
  "Espacio para tu foto" — nada se rompe.
- Para crear una sección nueva con fotos, mira `src/lib/imagenes.ts`:
  ahí está la lista de carpetas y cómo añadir una más (copiar y pegar 3 líneas).
