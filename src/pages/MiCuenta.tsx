import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/context/AuthContext";
import { useMyOrders } from "@/hooks/use-pedidos";
import { ESTADOS } from "@/lib/api/pedidos";
import { fmtPrecio } from "@/lib/api/tienda";
import { usePageMeta } from "@/lib/seo";

const CONTENT: Record<UserRole, { label: string; desc: string; to: string; tag: string }[]> = {
  master: [
    { label: "Panel Maestro",       desc: "Control total: usuarios, contenido, tienda y pedidos.",         to: "/dashboard",   tag: "MASTER"  },
    { label: "Kit de Prensa",       desc: "Materiales oficiales, fotos en alta resolución y archivos.",    to: "/prensa/kit",  tag: "PRENSA"  },
    { label: "Contenido Exclusivo", desc: "Galería privada y material behind-the-scenes de Jhonkarly.",    to: "/exclusivo",   tag: "PREMIUM" },
  ],
  admin: [
    { label: "Panel de Admin",      desc: "Administración de contenido: prensa, tienda y pedidos.",        to: "/dashboard",   tag: "ADMIN"   },
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

const COLOR_ESTADO: Record<string, string> = {
  pendiente: "border-g300 text-g300",
  pagado: "border-foreground text-foreground",
  enviado: "border-g100 text-g100",
  entregado: "border-g700 text-g500",
  cancelado: "border-destructive/60 text-destructive",
};

const MiCuenta = () => {
  usePageMeta({
    titulo: "Mi cuenta — Jhonkarly Alvarez",
    noindex: true,
  });

  const { profile, user, role, signOut } = useAuth();
  const { data: pedidos } = useMyOrders(user?.id);

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
              <span className="font-body text-[0.65rem] font-semibold tracking-[0.38em] uppercase text-g500 block mb-2">
                Mi cuenta
              </span>
              <h1 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.9] text-foreground">
                {profile?.full_name ?? "Bienvenido"}
              </h1>
              {user?.email && (
                <p className="font-body text-sm text-g300 mt-2">{user.email}</p>
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
            <span className="font-body text-[0.65rem] font-semibold tracking-[0.38em] uppercase text-g500 block mb-8">
              Contenido disponible
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-g700">
              {items.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group block border-b border-r border-g700 p-8 transition-colors duration-300 hover:bg-g900"
                >
                  <span className="font-body text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-g500 block mb-4">
                    {item.tag}
                  </span>
                  <h2 className="font-display text-[1.6rem] text-foreground leading-none mb-4 group-hover:text-g100 transition-colors duration-300">
                    {item.label}
                  </h2>
                  <p className="font-body font-light text-[0.83rem] text-g300 leading-[1.75]">
                    {item.desc}
                  </p>
                  <span className="block mt-6 font-body text-[0.65rem] font-semibold tracking-[0.22em] uppercase text-g500 group-hover:text-g300 transition-colors duration-300">
                    Abrir →
                  </span>
                </Link>
              ))}
            </div>
          </>
        ) : (
          /* Public role — no exclusive content yet */
          <div className="border border-g700 p-10 md:p-14 max-w-[480px]">
            <span className="font-body text-[0.65rem] font-semibold tracking-[0.38em] uppercase text-g500 block mb-4">
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
              href="mailto:contact@jhonkarly.com"
              className="inline-block px-8 py-3 bg-foreground text-background font-body font-semibold text-[0.72rem] tracking-[0.2em] uppercase transition-opacity duration-300 hover:opacity-80"
            >
              Solicitar acceso
            </a>
          </div>
        )}

        {/* ── Mis pedidos (tienda) ── */}
        <div className="mt-16">
          <span className="font-body text-[0.65rem] font-semibold tracking-[0.38em] uppercase text-g500 block mb-8">
            Mis pedidos
          </span>
          {!pedidos || pedidos.length === 0 ? (
            <div className="border border-g700 bg-g900 px-8 py-10 max-w-[480px]">
              <p className="font-body font-light text-[0.88rem] text-g300 leading-[1.85] mb-6">
                Aún no has hecho compras en la tienda oficial.
              </p>
              <Link
                to="/tienda"
                className="font-body text-[0.7rem] font-semibold tracking-[0.22em] uppercase text-foreground relative inline-block after:absolute after:bottom-[-4px] after:left-0 after:h-px after:w-full after:bg-foreground"
              >
                Visitar la tienda
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-3 max-w-[720px]">
              {pedidos.map((o) => (
                <li key={o.id} className="border border-g700 px-5 py-4 flex items-center gap-4 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <p className="font-body text-sm font-semibold text-foreground truncate">
                      {o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
                    </p>
                    <p className="font-body text-[0.7rem] text-g500 mt-0.5">
                      {new Date(o.created_at).toLocaleDateString("es-CO", { dateStyle: "medium" })} · Nº {o.id.slice(0, 8)}
                    </p>
                  </div>
                  <span className={`font-body text-[0.58rem] font-semibold tracking-[0.2em] uppercase border px-2 py-1 shrink-0 ${COLOR_ESTADO[o.status] ?? "border-g700 text-g500"}`}>
                    {ESTADOS[o.status]}
                  </span>
                  <span className="font-display text-[1.05rem] text-foreground shrink-0">
                    {fmtPrecio(o.total)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
};

export default MiCuenta;
