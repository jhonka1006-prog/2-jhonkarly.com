import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  useMilestones,
  useCreateMilestone,
  useUpdateMilestone,
  useDeleteMilestone,
  useAchievements,
  useCreateAchievement,
  useUpdateAchievement,
  useDeleteAchievement,
} from "@/hooks/use-trayectoria";
import { Milestone, Achievement, Medal, Scope } from "@/lib/api/trayectoria";
import { Trash2, Plus, Pencil, X, Medal as MedalIcon, Milestone as MilestoneIcon, ExternalLink } from "lucide-react";

const inputCls =
  "w-full bg-g900 border border-g700 font-body text-sm px-4 py-2.5 outline-none transition-colors placeholder:text-g500 text-foreground focus:border-g300";
const labelCls =
  "font-body text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-g500 block mb-2";
const btnCls =
  "flex items-center justify-center gap-2 py-3 bg-foreground text-background font-body font-semibold text-[0.7rem] tracking-[0.2em] uppercase transition-opacity hover:opacity-80 disabled:opacity-40";

const MEDAL_LABEL: Record<number, string> = { 1: "🥇 1er lugar", 2: "🥈 2º lugar", 3: "🥉 3er lugar" };

/* ════════════════════════════════════════════
   HITOS
════════════════════════════════════════════ */
const HITO_VACIO = {
  year_label: "",
  title: "",
  category: "",
  description: "",
  details: "",
  link_url: "",
  link_label: "",
  is_future: false,
  sort_order: "0",
};

