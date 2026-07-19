import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/* Restablece el scroll al tope en cada cambio de ruta.
   - Sin esto, React Router conserva la posición de scroll anterior y las
     páginas nuevas aparecen "a mitad de camino" o al final.
   - behavior "instant" evita que el `scroll-behavior: smooth` global del CSS
     convierta el reset en una animación visible.
   - Si la URL trae un ancla (#seccion), se respeta y se navega a ella. */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      /* Las páginas son lazy: al entrar directo con #ancla el elemento aún no
         existe. Reintenta por frame (~2 s máx.) hasta que la sección monte. */
      let intentos = 0;
      let raf = 0;
      const buscar = () => {
        const destino = document.querySelector(hash);
        if (destino) {
          destino.scrollIntoView();
          return;
        }
        if (++intentos < 120) raf = requestAnimationFrame(buscar);
      };
      buscar();
      return () => cancelAnimationFrame(raf);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
