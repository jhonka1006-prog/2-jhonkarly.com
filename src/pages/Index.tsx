import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-inicio.jpg";

const STATS = [
  { num: "10 KM",   lbl: "Diarios de nado" },
  { num: "7 días",  lbl: "Sin tregua" },
  { num: "LA 2028", lbl: "Juegos Paralímpicos" },
  { num: "3×/sem",  lbl: "Fuerza y resistencia" },
];

const FACTS = [
  { key: "Deporte",       val: "Natación Adaptada" },
  { key: "Categoría",     val: "Paralímpico" },
  { key: "País",          val: "Colombia" },
  { key: "Objetivo",      val: "Los Ángeles 2028" },
  { key: "Entrenamiento", val: "10 km / día" },
];

const NAV_CARDS = [
  {
    num: "01", title: "Sobre mí",
    desc: "La historia detrás del atleta. Quién es Jhonkarly fuera del agua.",
    to: "/sobre-mi", cta: "Leer más",
  },
  {
    num: "02", title: "Prensa",
    desc: "Coberturas mediáticas, entrevistas y apariciones en medios.",
    to: "/prensa", cta: "Ver cobertura",
  },
  {
    num: "03", title: "Trayectoria",
    desc: "Resultados, récords y la línea de tiempo de una carrera excepcional.",
    to: "/trayectoria", cta: "Ver trayectoria",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">

      {/* ── HERO ── */}
      <section className="relative w-full h-screen min-h-[600px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Jhonkarly ALVAREZ, atleta paralímpico colombiano"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-[var(--container-max)] mx-auto px-[var(--px)] pb-20">
          <span className="font-body text-[0.68rem] font-semibold tracking-[0.38em] uppercase text-g300 block mb-6">
            Atleta Paralímpico · Colombia · Los Ángeles 2028
          </span>

          <h1 className="font-display text-[clamp(4rem,13vw,11rem)] leading-[0.88] text-foreground mb-8">
            Jhonkarly<br />
            <span className="text-g300">Alvarez</span>
          </h1>

          <p className="font-body font-light text-[clamp(0.88rem,1.1vw,1rem)] text-g300 max-w-[480px] mb-10 leading-[1.85]">
            Mi vida no giraba solo en torno a entrenar; giraba en torno a demostrarme
            que soy capaz de soportar lo que otros evitarían.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/sobre-mi"
              className="inline-block px-8 py-3 bg-foreground text-background font-body font-semibold text-[0.72rem] tracking-[0.2em] uppercase transition-opacity duration-300 hover:opacity-80"
            >
              Sobre mí
            </Link>
            <Link
              to="/trayectoria"
              className="inline-block px-8 py-3 border border-g700 text-g300 font-body font-semibold text-[0.72rem] tracking-[0.2em] uppercase transition-colors duration-300 hover:border-g300 hover:text-foreground"
            >
              Trayectoria
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-[var(--px)] flex flex-col items-center gap-3 z-10" aria-hidden="true">
          <span
            className="font-body text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-g300"
            style={{ writingMode: "vertical-rl" }}
          >
            Scroll
          </span>
          <div className="w-px h-16 bg-gradient-to-b from-g300 to-transparent" />
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-foreground py-12 px-[var(--px)]" aria-label="Estadísticas de entrenamiento">
        <div className="max-w-[var(--container-max)] mx-auto flex flex-wrap items-center gap-6 gap-x-12">
          {STATS.map((s) => (
            <div key={s.lbl}>
              <span className="font-display text-[clamp(2rem,4vw,3.2rem)] text-background leading-none block tracking-[0.02em]">
                {s.num}
              </span>
              <span className="font-body text-[0.65rem] font-semibold tracking-[0.22em] uppercase text-background/50 mt-1 block">
                {s.lbl}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── BIO ── */}
      <section className="border-t border-border py-[var(--section-py)] px-[var(--px)]">
        <div className="max-w-[var(--container-max)] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[clamp(48px,8vw,120px)] items-start">

          {/* Left */}
          <article>
            <span className="font-body text-[0.68rem] font-semibold tracking-[0.38em] uppercase text-g300 block mb-6">
              Quién es
            </span>
            <h2 className="font-display text-[clamp(2.8rem,6vw,6rem)] leading-[0.9] mb-10 text-foreground">
              La voluntad<br />
              <span className="text-g300">es de acero</span>
            </h2>

            <p className="font-body font-light text-[clamp(0.88rem,1.1vw,0.98rem)] leading-[1.85] text-g300 mb-5 max-w-[480px]">
              Para la mayoría de los atletas, el deporte es pasión.
              Para <strong className="font-semibold text-foreground">Jhonkarly ALVAREZ Pantoja</strong>, la natación es una tortura necesaria.
              No nada porque ame el agua — los primeros 50 metros bajo el frío son una incomodidad
              insoportable que preferiría cambiar mil veces por la calma de su casa.
            </p>
            <p className="font-body font-light text-[clamp(0.88rem,1.1vw,0.98rem)] leading-[1.85] text-g300 mb-5 max-w-[480px]">
              Pero es precisamente en ese rechazo donde reside su verdadera fuerza:{" "}
              <strong className="font-semibold text-foreground">
                hace lo que odia como si lo amara, solo para demostrarse a sí mismo de qué está hecho.
              </strong>
            </p>
            <p className="font-body font-light text-[clamp(0.88rem,1.1vw,0.98rem)] leading-[1.85] text-g300 mb-8 max-w-[480px]">
              Su disciplina no se mide en medallas, sino en los kilómetros recorridos fuera del agua,
              caminando hacia el entrenamiento con la prótesis al hombro, sobre un muñón lleno de llagas
              vivas.
            </p>
            <Link
              to="/sobre-mi"
              className="font-body text-[0.7rem] font-semibold tracking-[0.22em] uppercase text-foreground relative inline-block after:absolute after:bottom-[-4px] after:left-0 after:h-px after:w-full after:bg-foreground"
            >
              Leer historia completa
            </Link>
          </article>

          {/* Right */}
          <div className="pt-4">
            <div className="border-l-2 border-g700 p-7 bg-g900 mb-10">
              <blockquote className="font-body font-light italic text-[clamp(1rem,1.6vw,1.2rem)] leading-[1.7] text-g100">
                "La paz real no se encuentra en el descanso, sino en ese segundo exacto
                al salir de la piscina después del entrenamiento más duro de tu vida.
                Ahí la tortura se transforma en victoria."
              </blockquote>
              <cite className="block not-italic text-[0.68rem] font-semibold tracking-[0.25em] uppercase text-g300 mt-5">
                — Jhonkarly ALVAREZ Pantoja
              </cite>
            </div>

            <dl className="flex flex-col">
              {FACTS.map((f) => (
                <div key={f.key} className="flex justify-between items-center py-4 border-b border-g800 gap-6">
                  <dt className="font-body text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-g300 shrink-0">
                    {f.key}
                  </dt>
                  <dd className="font-display text-[1.1rem] tracking-[0.06em] text-foreground text-right">
                    {f.val}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ── PULL QUOTE ── */}
      <section className="bg-g900 border-t border-b border-g700 py-[clamp(72px,12vw,140px)] px-[var(--px)] text-center">
        <div className="max-w-[1000px] mx-auto">
          <p className="font-display text-[clamp(2.2rem,5.5vw,5.5rem)] leading-[1.05] text-foreground tracking-[0.01em]">
            No se puede<br />
            <span className="text-g300">vencer a quien</span><br />
            no sabe rendirse.
          </p>
          <span className="block text-[0.68rem] font-semibold tracking-[0.3em] uppercase text-g300 mt-10">
            Su visión para Los Ángeles 2028
          </span>
        </div>
      </section>

      {/* ── NAV CARDS ── */}
      <section className="py-[var(--section-py)] px-[var(--px)]">
        <div className="max-w-[var(--container-max)] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 pb-6 border-b border-g700">
            <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] text-foreground">
              Explorar
            </h2>
            <p className="font-body font-light text-[0.88rem] text-g300 max-w-[340px]">
              Conoce la historia completa, la cobertura mediática y el récord deportivo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-l border-g700">
            {NAV_CARDS.map((card) => (
              <Link
                key={card.num}
                to={card.to}
                className="group block border-r border-g700 p-8 transition-colors duration-300 hover:bg-g900"
              >
                <span className="font-display text-[clamp(3rem,6vw,5rem)] text-g700 leading-none block mb-6 transition-colors duration-300 group-hover:text-g300">
                  {card.num}
                </span>
                <h3 className="font-display text-[clamp(1.4rem,2.5vw,2rem)] text-foreground mb-4 leading-none">
                  {card.title}
                </h3>
                <p className="font-body font-light text-[0.85rem] text-g300 leading-[1.75] mb-8">
                  {card.desc}
                </p>
                <span className="font-body text-[0.68rem] font-semibold tracking-[0.22em] uppercase text-g300 transition-colors duration-300 group-hover:text-foreground">
                  {card.cta} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Index;
