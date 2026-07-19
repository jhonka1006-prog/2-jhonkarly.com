import { Link } from "react-router-dom";
import { FOTOS_INICIO } from "@/lib/imagenes";
import { usePageMeta } from "@/lib/seo";
import SponsorsMarquee from "@/components/SponsorsMarquee";
import Reveal from "@/components/Reveal";

/* FOTO DE INICIO: pega tu foto en src/assets/inicio/
   (si hay varias se usa la primera por orden de nombre). */
const heroImage = FOTOS_INICIO[0];

const STATS = [
  { num: "15 KM",   lbl: "Diarios de nado" },
  { num: "7 días",  lbl: "Sin tregua" },
  { num: "LA 2028", lbl: "Juegos Paralímpicos" },
  { num: "3×/sem",  lbl: "Fuerza y resistencia" },
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
  {
    num: "04", title: "Tienda",
    desc: "Merchandising oficial. Cada compra apoya el camino a Los Ángeles 2028.",
    to: "/tienda", cta: "Ver tienda",
  },
];

const Index = () => {
  usePageMeta({
    titulo: "Jhonkarly Alvarez — Nadador Paralímpico Colombiano | LA 2028",
    descripcion:
      "Sitio oficial de Jhonkarly Alvarez Pantoja, nadador paralímpico colombiano. Trayectoria, prensa, resultados y rumbo a Los Ángeles 2028.",
    ruta: "/",
  });

  return (
    <div id="main-content" className="min-h-screen bg-background">

      {/* ── HERO ── */}
      <section className="relative w-full h-screen min-h-[600px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          {heroImage ? (
            <img
              src={heroImage}
              alt="Jhonkarly Alvarez, atleta paralímpico colombiano"
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
              /* fetchpriority en minúsculas: React 18 aún no conoce la forma camelCase */
              {...({ fetchpriority: "high" } as Record<string, string>)}
            />
          ) : (
            <div className="w-full h-full bg-g900 flex items-center justify-center">
              <span className="font-body text-[0.62rem] font-semibold tracking-[0.35em] uppercase text-g500 text-center px-6">
                Pega tu foto en src/assets/inicio/
              </span>
            </div>
          )}
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

      {/* ── PATROCINADORES ── */}
      <SponsorsMarquee />

      {/* ── PULL QUOTE ── */}
      <section id="frase" className="bg-g900 border-t border-b border-g700 py-[clamp(72px,12vw,140px)] px-[var(--px)] text-center">
        <Reveal className="max-w-[1000px] mx-auto">
          <p className="font-display text-[clamp(2.2rem,5.5vw,5.5rem)] leading-[1.05] text-foreground tracking-[0.01em]">
            No se puede<br />
            <span className="text-g300">vencer a quien</span><br />
            no sabe rendirse.
          </p>
          <span className="block text-[0.68rem] font-semibold tracking-[0.3em] uppercase text-g300 mt-10">
            Rumbo a Los Ángeles 2028
          </span>
        </Reveal>
      </section>

      {/* ── NAV CARDS ── */}
      <section id="explorar" className="py-[var(--section-py)] px-[var(--px)]">
        <div className="max-w-[var(--container-max)] mx-auto">
          <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 pb-6 border-b border-g700">
            <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] text-foreground">
              Explorar
            </h2>
            <p className="font-body font-light text-[0.88rem] text-g300 max-w-[340px]">
              Conoce la historia completa, la cobertura mediática y el récord deportivo.
            </p>
          </Reveal>

          <Reveal delay={120} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-l border-t border-g700">
            {NAV_CARDS.map((card) => (
              <Link
                key={card.num}
                to={card.to}
                className="group block border-r border-b border-g700 p-8 transition-colors duration-300 hover:bg-g900"
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
          </Reveal>
        </div>
      </section>

      {/* ── MI LIBRO — teaser ── */}
      <section id="libro" className="bg-foreground py-[clamp(56px,9vw,110px)] px-[var(--px)]" aria-label="Mi libro">
        <Reveal className="max-w-[var(--container-max)] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div>
            <span className="font-body text-[0.68rem] font-semibold tracking-[0.38em] uppercase text-background/50 block mb-5">
              Próximamente — Mi libro
            </span>
            <p className="font-display text-[clamp(2rem,5vw,4.5rem)] leading-[0.95] text-background">
              Voluntad<br />
              <span className="text-background/50">de acero</span>
            </p>
            <p className="font-body font-light text-[0.9rem] text-background/70 max-w-[440px] mt-6 leading-[1.85]">
              La historia completa, contada por él mismo: el dolor real de los
              entrenamientos y el segundo exacto en que la tortura se transforma
              en victoria.
            </p>
          </div>
          <Link
            to="/sobre-mi"
            className="inline-block self-start md:self-auto shrink-0 px-8 py-4 bg-background text-foreground font-body font-semibold text-[0.72rem] tracking-[0.2em] uppercase transition-opacity duration-300 hover:opacity-80"
          >
            Conocer el libro
          </Link>
        </Reveal>
      </section>

    </div>
  );
};

export default Index;
