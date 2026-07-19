-- ============================================================
-- Prensa — Notas de prensa dinámicas + Galería de fotos
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Tabla de notas de prensa
CREATE TABLE IF NOT EXISTS press_notes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title      text NOT NULL,
  outlet     text NOT NULL,            -- medio de comunicación
  url        text NOT NULL,            -- enlace al artículo
  published  date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Tabla de fotos de la galería
--    Guarda URLs: pueden ser de Supabase Storage (bucket "prensa")
--    o de cualquier CDN externo.
CREATE TABLE IF NOT EXISTS press_photos (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url        text NOT NULL,
  caption    text,
  sort_order int  NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Habilitar RLS en ambas tablas
ALTER TABLE press_notes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE press_photos ENABLE ROW LEVEL SECURITY;

-- 4. Lectura pública (el sitio muestra prensa y galería a cualquier visitante)
CREATE POLICY "Public can read press notes"
  ON press_notes FOR SELECT
  USING (true);

CREATE POLICY "Public can read press photos"
  ON press_photos FOR SELECT
  USING (true);

-- 5. Solo admins pueden crear, editar y eliminar
CREATE POLICY "Admins can insert press notes"
  ON press_notes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update press notes"
  ON press_notes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete press notes"
  ON press_notes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert press photos"
  ON press_photos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update press photos"
  ON press_photos FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete press photos"
  ON press_photos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================
-- OPCIONAL — Almacenamiento de imágenes en Supabase Storage:
-- Dashboard > Storage > New bucket:
--   nombre: "prensa", Public bucket: ON
-- Luego sube fotos y pega la URL pública en el panel
-- Dashboard > Prensa del sitio.
-- ============================================================
