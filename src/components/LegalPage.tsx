import { ReactNode } from "react";

export interface LegalSection {
  titulo: string;
  contenido: ReactNode;
}

interface Props {
  etiqueta: string;
  titulo: ReactNode;
  actualizado: string;
  intro: string;
  secciones: LegalSection[];
}

/** Layout compartido para páginas legales (Privacidad, Términos) */
const LegalPage = ({ etiqueta, titulo, actualizado, intro, secciones }: Props) => (
  <div id="main-content" className="min-h-screen bg-background">

    {/* ── Header ── */}
    <section className="px-[var(--px)] pt-[calc(68px+clamp(48px,10vw,110px))] pb-[clamp(36px,5vw,64px)]">
      <div className="max-w-[820px] mx-auto">
        <span className="font-body text-[0.68rem] font-semibold tracking-[0.38em] uppercase text-g300 block mb-6">
          {etiqueta}
        </span>
        <h1 className="font-display text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.92] text-foreground">
          {titulo}
        </h1>
        <p className="font-body text-[0.7rem] font-semibold tracking-[0.22em] uppercase text-g500 mt-6">
          Última actualización: {actualizado}
        </p>
        <p className="font-body font-light text-[0.92rem] text-g300 leading-[1.85] mt-8 max-w-[640px]">
          {intro}
        </p>
      </div>
    </section>

    {/* ── Secciones ── */}
    <section className="border-t border-border py-[clamp(48px,7vw,90px)] px-[var(--px)]">
      <div className="max-w-[820px] mx-auto flex flex-col gap-[clamp(36px,5vw,56px)]">
        {secciones.map((s, i) => (
          <article key={s.titulo}>
            <h2 className="font-display text-[clamp(1.3rem,2.4vw,1.8rem)] text-foreground leading-tight mb-4">
              <span className="text-g500 mr-3">{String(i + 1).padStart(2, "0")}</span>
              {s.titulo}
            </h2>
            <div className="font-body font-light text-[0.9rem] text-g300 leading-[1.9] [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_li]:mb-1.5 [&_strong]:text-foreground [&_strong]:font-semibold [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4">
              {s.contenido}
            </div>
          </article>
        ))}
      </div>
    </section>

    {/* ── Contacto ── */}
    <section className="bg-g900 border-t border-g700 py-[clamp(48px,7vw,80px)] px-[var(--px)]">
      <div className="max-w-[820px] mx-auto text-center">
        <p className="font-body font-light text-[0.9rem] text-g300 leading-[1.85] mb-6">
          ¿Tienes preguntas sobre este documento?
        </p>
        <a
          href="mailto:contact@jhonkarly.com"
          className="inline-block px-8 py-3 bg-foreground text-background font-body font-semibold text-[0.72rem] tracking-[0.2em] uppercase transition-opacity duration-300 hover:opacity-80"
        >
          contact@jhonkarly.com
        </a>
      </div>
    </section>

  </div>
);

export default LegalPage;
