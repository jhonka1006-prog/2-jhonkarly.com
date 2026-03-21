import { Outlet, NavLink, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Star,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/dashboard",          end: true,  icon: LayoutDashboard, label: "Resumen"       },
  { to: "/dashboard/usuarios", end: false, icon: Users,           label: "Usuarios"      },
  { to: "/prensa/kit",         end: false, icon: FileText,        label: "Kit de Prensa" },
  { to: "/exclusivo",          end: false, icon: Star,            label: "Exclusivo"     },
];

const Dashboard = () => {
  const { profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);

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
          <span className="font-body text-[0.58rem] font-semibold tracking-[0.38em] uppercase text-g700 px-2 mb-3 block">
            Panel
          </span>
          <div className="flex flex-col gap-0.5">
            {NAV_ITEMS.map((item) => (
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
            <span className="font-body text-[0.58rem] font-semibold tracking-[0.3em] uppercase text-g700">
              {profile?.role ?? "—"}
            </span>
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 font-body text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-g700 hover:text-destructive transition-colors duration-300"
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

        {/* Page content */}
        <div className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
