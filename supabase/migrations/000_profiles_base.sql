-- ============================================================
-- Base de autenticación: tabla profiles + perfil automático
-- Debe ejecutarse ANTES que 001 (001 asume que profiles existe;
-- en el proyecto original la tabla se creó a mano desde el panel).
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  role text NOT NULL DEFAULT 'public'
    CHECK (role IN ('master', 'admin', 'prensa', 'premium', 'public')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Crea el perfil al registrarse un usuario (signUp desde la web).
-- La cuenta login@jhonkarly.com nace directamente como master.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE WHEN NEW.email = 'login@jhonkarly.com' THEN 'master' ELSE 'public' END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
