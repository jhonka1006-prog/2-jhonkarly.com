import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

const schema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type FormData = z.infer<typeof schema>;

/** Ruta por defecto según el rol del usuario */
const ROLE_REDIRECT: Record<UserRole, string> = {
  admin:   "/dashboard",
  prensa:  "/mi-cuenta",
  premium: "/mi-cuenta",
  public:  "/mi-cuenta",
};

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname ?? null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    const { error: authError, role: newRole } = await signIn(data.email, data.password);

    if (authError) {
      setError(authError);
      setLoading(false);
      return;
    }

    // Redirige a la página de origen o a la ruta del rol
    navigate(from ?? ROLE_REDIRECT[newRole ?? "public"], { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-[var(--px)] pt-[68px]">
      <div className="w-full max-w-[420px]">

        {/* Header */}
        <div className="mb-12">
          <span className="font-body text-[0.65rem] font-semibold tracking-[0.38em] uppercase text-g300 block mb-4">
            Área privada
          </span>
          <h1 className="font-display text-[clamp(3rem,8vw,5.5rem)] leading-[0.88] text-foreground">
            Acceder
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-body text-[0.65rem] font-semibold tracking-[0.28em] uppercase text-g300">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="tucorreo@ejemplo.com"
              {...register("email")}
              className="login-input"
            />
            {errors.email && (
              <span className="font-body text-[0.72rem] text-destructive">{errors.email.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="font-body text-[0.65rem] font-semibold tracking-[0.28em] uppercase text-g300">
                Contraseña
              </label>
              <button
                type="button"
                onClick={() => { setResetMode(true); setError(null); setResetSent(false); }}
                className="font-body text-[0.7rem] text-g300 hover:text-foreground transition-colors duration-300"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...register("password")}
              className="login-input"
            />
            {errors.password && (
              <span className="font-body text-[0.72rem] text-destructive">{errors.password.message}</span>
            )}
          </div>

          {error && (
            <p className="font-body text-[0.78rem] text-destructive border border-destructive/30 bg-destructive/10 px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-foreground text-background font-body font-semibold text-[0.72rem] tracking-[0.22em] uppercase transition-opacity duration-300 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Verificando…" : "Entrar"}
          </button>
        </form>

        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-g700" />
          <span className="font-body text-[0.65rem] tracking-[0.2em] uppercase text-g700">o</span>
          <div className="flex-1 h-px bg-g700" />
        </div>

        <p className="font-body text-[0.78rem] text-g300 text-center">
          ¿No tienes cuenta?{" "}
          <a href="mailto:contact@jhonkarly.com" className="text-foreground hover:text-g300 transition-colors duration-300">
            Solicitar acceso
          </a>
        </p>

        <div className="mt-10 text-center">
          <Link to="/" className="font-body text-[0.65rem] font-semibold tracking-[0.22em] uppercase text-g700 hover:text-g300 transition-colors duration-300">
            ← Volver al inicio
          </Link>
        </div>

      </div>

      {/* ── Password Reset Modal ── */}
      {resetMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => !resetLoading && setResetMode(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative w-full max-w-[420px] mx-4 bg-background border border-g700 p-8" onClick={(e) => e.stopPropagation()}>
            <span className="font-body text-[0.58rem] font-semibold tracking-[0.38em] uppercase text-g700 block mb-2">
              Recuperar acceso
            </span>
            <h2 className="font-display text-[2rem] leading-none text-foreground mb-6">
              Restablecer contraseña
            </h2>

            {resetSent ? (
              <div>
                <p className="font-body text-sm text-g300 leading-[1.85] mb-6">
                  Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y spam.
                </p>
                <button
                  onClick={() => { setResetMode(false); setResetSent(false); }}
                  className="w-full py-3 bg-foreground text-background font-body font-semibold text-[0.72rem] tracking-[0.2em] uppercase transition-opacity hover:opacity-80"
                >
                  Volver al inicio de sesión
                </button>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const email = (e.currentTarget.elements.namedItem("reset-email") as HTMLInputElement).value;
                  if (!email) { setError("Ingresa tu correo electrónico."); return; }
                  setResetLoading(true);
                  setError(null);
                  const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/login`,
                  });
                  setResetLoading(false);
                  if (resetError) {
                    setError("Error al enviar el enlace. Inténtalo de nuevo.");
                  } else {
                    setResetSent(true);
                  }
                }}
              >
                <p className="font-body text-sm text-g300 leading-[1.85] mb-6">
                  Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                </p>
                <input
                  name="reset-email"
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  className="login-input w-full mb-4"
                  disabled={resetLoading}
                />
                {error && (
                  <p className="font-body text-[0.78rem] text-destructive mb-4">{error}</p>
                )}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setResetMode(false); setError(null); }}
                    disabled={resetLoading}
                    className="flex-1 py-3 font-body text-[0.68rem] font-semibold tracking-[0.2em] uppercase border border-g700 text-g300 hover:border-g300 hover:text-foreground transition-colors disabled:opacity-40"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="flex-1 py-3 bg-foreground text-background font-body font-semibold text-[0.72rem] tracking-[0.2em] uppercase transition-opacity hover:opacity-80 disabled:opacity-40"
                  >
                    {resetLoading ? "Enviando…" : "Enviar enlace"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
