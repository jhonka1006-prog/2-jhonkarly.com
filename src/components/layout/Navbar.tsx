import { Link, useLocation } from "react-router-dom";
import "../index.css"; // Aseguramos que cargue los estilos

const Navbar = () => {
  const location = useLocation();

  return (
    <header className="site-header" role="banner">
      <Link to="/" className="site-header__logo" aria-label="Jhonkarly ALVAREZ — Inicio">
        JHONKARLY ALVAREZ
      </Link>
      <nav className="site-nav" aria-label="Navegación principal">
        <Link to="/" aria-current={location.pathname === "/" ? "page" : undefined}>Inicio</Link>
        <Link to="/tienda" aria-current={location.pathname === "/tienda" ? "page" : undefined}>Tienda</Link>
        <Link to="/prensa" aria-current={location.pathname === "/prensa" ? "page" : undefined}>Prensa</Link>
        <Link to="/sobre-mi" aria-current={location.pathname.includes("/sobre-mi") ? "page" : undefined}>Sobre mí</Link>
        <Link to="/trayectoria" aria-current={location.pathname.includes("/trayectoria") ? "page" : undefined}>Trayectoria</Link>
        <Link to="/login" aria-current={location.pathname === "/login" ? "page" : undefined}>Inicio de sesión</Link>
      </nav>
    </header>
  );
};

export default Navbar;
