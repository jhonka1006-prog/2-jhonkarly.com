-- ============================================================
-- Storage (subida de archivos) + Kit de Prensa
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- ─────────────────────────────────────────────
-- 1. BUCKET público "media" para todos los archivos del sitio
--    (fotos de tienda, galería de prensa, kits en PDF…)
-- ─────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Cualquiera puede LEER los archivos (el bucket es público)
CREATE POLICY "Public read media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

-- Solo el staff (admin / master) puede subir, reemplazar y borrar
CREATE POLICY "Staff insert media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'media'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master'))
  );

CREATE POLICY "Staff update media"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'media'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master'))
  );

CREATE POLICY "Staff delete media"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'media'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master'))
  );

-- ─────────────────────────────────────────────
-- 2. KIT DE PRENSA — 3 archivos fijos y reemplazables
--    kit_es   → Kit de prensa en español
--    kit_en   → Press kit in English
--    historia → PDF con la historia integral
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS press_kit_files (
  kind       text PRIMARY KEY CHECK (kind IN ('kit_es','kit_en','historia')),
  file_url   text NOT NULL,
  file_name  text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE press_kit_files ENABLE ROW LEVEL SECURITY;

-- Lectura para cualquier usuario autenticado (la página /prensa/kit
-- ya exige rol master/admin/prensa a nivel de aplicación)
CREATE POLICY "Authenticated can read kit files"
  ON press_kit_files FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff can insert kit files" ON press_kit_files FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master')));
CREATE POLICY "Staff can update kit files" ON press_kit_files FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master')));
CREATE POLICY "Staff can delete kit files" ON press_kit_files FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master')));
