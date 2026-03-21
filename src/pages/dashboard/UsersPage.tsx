import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { UserRole } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Search, ChevronLeft, ChevronRight,
  Trash2, Shield, X, ChevronDown, UserPlus,
} from "lucide-react";

interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  email: string | null;
  created_at: string | null;
}

const ROLES: UserRole[] = ["admin", "prensa", "premium", "public"];
const PAGE_SIZE = 10;

const ROLE_BADGE: Record<UserRole, string> = {
  admin:   "border-foreground text-foreground",
  prensa:  "border-g300 text-g300",
  premium: "border-g100 text-g100",
  public:  "border-g700 text-g700",
};

const initials = (name: string | null) =>
  name ? name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() : "?";

const fmtDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("es-CO", { year: "numeric", month: "short", day: "numeric" })
    : "—";

/* ── Component ── */
const UsersPage = () => {
  const { toast } = useToast();

  const [users, setUsers]       = useState<Profile[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage]         = useState(1);
  const [detail, setDetail]     = useState<Profile | null>(null);
  const [bulkMenu, setBulkMenu] = useState(false);

  /* ── Create user state ── */
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating]     = useState(false);
  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "public" as UserRole,
  });
  const [createErrors, setCreateErrors] = useState<Record<string, string>>({});

  /* ── Fetch ── */
  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setUsers(data as Profile[]);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  /* ── Filter + paginate ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      const matchSearch =
        !q ||
        u.full_name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q);
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* ── Selection ── */
  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };
  const toggleAll = () => {
    if (selected.size === paginated.length && paginated.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paginated.map((u) => u.id)));
    }
  };

  /* ── Create user ── */
  const validateCreate = () => {
    const errs: Record<string, string> = {};
    if (!newUser.full_name.trim())           errs.full_name = "El nombre es obligatorio";
    if (!newUser.email.trim())               errs.email     = "El correo es obligatorio";
    if (!/\S+@\S+\.\S+/.test(newUser.email)) errs.email     = "Correo inválido";
    if (newUser.password.length < 6)         errs.password  = "Mínimo 6 caracteres";
    setCreateErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreate = async () => {
    if (!validateCreate()) return;
    setCreating(true);

    // Save admin session to restore it after signUp
    const { data: { session: adminSession } } = await supabase.auth.getSession();

    const { data, error } = await supabase.auth.signUp({
      email: newUser.email,
      password: newUser.password,
      options: { data: { full_name: newUser.full_name } },
    });

    if (error) {
      // Restore admin session before reporting error
      if (adminSession) {
        await supabase.auth.setSession({
          access_token: adminSession.access_token,
          refresh_token: adminSession.refresh_token,
        });
      }
      toast({ title: "Error al crear usuario", description: error.message, variant: "destructive" });
      setCreating(false);
      return;
    }

    // Update profile with correct role + email (trigger created it with "public")
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        role: newUser.role,
        full_name: newUser.full_name,
        email: newUser.email,
      });
    }

    // Restore admin session
    if (adminSession) {
      await supabase.auth.setSession({
        access_token: adminSession.access_token,
        refresh_token: adminSession.refresh_token,
      });
    }

    toast({
      title: "Usuario creado",
      description: `Se envió un email de confirmación a ${newUser.email}`,
    });

    setNewUser({ full_name: "", email: "", password: "", role: "public" });
    setCreateErrors({});
    setCreateOpen(false);
    fetchUsers();
    setCreating(false);
  };

  /* ── Update / Delete ── */
  const updateRole = async (userId: string, role: UserRole) => {
    const { error } = await supabase.from("profiles").update({ role }).eq("id", userId);
    if (error) {
      toast({ title: "Error al actualizar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Rol actualizado" });
      setDetail((prev) => (prev?.id === userId ? { ...prev, role } : prev));
      fetchUsers();
    }
  };

  const deleteUser = async (userId: string) => {
    const { error } = await supabase.from("profiles").delete().eq("id", userId);
    if (error) {
      toast({ title: "Error al eliminar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Usuario eliminado" });
      setDetail(null);
      setSelected((prev) => { const n = new Set(prev); n.delete(userId); return n; });
      fetchUsers();
    }
  };

  const bulkUpdateRole = async (role: UserRole) => {
    const ids = Array.from(selected);
    const { error } = await supabase.from("profiles").update({ role }).in("id", ids);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `${ids.length} usuarios actualizados` });
      setSelected(new Set());
      setBulkMenu(false);
      fetchUsers();
    }
  };

  const bulkDelete = async () => {
    const ids = Array.from(selected);
    const { error } = await supabase.from("profiles").delete().in("id", ids);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `${ids.length} usuarios eliminados` });
      setSelected(new Set());
      fetchUsers();
    }
  };

  /* ── Input style helper ── */
  const inputCls = (field: string) =>
    `w-full bg-g900 border font-body text-sm px-4 py-2.5 outline-none transition-colors placeholder:text-g700 text-foreground ${
      createErrors[field] ? "border-destructive" : "border-g700 focus:border-g300"
    }`;

  /* ── Render ── */
  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <span className="font-body text-[0.6rem] font-semibold tracking-[0.38em] uppercase text-g700 block mb-2">
            Dashboard · Administración
          </span>
          <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-none text-foreground">
            Usuarios
          </h1>
          <p className="font-body text-sm text-g300 mt-2">
            {loading ? "Cargando…" : `${users.length} usuarios registrados`}
          </p>
        </div>

        <button
          onClick={() => { setCreateOpen(true); setCreateErrors({}); }}
          className="flex items-center gap-2 px-5 py-3 bg-foreground text-background font-body font-semibold text-[0.7rem] tracking-[0.2em] uppercase transition-opacity hover:opacity-80 flex-shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Nuevo usuario
        </button>
      </div>

      {/* ── Search + filter ── */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-g700" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o ID…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-g900 border border-g700 text-foreground font-body text-sm pl-9 pr-4 py-2.5 outline-none focus:border-g300 transition-colors placeholder:text-g700"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value as UserRole | "all"); setPage(1); }}
          className="bg-g900 border border-g700 text-g300 font-body text-[0.68rem] tracking-widest uppercase px-4 py-2.5 outline-none focus:border-g300 transition-colors cursor-pointer"
        >
          <option value="all">Todos los roles</option>
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* ── Bulk action bar ── */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 bg-g900 border border-g700 px-4 py-3 mb-4 flex-wrap">
          <span className="font-body text-[0.68rem] font-semibold tracking-widest uppercase text-g300">
            {selected.size} seleccionados
          </span>

          <div className="relative">
            <button
              onClick={() => setBulkMenu(!bulkMenu)}
              className="flex items-center gap-1.5 font-body text-[0.65rem] font-semibold tracking-widest uppercase border border-g700 px-3 py-1.5 text-g300 hover:border-g300 hover:text-foreground transition-colors"
            >
              <Shield className="w-3 h-3" />
              Cambiar rol
              <ChevronDown className="w-3 h-3" />
            </button>
            {bulkMenu && (
              <div className="absolute top-full left-0 mt-1 z-20 bg-g900 border border-g700 min-w-[140px]">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    onClick={() => bulkUpdateRole(r)}
                    className="w-full text-left px-4 py-2.5 font-body text-[0.68rem] font-semibold tracking-widest uppercase text-g300 hover:bg-g800 hover:text-foreground transition-colors"
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={bulkDelete}
            className="flex items-center gap-1.5 font-body text-[0.65rem] font-semibold tracking-widest uppercase text-destructive border border-destructive/30 px-3 py-1.5 hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Eliminar
          </button>

          <button
            onClick={() => setSelected(new Set())}
            className="ml-auto text-g700 hover:text-g300 transition-colors"
            aria-label="Cancelar selección"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Table ── */}
      <div className="border border-g700 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-g700 bg-g900">
              <th className="w-10 p-3 text-center">
                <input
                  type="checkbox"
                  checked={selected.size === paginated.length && paginated.length > 0}
                  onChange={toggleAll}
                  className="accent-foreground cursor-pointer"
                />
              </th>
              <th className="text-left p-3 font-body text-[0.58rem] font-semibold tracking-[0.32em] uppercase text-g700">Usuario</th>
              <th className="text-left p-3 font-body text-[0.58rem] font-semibold tracking-[0.32em] uppercase text-g700 hidden sm:table-cell">Rol</th>
              <th className="text-left p-3 font-body text-[0.58rem] font-semibold tracking-[0.32em] uppercase text-g700 hidden lg:table-cell">Registro</th>
              <th className="w-14 p-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-10 text-center font-body text-g700 text-sm">Cargando…</td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center">
                  <p className="font-body text-g700 text-sm mb-4">No hay usuarios que coincidan</p>
                  {!search && roleFilter === "all" && (
                    <button
                      onClick={() => setCreateOpen(true)}
                      className="font-body text-[0.68rem] font-semibold tracking-widest uppercase text-g300 border border-g700 px-4 py-2 hover:border-g300 hover:text-foreground transition-colors"
                    >
                      + Crear primer usuario
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              paginated.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-g700 hover:bg-g900 transition-colors cursor-pointer"
                  onClick={() => setDetail(user)}
                >
                  <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selected.has(user.id)}
                      onChange={() => toggleOne(user.id)}
                      className="accent-foreground cursor-pointer"
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-g700 flex items-center justify-center font-body text-[0.62rem] font-semibold text-g300 flex-shrink-0">
                        {initials(user.full_name)}
                      </div>
                      <div>
                        <p className="font-body text-sm font-semibold text-foreground leading-none">
                          {user.full_name ?? "Sin nombre"}
                        </p>
                        {user.email && (
                          <p className="font-body text-[0.7rem] text-g700 mt-0.5">{user.email}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 hidden sm:table-cell">
                    <span className={`font-body text-[0.58rem] font-semibold tracking-[0.25em] uppercase border px-2 py-1 ${ROLE_BADGE[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3 hidden lg:table-cell font-body text-[0.78rem] text-g700">
                    {fmtDate(user.created_at)}
                  </td>
                  <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-g700 hover:text-destructive transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
          <span className="font-body text-[0.7rem] text-g700">
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border border-g700 text-g300 hover:border-g300 hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-body text-[0.7rem] text-g300 min-w-[56px] text-center">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 border border-g700 text-g300 hover:border-g300 hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Create User Modal ── */}
      {createOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => !creating && setCreateOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="relative w-full max-w-[460px] mx-4 bg-background border border-g700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between px-8 pt-8 pb-6 border-b border-g700">
              <div>
                <span className="font-body text-[0.58rem] font-semibold tracking-[0.38em] uppercase text-g700 block mb-2">
                  Gestión de usuarios
                </span>
                <h2 className="font-display text-[2rem] leading-none text-foreground">
                  Nuevo usuario
                </h2>
              </div>
              <button
                onClick={() => setCreateOpen(false)}
                disabled={creating}
                className="text-g700 hover:text-g300 transition-colors mt-1 disabled:opacity-30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="px-8 py-6 flex flex-col gap-5">

              {/* Full name */}
              <div>
                <label className="font-body text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-g700 block mb-2">
                  Nombre completo <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: María González"
                  value={newUser.full_name}
                  onChange={(e) => setNewUser((p) => ({ ...p, full_name: e.target.value }))}
                  className={inputCls("full_name")}
                  disabled={creating}
                />
                {createErrors.full_name && (
                  <p className="font-body text-[0.7rem] text-destructive mt-1">{createErrors.full_name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="font-body text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-g700 block mb-2">
                  Correo electrónico <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser((p) => ({ ...p, email: e.target.value }))}
                  className={inputCls("email")}
                  disabled={creating}
                />
                {createErrors.email && (
                  <p className="font-body text-[0.7rem] text-destructive mt-1">{createErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="font-body text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-g700 block mb-2">
                  Contraseña temporal <span className="text-destructive">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={newUser.password}
                  onChange={(e) => setNewUser((p) => ({ ...p, password: e.target.value }))}
                  className={inputCls("password")}
                  disabled={creating}
                />
                {createErrors.password && (
                  <p className="font-body text-[0.7rem] text-destructive mt-1">{createErrors.password}</p>
                )}
                <p className="font-body text-[0.68rem] text-g700 mt-1.5">
                  El usuario recibirá un email de confirmación y podrá cambiarla.
                </p>
              </div>

              {/* Role */}
              <div>
                <label className="font-body text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-g700 block mb-3">
                  Rol y permisos
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      disabled={creating}
                      onClick={() => setNewUser((p) => ({ ...p, role: r }))}
                      className={`font-body text-[0.65rem] font-semibold tracking-[0.2em] uppercase border px-3 py-2.5 transition-colors disabled:opacity-40 ${
                        newUser.role === r
                          ? "bg-foreground text-background border-foreground"
                          : "border-g700 text-g700 hover:border-g300 hover:text-g300"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 pb-8 flex flex-col gap-3">
              <button
                onClick={handleCreate}
                disabled={creating}
                className="w-full py-3.5 bg-foreground text-background font-body font-semibold text-[0.72rem] tracking-[0.22em] uppercase transition-opacity hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {creating ? "Creando usuario…" : "Crear usuario"}
              </button>
              <button
                onClick={() => setCreateOpen(false)}
                disabled={creating}
                className="w-full py-3 font-body text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-g700 hover:text-g300 transition-colors disabled:opacity-40"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── User Detail Panel ── */}
      {detail && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setDetail(null)}>
          <div className="flex-1 bg-black/40" />
          <div
            className="w-full max-w-[400px] bg-background border-l border-g700 h-full overflow-y-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-g700 sticky top-0 bg-background z-10">
              <span className="font-body text-[0.58rem] font-semibold tracking-[0.32em] uppercase text-g700">
                Perfil de usuario
              </span>
              <button onClick={() => setDetail(null)} className="text-g700 hover:text-g300 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-6 border-b border-g700">
              <div className="w-14 h-14 bg-g700 flex items-center justify-center font-display text-xl text-foreground mb-4">
                {initials(detail.full_name)}
              </div>
              <h2 className="font-display text-[1.9rem] leading-none text-foreground mb-1">
                {detail.full_name ?? "Sin nombre"}
              </h2>
              {detail.email && (
                <p className="font-body text-sm text-g300">{detail.email}</p>
              )}
            </div>

            <div className="px-6 py-6 flex flex-col gap-5 flex-1">
              <div>
                <span className="font-body text-[0.58rem] font-semibold tracking-[0.32em] uppercase text-g700 block mb-1.5">ID</span>
                <p className="font-body text-[0.72rem] text-g300 break-all font-mono">{detail.id}</p>
              </div>
              <div>
                <span className="font-body text-[0.58rem] font-semibold tracking-[0.32em] uppercase text-g700 block mb-1.5">Registro</span>
                <p className="font-body text-sm text-g300">{fmtDate(detail.created_at)}</p>
              </div>
              <div>
                <span className="font-body text-[0.58rem] font-semibold tracking-[0.32em] uppercase text-g700 block mb-3">
                  Permisos / Rol
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r}
                      onClick={() => updateRole(detail.id, r)}
                      className={`font-body text-[0.65rem] font-semibold tracking-[0.2em] uppercase border px-3 py-2.5 transition-colors duration-300 ${
                        detail.role === r
                          ? "bg-foreground text-background border-foreground"
                          : "border-g700 text-g700 hover:border-g300 hover:text-g300"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-5 border-t border-g700">
              <button
                onClick={() => deleteUser(detail.id)}
                className="w-full flex items-center justify-center gap-2 font-body text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-destructive border border-destructive/30 px-4 py-3 hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar usuario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
