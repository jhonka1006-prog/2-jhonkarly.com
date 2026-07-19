-- ============================================================
-- Tienda — Productos administrables
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  description text NOT NULL DEFAULT '',
  price       numeric(12,0) NOT NULL DEFAULT 0,   -- en pesos colombianos (COP)
  image_urls  text[] NOT NULL DEFAULT '{}',       -- fotos del producto (URLs)
  buy_url     text,                               -- link de pago externo (opcional)
  available   boolean NOT NULL DEFAULT true,      -- visible/agotado
  sort_order  int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 2. Habilitar RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 3. Lectura pública (la vitrina la ve cualquier visitante)
CREATE POLICY "Public can read products"
  ON products FOR SELECT
  USING (true);

-- 4. Solo admins pueden crear, editar y eliminar
CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================
-- Fotos de productos: usa el mismo bucket público "prensa" de
-- Supabase Storage (o crea uno llamado "tienda") y pega las
-- URLs públicas en el panel Dashboard > Tienda.
-- ============================================================
