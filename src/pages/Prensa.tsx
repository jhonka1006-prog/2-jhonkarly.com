import { usePressNotes, usePressPhotos } from "@/hooks/use-prensa";
import { useKitFiles } from "@/hooks/use-kit";
import { KIT_INFO, KitKind } from "@/lib/api/kit";
import { FOTOS_GALERIA_PRENSA, LOGOS_PRENSA } from "@/lib/imagenes";
import { usePageMeta } from "@/lib/seo";
import Reveal from "@/components/Reveal";

/* Orden de las descargas del kit de prensa */
const KIT_KINDS: KitKind[] = ["kit_es", "kit_en", "historia"];

/* ════════════════════════════════════════════════════════════
   COBERTURA DESTACADA — edita solo esta parte
   ════════════════════════════════════════════════════════════
   Cada nota lleva: medio, iniciales (isotipo de respaldo),
   logo (nombre de archivo SIN extensión dentro de
   src/assets/prensa/logos/ — si pegas ahí el logo del medio,
   se muestra solo; si no existe, se usan las iniciales),
   fecha, titular, un pequeño fragmento y el link a la nota. */
const COBERTURA_DESTACADA = [
  {
    medio: "Gobernación del Quindío",
    iniciales: "GQ",
    logo: "quindio-gov", // ← pega el logo como src/assets/prensa/logos/quindio-gov.png
    fecha: "17 de noviembre de 2024",
    titular:
      "Jhonkarly Alvarez, la estrella quindiana en los Paranacionales: sumó 4 medallas",
    fragmento:
      "Jhonkarly Alvarez ha emergido como la gran figura del Quindío en los Juegos Deportivos Paranacionales Juveniles. Su destacada participación en paranatación le permitió sumar una medalla de plata y tres de bronce, consolidándose como uno de los atletas más prometedores de la delegación quindiana.",
    url: "https://www.quindio.gov.co/jhonkarly-alvarez-la-estrella-quindiana-en-los-paranacionales-sumo-4-medallas",
  },
  {
    medio: "El Quindiano",
    iniciales: "EQ",
    logo: "el-quindiano", // ← pega el logo como src/assets/prensa/logos/el-quindiano.png
    fecha: "16 de noviembre de 2024",
    titular:
      "Jhonkarly Alvarez, orgullo quindiano en la paranatación de los Juegos Nacionales Juveniles",
    fragmento:
      "Desde muy pequeño, Jhonkarly Alvarez Pantoja supo que el agua era su lugar. A los tres años, impulsado por una recomendación médica, se sumergió en el mundo de la natación como un simple hobby. Pero lo que comenzó como una actividad recreativa, pronto se transformó en su mayor pasión.",
    url: "https://elquindiano.com/noticia/219034/jhonkarly-alvarez-orgullo-quindiano-en-la-paranatacion-de-los-juegos-nacionales-juveniles/",
  },
];
/* ════════════════════════════════════════════════════════════ */

const fmtFecha = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

