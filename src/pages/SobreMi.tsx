import { Link } from "react-router-dom";
import {
  FOTOS_PERFIL,
  FOTOS_KING_OF_POOL,
  FOTOS_LA_2028,
  FOTOS_LIBRO,
} from "@/lib/imagenes";
import { usePageMeta } from "@/lib/seo";
import Reveal from "@/components/Reveal";

/* ════════════════════════════════════════════════════════════
   CONFIGURACIÓN — edita solo esta parte
   ════════════════════════════════════════════════════════════

   IMÁGENES: no se tocan aquí. Cada bloque tiene su carpeta y
   basta con pegar el archivo dentro (ver src/lib/imagenes.ts):
   • Tu foto principal  → src/assets/sobre-mi/perfil/
   • King of Pool       → src/assets/sobre-mi/king-of-pool/
   • Los Ángeles 2028   → src/assets/sobre-mi/los-angeles-2028/  (3 espacios)
   • Portada del libro  → src/assets/libro/
*/

/* LINKS DE VIDEO: pega aquí los links cuando los tengas.
   Mientras estén vacíos, el botón aparece como "Próximamente". */
const VIDEO_KING_OF_POOL = ""; // ← link al video inicial de King of Pool
const VIDEO_LOS_ANGELES_2028 = ""; // ← link del video de YouTube de LA 2028

/* VIDEOS DE YOUTUBE: pega el link de cada video en "url".
   Las tarjetas con url vacía se muestran como "espacio reservado". */
const VIDEOS_YOUTUBE = [
  { titulo: "Título del video 1", url: "" },
  { titulo: "Título del video 2", url: "" },
  { titulo: "Título del video 3", url: "" },
];

/* PUBLICACIONES DE INSTAGRAM: pega el link de cada post en "url". */
const POSTS_INSTAGRAM = [
  { titulo: "Publicación 1", url: "" },
  { titulo: "Publicación 2", url: "" },
  { titulo: "Publicación 3", url: "" },
];

/* CLIPS DE TIKTOK: pega el link de cada clip en "url". */
const CLIPS_TIKTOK = [
  { titulo: "Clip 1", url: "" },
  { titulo: "Clip 2", url: "" },
  { titulo: "Clip 3", url: "" },
];

const PERFILES = {
  youtube: "https://www.youtube.com/@Jhonkarly",
  instagram: "https://instagram.com/jhonkarly__",
  tiktok: "https://tiktok.com/@nuvakii",
};

/* ════════════════════════════════════════════════════════════ */

const ICONOS = {
  youtube: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.4 2.8 12 2.8 12 2.8s-4.4 0-6.8.2c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.3.7 11.5v2.1c0 2.2.3 4.5.3 4.5s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.5 22.2 12 22.2 12 22.2s4.4 0 6.8-.3c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.2.3-4.5v-2c0-2.3-.3-4.3-.3-4.3zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z"/>
    </svg>
  ),
  instagram: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  ),
  tiktok: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
    </svg>
  ),
  play: (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z"/>
    </svg>
  ),
};

/* Espacio de foto: muestra la imagen si existe en la carpeta,
   o un recuadro punteado indicando dónde pegarla si aún no hay. */
const SlotFoto = ({
  src,
  alt,
  aspecto,
  claro = false,
}: {
  src?: string;
  alt: string;
  aspecto: string;
  claro?: boolean; // true si va sobre fondo claro
}) => {
  if (src) {
    return (
      <div className={`relative ${aspecto} overflow-hidden border ${claro ? "border-background/20" : "border-g700"}`}>
        <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" />
      </div>
    );
  }
  return (
    <div
      className={`relative ${aspecto} border border-dashed flex items-center justify-center ${
        claro ? "bg-background/5 border-background/25" : "bg-g900 border-g700"
      }`}
    >
      <span
        className={`font-body text-[0.58rem] font-semibold tracking-[0.3em] uppercase text-center px-4 ${
          claro ? "text-background/40" : "text-g500"
        }`}
      >
        Espacio para
        <br />
        tu foto
      </span>
    </div>
  );
};

