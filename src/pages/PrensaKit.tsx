import { useKitFiles } from "@/hooks/use-kit";
import { KIT_INFO, KitKind } from "@/lib/api/kit";
import { usePageMeta } from "@/lib/seo";
import { Download, FileText } from "lucide-react";

const ORDEN: KitKind[] = ["kit_es", "kit_en", "historia"];

const fmtFecha = (iso: string) =>
  new Date(iso).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });

const PrensaKit = () => {
  usePageMeta({
    titulo: "Kit de Prensa — Jhonkarly Alvarez",
    noindex: true,
  });

  const { data: archivos, isLoading } = useKitFiles();

  const porTipo = (kind: KitKind) => archivos?.find((a) => a.kind === kind);

  return (
    <div id="main-content" className="min-h-screen bg-background">

      {/* ── HEADER ── */}
      <section className="px-[var(--px)] pt-[calc(68px+clamp(48px,10vw,110px))] pb-[clamp(40px,6vw,72px)]">
        <div className="max-w-[var(--container-max)] mx-auto">
          <span className="font-body text-[0.68rem] font-semibold tracking-[0.38em] uppercase text-g300 block mb-6">
            Prensa · Material oficial
          </span>
          <h1 className="font-display text-[clamp(3rem,8vw,6.5rem)] leading-[0.9] text-foreground">
            Kit de<br />
            <span className="text-g300">prensa</span>
          </h1>
          <p className="font-body font-light text-[clamp(0.88rem,1.1vw,1rem)] text-g300 max-w-[520px] mt-8 leading-[1.85]">
            Material oficial para medios acreditados. Uso exclusivamente informativo,
            citando la fuente. Para solicitudes especiales escribe a{" "}
            <a href="mailto:contact@jhonkarly.com" className="text-foreground underline underline-offset-4">
              contact@jhonkarly.com
            </a>.
          </p>
        </div>
      </section>

      {/* ── DESCARGAS ── */}
      <section className="border-t border-border py-[var(--section-py)] px-[var(--px)]">
        <div className="max-w-[var(--container-max)] mx-auto">
          {isLoading ? (
            <p
              className="font-body text-sm text-g300 tracking-widest uppercase animate-pulse py-12 text-center"
              role="status"
              aria-live="polite"
            >
              Cargando material…
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-l border-t border-g700">
              {ORDEN.map((kind, i) => {
                const info = KIT_INFO[kind];
                const archivo = porTipo(kind);
                return (
                  <article key={kind} className="border-r border-b border-g700 p-8 flex flex-col">
                    <span className="font-display text-[clamp(2.5rem,5vw,4rem)] text-g700 leading-none block mb-6">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <FileText className="w-5 h-5 text-g300 mb-4" />
                    <h2 className="font-display text-[clamp(1.3rem,2.2vw,1.8rem)] text-foreground mb-3 leading-tight">
                      {info.titulo}
                    </h2>
                    <p className="font-body font-light text-[0.85rem] text-g300 leading-[1.75] mb-8">
                      {info.desc}
                    </p>

                    <div className="mt-auto">
                      {archivo ? (
                        <>
                          <a
                            href={archivo.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="flex items-center justify-center gap-2 w-full py-3.5 bg-foreground text-background font-body font-semibold text-[0.68rem] tracking-[0.22em] uppercase transition-opacity duration-300 hover:opacity-80"
                          >
                            <Download className="w-4 h-4" />
                            Descargar
                          </a>
                          <p className="font-body text-[0.65rem] text-g500 mt-3 text-center">
                            Actualizado: {fmtFecha(archivo.updated_at)}
                          </p>
                        </>
                      ) : (
                        <span className="block w-full text-center py-3.5 border border-dashed border-g700 text-g500 font-body font-semibold text-[0.65rem] tracking-[0.22em] uppercase">
                          Disponible próximamente
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default PrensaKit;
