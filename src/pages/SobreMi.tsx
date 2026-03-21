import heroImage from "@/assets/sobre-mi-hero.jpg";

const SobreMi = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative w-full h-[70svh] min-h-[400px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Jhonkarly ALVAREZ, atleta paralímpico colombiano"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-[var(--container-max)] mx-auto px-[var(--px)] pb-16">
          <span className="font-body text-[0.68rem] font-semibold tracking-[0.38em] uppercase text-g300 block mb-6">
            01 — Identidad
          </span>
          <h1 className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.9] text-foreground">
            Sobre
            <br />
            <span className="text-g300">mí</span>
          </h1>
        </div>
      </section>

      {/* Bio Section */}
      <section className="border-t border-border py-[var(--section-py)] px-[var(--px)]">
        <div className="max-w-[var(--container-max)] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-[clamp(48px,8vw,120px)] items-start">
          {/* Left Column */}
          <article>
            <span className="font-body text-[0.68rem] font-semibold tracking-[0.38em] uppercase text-g300 block mb-6">
              Quién es
            </span>

            <h2 className="font-display text-[clamp(2.8rem,6vw,6rem)] leading-[0.9] mb-10 text-foreground">
              La voluntad
              <br />
              <span className="text-g300 block">es de acero</span>
            </h2>

            <p className="font-body font-light text-[clamp(0.88rem,1.1vw,0.98rem)] leading-[1.85] text-g300 mb-5 max-w-[480px]">
              Para la mayoría de los atletas, el deporte es pasión.
              Para <strong className="font-semibold text-foreground">Jhonkarly ALVAREZ Pantoja</strong>, la natación es una tortura necesaria.
              No nada porque ame el agua — los primeros 50 metros bajo el frío son una incomodidad
              insoportable que preferiría cambiar mil veces por la calma de su casa.
            </p>

            <p className="font-body font-light text-[clamp(0.88rem,1.1vw,0.98rem)] leading-[1.85] text-g300 mb-5 max-w-[480px]">
              Pero es precisamente en ese rechazo donde reside su verdadera fuerza:
              <strong className="font-semibold text-foreground"> hace lo que odia como si lo amara, solo para demostrarse a sí mismo de qué está hecho.</strong>
            </p>

            <p className="font-body font-light text-[clamp(0.88rem,1.1vw,0.98rem)] leading-[1.85] text-g300 mb-5 max-w-[480px]">
              Su disciplina no se mide en medallas, sino en los kilómetros recorridos fuera del agua,
              caminando hacia el entrenamiento con la prótesis al hombro, sobre un muñón lleno de llagas
              vivas. Ese día no solo llegó a entrenar. Llegó a confirmar que su voluntad no tiene límite.
            </p>
          </article>

          {/* Right Column */}
          <div className="pt-4">
            {/* Quote */}
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

            {/* Facts */}
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

      {/* Pull Quote */}
      <section className="bg-g900 border-t border-b border-g700 py-[clamp(72px,12vw,140px)] px-[var(--px)] text-center">
        <div className="max-w-[1000px] mx-auto">
          <p className="font-display text-[clamp(2.2rem,5.5vw,5.5rem)] leading-[1.05] text-foreground tracking-[0.01em]">
            Nadie en esa sala
            <br />
            <span className="text-g300">ha sufrido más.</span>
            <br />
            Nadie ha odiado más
            <br />
            <span className="text-g300">el proceso.</span>
          </p>
          <span className="block text-[0.68rem] font-semibold tracking-[0.3em] uppercase text-g300 mt-10">
            Su visión para Los Ángeles 2028
          </span>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-foreground py-12 px-[var(--px)]">
        <div className="max-w-[var(--container-max)] mx-auto flex items-center flex-wrap gap-6 gap-x-12">
          {[
            { num: "15 KM", lbl: "Diarios de nado" },
            { num: "7 días", lbl: "Sin tregua" },
            { num: "LA 2028", lbl: "Juegos Paralímpicos" },
            { num: "3×/sem", lbl: "Fuerza y resistencia" },
          ].map((stat) => (
            <div key={stat.lbl} className="text-left">
              <span className="font-display text-[clamp(2rem,4vw,3.2rem)] text-background leading-none block tracking-[0.02em]">
                {stat.num}
              </span>
              <span className="font-body text-[0.65rem] font-semibold tracking-[0.22em] uppercase text-background/50 mt-1 block">
                {stat.lbl}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SobreMi;