/* Botón de video: clicable si ya pegaste el link, "Próximamente" si no */
const BotonVideo = ({
  url,
  texto,
  claro = false,
}: {
  url: string;
  texto: string;
  claro?: boolean;
}) => {
  if (!url) {
    return (
      <span
        className={`inline-flex items-center gap-3 px-8 py-4 border font-body font-semibold text-[0.72rem] tracking-[0.2em] uppercase cursor-default select-none ${
          claro ? "border-background/25 text-background/40" : "border-g700 text-g500"
        }`}
      >
        {ICONOS.play}
        {texto} — Próximamente
      </span>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-3 px-8 py-4 font-body font-semibold text-[0.72rem] tracking-[0.2em] uppercase transition-opacity duration-300 hover:opacity-80 ${
        claro ? "bg-background text-foreground" : "bg-foreground text-background"
      }`}
    >
      {ICONOS.play}
      {texto}
    </a>
  );
};

/* Tarjeta de contenido: clicable si tiene link, espacio reservado si no */
const TarjetaContenido = ({
  titulo,
  url,
  aspecto,
}: {
  titulo: string;
  url: string;
  aspecto: string; // ej. "aspect-video" | "aspect-square" | "aspect-[9/16]"
}) => {
  const contenido = (
    <>
      <div className="absolute inset-0 flex items-center justify-center text-g500 transition-colors duration-300 group-hover:text-foreground">
        {url ? ICONOS.play : (
          <span className="font-body text-[0.58rem] font-semibold tracking-[0.3em] uppercase text-g500 text-center px-4">
            Espacio para<br />tu contenido
          </span>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-4 pt-10 pb-3">
        <span className="font-body text-[0.72rem] font-semibold text-white/90 block truncate">
          {titulo}
        </span>
      </div>
    </>
  );

  if (!url) {
    return (
      <div className={`relative ${aspecto} bg-g900 border border-dashed border-g700 overflow-hidden`}>
        {contenido}
      </div>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative ${aspecto} bg-g900 border border-g700 overflow-hidden block transition-colors duration-300 hover:border-g300 hover:bg-g800`}
      aria-label={`Ver: ${titulo}`}
    >
      {contenido}
    </a>
  );
};

/* Encabezado de cada red: icono + título principal + descripción */
const EncabezadoRed = ({
  icono,
  titulo,
  desc,
  url,
  cta,
}: {
  icono: React.ReactNode;
  titulo: string;
  desc: string;
  url: string;
  cta: string;
}) => (
  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 pb-5 border-b border-g700">
    <div>
      <span className="text-g300 block mb-4">{icono}</span>
      <h3 className="font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-none text-foreground mb-3">
        {titulo}
      </h3>
      <p className="font-body font-light text-[0.88rem] text-g300 max-w-[440px] leading-[1.75]">
        {desc}
      </p>
    </div>
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="font-body text-[0.68rem] font-semibold tracking-[0.22em] uppercase text-g300 hover:text-foreground transition-colors duration-300 shrink-0"
    >
      {cta} →
    </a>
  </div>
);

const parrafo =
  "font-body font-light text-[clamp(0.88rem,1.1vw,0.98rem)] leading-[1.85] text-g300 mb-5 max-w-[520px]";

