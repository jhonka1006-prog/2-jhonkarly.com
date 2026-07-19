-- ============================================================
-- Fix: recursión infinita en las políticas RLS de profiles
-- Una política de profiles no puede consultar profiles directamente
-- (Postgres aborta con "infinite recursion detected", 42P17, y eso
-- rompería el login). Se reemplazan por una función SECURITY DEFINER
-- que lee el rol sin pasar por RLS.
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Versiones de 004 (y por si acaso, las originales de 001)
DROP POLICY IF EXISTS "Staff can read all profiles"    ON profiles;
DROP POLICY IF EXISTS "Master can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Master can delete profiles"     ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles"   ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can delete profiles"     ON profiles;
DROP POLICY IF EXISTS "Users can update own name"      ON profiles;

CREATE POLICY "Staff can read all profiles"
  ON profiles FOR SELECT
  USING (public.get_my_role() IN ('admin', 'master'));

CREATE POLICY "Master can update all profiles"
  ON profiles FOR UPDATE
  USING (public.get_my_role() = 'master');

CREATE POLICY "Master can delete profiles"
  ON profiles FOR DELETE
  USING (public.get_my_role() = 'master');

-- Igual que la original de 001 pero sin subconsulta recursiva:
-- el usuario edita su nombre pero no puede cambiarse el rol.
CREATE POLICY "Users can update own name"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = public.get_my_role());
