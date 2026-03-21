import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import "../index.css";

const PUBLIC_LINKS = [
  { to: "/",            label: "Inicio",      exact: true  },
  { to: "/sobre-mi",    label: "Sobre mí",    exact: false },
  { to: "/tienda",      label: "Tienda",      exact: false },
  { to: "/prensa",      label: "Prensa",      exact: false },
  { to: "/trayectoria", label: "Trayectoria", exact: false },
];

const Navbar = () => {
  const location  = useLocation();
  const { session, role } = useAuth();
  const [open, setOpen] = useState(false);

  const accountLink = session
    ? { to: role === "admin" ? "/mi-cuenta" : "/mi-cuenta", label: "Mi cuenta", exact: false }
    : { to: "/login", label: "Inicio de sesión", exact: false };

  const allLinks = [...PUBLIC_LINKS, accountLink];

  useEffect(() => { setOpen(false); }, [location.pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="site-header" role="banner">
        <Link to="/" className="site-header__logo" aria-label="Jhonkarly ALVAREZ — Inicio">
          JHONKARLY ALVAREZ
        </Link>

        {/* Desktop nav */}
        <nav className="site-nav" aria-label="Navegación principal">
          {allLinks.map(({ to, label, exact }) => (
            <Link
              key={to}
              to={to}
              aria-current={(exact ? location.pathname === to : location.pathname.startsWith(to)) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Hamburger — mobile only */}
        <button
          className="nav-toggle"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className={`nav-toggle__bar ${open ? "nav-toggle__bar--open" : ""}`} />
          <span className={`nav-toggle__bar ${open ? "nav-toggle__bar--open" : ""}`} />
          <span className={`nav-toggle__bar ${open ? "nav-toggle__bar--open" : ""}`} />
        </button>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`nav-mobile ${open ? "nav-mobile--open" : ""}`}
        aria-hidden={!open}
      >
        <nav aria-label="Menú móvil">
          {allLinks.map(({ to, label, exact }) => {
            const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`nav-mobile__link ${isActive ? "nav-mobile__link--active" : ""}`}
                aria-current={isActive ? "page" : undefined}
                tabIndex={open ? 0 : -1}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {open && (
        <div
          className="nav-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Navbar;