const SobreMi = () => {
  usePageMeta({
    titulo: "Sobre mí — Jhonkarly Alvarez | Nadador Paralímpico Colombiano",
    descripcion:
      "La historia de Jhonkarly Alvarez Pantoja: su camino en la natación adaptada, el proyecto King of Pool y la ruta hacia los Juegos Paralímpicos de Los Ángeles 2028.",
    ruta: "/sobre-mi",
  });

  /* Primera foto de cada carpeta (undefined si la carpeta está vacía) */
  const fotoPerfil = FOTOS_PERFIL[0];
  const fotoKingOfPool = FOTOS_KING_OF_POOL[0];
  const fotoLibro = FOTOS_LIBRO[0];

  return (
    <div id="main-content" className="min-h-screen bg-background">

      {/* ══════════ 1. ¿QUIÉN SOY? ══════════ */}
      {/* TU FOTO GRANDE: pégala en src/assets/sobre-mi/perfil/ */}
      <section className="relative w-full h-[70svh] min-h-[400px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          {fotoPerfil ? (
            <img
              src={fotoPerfil}
              alt="Jhonkarly Alvarez Pantoja, atleta paralímpico colombiano"
              className="w-full h-full object-cover object-[50%_58%]"
              loading="eager"
              decoding="async"
              /* fetchpriority en minúsculas: React 18 aún no conoce la forma camelCase */
              {...({ fetchpriority: "high" } as Record<string, string>)}
            />
          ) : (
            <div className="w-full h-full bg-g900 border-b border-g700 flex items-center justify-center">
              <div className="text-center px-6">
                <span className="font-body text-[0.62rem] font-semibold tracking-[0.35em] uppercase text-g500 block mb-3">
                  Espacio reservado
                </span>
                <span className="font-display text-[clamp(1.2rem,3vw,2rem)] text-g500 block">
                  Pega tu foto en src/assets/sobre-mi/perfil/
                </span>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-[var(--container-max)] mx-auto px-[var(--px)] pb-16">
          <span className="font-body text-[0.68rem] font-semibold tracking-[0.38em] uppercase text-g300 block mb-6">
            01 — ¿Quién soy?
          </span>
          <h1 className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.9] text-foreground">
            Sobre
            <br />
            <span className="text-g300">mí</span>
          </h1>
        </div>
      </section>

      <section className="border-t border-border py-[var(--section-py)] px-[var(--px)]">
        <div className="max-w-[var(--container-max)] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[clamp(48px,8vw,120px)] items-start">
          {/* Mi historia */}
          <article>
            <span className="font-body text-[0.68rem] font-semibold tracking-[0.38em] uppercase text-g300 block mb-6">
              Mi historia
            </span>

            <h2 className="font-display text-[clamp(2.2rem,4.5vw,4.2rem)] leading-[0.95] mb-10 text-foreground">
              No soy la historia
              <br />
              de una discapacidad.
              <br />
              <span className="text-g300 block mt-2">
                Soy la historia
                <br />
                de una decisión.
              </span>
            </h2>

            <p className={parrafo}>
              Mi nombre es{" "}
              <strong className="font-semibold text-foreground">
                Jhonkarly Alvarez Pantoja
              </strong>
              , atleta paralímpico colombiano. Cada entrenamiento, cada
              competencia y cada obstáculo han construido la persona que soy hoy.
              Pero mi historia apenas comienza.
            </p>

            <p className={parrafo}>
              Estoy viviendo una transformación. Una metamorfosis que no busca
              únicamente convertirme en un mejor deportista, sino en un ser humano
              capaz de redefinir lo que creemos posible.
            </p>

            <p className={parrafo}>
              Mi objetivo no es solo ganar medallas.{" "}
              <strong className="font-semibold text-foreground">
                Quiero convertirme en el atleta con discapacidad más resistente
                del mundo.
              </strong>
            </p>

            <p className={parrafo}>
              Atravesaré montañas, recorreré valles, nadaré distancias que parecen
              interminables y enfrentaré algunos de los entornos más extremos del
              planeta. No porque sea fácil, sino porque creo que los límites
              existen para ser cuestionados.
            </p>

            <p className={parrafo}>
              Cada desafío será una oportunidad para demostrar que el cuerpo tiene
              límites, pero la voluntad humana puede ir mucho más allá.
            </p>

            <p className={parrafo}>
              No busco ser recordado únicamente por mis resultados deportivos.{" "}
              <strong className="font-semibold text-foreground">
                Quiero dejar un legado.
              </strong>{" "}
              Demostrar que el coraje, la disciplina y la determinación pueden
              transformar una vida y abrir el camino para miles de personas que
              alguna vez escucharon que no podían.
            </p>

            <p className={parrafo}>
              Esto no es una etapa.{" "}
              <strong className="font-semibold text-foreground">
                Es el comienzo de una vida dedicada a convertir lo imposible en
                posible.
              </strong>
            </p>
          </article>

          {/* Frase destacada + datos */}
          <div className="pt-4 lg:sticky lg:top-24">
            <div className="border-l-2 border-g700 p-7 bg-g900 mb-10">
              <blockquote className="font-display text-[clamp(1.3rem,2.2vw,1.8rem)] leading-[1.35] text-g100">
                "Estoy construyendo el mayor proyecto de resistencia humana jamás
                realizado por un atleta con discapacidad."
              </blockquote>
              <cite className="block not-italic text-[0.68rem] font-semibold tracking-[0.25em] uppercase text-g300 mt-5">
                — Jhonkarly Alvarez Pantoja
              </cite>
            </div>

            <dl className="flex flex-col">
              {[
                { key: "Deporte", val: "Natación Adaptada" },
                { key: "Categoría", val: "Paralímpico" },
                { key: "País", val: "Colombia" },
                { key: "Objetivo", val: "Los Ángeles 2028" },
                { key: "Entrenamiento", val: "15 km / día" },
              ].map((fact) => (
                <div
                  key={fact.key}
                  className="flex justify-between items-center py-4 border-b border-g800 gap-6"
                >
                  <dt className="font-body text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-g300 shrink-0">
                    {fact.key}
                  </dt>
                  <dd className="font-display text-[1.1rem] tracking-[0.06em] text-foreground text-right">
                    {fact.val}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ══════════ 2. MIS PROYECTOS ══════════ */}
      <section id="proyectos" className="border-t border-border py-[var(--section-py)] px-[var(--px)]" aria-label="Mis proyectos">
        <div className="max-w-[var(--container-max)] mx-auto">
          <div className="mb-14">
            <span className="font-body text-[0.68rem] font-semibold tracking-[0.38em] uppercase text-g300 block mb-4">
              02 — Mis proyectos
            </span>
            <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] text-foreground">
              Lo que viene
            </h2>
          </div>

          {/* ── PROYECTO: KING OF POOL ── */}
          <Reveal>
          <article className="relative bg-foreground text-background overflow-hidden mb-[clamp(48px,7vw,90px)]">
            {/* Decoración: "24H" gigante de fondo */}
            <span
              aria-hidden="true"
              className="pointer-events-none select-none absolute -right-6 -top-10 font-display text-[clamp(9rem,24vw,22rem)] leading-none text-background/[0.06]"
            >
              24H
            </span>
            {/* Decoración: onda de agua */}
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 w-full h-16 text-background/[0.07]"
              viewBox="0 0 1200 60"
              preserveAspectRatio="none"
              fill="currentColor"
            >
              <path d="M0 35 Q 75 10 150 35 T 300 35 T 450 35 T 600 35 T 750 35 T 900 35 T 1050 35 T 1200 35 V 60 H 0 Z" />
            </svg>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-[clamp(36px,5vw,80px)] p-[clamp(28px,5vw,72px)] items-center">
              <div>
                {/* Cartelito de anuncio de fecha */}
                <span className="inline-block border border-background/40 px-4 py-2 font-body text-[0.6rem] font-semibold tracking-[0.28em] uppercase text-background/70 mb-7 animate-pulse">
                  ★ Próximamente anunciaré la fecha
                </span>

                <span className="font-body text-[0.65rem] font-semibold tracking-[0.35em] uppercase text-background/50 block mb-4">
                  Proyecto — Intento de récord · 24 horas de nado continuo
                </span>
                <h3 className="font-display text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.9] mb-8">
                  King
                  <br />
                  <span className="text-background/50">of Pool</span>
                </h3>

                <p className="font-body font-light text-[clamp(0.88rem,1.1vw,0.98rem)] leading-[1.85] text-background/70 mb-5 max-w-[500px]">
                  No se trata solo de nadar durante 24 horas.{" "}
                  <strong className="font-semibold text-background">
                    Se trata de demostrar que los límites existen para ser
                    cuestionados.
                  </strong>
                </p>
                <p className="font-body font-light text-[clamp(0.88rem,1.1vw,0.98rem)] leading-[1.85] text-background/70 mb-5 max-w-[500px]">
                  King of Pool es un proyecto deportivo, humano y audiovisual que
                  busca realizar un intento oficial de récord de 24 horas de nado
                  continuo en piscina olímpica por un para-nadador. Más allá de la
                  distancia, este desafío representa una convicción: la
                  discapacidad no define hasta dónde puede llegar una persona; la
                  determinación, la disciplina y el sacrificio diario sí.
                </p>
                <p className="font-body font-light text-[clamp(0.88rem,1.1vw,0.98rem)] leading-[1.85] text-background/70 mb-5 max-w-[500px]">
                  Cada entrenamiento, cada madrugada, cada metro recorrido forma
                  parte de una historia real de resistencia, superación y
                  propósito. Este proyecto busca inspirar a miles de personas,
                  apoyar a la comunidad con discapacidad, construir el camino
                  hacia los Juegos Paralímpicos de Los Ángeles 2028 y dejar un
                  legado que trascienda el deporte a través de un documental y una
                  narrativa auténtica.
                </p>
                <p className="font-body text-[clamp(0.92rem,1.2vw,1.05rem)] leading-[1.7] font-semibold text-background mb-10 max-w-[500px]">
                  King of Pool no es un récord. Es la prueba de que los límites se
                  redefinen cuando decides no rendirte.
                </p>

                {/* Botón al video inicial del proyecto (link en VIDEO_KING_OF_POOL, arriba) */}
                <BotonVideo url={VIDEO_KING_OF_POOL} texto="Ver el video del proyecto" claro />
              </div>

              <div className="flex flex-col gap-5">
                {/* FOTO DEL PROYECTO: pégala en src/assets/sobre-mi/king-of-pool/ */}
                <SlotFoto
                  src={fotoKingOfPool}
                  alt="Proyecto King of Pool — 24 horas de nado continuo"
                  aspecto="aspect-[4/5]"
                  claro
                />
                {/* Decoración: mini datos del reto */}
                <div className="grid grid-cols-3 gap-px bg-background/15 border border-background/15">
                  {[
                    { n: "24", t: "horas de nado" },
                    { n: "50m", t: "piscina olímpica" },
                    { n: "1", t: "récord por escribir" },
                  ].map((s) => (
                    <div key={s.t} className="bg-foreground p-4 text-center">
                      <span className="font-display text-[clamp(1.4rem,2.5vw,2.2rem)] block leading-none mb-2">
                        {s.n}
                      </span>
                      <span className="font-body text-[0.55rem] font-semibold tracking-[0.2em] uppercase text-background/50">
                        {s.t}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
          </Reveal>

          {/* ── PROYECTO: RUMBO A LOS ÁNGELES 2028 ── */}
          <Reveal>
          <article className="border border-g700 bg-g900 p-[clamp(28px,5vw,72px)] relative overflow-hidden">
            {/* Decoración: "2028" gigante de fondo */}
            <span
              aria-hidden="true"
              className="pointer-events-none select-none absolute -right-4 -bottom-8 font-display text-[clamp(8rem,20vw,18rem)] leading-none text-g800"
            >
              2028
            </span>

            <div className="relative z-10">
              <span className="font-body text-[0.65rem] font-semibold tracking-[0.35em] uppercase text-g300 block mb-4">
                Proyecto — Camino paralímpico
              </span>
              <h3 className="font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[0.92] text-foreground mb-8">
                Rumbo a los Juegos Paralímpicos
                <br />
                <span className="text-g300">Los Ángeles 2028</span>
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-[clamp(36px,5vw,80px)]">
                <div>
                  <p className={parrafo}>
                    Los Juegos Paralímpicos de Los Ángeles 2028 no son un sueño
                    lejano;{" "}
                    <strong className="font-semibold text-foreground">
                      son un objetivo que se construye cada día.
                    </strong>
                  </p>
                  <p className={parrafo}>
                    Este camino representa años de entrenamiento, disciplina,
                    sacrificio y una determinación inquebrantable por competir
                    entre los mejores para-nadadores del mundo. Cada sesión en la
                    piscina, cada reto superado y cada obstáculo vencido forman
                    parte de una preparación que va mucho más allá del deporte: es
                    la búsqueda constante de la excelencia.
                  </p>
                </div>
                <div>
                  <p className={parrafo}>
                    Más que una meta personal, este proyecto busca inspirar a una
                    nueva generación de deportistas y demostrar que la
                    discapacidad no define el potencial de una persona. Con
                    trabajo, perseverancia y el apoyo de quienes creen en este
                    sueño, el objetivo es representar con orgullo a Colombia en el
                    escenario deportivo más importante del mundo.
                  </p>
                  <p className="font-body text-[clamp(0.92rem,1.2vw,1.05rem)] leading-[1.7] font-semibold text-foreground mb-5 max-w-[520px]">
                    Los Ángeles 2028 no es el destino. Es la recompensa de un
                    camino recorrido con disciplina, resiliencia y la decisión de
                    nunca rendirse.
                  </p>
                </div>
              </div>

              {/* 3 FOTOS DEL CAMINO A LA 2028:
                  pégalas en src/assets/sobre-mi/los-angeles-2028/
                  (usa nombres 01-..., 02-..., 03-... para elegir el orden) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 mb-10">
                {[0, 1, 2].map((i) => (
                  <SlotFoto
                    key={i}
                    src={FOTOS_LA_2028[i]}
                    alt={`Camino a Los Ángeles 2028 — foto ${i + 1}`}
                    aspecto="aspect-[4/3]"
                  />
                ))}
              </div>

              {/* Botón al video de YouTube (link en VIDEO_LOS_ANGELES_2028, arriba) */}
              <BotonVideo url={VIDEO_LOS_ANGELES_2028} texto="Ver video en YouTube" />
            </div>
          </article>
          </Reveal>
        </div>
      </section>

      {/* ══════════ 3. MIS REDES SOCIALES ══════════ */}
      <section id="redes" className="bg-g900 border-t border-b border-g700 py-[var(--section-py)] px-[var(--px)]" aria-label="Redes sociales">
        <div className="max-w-[var(--container-max)] mx-auto">
          <div className="mb-14">
            <span className="font-body text-[0.68rem] font-semibold tracking-[0.38em] uppercase text-g300 block mb-4">
              03 — Sígueme
            </span>
            <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.9] text-foreground">
              Mis redes
            </h2>
          </div>

          {/* ── YouTube ── */}
          <div className="mb-16">
            <EncabezadoRed
              icono={ICONOS.youtube}
              titulo="YouTube"
              desc="Entrenamientos completos, competencias y la vida real detrás del atleta: los videos que cuentan la historia en profundidad."
              url={PERFILES.youtube}
              cta="Ver canal"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {VIDEOS_YOUTUBE.map((v) => (
                <TarjetaContenido key={v.titulo} titulo={v.titulo} url={v.url} aspecto="aspect-video" />
              ))}
            </div>
          </div>

          {/* ── Instagram ── */}
          <div className="mb-16">
            <EncabezadoRed
              icono={ICONOS.instagram}
              titulo="Instagram"
              desc="El día a día en fotos: piscina, disciplina, viajes de competencia y el camino a Los Ángeles 2028."
              url={PERFILES.instagram}
              cta="Ver perfil"
            />
            <div className="grid grid-cols-3 gap-4">
              {POSTS_INSTAGRAM.map((p) => (
                <TarjetaContenido key={p.titulo} titulo={p.titulo} url={p.url} aspecto="aspect-square" />
              ))}
            </div>
          </div>

          {/* ── TikTok ── */}
          <div>
            <EncabezadoRed
              icono={ICONOS.tiktok}
              titulo="TikTok"
              desc="Los momentos más intensos del entrenamiento, en formato corto y sin filtros."
              url={PERFILES.tiktok}
              cta="Ver perfil"
            />
            <div className="grid grid-cols-3 gap-4 max-w-[720px]">
              {CLIPS_TIKTOK.map((c) => (
                <TarjetaContenido key={c.titulo} titulo={c.titulo} url={c.url} aspecto="aspect-[9/16]" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ Enlace directo a Prensa ══════════ */}
      <section className="py-[clamp(56px,8vw,96px)] px-[var(--px)]" aria-label="Apariciones en prensa">
        <div className="max-w-[var(--container-max)] mx-auto">
          <Link
            to="/prensa"
            className="group flex flex-col md:flex-row md:items-center justify-between gap-6 border border-g700 px-8 py-10 transition-colors duration-300 hover:bg-g900"
          >
            <div>
              <span className="font-body text-[0.62rem] font-semibold tracking-[0.32em] uppercase text-g500 block mb-3">
                En los medios
              </span>
              <span className="font-display text-[clamp(1.8rem,4vw,3rem)] text-foreground leading-none block">
                ¿Quieres ver lo que dice<br className="hidden md:block" />
                <span className="text-g300"> la prensa de mí?</span>
              </span>
            </div>
            <span className="font-body text-[0.7rem] font-semibold tracking-[0.22em] uppercase text-g300 shrink-0 transition-colors duration-300 group-hover:text-foreground">
              Ir a Prensa →
            </span>
          </Link>
        </div>
      </section>

      {/* ══════════ 4. MI LIBRO — Gran cierre ══════════ */}
      <section id="libro" className="bg-foreground py-[var(--section-py)] px-[var(--px)]" aria-label="Mi libro">
        <div className="max-w-[var(--container-max)] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[clamp(40px,7vw,100px)] items-center">

          {/* Portada del libro: pega la imagen en src/assets/libro/ */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-none">
            {fotoLibro ? (
              <img
                src={fotoLibro}
                alt="Portada del libro de Jhonkarly Alvarez"
                className="w-[min(320px,80vw)] aspect-[2/3] object-cover border border-background/20 shadow-[24px_24px_0_0_rgba(0,0,0,0.25)]"
              />
            ) : (
              <div className="relative w-[min(320px,80vw)] aspect-[2/3] bg-background border border-background/20 shadow-[24px_24px_0_0_rgba(0,0,0,0.25)] flex flex-col justify-between p-8">
                <span className="font-body text-[0.6rem] font-semibold tracking-[0.35em] uppercase text-g300">
                  Próximamente
                </span>
                <div>
                  <span className="font-display text-[2.2rem] leading-[0.95] text-foreground block">
                    Voluntad<br />de acero
                  </span>
                  <span className="font-body text-[0.65rem] font-semibold tracking-[0.25em] uppercase text-g300 block mt-4">
                    Jhonkarly Alvarez
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Sinopsis + CTA */}
          <div>
            <span className="font-body text-[0.68rem] font-semibold tracking-[0.38em] uppercase text-background/50 block mb-6">
              04 — Mi libro
            </span>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.9] text-background mb-8">
              La historia<br />
              <span className="text-background/50">completa</span>
            </h2>
            <p className="font-body font-light text-[clamp(0.88rem,1.1vw,1rem)] text-background/70 max-w-[480px] mb-5 leading-[1.85]">
              Lo que no cabe en una entrevista ni en un video: el dolor real de los
              entrenamientos, las llagas, las dudas, y ese segundo exacto al salir de la
              piscina en el que la tortura se transforma en victoria.
            </p>
            <p className="font-body font-light text-[clamp(0.88rem,1.1vw,1rem)] text-background/70 max-w-[480px] mb-10 leading-[1.85]">
              Un testimonio de primera mano sobre lo que significa construir, brazada a
              brazada, el camino hacia unos Juegos Paralímpicos.
            </p>

            <div className="flex flex-wrap gap-4">
              {/* Cuando el libro esté a la venta, reemplaza el mailto por la URL de compra */}
              <a
                href="mailto:contact@jhonkarly.com?subject=Quiero%20adquirir%20el%20libro"
                className="inline-block px-8 py-4 bg-background text-foreground font-body font-semibold text-[0.72rem] tracking-[0.2em] uppercase transition-opacity duration-300 hover:opacity-80"
              >
                Adquirir el libro
              </a>
              <Link
                to="/trayectoria"
                className="inline-block px-8 py-4 border border-background/30 text-background/70 font-body font-semibold text-[0.72rem] tracking-[0.2em] uppercase transition-colors duration-300 hover:border-background hover:text-background"
              >
                Ver trayectoria
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default SobreMi;
