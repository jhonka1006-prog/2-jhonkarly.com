-- ============================================================
-- Pedidos de la tienda + jerarquía de roles (master > admin)
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================
--
-- Jerarquía resultante:
--   master  → poder total: gestiona usuarios (incluidos admins),
--             contenido, tienda y pedidos.
--   admin   → solo administración de contenido: tienda, pedidos,
--             prensa y galería. NO gestiona usuarios.
--   prensa / premium / public → sin cambios.
-- ============================================================

-- 0. Cuenta maestra
UPDATE profiles SET role = 'master' WHERE email = 'login@jhonkarly.com';

-- ─────────────────────────────────────────────
-- 1. PROFILES — la gestión de usuarios pasa a master
-- ─────────────────────────────────────────────
DROP POLICY IF EXISTS "Admins can read all profiles"   ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can delete profiles"     ON profiles;

CREATE POLICY "Staff can read all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master'))
  );

-- Solo el maestro edita/elimina cuentas (incluidas las de admins)
CREATE POLICY "Master can update all profiles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'master')
  );

CREATE POLICY "Master can delete profiles"
  ON profiles FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'master')
  );

-- ─────────────────────────────────────────────
-- 2. CONTENIDO — las políticas de admin ahora incluyen a master
-- ─────────────────────────────────────────────
DROP POLICY IF EXISTS "Admins can insert press notes"  ON press_notes;
DROP POLICY IF EXISTS "Admins can update press notes"  ON press_notes;
DROP POLICY IF EXISTS "Admins can delete press notes"  ON press_notes;
DROP POLICY IF EXISTS "Admins can insert press photos" ON press_photos;
DROP POLICY IF EXISTS "Admins can update press photos" ON press_photos;
DROP POLICY IF EXISTS "Admins can delete press photos" ON press_photos;
DROP POLICY IF EXISTS "Admins can insert products"     ON products;
DROP POLICY IF EXISTS "Admins can update products"     ON products;
DROP POLICY IF EXISTS "Admins can delete products"     ON products;

CREATE POLICY "Staff can insert press notes" ON press_notes FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master')));
CREATE POLICY "Staff can update press notes" ON press_notes FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master')));
CREATE POLICY "Staff can delete press notes" ON press_notes FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master')));

CREATE POLICY "Staff can insert press photos" ON press_photos FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master')));
CREATE POLICY "Staff can update press photos" ON press_photos FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master')));
CREATE POLICY "Staff can delete press photos" ON press_photos FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master')));

CREATE POLICY "Staff can insert products" ON products FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master')));
CREATE POLICY "Staff can update products" ON products FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master')));
CREATE POLICY "Staff can delete products" ON products FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master')));

-- ─────────────────────────────────────────────
-- 3. PEDIDOS — estructura de pagos de la tienda
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid REFERENCES auth.users (id) ON DELETE SET NULL,
  customer_name  text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  address        text NOT NULL,           -- dirección de envío
  city           text NOT NULL,
  department     text NOT NULL,           -- departamento (Colombia)
  notes          text,                    -- indicaciones de entrega
  items          jsonb NOT NULL,          -- [{product_id, name, price, qty}]
  total          numeric(12,0) NOT NULL,
  payment_method text NOT NULL DEFAULT 'transferencia'
                 CHECK (payment_method IN ('transferencia','contra_entrega','pasarela')),
  payment_ref    text,                    -- nº de comprobante o referencia de pasarela
  status         text NOT NULL DEFAULT 'pendiente'
                 CHECK (status IN ('pendiente','pagado','enviado','entregado','cancelado')),
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- El cliente crea sus propios pedidos (requiere cuenta)
CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- El cliente ve solo sus pedidos
CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- El staff ve y gestiona todos los pedidos
CREATE POLICY "Staff can read all orders"
  ON orders FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master')));

CREATE POLICY "Staff can update orders"
  ON orders FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','master')));

CREATE POLICY "Master can delete orders"
  ON orders FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'master'));

-- ============================================================
-- PASARELA DE PAGO (cuando tengas cuenta de comercio):
-- 1. Crea tu cuenta en Wompi (wompi.co) o MercadoPago.
-- 2. Genera un "link de pago" por producto o por pedido y pégalo
--    en el campo buy_url del producto, o intégralo en el checkout
--    guardando la referencia en orders.payment_ref.
-- Mientras tanto el flujo funciona con transferencia (Nequi /
-- Bancolombia) y contra entrega: el pedido queda "pendiente" y
-- lo confirmas desde Dashboard > Pedidos al verificar el pago.
-- ============================================================
