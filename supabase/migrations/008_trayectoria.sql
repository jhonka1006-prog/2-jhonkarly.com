-- ============================================================
-- Trayectoria — hitos de la línea de tiempo + logros (medallas y récords)
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- ── Hitos de la trayectoria ──────────────────────────────────
CREATE TABLE IF NOT EXISTS trajectory_milestones (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year_label  text NOT NULL,              -- ej: 2023 / 2010–2020
  title       text NOT NULL,              -- ej: VI Juegos Paranacionales
  category    text NOT NULL,              -- ej: Representación Nacional
  description text,                       -- párrafo del hito
  details     text[],                     -- viñetas opcionales
  link_url    text,                       -- link opcional (resultados, prensa…)
  link_label  text,                       -- texto del link
  is_future   boolean NOT NULL DEFAULT false,  -- meta futura (ej: LA 2028)
  sort_order  integer NOT NULL DEFAULT 0, -- menor = aparece primero
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE trajectory_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read milestones"
  ON trajectory_milestones FOR SELECT
  USING (true);

CREATE POLICY "Staff can insert milestones" ON trajectory_milestones FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master')));
CREATE POLICY "Staff can update milestones" ON trajectory_milestones FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master')));
CREATE POLICY "Staff can delete milestones" ON trajectory_milestones FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master')));

-- ── Logros: medallas (1º/2º/3º) y récords ────────────────────
CREATE TABLE IF NOT EXISTS achievements (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,              -- ej: 100m Libre S9
  event_name  text,                       -- ej: VI Juegos Paranacionales
  year_label  text,                       -- ej: 2023
  medal       smallint CHECK (medal IN (1, 2, 3)),  -- 1=oro, 2=plata, 3=bronce (null si es solo récord)
  scope       text NOT NULL DEFAULT 'nacional' CHECK (scope IN ('nacional', 'internacional')),
  is_record   boolean NOT NULL DEFAULT false,       -- imposición de récord
  description text,                       -- detalle opcional (ej: tiempo, ciudad)
  sort_order  integer NOT NULL DEFAULT 0, -- menor = aparece primero
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read achievements"
  ON achievements FOR SELECT
  USING (true);

CREATE POLICY "Staff can insert achievements" ON achievements FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master')));
CREATE POLICY "Staff can update achievements" ON achievements FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master')));
CREATE POLICY "Staff can delete achievements" ON achievements FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master')));

-- ── Datos iniciales de la trayectoria ────────────────────────
INSERT INTO trajectory_milestones (year_label, title, category, description, details, link_url, link_label, is_future, sort_order) VALUES
('2028', 'Juegos Paralímpicos — Los Ángeles', 'Meta Paralímpica',
 'El objetivo máximo. Clasificar y competir en los Juegos Paralímpicos de Los Ángeles 2028 representando a Colombia en la máxima tarima del deporte paralímpico mundial. Cada entrenamiento desde hoy apunta a este momento.',
 NULL, NULL, NULL, true, 10),

('2026', 'World Series Abu Dhabi', 'Competencia Internacional',
 'Participación en el World Series de Abu Dhabi, consolidando presencia en el circuito paralímpico internacional y midiendo el nivel frente a los mejores nadadores del mundo.',
 NULL, NULL, NULL, false, 20),

('2025', 'Bloque de Entrenamiento', 'Preparación',
 'Ciclo intensivo de preparación física y técnica orientado al alto rendimiento paralímpico, afinando tiempos y construyendo la base para los próximos retos internacionales.',
 NULL, NULL, NULL, false, 30),

('2024', 'I Juegos Paranacionales Juveniles', 'Competencia Nacional',
 'Participación en los primeros Juegos Paranacionales Juveniles de Colombia. Competencia que consolidó la proyección nacional y reafirmó el compromiso con el alto rendimiento paralímpico.',
 NULL, 'https://www.coldeportes.gov.co', 'Jhonkarly Alvarez Pantoja | I Juegos Paranacionales Juveniles', false, 40),

('2023', 'VI Juegos Paranacionales', 'Representación Nacional',
 'Representación de Colombia en los VI Juegos Paranacionales. Competencia que marcó la consolidación a nivel nacional y el inicio de la proyección hacia el circuito paralímpico internacional.',
 NULL, 'https://www.coldeportes.gov.co', 'Jhonkarly Alvarez Pantoja | VI Juegos Paranacionales 2023', false, 50),

('2022', 'Proyección Nacional', 'Hito de Carrera',
 NULL,
 ARRAY[
   'Participación en clasificatorios a Juegos Nacionales, entrando al circuito competitivo de alto rendimiento.',
   'Convocado en dos ocasiones a preselecciones Colombia con miras a los Juegos Panamericanos Juveniles 2023 en Bogotá.',
   'Aunque finalmente no se integró la delegación final, estas convocatorias consolidaron y reconocieron su nivel deportivo a escala nacional.'
 ],
 NULL, NULL, false, 60),

('2021', 'Primera Competencia Oficial', 'Diciembre 2021',
 'Participación en la primera competencia federada, marcando el inicio formal de la carrera competitiva en natación. El primer escalón de un recorrido construido desde la disciplina y la constancia.',
 NULL, NULL, NULL, false, 70),

('2010–2020', 'Formación y Desarrollo Competitivo', 'Década de construcción',
 'Etapa de aprendizaje, perfeccionamiento técnico y construcción de base física dentro del proceso deportivo. Diez años forjando los cimientos de todo lo que vendría después.',
 NULL, NULL, NULL, false, 80),

('2010', 'Inicio en la Natación', 'Origen',
 'Comienzo en la natación a los 3 años, iniciando el proceso de formación deportiva y desarrollo técnico básico. El agua como primer lenguaje, la disciplina como primer hábito.',
 NULL, NULL, NULL, false, 90);

-- ── Logros iniciales (según la trayectoria; agrega medallas y récords desde el panel admin) ──
INSERT INTO achievements (title, event_name, year_label, medal, scope, is_record, description, sort_order) VALUES
('World Series Abu Dhabi', 'Circuito Paralímpico Internacional', '2026', NULL, 'internacional', false,
 'Participación internacional midiendo el nivel frente a los mejores nadadores del mundo.', 10),

('I Juegos Paranacionales Juveniles', 'Juegos Paranacionales Juveniles de Colombia', '2024', NULL, 'nacional', false,
 'Participación en los primeros Juegos Paranacionales Juveniles de Colombia, consolidando la proyección nacional.', 20),

('VI Juegos Paranacionales', 'Juegos Paranacionales de Colombia', '2023', NULL, 'nacional', false,
 'Representación de Colombia en los VI Juegos Paranacionales, consolidación a nivel nacional.', 30),

('Preselección Colombia', 'Juegos Panamericanos Juveniles 2023 — Bogotá', '2022', NULL, 'nacional', false,
 'Convocado en dos ocasiones a preselecciones Colombia, reconocimiento del nivel deportivo a escala nacional.', 40),

('Clasificatorios a Juegos Nacionales', NULL, '2022', NULL, 'nacional', false,
 'Ingreso al circuito competitivo de alto rendimiento.', 50);
