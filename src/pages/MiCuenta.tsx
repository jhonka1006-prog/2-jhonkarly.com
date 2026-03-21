import { Link } from "react-router-dom";
import { useAuth, UserRole } from "@/context/AuthContext";

const CONTENT: Record<UserRole, { label: string; desc: string; to: string; tag: string }[]> = {
  admin: [
    { label: "Panel de Admin",      desc: "Gestión de usuarios, analítica y configuración del sitio.",     to: "/dashboard",   tag: "ADMIN"   },
    { label: "Kit de Prensa",       desc: "Materiales oficiales, fotos en alta resolución y archivos.",    to: "/prensa/kit",  tag: "PRENSA"  },
    { label: "Contenido Exclusivo", desc: "Galería privada y material behind-the-scenes de Jhonkarly.",    to: "/exclusivo",   tag: "PREMIUM" },
  ],
  prensa: [
    { label: "Kit de Prensa",       desc: "Materiales oficiales, fotos en alta resolución y archivos para medios.", to: "/prensa/kit", tag: "PRENSA" },
  ],
  premium: [
    { label: "Contenido Exclusivo", desc: "Galería privada y material behind-the-scenes de Jhonkarly.",   to: "/exclusivo",   tag: "PREMIUM" },
  ],
  public: [],
};

const initials = (name: string | null) =>
  name ? name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() : "?";

const MiCuenta = () => {
  const { profile, role, signOut } = useAuth();

  const items = CONTENT[role] ?? [];

  return (
    <div className="min-h-screen bg-background pt-[68px] px-[var(--px)] py-[var(--section-py)]">
      <div className="max-w-[var(--container-max)] mx-auto">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-14 flex-wrap gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-g700 flex items-center justify-center font-display text-[1.6rem] text-foreground flex-shrink-0">
              {initials(profile?.full_name ?? null)}
            </div>
            <div>
              <span className="font-body text-[0.65rem] font-semibold tracking-[0.38em] uppercase text-g700 block mb-2">
                Mi cuenta
              </span>
              <h1 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.9] text-foreground">
                {profile?.full_name ?? "Bienvenido"}
              </h1>
              {profile?.email && (
                <p className="font-body text-sm text-g300 mt-2">{profile.email}</p>
              )}
            </div>
          </div>

          <button
            onClick={signOut}
            className="font-body text-[0.68rem] font-semibold tracking-[0.22em] uppercase text-g300 border border-g700 px-6 py-3 hover:border-g300 hover:text-foreground transition-colors duration-300 self-start"
          >
            Cerrar sesión
          </button>
        </div>

        {/* ── Role badge ── */}
        <div className="inline-flex items-center gap-2 border border-g700 px-4 py-2 mb-12">
          <span className="w-2 h-2 rounded-full bg-foreground block" />
          <span className="font-body text-[0.65rem] font-semibold tracking-[0.28em] uppercase text-g300">
            Acceso: {role}
          </span>
        </div>

        {/* ── Content accessible to this user ── */}
        {items.length > 0 ? (
          <>
            <span className="font-body text-[0.65rem] font-semibold tracking-[0.38em] uppercase text-g700 block mb-8">
              Contenido disponible
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-g700">
              {items.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group block border-b border-r border-g700 p-8 transition-colors duration-300 hover:bg-g900"
                >
                  <span className="font-body text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-g700 block mb-4">
                    {item.tag}
                  </span>
                  <h2 className="font-display text-[1.6rem] text-foreground leading-none mb-4 group-hover:text-g100 transition-colors duration-300">
                    {item.label}
                  </h2>
                  <p className="font-body font-light text-[0.83rem] text-g300 leading-[1.75]">
                    {item.desc}
                  </p>
                  <span className="block mt-6 font-body text-[0.65rem] font-semibold tracking-[0.22em] uppercase text-g700 group-hover:text-g300 transition-colors duration-300">
                    Abrir →
                  </span>
                </Link>
              ))}
            </div>
          </>
        ) : (
          /* Public role — no exclusive content yet */
          <div className="border border-g700 p-10 md:p-14 max-w-[480px]">
            <span className="font-body text-[0.65rem] font-semibold tracking-[0.38em] uppercase text-g700 block mb-4">
              Acceso limitado
            </span>
            <h2 className="font-display text-[2.2rem] leading-none text-foreground mb-5">
              Sin contenido<br />
              <span className="text-g300">exclusivo aún</span>
            </h2>
            <p className="font-body font-light text-[0.88rem] text-g300 leading-[1.85] mb-8">
              Tu cuenta aún no tiene acceso a contenido privado. Contacta a Jhonkarly para solicitar
              un rol de <strong className="text-foreground font-semibold">prensa</strong> o{" "}
              <strong className="text-foreground font-semibold">premium</strong>.
            </p>
            <a
              href="mailto:contac@jhonkarly.com"
              className="inline-block px-8 py-3 bg-foreground text-background font-body font-semibold text-[0.72rem] tracking-[0.2em] uppercase transition-opacity duration-300 hover:opacity-80"
            >
              Solicitar acceso
            </a>
          </div>
        )}

      </div>
    </div>
  );
};

export default MiCuenta;
