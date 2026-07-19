import { useCompetitions } from "@/hooks/use-competencias";
import { useMilestones, useAchievements } from "@/hooks/use-trayectoria";
import { Competition } from "@/lib/api/competencias";
import { Milestone, Achievement } from "@/lib/api/trayectoria";
import { usePageMeta } from "@/lib/seo";
import { useReveal } from "@/hooks/use-reveal";
import { Medal as MedalIcon, Trophy } from "lucide-react";

const fmtFecha = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const anio = (iso: string) => iso.slice(0, 4);

const MEDAL_LABEL: Record<number, string> = { 1: "1er lugar · Oro", 2: "2º lugar · Plata", 3: "3er lugar · Bronce" };
const MEDAL_COLOR: Record<number, string> = {
  1: "text-[#d4af37]",
  2: "text-[#c0c0c0]",
  3: "text-[#cd7f32]",
};

/* ── Un hito de la trayectoria (tarjeta sobre línea central) ── */
const HitoTrayectoria = ({ m, lado }: { m: Milestone; lado: "L" | "R" }) => {
  const { ref, visible } = useReveal<HTMLLIElement>();
  const esDerecha = lado === "R" && !m.is_future;

  return (
    <li
      ref={ref}
      className={`relative md:grid md:grid-cols-2 pl-10 md:pl-0 pb-10 md:pb-16 last:pb-2 transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Punto sobre la línea */}
      <span
        className={`absolute top-8 left-[9px] md:left-1/2 -translate-x-1/2 z-10 w-[18px] h-[18px] rounded-full ${
          m.is_future
            ? "bg-background border-2 border-white/40"
            : "bg-foreground shadow-[0_0_0_5px_rgba(255,255,255,0.14)]"
        }`}
        aria-hidden="true"
      >
        {m.is_future && (
          <span className="absolute -inset-2 rounded-full border border-white/30 animate-ping" />
        )}
      </span>

      <div className={lado === "R" ? "md:col-start-2 md:pl-14" : "md:col-start-1 md:pr-14"}>
        <div
          className={`group border p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.6)] ${
            m.is_future
              ? "bg-background border-white/20 border-t-[3px] border-t-white/40 opacity-75 hover:opacity-100 hover:border-white/50"
              : esDerecha
                ? "bg-g800 border-g700 border-t-[3px] border-t-foreground hover:border-g300"
                : "bg-g900 border-g700 border-t-[3px] border-t-g300 hover:border-t-foreground hover:border-g300"
          }`}
        >
          {/* Año */}
          {esDerecha ? (
            <span className="inline-block font-display text-[clamp(2rem,3.6vw,3.4rem)] leading-[0.9] bg-foreground text-background px-3 pt-1 pb-1.5 mb-5">
              {m.year_label}
            </span>
          ) : (
            <span
              className={`block font-display text-[clamp(2.4rem,4.5vw,4.2rem)] leading-[0.85] pb-3 mb-4 border-b border-g700 ${
                m.is_future ? "text-g300" : "text-foreground"
              }`}
            >
              {m.year_label}
            </span>
          )}

          <h3 className="font-display text-[clamp(1.25rem,2.2vw,1.7rem)] text-foreground leading-[1.02] mb-3">
            {m.title}
          </h3>

          <span
            className={`inline-block font-body text-[0.58rem] font-semibold tracking-[0.22em] uppercase px-3 py-1.5 mb-4 ${
              m.is_future
                ? "bg-foreground text-background font-bold"
                : `border border-g700 text-foreground ${esDerecha ? "bg-g900" : "bg-g800"}`
            }`}
          >
            {m.is_future ? "★ " : ""}{m.category}
          </span>

          {m.description && (
            <p className="font-body font-light text-[0.85rem] text-g100 leading-[1.85]">
              {m.description}
            </p>
          )}

          {m.details && m.details.length > 0 && (
            <ul className="flex flex-col gap-2.5">
              {m.details.map((d, i) => (
                <li key={i} className="relative pl-[18px] font-body font-light text-[0.84rem] text-g100 leading-[1.75]">
                  <span className="absolute left-0 text-g300" aria-hidden="true">—</span>
                  {d}
                </li>
              ))}
            </ul>
          )}

          {m.link_url && (
            <a
              href={m.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 font-body text-[0.6rem] font-semibold tracking-[0.2em] uppercase text-foreground border border-g700 px-4 py-2.5 transition-colors duration-300 hover:bg-foreground hover:text-background hover:border-foreground"
            >
              {m.link_label ?? "Ver más"} ↗
            </a>
          )}
        </div>
      </div>
    </li>
  );
};

/* ── Un logro (medalla o récord) ── */
const Logro = ({ a }: { a: Achievement }) => (
  <li className="border border-g700 bg-g900 p-6 flex flex-col gap-3 transition-colors duration-300 hover:border-g300 hover:bg-g800">
    <div className="flex items-center gap-3">
      {a.medal ? (
        <MedalIcon className={`w-6 h-6 shrink-0 ${MEDAL_COLOR[a.medal]}`} aria-hidden="true" />
      ) : (
        <Trophy className="w-6 h-6 shrink-0 text-foreground" aria-hidden="true" />
      )}
      <div className="flex flex-wrap gap-2">
        <span className="font-body text-[0.56rem] font-semibold tracking-[0.24em] uppercase px-2.5 py-1 border border-g700 text-g300">
          {a.scope}
        </span>
        {a.is_record && (
          <span className="font-body text-[0.56rem] font-semibold tracking-[0.24em] uppercase px-2.5 py-1 bg-foreground text-background">
            Récord
          </span>
        )}
      </div>
    </div>

    <h3 className="font-display text-[clamp(1.2rem,2.2vw,1.6rem)] text-foreground leading-[1.05]">
      {a.title}
    </h3>

    {a.medal && (
      <span className={`font-body text-[0.68rem] font-semibold tracking-[0.18em] uppercase ${MEDAL_COLOR[a.medal]}`}>
        {MEDAL_LABEL[a.medal]}
      </span>
    )}

    {(a.event_name || a.year_label) && (
      <span className="font-body text-[0.72rem] text-g300">
        {[a.event_name, a.year_label].filter(Boolean).join(" · ")}
      </span>
    )}

    {a.description && (
      <p className="font-body font-light text-[0.8rem] text-g100 leading-[1.7]">
        {a.description}
      </p>
    )}
  </li>
);

/* ── Un resultado oficial (competencia con marca) ── */
const Hito = ({ c, mostrarAnio }: { c: Competition; mostrarAnio: boolean }) => (
  <li className="relative pl-[clamp(28px,5vw,56px)] pb-[clamp(44px,7vw,72px)] last:pb-0">
    {/* Nodo sobre la línea */}
    <span
      className="absolute left-0 top-2 -translate-x-1/2 w-3 h-3 bg-background border-2 border-g300"
      aria-hidden="true"
    />

    {/* Año fantasma (solo en el primer evento de cada año) */}
    {mostrarAnio && (
      <span className="font-display text-[clamp(2.6rem,6vw,4.5rem)] text-g800 leading-none block mb-5 select-none">
        {anio(c.event_date)}
      </span>
    )}

    <span className="font-body text-[0.62rem] font-semibold tracking-[0.32em] uppercase text-g300 block mb-2">
      {fmtFecha(c.event_date)} · {c.location}
    </span>

    <h2 className="font-display text-[clamp(1.5rem,3.2vw,2.4rem)] text-foreground leading-[1.05] mb-2">
      {c.event_name}
    </h2>

    <span className="font-body text-[0.75rem] font-semibold tracking-[0.18em] uppercase text-g500 block mb-6">
      {c.race}
    </span>

    {/* Marca + puesto */}
    <div className="flex flex-wrap items-stretch gap-3">
      {c.result_url ? (
        <a
          href={c.result_url}
          target="_blank"
          rel="noopener noreferrer"
          className="group border border-g700 bg-g900 px-6 py-4 transition-colors duration-300 hover:border-g300 hover:bg-g800"
          aria-label={`Ver marca oficial de ${c.race}: ${c.mark}`}
        >
          <span className="font-body text-[0.55rem] font-semibold tracking-[0.3em] uppercase text-g500 block mb-1 transition-colors duration-300 group-hover:text-g300">
            Marca
          </span>
          <span className="font-display text-[clamp(1.5rem,3vw,2.2rem)] text-foreground leading-none tracking-[0.04em]">
            {c.mark}
          </span>
          <span className="font-body text-[0.6rem] font-semibold tracking-[0.22em] uppercase text-g300 block mt-2 transition-colors duration-300 group-hover:text-foreground">
            Ver marca oficial →
          </span>
        </a>
      ) : (
        <div className="border border-g700 bg-g900 px-6 py-4">
          <span className="font-body text-[0.55rem] font-semibold tracking-[0.3em] uppercase text-g500 block mb-1">
            Marca
          </span>
          <span className="font-display text-[clamp(1.5rem,3vw,2.2rem)] text-foreground leading-none tracking-[0.04em]">
            {c.mark}
          </span>
        </div>
      )}

      {c.placement && (
        <div
          className={`flex flex-col justify-center px-6 py-4 border ${
            /^1\b|^1er|oro/i.test(c.placement)
              ? "bg-foreground border-foreground"
              : "border-g700"
          }`}
        >
          <span className={`font-body text-[0.55rem] font-semibold tracking-[0.3em] uppercase block mb-1 ${
            /^1\b|^1er|oro/i.test(c.placement) ? "text-background/60" : "text-g500"
          }`}>
            Puesto
          </span>
          <span className={`font-display text-[clamp(1.1rem,2.2vw,1.6rem)] leading-none ${
            /^1\b|^1er|oro/i.test(c.placement) ? "text-background" : "text-foreground"
          }`}>
            {c.placement}
          </span>
        </div>
      )}
    </div>
  </li>
);

const Trayectoria = () => {
  usePageMeta({
    titulo: "Trayectoria y Logros — Jhonkarly Alvarez",
    descripcion:
      "Cronología deportiva de Jhonkarly Alvarez: hitos, medallas, récords y marcas oficiales de un nadador paralímpico colombiano rumbo a Los Ángeles 2028.",
    ruta: "/trayectoria",
  });

  const { data: competencias, isLoading } = useCompetitions();
  const { data: hitos, isLoading: cargandoHitos } = useMilestones();
  const { data: logros, isLoading: cargandoLogros } = useAchievements();

  const hay = !!competencias && competencias.length > 0;
  const hayHitos = !!hitos && hitos.length > 0;
  const hayLogros = !!logros && logros.length > 0;

  return (
    <div id="main-content" className="min-h-screen bg-background">

      {/* ── HEADER ── */}
      <section className="px-[var(--px)] pt-[calc(68px+clamp(48px,10vw,120px))] pb-[clamp(40px,6vw,80px)]">
        <div className="max-w-[var(--container-max)] mx-auto">
          <span className="font-body text-[0.68rem] font-semibold tracking-[0.38em] uppercase text-g300 block mb-6">
            03 — Logros &amp; Recorrido
          </span>
          <h1 className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.9] text-foreground">
            Trayec<span className="text-g300">toria</span>
          </h1>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className="bg-g900 border-t border-b-2 border-t-g700 border-b-foreground px-[var(--px)] py-[clamp(52px,8vw,100px)]">
        <div className="max-w-[var(--container-max)] mx-auto">
          <p className="font-display text-[clamp(1.3rem,2.8vw,2.1rem)] leading-[1.08] text-foreground uppercase tracking-[0.02em] max-w-[780px] pl-[22px] border-l-4 border-foreground mb-8">
            Cada competencia, cada entrenamiento, cada sacrificio.<br />
            La hoja de ruta de un atleta construida sobre voluntad pura y acero.
          </p>
          <p className="font-body font-light text-[clamp(0.88rem,1.1vw,1rem)] text-g100 leading-[1.9] max-w-[880px] mb-12">
            Jhonkarly es un para-nadador que ha construido su trayectoria desde la disciplina y la confrontación constante con sus propios límites. Su camino en el deporte no nace desde la comodidad, sino desde la decisión diaria de presentarse, entrenar y sostener el esfuerzo cuando el cuerpo duele y la mente duda. A lo largo de su carrera ha entendido que la discapacidad no es un límite predefinido, sino una condición que exige adaptación, estrategia y carácter. Cada sesión, cada competencia y cada obstáculo han sido parte de un proceso de formación mental y física donde la constancia pesa más que el talento.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 max-w-[720px] border-2 border-foreground">
            <div className="px-6 py-7 bg-background border-b sm:border-b-0 sm:border-r border-g700">
              <div className="font-display text-[clamp(2rem,4vw,2.9rem)] text-foreground leading-none">14</div>
              <div className="font-body text-[0.58rem] font-semibold tracking-[0.26em] uppercase text-g300 mt-2">Años en el deporte</div>
            </div>
            <div className="px-6 py-7 bg-foreground border-b sm:border-b-0 sm:border-r border-g700">
              <div className="font-display text-[clamp(2rem,4vw,2.9rem)] text-background leading-none">20</div>
              <div className="font-body text-[0.58rem] font-semibold tracking-[0.26em] uppercase text-background/60 mt-2">Competencias</div>
            </div>
            <div className="px-6 py-7 bg-background">
              <div className="font-display text-[clamp(2rem,4vw,2.9rem)] text-foreground leading-none">COL</div>
              <div className="font-body text-[0.58rem] font-semibold tracking-[0.26em] uppercase text-g300 mt-2">Representando</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOGROS ── */}
      {(cargandoLogros || hayLogros) && (
        <section id="logros" className="py-[var(--section-py)] px-[var(--px)]">
          <div className="max-w-[var(--container-max)] mx-auto">
            <div className="flex items-end justify-between gap-6 pb-[clamp(24px,4vw,40px)] mb-[clamp(36px,5vw,56px)] border-b-2 border-foreground">
              <div>
                <span className="font-body text-[0.63rem] font-semibold tracking-[0.36em] uppercase text-g300 block mb-3">
                  Palmarés
                </span>
                <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] leading-[0.9] text-foreground">
                  Logros
                </h2>
              </div>
              <p className="font-body text-[0.86rem] text-g100 leading-[1.8] max-w-[280px] text-right hidden md:block">
                Medallas, récords y representaciones, nacionales e internacionales.
              </p>
            </div>

            {cargandoLogros ? (
              <p
                className="font-body text-sm text-g300 tracking-widest uppercase animate-pulse py-12 text-center"
                role="status"
                aria-live="polite"
              >
                Cargando logros…
              </p>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {logros!.map((a) => (
                  <Logro key={a.id} a={a} />
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* ── EL RECORRIDO (hitos) ── */}
      <section id="recorrido" className="border-t border-border py-[var(--section-py)] px-[var(--px)]">
        <div className="max-w-[1080px] mx-auto">
          <div className="flex items-end justify-between gap-6 pb-[clamp(24px,4vw,40px)] mb-[clamp(36px,5vw,56px)] border-b-2 border-foreground">
            <div>
              <span className="font-body text-[0.63rem] font-semibold tracking-[0.36em] uppercase text-g300 block mb-3">
                Cronología
              </span>
              <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] leading-[0.9] text-foreground">
                El recorrido
              </h2>
            </div>
            <p className="font-body text-[0.86rem] text-g100 leading-[1.8] max-w-[280px] text-right hidden md:block">
              De los primeros metros en el agua hasta la meta más grande: Los Ángeles 2028.
            </p>
          </div>

          {cargandoHitos ? (
            <p
              className="font-body text-sm text-g300 tracking-widest uppercase animate-pulse py-12 text-center"
              role="status"
              aria-live="polite"
            >
              Cargando trayectoria…
            </p>
          ) : hayHitos ? (
            <>
              <div className="relative">
                {/* Línea central (izquierda en móvil) */}
                <div
                  className="absolute top-2 bottom-2 w-[2px] md:w-[3px] left-[9px] md:left-1/2 -translate-x-1/2 bg-gradient-to-b from-white/10 via-white/70 to-white/10"
                  aria-hidden="true"
                />
                <ol>
                  {hitos!.map((m, i) => (
                    <HitoTrayectoria key={m.id} m={m} lado={i % 2 === 0 ? "L" : "R"} />
                  ))}
                </ol>
              </div>
              <div className="mt-11 pt-6 border-t-2 border-g300 text-center">
                <p className="font-body text-[0.68rem] font-semibold tracking-[0.28em] uppercase text-foreground">
                  La historia continúa — Próximo capítulo: Los Ángeles 2028
                </p>
              </div>
            </>
          ) : null}
        </div>
      </section>

      {/* ── RESULTADOS OFICIALES (competencias con marca) ── */}
      {(isLoading || hay) && (
        <section id="resultados" className="border-t border-border py-[var(--section-py)] px-[var(--px)]">
          <div className="max-w-[900px] mx-auto">
            <div className="pb-[clamp(24px,4vw,40px)] mb-[clamp(36px,5vw,56px)] border-b-2 border-foreground">
              <span className="font-body text-[0.63rem] font-semibold tracking-[0.36em] uppercase text-g300 block mb-3">
                Marcas
              </span>
              <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] leading-[0.9] text-foreground">
                Resultados oficiales
              </h2>
            </div>

            {isLoading ? (
              <p
                className="font-body text-sm text-g300 tracking-widest uppercase animate-pulse py-12 text-center"
                role="status"
                aria-live="polite"
              >
                Cargando competencias…
              </p>
            ) : (
              <ol className="relative border-l border-g700">
                {competencias!.map((c, i) => (
                  <Hito
                    key={c.id}
                    c={c}
                    mostrarAnio={i === 0 || anio(c.event_date) !== anio(competencias![i - 1].event_date)}
                  />
                ))}
              </ol>
            )}
          </div>
        </section>
      )}

      {/* ── PULL QUOTE ── */}
      <section className="bg-g900 border-t border-b border-g700 py-[clamp(72px,12vw,140px)] px-[var(--px)] text-center">
        <div className="max-w-[1000px] mx-auto">
          <p className="font-display text-[clamp(2.2rem,5.5vw,5.5rem)] leading-[1.05] text-foreground tracking-[0.01em]">
            No se puede<br />
            <span className="text-g300">vencer a quien</span><br />
            no sabe rendirse.
          </p>
          <span className="block text-[0.68rem] font-semibold tracking-[0.3em] uppercase text-g300 mt-10">
            Rumbo a Los Ángeles 2028
          </span>
        </div>
      </section>

    </div>
  );
};

export default Trayectoria;
