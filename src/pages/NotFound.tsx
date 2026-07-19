import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { usePageMeta } from "@/lib/seo";

const NotFound = () => {
  const location = useLocation();

  usePageMeta({
    titulo: "Página no encontrada — Jhonkarly Alvarez",
    noindex: true,
  });

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.error("404: ruta inexistente:", location.pathname);
    }
  }, [location.pathname]);

  return (
    <div id="main-content" className="min-h-screen bg-background flex items-center justify-center px-[var(--px)] pt-[68px]">
      <div className="w-full max-w-[520px] text-center py-24">
        <span className="font-body text-[0.65rem] font-semibold tracking-[0.38em] uppercase text-g500 block mb-4">
          Error 404
        </span>
        <h1 className="font-display text-[clamp(5rem,18vw,11rem)] leading-[0.85] text-foreground mb-6">
          4<span className="text-g300">0</span>4
        </h1>
        <p className="font-body font-light text-[0.9rem] text-g300 leading-[1.85] mb-10 max-w-[360px] mx-auto">
          La página que buscas no existe o cambió de lugar.
          Vuelve al inicio y sigue explorando la historia.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-foreground text-background font-body font-semibold text-[0.72rem] tracking-[0.2em] uppercase transition-opacity duration-300 hover:opacity-80"
          >
            Volver al inicio
          </Link>
          <Link
            to="/trayectoria"
            className="inline-block px-8 py-3 border border-g700 text-g300 font-body font-semibold text-[0.72rem] tracking-[0.2em] uppercase transition-colors duration-300 hover:border-g300 hover:text-foreground"
          >
            Ver trayectoria
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
