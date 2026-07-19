import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  useCompetitions,
  useCreateCompetition,
  useDeleteCompetition,
} from "@/hooks/use-competencias";
import { Trash2, Plus, Trophy, ExternalLink } from "lucide-react";

const hoy = () => new Date().toISOString().slice(0, 10);

const inputCls =
  "w-full bg-g900 border border-g700 font-body text-sm px-4 py-2.5 outline-none transition-colors placeholder:text-g500 text-foreground focus:border-g300";
const labelCls =
  "font-body text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-g500 block mb-2";

const FORM_VACIO = {
  event_name: "",
  location: "",
  event_date: hoy(),
  race: "",
  mark: "",
  placement: "",
  result_url: "",
};

const CompetenciasAdminPage = () => {
  const { toast } = useToast();
  const { data: competencias, isLoading } = useCompetitions();
  const crear = useCreateCompetition();
  const borrar = useDeleteCompetition();
  const [form, setForm] = useState(FORM_VACIO);

  const set = (campo: keyof typeof FORM_VACIO) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [campo]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.event_name.trim() || !form.location.trim() || !form.race.trim() || !form.mark.trim()) {
      toast({ title: "Completa evento, ubicación, prueba y marca", variant: "destructive" });
      return;
    }
    try {
      await crear.mutateAsync({
        event_name: form.event_name.trim(),
        location: form.location.trim(),
        event_date: form.event_date,
        race: form.race.trim(),
        mark: form.mark.trim(),
        placement: form.placement.trim() || null,
        result_url: form.result_url.trim() || null,
      });
      toast({ title: "Competencia publicada en la trayectoria" });
      setForm(FORM_VACIO);
    } catch (err) {
      toast({ title: "Error al publicar", description: (err as Error).message, variant: "destructive" });
    }
  };

  const eliminar = async (id: string, nombre: string) => {
    try {
      await borrar.mutateAsync(id);
      toast({ title: `"${nombre}" eliminada` });
    } catch (err) {
      toast({ title: "Error al eliminar", description: (err as Error).message, variant: "destructive" });
    }
  };

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-8">
        <span className="font-body text-[0.6rem] font-semibold tracking-[0.38em] uppercase text-g500 block mb-2">
          Dashboard · Contenido
        </span>
        <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-none text-foreground">
          Competencias
        </h1>
        <p className="font-body text-sm text-g300 mt-2">
          Lo que publiques aquí arma la línea de tiempo pública de /trayectoria.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">

        {/* ══ Formulario ══ */}
        <section className="border border-g700">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-g700 bg-g900">
            <Trophy className="w-4 h-4 text-g300" />
            <h2 className="font-body text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-foreground">
              Nueva competencia
            </h2>
          </div>

          <form onSubmit={submit} className="px-6 py-5 flex flex-col gap-4">
            <div>
              <label htmlFor="comp-evento" className={labelCls}>Evento</label>
              <input id="comp-evento" type="text" placeholder="Ej: Campeonato Nacional de Para Natación" value={form.event_name} onChange={set("event_name")} className={inputCls} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="comp-lugar" className={labelCls}>Ubicación</label>
                <input id="comp-lugar" type="text" placeholder="Ej: Medellín, Colombia" value={form.location} onChange={set("location")} className={inputCls} />
              </div>
              <div>
                <label htmlFor="comp-fecha" className={labelCls}>Fecha</label>
                <input id="comp-fecha" type="date" value={form.event_date} onChange={set("event_date")} className={inputCls} />
              </div>
              <div>
                <label htmlFor="comp-prueba" className={labelCls}>Prueba</label>
                <input id="comp-prueba" type="text" placeholder="Ej: 100m Libre S9" value={form.race} onChange={set("race")} className={inputCls} />
              </div>
              <div>
                <label htmlFor="comp-marca" className={labelCls}>Marca</label>
                <input id="comp-marca" type="text" placeholder="Ej: 01:02.45" value={form.mark} onChange={set("mark")} className={inputCls} />
              </div>
              <div>
                <label htmlFor="comp-puesto" className={labelCls}>Puesto (opcional)</label>
                <input id="comp-puesto" type="text" placeholder="Ej: 1er lugar" value={form.placement} onChange={set("placement")} className={inputCls} />
              </div>
              <div>
                <label htmlFor="comp-url" className={labelCls}>Link a la marca oficial (opcional)</label>
                <input id="comp-url" type="url" placeholder="https://… (resultados oficiales)" value={form.result_url} onChange={set("result_url")} className={inputCls} />
              </div>
            </div>

            <button
              type="submit"
              disabled={crear.isPending}
              className="flex items-center justify-center gap-2 py-3 bg-foreground text-background font-body font-semibold text-[0.7rem] tracking-[0.2em] uppercase transition-opacity hover:opacity-80 disabled:opacity-40"
            >
              <Plus className="w-4 h-4" />
              {crear.isPending ? "Publicando…" : "Publicar competencia"}
            </button>
          </form>
        </section>

        {/* ══ Lista ══ */}
        <section className="border border-g700">
          <div className="flex items-center justify-between px-6 py-4 border-b border-g700 bg-g900">
            <h2 className="font-body text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-foreground">
              Competencias publicadas
            </h2>
            <span className="font-body text-[0.68rem] text-g500">
              {competencias?.length ?? 0}
            </span>
          </div>

          <ul>
            {isLoading ? (
              <li className="px-6 py-8 text-center font-body text-sm text-g500">Cargando…</li>
            ) : !competencias || competencias.length === 0 ? (
              <li className="px-6 py-8 text-center font-body text-sm text-g500">
                Aún no hay competencias. Publica la primera con el formulario.
              </li>
            ) : (
              competencias.map((c) => (
                <li key={c.id} className="flex items-center gap-4 px-6 py-4 border-b border-g800 last:border-b-0">
                  <div className="min-w-0 flex-1">
                    <p className="font-body text-sm font-semibold text-foreground truncate">
                      {c.event_name}
                    </p>
                    <p className="font-body text-[0.72rem] text-g500 mt-0.5">
                      {c.event_date} · {c.race} · <span className="text-g300">{c.mark}</span>
                      {c.placement && ` · ${c.placement}`}
                    </p>
                  </div>
                  {c.result_url && (
                    <a
                      href={c.result_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-g500 hover:text-g300 transition-colors p-1 shrink-0"
                      aria-label="Ver marca oficial"
                      title="Ver marca oficial"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => eliminar(c.id, c.event_name)}
                    className="text-g500 hover:text-destructive transition-colors p-1 shrink-0"
                    aria-label={`Eliminar competencia: ${c.event_name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))
            )}
          </ul>
        </section>

      </div>
    </div>
  );
};

export default CompetenciasAdminPage;
