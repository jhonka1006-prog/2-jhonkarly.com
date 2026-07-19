import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabaseReady } from "@/lib/supabase";
import { usePageMeta } from "@/lib/seo";
import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Users,
  Newspaper,
  ShoppingBag,
  Package,
  Trophy,
  Medal,
  Receipt,
  FileText,
  Star,
  Handshake,
  CircleUser,
  LogOut,
  Menu,
  X,
} from "lucide-react";

/* "masterOnly" = solo visible para la cuenta maestra */
const NAV_ITEMS = [
  { to: "/dashboard",          end: true,  icon: LayoutDashboard, label: "Resumen",       masterOnly: false },
  { to: "/dashboard/usuarios", end: false, icon: Users,           label: "Usuarios",      masterOnly: true  },
  { to: "/dashboard/prensa",   end: false, icon: Newspaper,       label: "Prensa",        masterOnly: false },
  { to: "/dashboard/tienda",   end: false, icon: ShoppingBag,     label: "Tienda",        masterOnly: false },
  { to: "/dashboard/pedidos",  end: false, icon: Package,         label: "Pedidos",       masterOnly: false },
  { to: "/dashboard/competencias", end: false, icon: Trophy,      label: "Competencias",  masterOnly: false },
  { to: "/dashboard/trayectoria",  end: false, icon: Medal,       label: "Trayectoria",   masterOnly: false },
  { to: "/dashboard/sponsors",     end: false, icon: Handshake,   label: "Patrocinadores", masterOnly: false },
  { to: "/dashboard/facturacion",  end: false, icon: Receipt,     label: "Facturación",   masterOnly: true  },
  { to: "/prensa/kit",         end: false, icon: FileText,        label: "Kit de Prensa", masterOnly: false },
  { to: "/exclusivo",          end: false, icon: Star,            label: "Exclusivo",     masterOnly: false },
  { to: "/dashboard/mi-cuenta", end: false, icon: CircleUser,     label: "Mi cuenta",     masterOnly: false },
];

const Dashboard = () => {
  usePageMeta({
    titulo: "Panel de administración — Jhonkarly Alvarez",
    noindex: true,
  });

  const { profile, signOut, role } = useAuth();
  const [open, setOpen] = useState(false);
  const navItems = NAV_ITEMS.filter((i) => !i.masterOnly || role === "master");

  /* El contenido del panel scrollea en su propio contenedor (no en la ventana):
     al cambiar de sección, vuelve al tope para no heredar el scroll anterior. */
  const { pathname } = useLocation();
  const contenidoRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    contenidoRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-background">

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-[260px]
          bg-g900 border-r border-g700
          flex flex-col
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Brand */}
        <div className="h-[68px] flex items-center px-6 border-b border-g700 flex-shrink-0">
          <Link
            to="/"
            className="font-display text-[1rem] tracking-[0.22em] uppercase text-foreground hover:text-g300 transition-colors duration-300 truncate"
          >
            Jhonkarly Alvarez
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <span className="font-body text-[0.58rem] font-semibold tracking-[0.38em] uppercase text-g500 px-2 mb-3 block">
            Panel
          </span>
          <div className="flex flex-col gap-0.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 transition-colors duration-300 ${
                    isActive
                      ? "bg-g800 border border-g700 text-foreground"
                      : "text-g300 hover:text-foreground hover:bg-g800 border border-transparent"
                  }`
                }
              >
                <item.icon className="w-[14px] h-[14px] flex-shrink-0" />
                <span className="font-body text-[0.7rem] font-semibold tracking-[0.18em] uppercase">
                  {item.label}
                </span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User + signOut */}
        <div className="px-5 py-5 border-t border-g700 flex-shrink-0">
          {profile?.full_name && (
            <p className="font-body text-[0.75rem] font-semibold text-foreground mb-1 truncate">
              {profile.full_name}
            </p>
          )}
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-g700 block" />
            <span className="font-body text-[0.58rem] font-semibold tracking-[0.3em] uppercase text-g500">
              {profile?.role ?? "—"}
            </span>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 font-body text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-g500 hover:text-destructive transition-colors duration-300"
          >
            <LogOut className="w-3.5 h-3.5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Main area ── */}
      <main className="flex-1 md:ml-[260px] min-h-screen flex flex-col">

        {/* Mobile topbar */}
        <div className="md:hidden h-[68px] flex items-center justify-between px-6 border-b border-g700 bg-g900 sticky top-0 z-30">
          <Link
            to="/"
            className="font-display text-[0.95rem] tracking-[0.22em] uppercase text-foreground"
          >
            Jhonkarly
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="text-g300 hover:text-foreground transition-colors"
            aria-label="Abrir menú"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Aviso: base de datos sin conectar (modo vista previa) */}
        {!supabaseReady && (
          <div className="bg-g900 border-b border-g700 px-6 md:px-8 py-3">
            <p className="font-body text-[0.75rem] text-g300 leading-[1.7]">
              <span className="font-semibold text-foreground">Vista previa sin base de datos:</span>{" "}
              los datos no se cargan ni se guardan. Para activar el panel completo,
              pega las claves de Supabase en el archivo <code className="text-foreground">.env</code>{" "}
              y reinicia el servidor (guía en el README).
            </p>
          </div>
        )}

        {/* Page content */}
        <div ref={contenidoRef} className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
