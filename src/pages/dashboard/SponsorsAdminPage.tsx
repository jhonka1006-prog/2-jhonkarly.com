import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSponsors, useCrearSponsor, useEliminarSponsor } from "@/hooks/use-sponsors";
import { Handshake, Trash2, Upload, ExternalLink } from "lucide-react";

const inputCls =
  "w-full bg-g900 border border-g700 font-body text-sm px-4 py-2.5 outline-none transition-colors placeholder:text-g500 text-foreground focus:border-g300";

const labelCls =
  "font-body text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-g500 block mb-2";

const SponsorsAdminPage = () => {
  const { toast } = useToast();
  const { data: sponsors, isLoading } = useSponsors();
  const crear = useCrearSponsor();
  const eliminar = useEliminarSponsor();

  const [nombre, setNombre] = useState("");
  const [link, setLink] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      toast({ title: "Escribe el nombre del patrocinador", variant: "destructive" });
      return;
    }
    if (!archivo) {
      toast({ title: "Selecciona el logo (PNG o SVG sin fondo)", variant: "destructive" });
      return;
    }
    try {
      await crear.mutateAsync({ name: nombre.trim(), link_url: link.trim() || null, file: archivo });
      toast({ title: `${nombre.trim()} agregado — ya está en la página de inicio` });
      setNombre("");
      setLink("");
      setArchivo(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      toast({ title: "Error al agregar", description: (err as Error).message, variant: "destructive" });
    }
  };

  const borrar = async (id: string, name: string) => {
    if (!window.confirm(`¿Quitar a "${name}" de la marquesina?`)) return;
    try {
      await eliminar.mutateAsync(id);
      toast({ title: `${name} eliminado` });
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
          Patrocinadores
        </h1>
        <p className="font-body text-sm text-g300 mt-2">
          Los logos que subas aquí aparecen al instante en la marquesina de la
          página de inicio. Usa PNG o SVG sin fondo para que se vean bien.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">

        {/* ══ Agregar patrocinador ══ */}
        <section className="border border-g700">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-g700 bg-g900">
            <Handshake className="w-4 h-4 text-g300" />
            <h2 className="font-body text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-foreground">
              Agregar patrocinador
            </h2>
          </div>

          <form onSubmit={submit} className="px-6 py-5 flex flex-col gap-4">
            <div>
              <label htmlFor="sp-nombre" className={labelCls}>Nombre de la marca</label>
              <input
                id="sp-nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Indeportes Quindío"
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="sp-link" className={labelCls}>Web del patrocinador (opcional)</label>
              <input
                id="sp-link"
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://…"
                className={inputCls}
              />
            </div>

            <div>
              <label htmlFor="sp-logo" className={labelCls}>Logo (PNG / SVG sin fondo)</label>
              <input
                id="sp-logo"
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
                className="w-full font-body text-sm text-g300 file:mr-4 file:px-4 file:py-2 file:border file:border-g700 file:bg-g900 file:text-g300 file:font-body file:text-[0.65rem] file:font-semibold file:tracking-[0.2em] file:uppercase file:cursor-pointer hover:file:border-g300"
              />
              {archivo && (
                <p className="font-body text-[0.72rem] text-g300 mt-2">
                  Seleccionado: {archivo.name}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={crear.isPending}
              className="flex items-center justify-center gap-2 py-3 bg-foreground text-background font-body font-semibold text-[0.7rem] tracking-[0.22em] uppercase transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-3.5 h-3.5" />
              {crear.isPending ? "Subiendo…" : "Subir a la marquesina"}
            </button>
          </form>
        </section>

        {/* ══ Patrocinadores actuales ══ */}
        <section className="border border-g700">
          <div className="flex items-center justify-between px-6 py-4 border-b border-g700 bg-g900">
            <h2 className="font-body text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-foreground">
              En la marquesina
            </h2>
            <span className="font-body text-[0.65rem] text-g500">
              {sponsors?.length ?? 0}
            </span>
          </div>

          {isLoading ? (
            <p className="px-6 py-10 font-body text-sm text-g300 tracking-widest uppercase animate-pulse text-center">
              Cargando…
            </p>
          ) : !sponsors || sponsors.length === 0 ? (
            <p className="px-6 py-10 font-body text-sm text-g300 text-center leading-[1.8]">
              Aún no hay patrocinadores subidos desde el panel.
              <br />
              <span className="text-g500 text-[0.8rem]">
                (Los logos pegados en la carpeta src/assets/sponsors/ también se
                muestran, pero solo se administran desde el código.)
              </span>
            </p>
          ) : (
            <ul>
              {sponsors.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center gap-4 px-6 py-4 border-b border-g800 last:border-b-0"
                >
                  <span className="w-24 h-12 bg-white/95 border border-g700 flex items-center justify-center p-1.5 shrink-0">
                    <img src={s.logo_url} alt={s.name} loading="lazy" className="max-w-full max-h-full object-contain" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-body text-[0.85rem] font-semibold text-foreground truncate">
                      {s.name}
                    </p>
                    {s.link_url && (
                      <a
                        href={s.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-body text-[0.7rem] text-g300 hover:text-foreground transition-colors truncate"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        {s.link_url}
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => borrar(s.id, s.name)}
                    disabled={eliminar.isPending}
                    aria-label={`Eliminar ${s.name}`}
                    className="text-g500 hover:text-destructive transition-colors disabled:opacity-40 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};

export default SponsorsAdminPage;
