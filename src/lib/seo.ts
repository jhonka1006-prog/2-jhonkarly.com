import { useEffect } from "react";

/* ════════════════════════════════════════════════════════════
   SEO POR PÁGINA — usePageMeta
   ════════════════════════════════════════════════════════════
   En una SPA todas las rutas comparten el <head> de index.html.
   Este hook actualiza título, descripción, canonical y Open Graph
   al entrar en cada página, para que buscadores con JavaScript
   (Google) y quien comparta un enlace vean los datos correctos.

   Uso en una página:
     usePageMeta({
       titulo: "Prensa — Jhonkarly Alvarez",
       descripcion: "Cobertura de medios…",
       ruta: "/prensa",
     });
   Las rutas privadas añaden { noindex: true }.
   ════════════════════════════════════════════════════════════ */

const BASE_URL = "https://jhonkarly.com";

interface PageMeta {
  titulo: string;
  descripcion?: string;
  /** Ruta canónica, ej. "/prensa". Sin ella no se toca el canonical. */
  ruta?: string;
  /** true en páginas privadas (login, panel…) para no indexarlas */
  noindex?: boolean;
}

const setMeta = (attr: "name" | "property", key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

export const usePageMeta = ({ titulo, descripcion, ruta, noindex }: PageMeta) => {
  useEffect(() => {
    document.title = titulo;
    setMeta("property", "og:title", titulo);
    setMeta("name", "twitter:title", titulo);

    if (descripcion) {
      setMeta("name", "description", descripcion);
      setMeta("property", "og:description", descripcion);
      setMeta("name", "twitter:description", descripcion);
    }

    if (ruta) {
      const url = ruta === "/" ? BASE_URL : `${BASE_URL}${ruta}`;
      let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = url;
      setMeta("property", "og:url", url);
    }

    const robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (noindex) {
      setMeta("name", "robots", "noindex, nofollow");
    } else if (robots) {
      robots.remove();
    }
  }, [titulo, descripcion, ruta, noindex]);
};
