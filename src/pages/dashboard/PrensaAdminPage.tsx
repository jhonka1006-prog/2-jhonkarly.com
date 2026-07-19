import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  usePressNotes,
  useCreatePressNote,
  useDeletePressNote,
  usePressPhotos,
  useCreatePressPhoto,
  useDeletePressPhoto,
} from "@/hooks/use-prensa";
import { Trash2, Plus, Newspaper, Image, FileText, Upload, ExternalLink } from "lucide-react";
import { useKitFiles, useReplaceKitFile } from "@/hooks/use-kit";
import { KIT_INFO, KitKind } from "@/lib/api/kit";
import { uploadPublicFile } from "@/lib/api/storage";

const hoy = () => new Date().toISOString().slice(0, 10);

const inputCls =
  "w-full bg-g900 border border-g700 font-body text-sm px-4 py-2.5 outline-none transition-colors placeholder:text-g500 text-foreground focus:border-g300";

const labelCls =
  "font-body text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-g500 block mb-2";

const PrensaAdminPage = () => {
  const { toast } = useToast();

  /* ── Notas ── */
  const { data: notas, isLoading: cargandoNotas } = usePressNotes();
  const crearNota = useCreatePressNote();
  const borrarNota = useDeletePressNote();
  const [nota, setNota] = useState({ title: "", outlet: "", url: "", published: hoy() });

  const submitNota = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nota.title.trim() || !nota.outlet.trim() || !nota.url.trim()) {
      toast({ title: "Completa título, medio y enlace", variant: "destructive" });
      return;
    }
    try {
      await crearNota.mutateAsync(nota);
      toast({ title: "Nota de prensa publicada" });
      setNota({ title: "", outlet: "", url: "", published: hoy() });
    } catch (err) {
      toast({ title: "Error al publicar", description: (err as Error).message, variant: "destructive" });
    }
  };

  const eliminarNota = async (id: string) => {
    try {
      await borrarNota.mutateAsync(id);
      toast({ title: "Nota eliminada" });
    } catch (err) {
      toast({ title: "Error al eliminar", description: (err as Error).message, variant: "destructive" });
    }
  };

  /* ── Fotos ── */
  const { data: fotos, isLoading: cargandoFotos } = usePressPhotos();
  const crearFoto = useCreatePressPhoto();
  const borrarFoto = useDeletePressPhoto();
  const [foto, setFoto] = useState({ url: "", caption: "" });
  const [subiendoFoto, setSubiendoFoto] = useState(false);

  const subirFotoArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendoFoto(true);
    try {
      const url = await uploadPublicFile("prensa", file);
      setFoto((p) => ({ ...p, url }));
      toast({ title: "Foto subida — revisa y pulsa Agregar" });
    } catch (err) {
      toast({ title: "Error al subir la foto", description: (err as Error).message, variant: "destructive" });
    } finally {
      setSubiendoFoto(false);
      e.target.value = "";
    }
  };

  /* ── Kit de prensa ── */
  const { data: kitFiles, isLoading: cargandoKit } = useKitFiles();
  const reemplazarKit = useReplaceKitFile();
  const [subiendoKit, setSubiendoKit] = useState<KitKind | null>(null);

  const subirKit = async (kind: KitKind, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendoKit(kind);
    try {
      await reemplazarKit.mutateAsync({ kind, file });
      toast({ title: `${KIT_INFO[kind].titulo} actualizado` });
    } catch (err) {
      toast({ title: "Error al subir el archivo", description: (err as Error).message, variant: "destructive" });
    } finally {
      setSubiendoKit(null);
      e.target.value = "";
    }
  };

  const submitFoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foto.url.trim()) {
      toast({ title: "Pega la URL de la imagen", variant: "destructive" });
      return;
    }
    try {
      await crearFoto.mutateAsync({ url: foto.url, caption: foto.caption || undefined });
      toast({ title: "Foto agregada a la galería" });
      setFoto({ url: "", caption: "" });
    } catch (err) {
      toast({ title: "Error al agregar", description: (err as Error).message, variant: "destructive" });
    }
  };

  const eliminarFoto = async (id: string) => {
    try {
      await borrarFoto.mutateAsync(id);
      toast({ title: "Foto eliminada" });
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
          Prensa
        </h1>
        <p className="font-body text-sm text-g300 mt-2">
          Lo que publiques aquí aparece al instante en la página pública /prensa.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">

        {/* ══ Notas de prensa ══ */}
        <section className="border border-g700">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-g700 bg-g900">
            <Newspaper className="w-4 h-4 text-g300" />
            <h2 className="font-body text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-foreground">
              Notas de prensa
            </h2>
          </div>

          <form onSubmit={submitNota} className="px-6 py-5 border-b border-g700 flex flex-col gap-4">
            <div>
              <label htmlFor="nota-titulo" className={labelCls}>Titular</label>
              <input
                id="nota-titulo"
                type="text"
                placeholder="Ej: El nadador que desafía sus límites"
                value={nota.title}
                onChange={(e) => setNota((p) => ({ ...p, title: e.target.value }))}
                className={inputCls}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nota-medio" className={labelCls}>Medio</label>
                <input
                  id="nota-medio"
                  type="text"
                  placeholder="Ej: El Tiempo"
                  value={nota.outlet}
                  onChange={(e) => setNota((p) => ({ ...p, outlet: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="nota-fecha" className={labelCls}>Fecha de publicación</label>
                <input
                  id="nota-fecha"
                  type="date"
                  value={nota.published}
                  onChange={(e) => setNota((p) => ({ ...p, published: e.target.value }))}
                  className={inputCls}
                />
              </div>
            </div>
            <div>
              <label htmlFor="nota-url" className={labelCls}>Enlace al artículo</label>
              <input
                id="nota-url"
                type="url"
                placeholder="https://…"
                value={nota.url}
                onChange={(e) => setNota((p) => ({ ...p, url: e.target.value }))}
                className={inputCls}
              />
            </div>
            <button
              type="submit"
              disabled={crearNota.isPending}
              className="flex items-center justify-center gap-2 py-3 bg-foreground text-background font-body font-semibold text-[0.7rem] tracking-[0.2em] uppercase transition-opacity hover:opacity-80 disabled:opacity-40"
            >
              <Plus className="w-4 h-4" />
              {crearNota.isPending ? "Publicando…" : "Publicar nota"}
            </button>
          </form>

          <ul>
            {cargandoNotas ? (
              <li className="px-6 py-8 text-center font-body text-sm text-g500">Cargando…</li>
            ) : !notas || notas.length === 0 ? (
              <li className="px-6 py-8 text-center font-body text-sm text-g500">
                Aún no hay notas de prensa.
              </li>
            ) : (
              notas.map((n) => (
                <li key={n.id} className="flex items-center justify-between gap-4 px-6 py-4 border-b border-g800 last:border-b-0">
                  <div className="min-w-0">
                    <span className="font-body text-[0.6rem] font-semibold tracking-[0.25em] uppercase text-g500 block">
                      {n.outlet} · {n.published}
                    </span>
                    <a
                      href={n.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-sm font-semibold text-foreground hover:text-g300 transition-colors truncate block"
                    >
                      {n.title}
                    </a>
                  </div>
                  <button
                    onClick={() => eliminarNota(n.id)}
                    className="text-g500 hover:text-destructive transition-colors p-1 shrink-0"
                    aria-label={`Eliminar nota: ${n.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))
            )}
          </ul>
        </section>

        {/* ══ Galería de fotos ══ */}
        <section className="border border-g700">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-g700 bg-g900">
            <Image className="w-4 h-4 text-g300" />
            <h2 className="font-body text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-foreground">
              Galería de fotos
            </h2>
          </div>

          <form onSubmit={submitFoto} className="px-6 py-5 border-b border-g700 flex flex-col gap-4">
            <div>
              <label htmlFor="foto-archivo" className={labelCls}>Subir foto desde tu PC</label>
              <label
                htmlFor="foto-archivo"
                className={`flex items-center justify-center gap-2 border border-dashed border-g700 px-4 py-3 font-body text-[0.68rem] font-semibold tracking-[0.2em] uppercase cursor-pointer transition-colors ${
                  subiendoFoto ? "text-g700" : "text-g300 hover:border-g300 hover:text-foreground"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                {subiendoFoto ? "Subiendo…" : "Elegir imagen"}
              </label>
              <input
                id="foto-archivo"
                type="file"
                accept="image/*"
                onChange={subirFotoArchivo}
                disabled={subiendoFoto}
                className="sr-only"
              />
            </div>
            <div>
              <label htmlFor="foto-url" className={labelCls}>… o pega una URL</label>
              <input
                id="foto-url"
                type="url"
                placeholder="https://… (opcional si ya subiste el archivo)"
                value={foto.url}
                onChange={(e) => setFoto((p) => ({ ...p, url: e.target.value }))}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="foto-caption" className={labelCls}>Pie de foto (opcional)</label>
              <input
                id="foto-caption"
                type="text"
                placeholder="Ej: Campeonato Nacional 2026"
                value={foto.caption}
                onChange={(e) => setFoto((p) => ({ ...p, caption: e.target.value }))}
                className={inputCls}
              />
            </div>
            <button
              type="submit"
              disabled={crearFoto.isPending}
              className="flex items-center justify-center gap-2 py-3 bg-foreground text-background font-body font-semibold text-[0.7rem] tracking-[0.2em] uppercase transition-opacity hover:opacity-80 disabled:opacity-40"
            >
              <Plus className="w-4 h-4" />
              {crearFoto.isPending ? "Agregando…" : "Agregar foto"}
            </button>
          </form>

          {cargandoFotos ? (
            <p className="px-6 py-8 text-center font-body text-sm text-g500">Cargando…</p>
          ) : !fotos || fotos.length === 0 ? (
            <p className="px-6 py-8 text-center font-body text-sm text-g500">
              Aún no hay fotos en la galería.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-6">
              {fotos.map((f) => (
                <div key={f.id} className="group relative aspect-square bg-g900 border border-g800 overflow-hidden">
                  <img src={f.url} alt={f.caption ?? ""} loading="lazy" className="w-full h-full object-cover" />
                  <button
                    onClick={() => eliminarFoto(f.id)}
                    className="absolute top-2 right-2 bg-black/70 text-white/80 hover:text-destructive p-1.5 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                    aria-label="Eliminar foto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>

      {/* ══ Kit de prensa — 3 archivos reemplazables ══ */}
      <section className="border border-g700 mt-8">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-g700 bg-g900">
          <FileText className="w-4 h-4 text-g300" />
          <h2 className="font-body text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-foreground">
            Kit de prensa — archivos descargables
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {(Object.keys(KIT_INFO) as KitKind[]).map((kind) => {
            const archivo = kitFiles?.find((f) => f.kind === kind);
            const subiendo = subiendoKit === kind;
            return (
              <div key={kind} className="p-6 border-b md:border-b-0 md:border-r border-g800 last:border-0 flex flex-col">
                <h3 className="font-body text-[0.7rem] font-semibold tracking-[0.18em] uppercase text-foreground mb-2">
                  {KIT_INFO[kind].titulo}
                </h3>

                {cargandoKit ? (
                  <p className="font-body text-[0.75rem] text-g500 mb-4">Cargando…</p>
                ) : archivo ? (
                  <a
                    href={archivo.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 font-body text-[0.75rem] text-g300 hover:text-foreground transition-colors mb-1 truncate"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    <span className="truncate">{archivo.file_name ?? "Ver archivo actual"}</span>
                  </a>
                ) : (
                  <p className="font-body text-[0.75rem] text-g500 mb-1">Sin archivo aún</p>
                )}
                {archivo && (
                  <p className="font-body text-[0.65rem] text-g500 mb-4">
                    Actualizado: {new Date(archivo.updated_at).toLocaleDateString("es-CO")}
                  </p>
                )}

                <label
                  htmlFor={`kit-${kind}`}
                  className={`mt-auto flex items-center justify-center gap-2 border border-dashed border-g700 px-4 py-3 font-body text-[0.65rem] font-semibold tracking-[0.2em] uppercase cursor-pointer transition-colors ${
                    subiendo ? "text-g700" : "text-g300 hover:border-g300 hover:text-foreground"
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  {subiendo ? "Subiendo…" : archivo ? "Reemplazar archivo" : "Subir archivo"}
                </label>
                <input
                  id={`kit-${kind}`}
                  type="file"
                  accept=".pdf,.zip"
                  onChange={(e) => subirKit(kind, e)}
                  disabled={subiendo}
                  className="sr-only"
                />
              </div>
            );
          })}
        </div>
        <p className="font-body text-[0.68rem] text-g500 px-6 py-4 border-t border-g800">
          Los archivos aparecen al instante en la página /prensa/kit. Formatos: PDF o ZIP.
        </p>
      </section>
    </div>
  );
};

export default PrensaAdminPage;
