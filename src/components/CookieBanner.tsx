import { useState } from "react";
import { Link } from "react-router-dom";

/* ════════════════════════════════════════════════════════════
   Aviso de cookies / almacenamiento local.
   El sitio no usa cookies de rastreo: solo almacenamiento local
   (sesión, carrito y esta misma aceptación), y así se informa.
   Se muestra hasta que el visitante lo acepta.
   ════════════════════════════════════════════════════════════ */

const STORAGE_KEY = "jk-cookies-aceptadas";

const yaAceptado = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return true; // sin localStorage no podemos recordar la elección: no insistir
  }
};

const CookieBanner = () => {
  const [visible, setVisible] = useState(() => !yaAceptado());

  if (!visible) return null;

  const aceptar = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* modo incógnito estricto: se aceptará de nuevo la próxima visita */
    }
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="fixed bottom-0 inset-x-0 z-[60] border-t border-g700 bg-background/95 backdrop-blur-sm px-[var(--px)] py-4"
    >
      <div className="max-w-[var(--container-max)] mx-auto flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="font-body text-[0.78rem] text-g300 leading-[1.7] flex-1">
          Este sitio usa el almacenamiento de tu navegador para la sesión y el
          carrito de compras. Sin cookies publicitarias ni rastreo.{" "}
          <Link to="/privacidad" className="text-foreground underline underline-offset-4 hover:text-g300 transition-colors">
            Más información
          </Link>
        </p>
        <button
          onClick={aceptar}
          className="shrink-0 px-8 py-3 bg-foreground text-background font-body font-semibold text-[0.68rem] tracking-[0.22em] uppercase transition-opacity hover:opacity-80"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
