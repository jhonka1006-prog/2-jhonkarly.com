import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type UserRole = "admin" | "prensa" | "premium" | "public";

interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  role: UserRole;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null; role: UserRole | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, role, full_name")
        .eq("id", userId)
        .single();
      if (error) {
        console.error("Error al cargar perfil:", error.message);
        setProfile(null);
        return;
      }
      setProfile(data ?? null);
    } catch (err) {
      console.error("Error inesperado al cargar perfil:", err);
      setProfile(null);
    }
  };

  useEffect(() => {
    // Carga sesión inicial — aguarda el perfil antes de quitar el loading
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) await fetchProfile(session.user.id);
      setLoading(false);
    });

    // Escucha cambios de sesión en tiempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) fetchProfile(session.user.id);
        else setProfile(null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // Distinguish between credential errors and network/server errors
        const isCredentialError = error.message.includes("Invalid login credentials");
        return {
          error: isCredentialError
            ? "Credenciales incorrectas. Inténtalo de nuevo."
            : "Error de conexión. Verifica tu red e inténtalo de nuevo.",
          role: null,
        };
      }
      if (data.user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();
        return { error: null, role: (profileData?.role ?? "public") as UserRole };
      }
      return { error: null, role: "public" as UserRole };
    } catch {
      return { error: "Error de conexión. Verifica tu red e inténtalo de nuevo.", role: null };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const role: UserRole = profile?.role ?? "public";

  return (
    <AuthContext.Provider value={{ session, user, profile, role, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
};