/* Isotipo del medio: logo si está en src/assets/prensa/logos/, iniciales si no */
const IsotipoMedio = ({ logo, iniciales, medio }: { logo: string; iniciales: string; medio: string }) => {
  const src = LOGOS_PRENSA[logo];
  if (src) {
    return (
      <img
        src={src}
        alt={`Logo de ${medio}`}
        className="w-12 h-12 object-contain bg-white/95 p-1.5 border border-g700 shrink-0"
        loading="lazy"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="w-12 h-12 border border-g700 bg-g800 flex items-center justify-center font-display text-[1.05rem] tracking-[0.08em] text-foreground shrink-0"
    >
      {iniciales}
    </span>
  );
};

const Prensa = () => {
  usePageMeta({
    titulo: "Prensa y Medios — Jhonkarly Alvarez",
    descripcion:
      "Cobertura mediática, entrevistas, galería oficial y kit de prensa de Jhonkarly Alvarez, nadador paralímpico colombiano rumbo a Los Ángeles 2028.",
    ruta: "/prensa",
  });

  const { data: notas, isLoading: cargandoNotas } = usePressNotes();
  const { data: fotos, isLoading: cargandoFotos } = usePressPhotos();
  const { data: kit } = useKitFiles();
  const kitPorTipo = new Map((kit ?? []).map((k) => [k.kind, k]));

  return (
    <div id="main-content" className="min-h-screen bg-background">

      {/* ── HEADER ── */}
      <section className="px-[var(--px)] pt-[calc(68px+clamp(48px,10vw,120px))] pb-[clamp(40px,6vw,80px)]">
        <div className="max-w-[var(--container-max)] mx-auto">
          <span className="font-body text-[0.68rem] font-semibold tracking-[0.38em] uppercase text-g300 block mb-6">
            02 — Medios
          </span>
          <h1 className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.9] text-foreground">
            Prensa
          </h1>
          <p className="font-body font-light text-[clamp(0.88rem,1.1vw,1rem)] text-g300 max-w-[480px] mt-8 leading-[1.85]">
            Coberturas mediáticas, entrevistas y apariciones de Jhonkarly Alvarez,
            nadador paralímpico colombiano rumbo a Los Ángeles 2028.
          </p>
        </div>
      </section>

      {/* ── NOTAS DE PRENSA ── */}
      <section id="cobertura" className="border-t border-border py-[var(--section-py)] px-[var(--px)]">
        <div className="max-w-[var(--container-max)] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 pb-6 border-b border-g700">
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.8rem)] leading-[0.9] text-foreground">
              Cobertura
            </h2>
            <p className="font-body font-light text-[0.88rem] text-g300 max-w-[340px]">
              Apariciones en medios nacionales e internacionales.
            </p>
          </div>

          {/* ── Cobertura destacada (fija, editable arriba en COBERTURA_DESTACADA) ── */}
          <Reveal className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
            {COBERTURA_DESTACADA.map((c) => (
              <a
                key={c.url}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col border border-g700 bg-g900 p-7 transition-colors duration-300 hover:border-g300 hover:bg-g800"
                aria-label={`Leer nota: ${c.titular} — ${c.medio}`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <IsotipoMedio logo={c.logo} iniciales={c.iniciales} medio={c.medio} />
                  <div>
                    <span className="font-body text-[0.72rem] font-semibold tracking-[0.14em] uppercase text-foreground block">
                      {c.medio}
                    </span>
                    <span className="font-body text-[0.62rem] font-semibold tracking-[0.2em] uppercase text-g500">
                      {c.fecha}
                    </span>
                  </div>
                </div>

                <h3 className="font-display text-[clamp(1.2rem,2vw,1.6rem)] leading-[1.15] text-foreground mb-4">
                  {c.titular}
                </h3>

                <p className="font-body font-light text-[0.85rem] leading-[1.8] text-g300 mb-6">
                  “{c.fragmento.length > 220 ? `${c.fragmento.slice(0, 220).trimEnd()}…` : c.fragmento}”
                </p>

                <span className="mt-auto font-body text-[0.68rem] font-semibold tracking-[0.22em] uppercase text-g300 transition-colors duration-300 group-hover:text-foreground">
                  Leer nota completa →
                </span>
              </a>
            ))}
          </Reveal>

          {/* ── Más notas (dinámicas, se administran desde /dashboard/prensa) ── */}
          {cargandoNotas ? (
            <p
              className="font-body text-sm text-g300 tracking-widest uppercase animate-pulse py-12 text-center"
              role="status"
              aria-live="polite"
            >
              Cargando cobertura…
            </p>
          ) : !notas || notas.length === 0 ? null : (
            <ul className="border-t border-g800">
              {notas.map((n) => (
                <li key={n.id} className="border-b border-g800">
                  <a
                    href={n.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col md:flex-row md:items-center justify-between gap-2 py-6 transition-colors duration-300 hover:bg-g900 px-2"
                  >
                    <div>
                      <span className="font-body text-[0.62rem] font-semibold tracking-[0.28em] uppercase text-g500 block mb-1.5">
                        {n.outlet} · {fmtFecha(n.published)}
                      </span>
                      <span className="font-display text-[clamp(1.1rem,2vw,1.5rem)] text-foreground leading-tight">
                        {n.title}
                      </span>
                    </div>
                    <span className="font-body text-[0.68rem] font-semibold tracking-[0.22em] uppercase text-g300 shrink-0 transition-colors duration-300 group-hover:text-foreground">
                      Leer nota →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ── GALERÍA DE FOTOS ── */}
      <section id="galeria" className="border-t border-border py-[var(--section-py)] px-[var(--px)]" aria-label="Galería de fotos">
        <div className="max-w-[var(--container-max)] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 pb-6 border-b border-g700">
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.8rem)] leading-[0.9] text-foreground">
              Galería
            </h2>
            <p className="font-body font-light text-[0.88rem] text-g300 max-w-[340px]">
              Imágenes oficiales del atleta, dentro y fuera del agua.
            </p>
          </div>

          {/* GALERÍA AUTOMÁTICA: pega tus fotos en src/assets/prensa/galeria/
              y aparecen solas aquí, adaptándose a su tamaño (mosaico).
              A estas se suman las subidas desde /dashboard/prensa. */}
          {(() => {
            const fotosLocales = FOTOS_GALERIA_PRENSA.map((url) => ({
              id: `local-${url}`,
              url,
              caption: null as string | null,
            }));
            const todas = [...fotosLocales, ...(fotos ?? [])];

            if (cargandoFotos && todas.length === 0) {
              return (
                <p
                  className="font-body text-sm text-g300 tracking-widest uppercase animate-pulse py-12 text-center"
                  role="status"
                  aria-live="polite"
                >
                  Cargando galería…
                </p>
              );
            }

            if (todas.length === 0) {
              return (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-g900 border border-g800 flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <span className="font-body text-[0.58rem] font-semibold tracking-[0.3em] uppercase text-g500">
                        Próximamente
                      </span>
                    </div>
                  ))}
                </div>
              );
            }

            return (
              <div className="columns-2 md:columns-3 lg:columns-4 gap-3 [&>figure]:mb-3">
                {todas.map((f) => (
                  <figure
                    key={f.id}
                    className="group relative overflow-hidden bg-g900 border border-g800 break-inside-avoid"
                  >
                    <img
                      src={f.url}
                      alt={f.caption ?? "Fotografía de Jhonkarly Alvarez"}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
                    />
                    {f.caption && (
                      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pt-8 pb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="font-body text-[0.7rem] text-white/90">{f.caption}</span>
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      {/* ── CONTACTO DE PRENSA + KIT ── */}
      <section id="contacto" className="bg-g900 border-t border-b border-g700 py-[var(--section-py)] px-[var(--px)]">
        <div className="max-w-[var(--container-max)] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[clamp(48px,8vw,120px)] items-start">

          <div>
            <span className="font-body text-[0.68rem] font-semibold tracking-[0.38em] uppercase text-g300 block mb-6">
              Contacto de prensa
            </span>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.8rem)] leading-[0.95] text-foreground mb-8">
              ¿Quieres contar<br />
              <span className="text-g300">esta historia?</span>
            </h2>
            <p className="font-body font-light text-[0.88rem] text-g300 leading-[1.85] max-w-[440px] mb-8">
              Para entrevistas, reportajes o solicitudes de material,
              escribe al correo oficial. Respondemos todas las solicitudes de medios.
            </p>
            <a
              href="mailto:contact@jhonkarly.com?subject=Solicitud%20de%20prensa"
              className="inline-block px-8 py-3 bg-foreground text-background font-body font-semibold text-[0.72rem] tracking-[0.2em] uppercase transition-opacity duration-300 hover:opacity-80"
            >
              contact@jhonkarly.com
            </a>
          </div>

          <div className="border-l-2 border-g700 p-7 bg-background">
            <span className="font-body text-[0.62rem] font-semibold tracking-[0.32em] uppercase text-g500 block mb-4">
              Kit de prensa
            </span>
            <p className="font-body font-light text-[0.88rem] text-g300 leading-[1.85] mb-6">
              Fotografías en alta resolución, biografía oficial y logotipos,
              listos para descargar.
            </p>

            {/* Descargas directas del kit (los archivos se administran
                desde /dashboard/prensa → sección Kit) */}
            <div className="flex flex-col">
              {KIT_KINDS.map((kind) => {
                const archivo = kitPorTipo.get(kind);
                const info = KIT_INFO[kind];
                return archivo ? (
                  <a
                    key={kind}
                    href={archivo.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="group flex items-center justify-between gap-4 py-3.5 border-b border-g800 transition-colors duration-300 hover:bg-g900 px-2"
                  >
                    <span className="font-body text-[0.82rem] font-semibold text-foreground">
                      {info.titulo}
                    </span>
                    <span className="font-body text-[0.65rem] font-semibold tracking-[0.22em] uppercase text-g300 shrink-0 transition-colors duration-300 group-hover:text-foreground">
                      Descargar ↓
                    </span>
                  </a>
                ) : (
                  <div
                    key={kind}
                    className="flex items-center justify-between gap-4 py-3.5 border-b border-g800 px-2"
                  >
                    <span className="font-body text-[0.82rem] text-g500">
                      {info.titulo}
                    </span>
                    <span className="font-body text-[0.62rem] font-semibold tracking-[0.22em] uppercase text-g500 shrink-0">
                      Próximamente
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Prensa;
