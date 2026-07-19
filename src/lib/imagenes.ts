/* ════════════════════════════════════════════════════════════
   IMÁGENES DE LA WEB — sistema automático por carpetas
   ════════════════════════════════════════════════════════════
   Cada sección tiene su propia subcarpeta dentro de src/assets/.
   Para añadir una imagen NO hay que tocar código: solo pega el
   archivo (jpg, png, webp…) en la carpeta correcta y la web la
   detecta sola al recargar. Se muestran ordenadas por nombre de
   archivo (usa 01-foto.jpg, 02-foto.jpg… para controlar el orden).

   Da igual si la extensión va en MAYÚSCULAS o minúsculas
   (.JPEG, .jpg, .PNG…): todo funciona. Los archivos que no son
   imágenes (ej. Thumbs.db, .txt) se ignoran sin romper nada.

   DÓNDE PEGAR CADA IMAGEN:
   • src/assets/inicio/                     → foto grande de la página de inicio
   • src/assets/sobre-mi/perfil/            → tu foto principal de "Sobre mí"
   • src/assets/sobre-mi/king-of-pool/      → fotos del proyecto King of Pool
   • src/assets/sobre-mi/los-angeles-2028/  → fotos del camino a LA 2028 (3 espacios)
   • src/assets/prensa/galeria/             → fotos de la galería de Prensa (se
                                              añaden solas y se adaptan al tamaño)
   • src/assets/prensa/logos/               → logos de los medios que te cubren:
                                              el nombre del archivo es la clave
                                              (ej: quindio-gov.png, el-quindiano.png)
   • src/assets/libro/                      → portada del libro
   • src/assets/sponsors/                   → logos de patrocinadores (sin fondo)

   Para crear una sección nueva: crea la carpeta, copia una de
   las líneas export de abajo y cambia la ruta.
   ════════════════════════════════════════════════════════════ */

/* Con query "?url" Vite entrega cualquier archivo como URL sin intentar
   interpretarlo, así ninguna extensión rara puede tumbar la página. */
type ModulosUrl = Record<string, string>;

/* Extensiones de imagen que los navegadores pueden mostrar
   (mayúsculas o minúsculas, da igual). El resto se ignora. */
const ES_IMAGEN = /\.(jpe?g|png|webp|gif|avif|svg|bmp|ico)$/i;

/* Convierte lo que encuentra Vite en una lista de URLs ordenada por nombre */
const cargar = (modulos: ModulosUrl): string[] =>
  Object.keys(modulos)
    .filter((ruta) => ES_IMAGEN.test(ruta))
    .sort()
    .map((ruta) => modulos[ruta]);

export const FOTOS_INICIO = cargar(
  import.meta.glob("@/assets/inicio/*", { eager: true, query: "?url", import: "default" }) as ModulosUrl,
);

export const FOTOS_PERFIL = cargar(
  import.meta.glob("@/assets/sobre-mi/perfil/*", { eager: true, query: "?url", import: "default" }) as ModulosUrl,
);

export const FOTOS_KING_OF_POOL = cargar(
  import.meta.glob("@/assets/sobre-mi/king-of-pool/*", { eager: true, query: "?url", import: "default" }) as ModulosUrl,
);

export const FOTOS_LA_2028 = cargar(
  import.meta.glob("@/assets/sobre-mi/los-angeles-2028/*", { eager: true, query: "?url", import: "default" }) as ModulosUrl,
);

export const FOTOS_GALERIA_PRENSA = cargar(
  import.meta.glob("@/assets/prensa/galeria/*", { eager: true, query: "?url", import: "default" }) as ModulosUrl,
);

export const FOTOS_LIBRO = cargar(
  import.meta.glob("@/assets/libro/*", { eager: true, query: "?url", import: "default" }) as ModulosUrl,
);

/* Patrocinadores: cada archivo en src/assets/sponsors/ es un logo.
   El nombre visible sale del nombre del archivo:
   "01-banco-cafetero.png" → "banco cafetero" (el número inicial solo ordena).
   Para que el logo sea clicable, registra su link en SponsorsMarquee.tsx. */
const modulosSponsors = import.meta.glob("@/assets/sponsors/*", { eager: true, query: "?url", import: "default" }) as ModulosUrl;

export interface LogoSponsor {
  archivo: string; // nombre del archivo sin extensión (clave para los links)
  nombre: string;  // nombre legible para lectores de pantalla
  logo: string;    // URL de la imagen
}

export const LOGOS_SPONSORS: LogoSponsor[] = Object.keys(modulosSponsors)
  .filter((ruta) => ES_IMAGEN.test(ruta))
  .sort()
  .map((ruta) => {
    const archivo = (ruta.split("/").pop() ?? ruta).replace(/\.[^.]+$/, "");
    const nombre = archivo.replace(/^\d+[-_ ]*/, "").replace(/[-_]+/g, " ").trim() || archivo;
    return { archivo, nombre, logo: modulosSponsors[ruta] };
  });

/* Logos de medios de prensa: la clave es el nombre del archivo sin extensión.
   Ej: src/assets/prensa/logos/el-quindiano.png → LOGOS_PRENSA["el-quindiano"] */
const modulosLogos = import.meta.glob("@/assets/prensa/logos/*", { eager: true, query: "?url", import: "default" }) as ModulosUrl;

export const LOGOS_PRENSA: Record<string, string> = Object.fromEntries(
  Object.keys(modulosLogos)
    .filter((ruta) => ES_IMAGEN.test(ruta))
    .map((ruta) => {
      const archivo = ruta.split("/").pop() ?? ruta;
      const clave = archivo.replace(/\.[^.]+$/, "");
      return [clave, modulosLogos[ruta]];
    }),
);
