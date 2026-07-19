-- ============================================================
-- Competencias — línea de tiempo de Trayectoria
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS competitions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,               -- ej: Campeonato Nacional de Para Natación
  location   text NOT NULL,               -- ej: Medellín, Colombia
  event_date date NOT NULL,
  race       text NOT NULL,               -- prueba, ej: 100m Libre S9
  mark       text NOT NULL,               -- marca, ej: 01:02.45
  placement  text,                        -- lugar, ej: 1er lugar / Finalista
  result_url text,                        -- link a la marca/resultados oficiales
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;

-- Lectura pública (la línea de tiempo la ve cualquier visitante)
CREATE POLICY "Public can read competitions"
  ON competitions FOR SELECT
  USING (true);

-- Solo el staff (admin y master) gestiona las competencias
CREATE POLICY "Staff can insert competitions" ON competitions FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master')));
CREATE POLICY "Staff can update competitions" ON competitions FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master')));
CREATE POLICY "Staff can delete competitions" ON competitions FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master')));
