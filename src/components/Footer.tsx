import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-footer__grid">
        <div className="footer-brand">
          <Link to="/" className="footer-brand__name" aria-label="Jhonkarly ALVAREZ — Inicio">
            JHONKARLY ALVAREZ
          </Link>
          <p className="footer-brand__desc">
            Atleta paralímpico colombiano. Nadador de alta competencia.
            En dos años, medallista paralímpico en Los Ángeles 2028.
          </p>
        </div>

        <nav className="footer-col" aria-label="Navegación secundaria">
          <span className="footer-col__title">Páginas</span>
          <ul className="footer-nav-list">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/sobre-mi">Sobre mí</Link></li>
            <li><Link to="/tienda">Tienda</Link></li>
            <li><Link to="/prensa">Prensa</Link></li>
            <li><Link to="/trayectoria">Trayectoria</Link></li>
            <li><Link to="/login">Inicio de sesión</Link></li>
          </ul>
        </nav>

        <div className="footer-col" aria-label="Información de contacto">
          <span className="footer-col__title">Contacto</span>
          <ul className="footer-nav-list">
            <li>
              <a href="mailto:contac@jhonkarly.com" aria-label="Enviar correo a contac@jhonkarly.com">
                contac@jhonkarly.com
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <span className="footer-col__title">Redes</span>
          <div className="footer-socials">
            <a href="https://instagram.com/jhonkarly__" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
           <a href="https://x.com/jhonka777?s=21" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="X / Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://www.youtube.com/@Jhonkarly" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.4 2.8 12 2.8 12 2.8s-4.4 0-6.8.2c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.3.7 11.5v2.1c0 2.2.3 4.5.3 4.5s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.5 22.2 12 22.2 12 22.2s4.4 0 6.8-.3c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.2.3-4.5v-2c0-2.3-.3-4.3-.3-4.3zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z"/>
              </svg>
            </a>
            <a href="https://tiktok.com/@nuvakii" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="TikTok">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
              </svg>
            </a>
            <a href="https://vsco.co/jhonki-" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="VSCO">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                <circle cx="12" cy="12" r="9.5"/>
                <circle cx="12" cy="12" r="4"/>
                <line x1="12" y1="2.5" x2="12" y2="4.5" strokeWidth="2"/>
                <line x1="12" y1="19.5" x2="12" y2="21.5" strokeWidth="2"/>
                <line x1="2.5" y1="12" x2="4.5" y2="12" strokeWidth="2"/>
                <line x1="19.5" y1="12" x2="21.5" y2="12" strokeWidth="2"/>
              </svg>
            </a>
            <a href="https://strava.app.link/06PioIGKJYb" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Strava">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169"/>
              </svg>
            </a>
            <a href="https://www.reddit.com/u/Jhonkarly_" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Reddit">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 6.628 5.373 12 12 12s12-5.372 12-12c0-6.627-5.373-12-12-12zm5.894 11.25a1.55 1.55 0 0 0-1.007.373c-.98-.63-2.3-1.04-3.76-1.09l.717-3.194 2.19.496a1.17 1.17 0 1 0 .248-1.044l-2.476-.56a.31.31 0 0 0-.366.226l-.81 3.607c-1.494.035-2.845.446-3.843 1.083a1.55 1.55 0 1 0-1.665 2.516 3.14 3.14 0 0 0-.02.349c0 2.226 2.592 4.031 5.794 4.031s5.794-1.805 5.794-4.031c0-.12-.007-.237-.02-.354a1.55 1.55 0 0 0-.776-2.408zm-8.458 1.55a.93.93 0 1 1 1.86 0 .93.93 0 0 1-1.86 0zm5.174 2.905c-.602.602-1.756.65-2.116.65s-1.513-.048-2.115-.65a.248.248 0 0 1 .35-.352c.395.394 1.232.534 1.765.534s1.371-.14 1.765-.534a.248.248 0 1 1 .351.352zm-.155-1.975a.93.93 0 1 1 0-1.86.93.93 0 0 1 0 1.86z"/>
              </svg>
            </a>
            <a href="https://pin.it/2SRAJx8AN" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Pinterest">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
              </svg>
            </a>
            <a href="https://snapchat.com/t/X0a25YjV" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Snapchat">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2c-2.608 0-5.5 1.364-5.5 5.09v2.207c0 .24-.13.462-.34.583l-.555.32c-.51.295-.805.65-.805.98 0 .47.617.82 1.07.975.147.05.23.204.19.354l-.085.312c-.117.427-.273.819-.467 1.163-.43.775-1.16 1.431-2.17 1.955-.187.1-.294.3-.264.508.062.456.657.77 1.77.94.103.016.19.083.225.179l.16.4c.078.195.263.322.473.322.118 0 .24-.033.355-.084.304-.136.63-.254.99-.254.28 0 .547.055.8.164.49.21.97.668 1.71 1.06.515.275 1.05.414 1.593.414.547 0 1.086-.14 1.604-.42.732-.39 1.216-.851 1.713-1.061.25-.107.516-.16.797-.16.354 0 .677.116.974.25.113.05.235.084.352.084.21 0 .395-.127.473-.322l.16-.4a.314.314 0 0 1 .225-.179c1.113-.17 1.708-.484 1.77-.94a.476.476 0 0 0-.264-.508c-1.01-.524-1.74-1.18-2.17-1.955a6.25 6.25 0 0 1-.467-1.163l-.085-.312a.285.285 0 0 1 .19-.354c.453-.156 1.07-.505 1.07-.975 0-.33-.295-.685-.805-.98l-.555-.32a.672.672 0 0 1-.34-.583V7.09C17.5 3.364 14.608 2 12 2z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p className="footer-copy">
          &copy; <time dateTime="2025">2025</time> &nbsp;·&nbsp; <strong>Jhonkarly Alvarez Pantoja</strong> &nbsp;·&nbsp; Todos los derechos reservados.
        </p>
        <nav className="footer-legal" aria-label="Legal">
          <Link to="/privacidad">Privacidad</Link>
          <Link to="/terminos">Términos</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
