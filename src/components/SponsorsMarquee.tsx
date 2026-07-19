import { LOGOS_SPONSORS } from "@/lib/imagenes";
import { useSponsors } from "@/hooks/use-sponsors";

/* ════════════════════════════════════════════════════════════
   PATROCINADORES — dos formas de agregar logos (se combinan):

   1. PANEL (recomendado): /dashboard/sponsors → subir logo con
      nombre y link. Aparece al instante aquí. Requiere Supabase
      (migración 009_sponsors.sql ejecutada).

   2. CARPETA: pega logos SIN FONDO (PNG/SVG) en
      src/assets/sponsors/ — orden por nombre de archivo
      (01-..., 02-...). Para hacerlos clicables, registra el
      link aquí con el nombre del archivo SIN extensión: */
const LINKS_SPONSORS: Record<string, string> = {
  // "01-banco-cafetero": "https://bancocafetero.com",
};

/* Sin logos de ninguna fuente se muestran espacios reservados. */
interface Sponsor {
  nombre: string;
  logo: string | null;
  url?: string;
}

const PLACEHOLDERS: Sponsor[] = Array.from({ length: 6 }, (_, i) => ({
  nombre: `Patrocinador ${i + 1}`,
  logo: null,
}));

const LogoItem = ({ s }: { s: Sponsor }) => {
  const inner = s.logo ? (
    <img
      src={s.logo}
      alt={s.nombre}
      loading="lazy"
      className="h-10 md:h-12 w-auto object-contain opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
    />
  ) : (
    <span className="flex items-center justify-center h-10 md:h-12 px-8 border border-dashed border-g700 font-body text-[0.6rem] font-semibold tracking-[0.28em] uppercase text-g500 whitespace-nowrap">
      {s.nombre}
    </span>
  );

  return s.url ? (
    <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.nombre} className="shrink-0">
      {inner}
    </a>
  ) : (
    <span className="shrink-0">{inner}</span>
  );
};

const SponsorsMarquee = () => {
  const { data: remotos } = useSponsors();

  /* Combina: logos de la carpeta local + logos subidos desde el panel */
  const reales: Sponsor[] = [
    ...LOGOS_SPONSORS.map((s) => ({
      nombre: s.nombre,
      logo: s.logo,
      url: LINKS_SPONSORS[s.archivo],
    })),
    ...(remotos ?? []).map((s) => ({
      nombre: s.name,
      logo: s.logo_url,
      url: s.link_url ?? undefined,
    })),
  ];

  const SPONSORS = reales.length > 0 ? reales : PLACEHOLDERS;

  return (
    <section
      className="border-t border-b border-g700 py-[clamp(40px,6vw,64px)] overflow-hidden"
      aria-label="Patrocinadores"
    >
      <div className="max-w-[var(--container-max)] mx-auto px-[var(--px)] mb-10">
        <span className="font-body text-[0.68rem] font-semibold tracking-[0.38em] uppercase text-g300 block">
          Patrocinadores
        </span>
      </div>

      {/* Marquesina: la pista está duplicada; la animación desplaza el 50%
          del ancho, así el final empalma con el inicio y el bucle es infinito. */}
      <div className="sponsors-marquee" aria-hidden={false}>
        <div className="sponsors-track">
          {[...SPONSORS, ...SPONSORS].map((s, i) => (
            <LogoItem key={`${s.nombre}-${i}`} s={s} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorsMarquee;