const SeccionHitos = () => {
  const { toast } = useToast();
  const { data: hitos, isLoading } = useMilestones();
  const crear = useCreateMilestone();
  const actualizar = useUpdateMilestone();
  const borrar = useDeleteMilestone();
  const [form, setForm] = useState(HITO_VACIO);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const set = (campo: keyof typeof HITO_VACIO) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [campo]: e.target.value }));

  const cancelarEdicion = () => {
    setEditandoId(null);
    setForm(HITO_VACIO);
  };

  const editar = (m: Milestone) => {
    setEditandoId(m.id);
    setForm({
      year_label: m.year_label,
      title: m.title,
      category: m.category,
      description: m.description ?? "",
      details: (m.details ?? []).join("\n"),
      link_url: m.link_url ?? "",
      link_label: m.link_label ?? "",
      is_future: m.is_future,
      sort_order: String(m.sort_order),
    });
    document.getElementById("form-hito")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.year_label.trim() || !form.title.trim() || !form.category.trim()) {
      toast({ title: "Completa año, título y categoría", variant: "destructive" });
      return;
    }
    const detalles = form.details
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const data = {
      year_label: form.year_label.trim(),
      title: form.title.trim(),
      category: form.category.trim(),
      description: form.description.trim() || null,
      details: detalles.length > 0 ? detalles : null,
      link_url: form.link_url.trim() || null,
      link_label: form.link_label.trim() || null,
      is_future: form.is_future,
      sort_order: Number(form.sort_order) || 0,
    };
    try {
      if (editandoId) {
        await actualizar.mutateAsync({ id: editandoId, data });
        toast({ title: "Hito actualizado" });
      } else {
        await crear.mutateAsync(data);
        toast({ title: "Hito publicado en la trayectoria" });
      }
      cancelarEdicion();
    } catch (err) {
      toast({ title: "Error al guardar", description: (err as Error).message, variant: "destructive" });
    }
  };

  const eliminar = async (id: string, nombre: string) => {
    try {
      await borrar.mutateAsync(id);
      if (editandoId === id) cancelarEdicion();
      toast({ title: `"${nombre}" eliminado` });
    } catch (err) {
      toast({ title: "Error al eliminar", description: (err as Error).message, variant: "destructive" });
    }
  };

  const guardando = crear.isPending || actualizar.isPending;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">

      {/* ══ Formulario ══ */}
      <section id="form-hito" className="border border-g700 scroll-mt-24">
        <div className="flex items-center justify-between px-6 py-4 border-b border-g700 bg-g900">
          <div className="flex items-center gap-2">
            <MilestoneIcon className="w-4 h-4 text-g300" />
            <h2 className="font-body text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-foreground">
              {editandoId ? "Editar hito" : "Nuevo hito"}
            </h2>
          </div>
          {editandoId && (
            <button
              type="button"
              onClick={cancelarEdicion}
              className="flex items-center gap-1 font-body text-[0.62rem] font-semibold tracking-[0.2em] uppercase text-g500 hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Cancelar
            </button>
          )}
        </div>

        <form onSubmit={submit} className="px-6 py-5 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="hito-anio" className={labelCls}>Año</label>
              <input id="hito-anio" type="text" placeholder="Ej: 2023 o 2010–2020" value={form.year_label} onChange={set("year_label")} className={inputCls} />
            </div>
            <div>
              <label htmlFor="hito-cat" className={labelCls}>Categoría</label>
              <input id="hito-cat" type="text" placeholder="Ej: Competencia Nacional" value={form.category} onChange={set("category")} className={inputCls} />
            </div>
          </div>

          <div>
            <label htmlFor="hito-titulo" className={labelCls}>Título</label>
            <input id="hito-titulo" type="text" placeholder="Ej: VI Juegos Paranacionales" value={form.title} onChange={set("title")} className={inputCls} />
          </div>

          <div>
            <label htmlFor="hito-desc" className={labelCls}>Descripción (opcional)</label>
            <textarea id="hito-desc" rows={3} placeholder="Párrafo que cuenta el hito…" value={form.description} onChange={set("description")} className={inputCls} />
          </div>

          <div>
            <label htmlFor="hito-detalles" className={labelCls}>Viñetas (opcional, una por línea)</label>
            <textarea id="hito-detalles" rows={3} placeholder={"Primera viñeta\nSegunda viñeta"} value={form.details} onChange={set("details")} className={inputCls} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="hito-url" className={labelCls}>Link (opcional)</label>
              <input id="hito-url" type="url" placeholder="https://…" value={form.link_url} onChange={set("link_url")} className={inputCls} />
            </div>
            <div>
              <label htmlFor="hito-link-label" className={labelCls}>Texto del link (opcional)</label>
              <input id="hito-link-label" type="text" placeholder="Ej: Ver resultados oficiales" value={form.link_label} onChange={set("link_label")} className={inputCls} />
            </div>
            <div>
              <label htmlFor="hito-orden" className={labelCls}>Orden (menor sale primero)</label>
              <input id="hito-orden" type="number" value={form.sort_order} onChange={set("sort_order")} className={inputCls} />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.is_future}
                  onChange={(e) => setForm((p) => ({ ...p, is_future: e.target.checked }))}
                  className="w-4 h-4 accent-white"
                />
                <span className="font-body text-[0.62rem] font-semibold tracking-[0.2em] uppercase text-g300">
                  Meta futura (★)
                </span>
              </label>
            </div>
          </div>

          <button type="submit" disabled={guardando} className={btnCls}>
            {editandoId ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {guardando ? "Guardando…" : editandoId ? "Guardar cambios" : "Publicar hito"}
          </button>
        </form>
      </section>

      {/* ══ Lista ══ */}
      <section className="border border-g700">
        <div className="flex items-center justify-between px-6 py-4 border-b border-g700 bg-g900">
          <h2 className="font-body text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-foreground">
            Hitos publicados
          </h2>
          <span className="font-body text-[0.68rem] text-g500">{hitos?.length ?? 0}</span>
        </div>

        <ul>
          {isLoading ? (
            <li className="px-6 py-8 text-center font-body text-sm text-g500">Cargando…</li>
          ) : !hitos || hitos.length === 0 ? (
            <li className="px-6 py-8 text-center font-body text-sm text-g500">
              Aún no hay hitos. Publica el primero con el formulario.
            </li>
          ) : (
            hitos.map((m) => (
              <li key={m.id} className={`flex items-center gap-4 px-6 py-4 border-b border-g800 last:border-b-0 ${editandoId === m.id ? "bg-g900" : ""}`}>
                <div className="min-w-0 flex-1">
                  <p className="font-body text-sm font-semibold text-foreground truncate">
                    {m.year_label} — {m.title} {m.is_future && "★"}
                  </p>
                  <p className="font-body text-[0.72rem] text-g500 mt-0.5 truncate">
                    {m.category} · orden {m.sort_order}
                  </p>
                </div>
                {m.link_url && (
                  <a
                    href={m.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-g500 hover:text-g300 transition-colors p-1 shrink-0"
                    aria-label="Abrir link del hito"
                    title="Abrir link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => editar(m)}
                  className="text-g500 hover:text-foreground transition-colors p-1 shrink-0"
                  aria-label={`Editar hito: ${m.title}`}
                  title="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => eliminar(m.id, m.title)}
                  className="text-g500 hover:text-destructive transition-colors p-1 shrink-0"
                  aria-label={`Eliminar hito: ${m.title}`}
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
};

/* ════════════════════════════════════════════
   LOGROS
════════════════════════════════════════════ */
const LOGRO_VACIO = {
  title: "",
  event_name: "",
  year_label: "",
  medal: "" as "" | "1" | "2" | "3",
  scope: "nacional" as Scope,
  is_record: false,
  description: "",
  sort_order: "0",
};

const SeccionLogros = () => {
  const { toast } = useToast();
  const { data: logros, isLoading } = useAchievements();
  const crear = useCreateAchievement();
  const actualizar = useUpdateAchievement();
  const borrar = useDeleteAchievement();
  const [form, setForm] = useState(LOGRO_VACIO);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const set = (campo: keyof typeof LOGRO_VACIO) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [campo]: e.target.value }));

  const cancelarEdicion = () => {
    setEditandoId(null);
    setForm(LOGRO_VACIO);
  };

  const editar = (a: Achievement) => {
    setEditandoId(a.id);
    setForm({
      title: a.title,
      event_name: a.event_name ?? "",
      year_label: a.year_label ?? "",
      medal: a.medal ? (String(a.medal) as "1" | "2" | "3") : "",
      scope: a.scope,
      is_record: a.is_record,
      description: a.description ?? "",
      sort_order: String(a.sort_order),
    });
    document.getElementById("form-logro")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast({ title: "Escribe el título del logro", variant: "destructive" });
      return;
    }
    const data = {
      title: form.title.trim(),
      event_name: form.event_name.trim() || null,
      year_label: form.year_label.trim() || null,
      medal: form.medal ? (Number(form.medal) as Medal) : null,
      scope: form.scope,
      is_record: form.is_record,
      description: form.description.trim() || null,
      sort_order: Number(form.sort_order) || 0,
    };
    try {
      if (editandoId) {
        await actualizar.mutateAsync({ id: editandoId, data });
        toast({ title: "Logro actualizado" });
      } else {
        await crear.mutateAsync(data);
        toast({ title: "Logro publicado" });
      }
      cancelarEdicion();
    } catch (err) {
      toast({ title: "Error al guardar", description: (err as Error).message, variant: "destructive" });
    }
  };

  const eliminar = async (id: string, nombre: string) => {
    try {
      await borrar.mutateAsync(id);
      if (editandoId === id) cancelarEdicion();
      toast({ title: `"${nombre}" eliminado` });
    } catch (err) {
      toast({ title: "Error al eliminar", description: (err as Error).message, variant: "destructive" });
    }
  };

  const guardando = crear.isPending || actualizar.isPending;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">

      {/* ══ Formulario ══ */}
      <section id="form-logro" className="border border-g700 scroll-mt-24">
        <div className="flex items-center justify-between px-6 py-4 border-b border-g700 bg-g900">
          <div className="flex items-center gap-2">
            <MedalIcon className="w-4 h-4 text-g300" />
            <h2 className="font-body text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-foreground">
              {editandoId ? "Editar logro" : "Nuevo logro"}
            </h2>
          </div>
          {editandoId && (
            <button
              type="button"
              onClick={cancelarEdicion}
              className="flex items-center gap-1 font-body text-[0.62rem] font-semibold tracking-[0.2em] uppercase text-g500 hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Cancelar
            </button>
          )}
        </div>

        <form onSubmit={submit} className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label htmlFor="logro-titulo" className={labelCls}>Título del logro</label>
            <input id="logro-titulo" type="text" placeholder="Ej: 100m Libre S9" value={form.title} onChange={set("title")} className={inputCls} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="logro-evento" className={labelCls}>Evento (opcional)</label>
              <input id="logro-evento" type="text" placeholder="Ej: VI Juegos Paranacionales" value={form.event_name} onChange={set("event_name")} className={inputCls} />
            </div>
            <div>
              <label htmlFor="logro-anio" className={labelCls}>Año (opcional)</label>
              <input id="logro-anio" type="text" placeholder="Ej: 2023" value={form.year_label} onChange={set("year_label")} className={inputCls} />
            </div>
            <div>
              <label htmlFor="logro-medalla" className={labelCls}>Medalla</label>
              <select id="logro-medalla" value={form.medal} onChange={set("medal")} className={inputCls}>
                <option value="">— Sin medalla (participación / récord) —</option>
                <option value="1">🥇 1er lugar — Oro</option>
                <option value="2">🥈 2º lugar — Plata</option>
                <option value="3">🥉 3er lugar — Bronce</option>
              </select>
            </div>
            <div>
              <label htmlFor="logro-scope" className={labelCls}>Ámbito</label>
              <select id="logro-scope" value={form.scope} onChange={set("scope")} className={inputCls}>
                <option value="nacional">Nacional</option>
                <option value="internacional">Internacional</option>
              </select>
            </div>
            <div>
              <label htmlFor="logro-orden" className={labelCls}>Orden (menor sale primero)</label>
              <input id="logro-orden" type="number" value={form.sort_order} onChange={set("sort_order")} className={inputCls} />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.is_record}
                  onChange={(e) => setForm((p) => ({ ...p, is_record: e.target.checked }))}
                  className="w-4 h-4 accent-white"
                />
                <span className="font-body text-[0.62rem] font-semibold tracking-[0.2em] uppercase text-g300">
                  Imposición de récord
                </span>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="logro-desc" className={labelCls}>Detalle (opcional)</label>
            <textarea id="logro-desc" rows={2} placeholder="Ej: Tiempo 01:02.45 — Medellín, Colombia" value={form.description} onChange={set("description")} className={inputCls} />
          </div>

          <button type="submit" disabled={guardando} className={btnCls}>
            {editandoId ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {guardando ? "Guardando…" : editandoId ? "Guardar cambios" : "Publicar logro"}
          </button>
        </form>
      </section>

      {/* ══ Lista ══ */}
      <section className="border border-g700">
        <div className="flex items-center justify-between px-6 py-4 border-b border-g700 bg-g900">
          <h2 className="font-body text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-foreground">
            Logros publicados
          </h2>
          <span className="font-body text-[0.68rem] text-g500">{logros?.length ?? 0}</span>
        </div>

        <ul>
          {isLoading ? (
            <li className="px-6 py-8 text-center font-body text-sm text-g500">Cargando…</li>
          ) : !logros || logros.length === 0 ? (
            <li className="px-6 py-8 text-center font-body text-sm text-g500">
              Aún no hay logros. Publica el primero con el formulario.
            </li>
          ) : (
            logros.map((a) => (
              <li key={a.id} className={`flex items-center gap-4 px-6 py-4 border-b border-g800 last:border-b-0 ${editandoId === a.id ? "bg-g900" : ""}`}>
                <div className="min-w-0 flex-1">
                  <p className="font-body text-sm font-semibold text-foreground truncate">
                    {a.medal ? `${MEDAL_LABEL[a.medal]} — ` : ""}{a.title}{a.is_record && " · RÉCORD"}
                  </p>
                  <p className="font-body text-[0.72rem] text-g500 mt-0.5 truncate">
                    {[a.scope, a.event_name, a.year_label].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <button
                  onClick={() => editar(a)}
                  className="text-g500 hover:text-foreground transition-colors p-1 shrink-0"
                  aria-label={`Editar logro: ${a.title}`}
                  title="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => eliminar(a.id, a.title)}
                  className="text-g500 hover:text-destructive transition-colors p-1 shrink-0"
                  aria-label={`Eliminar logro: ${a.title}`}
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
};

/* ════════════════════════════════════════════
   PÁGINA
════════════════════════════════════════════ */
const TrayectoriaAdminPage = () => {
  const [tab, setTab] = useState<"hitos" | "logros">("hitos");

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-8">
        <span className="font-body text-[0.6rem] font-semibold tracking-[0.38em] uppercase text-g500 block mb-2">
          Dashboard · Contenido
        </span>
        <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-none text-foreground">
          Trayectoria
        </h1>
        <p className="font-body text-sm text-g300 mt-2">
          Administra los hitos de la línea de tiempo y los logros (medallas y récords) de /trayectoria.
        </p>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 mb-8 border-b border-g700">
        {([
          ["hitos", "Hitos del recorrido"],
          ["logros", "Logros · Medallas y récords"],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-5 py-3 font-body text-[0.68rem] font-semibold tracking-[0.2em] uppercase transition-colors border-b-2 -mb-px ${
              tab === id
                ? "text-foreground border-foreground"
                : "text-g500 border-transparent hover:text-g300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "hitos" ? <SeccionHitos /> : <SeccionLogros />}
    </div>
  );
};

export default TrayectoriaAdminPage;
