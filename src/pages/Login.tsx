import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "@/context/AuthContext";

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
      setError("Credenciales incorrectas. Inténtalo de nuevo.");
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
              <a href="#" className="font-body text-[0.7rem] text-g300 hover:text-foreground transition-colors duration-300">
                ¿Olvidaste tu contraseña?
              </a>
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
          <a href="mailto:contac@jhonkarly.com" className="text-foreground hover:text-g300 transition-colors duration-300">
            Solicitar acceso
          </a>
        </p>

        <div className="mt-10 text-center">
          <Link to="/" className="font-body text-[0.65rem] font-semibold tracking-[0.22em] uppercase text-g700 hover:text-g300 transition-colors duration-300">
            ← Volver al inicio
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
