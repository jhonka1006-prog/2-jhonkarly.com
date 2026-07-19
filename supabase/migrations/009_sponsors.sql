-- ============================================================
-- Patrocinadores (marquesina del Inicio) + fix lectura del kit
-- Ejecutar en: Supabase Dashboard > SQL Editor (una sola vez)
-- ============================================================

-- ─────────────────────────────────────────────
-- 1. TABLA sponsors — logos administrables desde /dashboard/sponsors
--    Aparecen automáticamente en la marquesina de la página de inicio.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sponsors (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  logo_url   text NOT NULL,
  link_url   text,                       -- opcional: web del patrocinador
  sort_order int  NOT NULL DEFAULT 0,    -- menor = aparece primero
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

-- Lectura pública (la marquesina es visible para todo el mundo)
CREATE POLICY "Public read sponsors"
  ON sponsors FOR SELECT
  USING (true);

-- Escritura solo staff (admin / master)
CREATE POLICY "Staff insert sponsors" ON sponsors FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master')));
CREATE POLICY "Staff update sponsors" ON sponsors FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master')));
CREATE POLICY "Staff delete sponsors" ON sponsors FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master')));

-- ─────────────────────────────────────────────
-- 2. FIX: el kit de prensa ahora se descarga públicamente desde /prensa,
--    así que la tabla press_kit_files debe poder leerse sin sesión.
--    (Antes: solo usuarios autenticados → los visitantes veían "Próximamente".)
-- ─────────────────────────────────────────────
DROP POLICY IF EXISTS "Authenticated can read kit files" ON press_kit_files;

CREATE POLICY "Public read kit files"
  ON press_kit_files FOR SELECT
  USING (true);
