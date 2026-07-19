-- ============================================================
-- Facturación web + envío por correo
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- ─────────────────────────────────────────────
-- 1. Documento del comprador en el pedido (cédula / NIT)
--    Requisito para expedir factura a nombre del cliente.
-- ─────────────────────────────────────────────
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_id_doc text;

-- ─────────────────────────────────────────────
-- 2. Datos fiscales del vendedor (una sola fila)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS billing_settings (
  id             smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  business_name  text NOT NULL DEFAULT 'Jhonkarly Alvarez Pantoja',
  nit            text NOT NULL DEFAULT '',      -- NIT o cédula del vendedor
  address        text NOT NULL DEFAULT '',
  city           text NOT NULL DEFAULT '',
  phone          text NOT NULL DEFAULT '',
  email          text NOT NULL DEFAULT 'contact@jhonkarly.com',
  regimen        text NOT NULL DEFAULT 'No responsable de IVA',
  iva_rate       numeric(4,2) NOT NULL DEFAULT 0,   -- 0, 0.05 o 0.19
  invoice_prefix text NOT NULL DEFAULT 'FV',
  dian_resolution text DEFAULT ''                -- resolución de numeración DIAN (si aplica)
);

INSERT INTO billing_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE billing_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can read billing settings"
  ON billing_settings FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master')));

-- Solo el maestro edita los datos fiscales
CREATE POLICY "Master can update billing settings"
  ON billing_settings FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'master'));

-- ─────────────────────────────────────────────
-- 3. Facturas — numeración consecutiva automática
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number     bigint GENERATED ALWAYS AS IDENTITY,  -- consecutivo
  order_id   uuid NOT NULL UNIQUE REFERENCES orders (id) ON DELETE CASCADE,
  user_id    uuid,                                 -- comprador (para su acceso)
  issued_at  timestamptz NOT NULL DEFAULT now(),
  subtotal   numeric(12,0) NOT NULL,
  iva        numeric(12,0) NOT NULL DEFAULT 0,
  total      numeric(12,0) NOT NULL,
  cufe       text,          -- se llenará cuando exista integración DIAN
  sent_at    timestamptz    -- último envío por correo
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- El comprador puede ver su propia factura
CREATE POLICY "Users can read own invoices"
  ON invoices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Staff can read all invoices"
  ON invoices FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master')));

CREATE POLICY "Staff can insert invoices"
  ON invoices FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master')));

CREATE POLICY "Staff can update invoices"
  ON invoices FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master')));

-- ============================================================
-- FACTURA ELECTRÓNICA DIAN — hoja de ruta:
-- 1. Verifica si estás obligado (persona natural no responsable
--    de IVA bajo topes: aún no). Cuando lo estés:
-- 2. Regístrate como facturador electrónico en dian.gov.co
--    (facturador gratuito DIAN) o contrata un proveedor
--    tecnológico (Siigo, Alegra, Factus…).
-- 3. Pide tu resolución de numeración y ponla en billing_settings.
-- 4. La integración llenará invoices.cufe con el código validado.
-- ============================================================
