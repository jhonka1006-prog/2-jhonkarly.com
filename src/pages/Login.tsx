import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/context/AuthContext";
import { supabase, supabaseReady } from "@/lib/supabase";
import { usePageMeta } from "@/lib/seo";

const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const registroSchema = loginSchema.extend({
  full_name: z.string().min(2, "Ingresa tu nombre completo"),
});

type RegistroData = z.infer<typeof registroSchema>;

/** Ruta por defecto según el rol del usuario */
const ROLE_REDIRECT: Record<UserRole, string> = {
  master:  "/dashboard",
  admin:   "/dashboard",
  prensa:  "/mi-cuenta",
  premium: "/mi-cuenta",
  public:  "/mi-cuenta",
};

const inputLabelCls =
  "font-body text-[0.65rem] font-semibold tracking-[0.28em] uppercase text-g300";

const Login = () => {
  usePageMeta({
    titulo: "Iniciar sesión — Jhonkarly Alvarez",
    noindex: true,
  });

  const { signIn, session, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname ?? null;

  const [modo, setModo] = useState<"login" | "registro">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registroOk, setRegistroOk] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // ── Resultado de los enlaces de correo (verificación / recuperación) ──
  // El hash se captura en el primer render: el SDK lo limpia al procesarlo.
  const verificado = new URLSearchParams(location.search).has("verificado");
  const [hashError] = useState<string | null>(() =>
    new URLSearchParams(window.location.hash.slice(1)).get("error_description")
  );
  const [recoveryMode, setRecoveryMode] = useState(() =>
    window.location.hash.includes("type=recovery")
  );
  const [recoveryDone, setRecoveryDone] = useState(false);
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setRecoveryMode(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegistroData>({
    resolver: zodResolver(modo === "login" ? loginSchema : registroSchema),
  });

  const cambiarModo = (m: "login" | "registro") => {
    setModo(m);
    setError(null);
    setRegistroOk(false);
    reset();
  };

  const onSubmit = async (data: RegistroData) => {
    setLoading(true);
    setError(null);

    if (modo === "login") {
      const { error: authError, role: newRole } = await signIn(data.email, data.password);
      if (authError) {
        setError(authError);
        setLoading(false);
        return;
      }
      navigate(from ?? ROLE_REDIRECT[newRole ?? "public"], { replace: true });
      return;
    }

    // ── Registro (cuentas de la tienda) ──
    const { error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.full_name },
        emailRedirectTo: `${window.location.origin}/login?verificado=1`,
      },
    });
    setLoading(false);
    if (signUpError) {
      setError(
        signUpError.message.includes("already registered")
          ? "Ya existe una cuenta con ese correo. Inicia sesión."
          : "No se pudo crear la cuenta. Inténtalo de nuevo."
      );
      return;
    }
    setRegistroOk(true);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-[var(--px)] pt-[68px]">
      <div className="w-full max-w-[420px] py-16">

        {/* Header */}
        <div className="mb-10">
          <span className="font-body text-[0.65rem] font-semibold tracking-[0.38em] uppercase text-g300 block mb-4">
            {modo === "login" ? "Área privada" : "Cuenta para la tienda"}
          </span>
          <h1 className="font-display text-[clamp(3rem,8vw,5.5rem)] leading-[0.88] text-foreground">
            {modo === "login" ? "Acceder" : "Crear cuenta"}
          </h1>
        </div>

        {/* Resultado del enlace del correo de verificación */}
        {verificado && !hashError && !recoveryMode && (
          <div className="border border-g700 bg-g900 border-l-2 border-l-foreground p-6 mb-8">
            <p className="font-body text-[0.82rem] text-g300 leading-[1.75]">
              <strong className="text-foreground">✓ Correo confirmado.</strong>{" "}
              Tu cuenta ya está activa.
              {session
                ? " Además tienes la sesión iniciada: puedes ir a la tienda o a tu cuenta."
                : " Inicia sesión para continuar."}
            </p>
          </div>
        )}
        {hashError && !recoveryMode && (
          <div className="border border-destructive/30 bg-destructive/10 p-6 mb-8">
            <p className="font-body text-[0.82rem] text-g300 leading-[1.75]">
              <strong className="text-foreground">El enlace del correo no funcionó</strong>{" "}
              (probablemente expiró o ya se había usado). Si era para confirmar tu
              cuenta, regístrate de nuevo con el mismo correo; si era para cambiar la
              contraseña, pide otro enlace con "¿Olvidaste tu contraseña?".
            </p>
          </div>
        )}

        {/* ── Recuperación de contraseña: definir la nueva ── */}
        {recoveryMode ? (
          <div className="border border-g700 bg-g900 p-8">
            {recoveryDone ? (
              <>
                <h2 className="font-display text-[1.8rem] leading-none text-foreground mb-4">
                  Contraseña actualizada
                </h2>
                <p className="font-body font-light text-[0.88rem] text-g300 leading-[1.85] mb-6">
                  Ya puedes usar tu nueva contraseña. Tu sesión quedó iniciada.
                </p>
                <div className="flex flex-wrap gap-3">
                  {(role === "master" || role === "admin") && (
                    <Link
                      to="/dashboard"
                      className="px-6 py-3 bg-foreground text-background font-body font-semibold text-[0.68rem] tracking-[0.2em] uppercase transition-opacity hover:opacity-80"
                    >
                      Ir al panel
                    </Link>
                  )}
                  <Link
                    to="/mi-cuenta"
                    className="px-6 py-3 border border-g700 text-g300 font-body font-semibold text-[0.68rem] tracking-[0.2em] uppercase hover:text-foreground hover:border-g300 transition-colors"
                  >
                    Mi cuenta
                  </Link>
                </div>
              </>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const pw = (form.elements.namedItem("new-password") as HTMLInputElement).value;
                  const pw2 = (form.elements.namedItem("new-password-2") as HTMLInputElement).value;
                  if (pw.length < 6) { setError("La contraseña debe tener al menos 6 caracteres."); return; }
                  if (pw !== pw2) { setError("Las contraseñas no coinciden."); return; }
                  setRecoveryLoading(true);
                  setError(null);
                  const { error: updError } = await supabase.auth.updateUser({ password: pw });
                  setRecoveryLoading(false);
                  if (updError) {
                    setError("No se pudo actualizar la contraseña. El enlace pudo haber expirado: pide uno nuevo.");
                  } else {
                    setRecoveryDone(true);
                  }
                }}
              >
                <h2 className="font-display text-[1.8rem] leading-none text-foreground mb-4">
                  Nueva contraseña
                </h2>
                <p className="font-body font-light text-[0.88rem] text-g300 leading-[1.85] mb-6">
                  Escribe la contraseña que usarás de ahora en adelante.
                </p>
                <div className="flex flex-col gap-4 mb-6">
                  <input
                    name="new-password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Nueva contraseña"
                    className="login-input"
                    disabled={recoveryLoading}
                  />
                  <input
                    name="new-password-2"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Repite la contraseña"
                    className="login-input"
                    disabled={recoveryLoading}
                  />
                </div>
                {error && (
                  <p className="font-body text-[0.78rem] text-destructive border border-destructive/30 bg-destructive/10 px-4 py-3 mb-4">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={recoveryLoading}
                  className="w-full py-3 bg-foreground text-background font-body font-semibold text-[0.72rem] tracking-[0.2em] uppercase transition-opacity hover:opacity-80 disabled:opacity-50"
                >
                  {recoveryLoading ? "Guardando…" : "Guardar contraseña"}
                </button>
              </form>
            )}
          </div>
        ) : (
        <>
        {/* Sesión ya activa (p. ej. modo vista previa): atajos directos */}
        {session && (
          <div className="border border-g700 bg-g900 p-6 mb-8">
            <p className="font-body text-[0.82rem] text-g300 leading-[1.75] mb-4">
              Ya tienes una sesión activa
              {role === "master" || role === "admin" ? " con acceso al panel" : ""}.
              No necesitas iniciar sesión de nuevo.
            </p>
            <div className="flex flex-wrap gap-3">
              {(role === "master" || role === "admin") && (
                <Link
                  to="/dashboard"
                  className="px-6 py-3 bg-foreground text-background font-body font-semibold text-[0.68rem] tracking-[0.2em] uppercase transition-opacity hover:opacity-80"
                >
                  Ir al panel
                </Link>
              )}
              <Link
                to="/mi-cuenta"
                className="px-6 py-3 border border-g700 text-g300 font-body font-semibold text-[0.68rem] tracking-[0.2em] uppercase hover:text-foreground hover:border-g300 transition-colors"
              >
                Mi cuenta
              </Link>
            </div>
          </div>
        )}

        {/* Base de datos sin configurar: avisar en vez de fallar en silencio */}
        {!supabaseReady && (
          <div className="border border-g700 bg-g900 border-l-2 border-l-g300 p-6 mb-8">
            <p className="font-body text-[0.82rem] text-g300 leading-[1.75]">
              <strong className="text-foreground">La base de datos aún no está conectada.</strong>{" "}
              Iniciar sesión o crear una cuenta no funcionará hasta pegar las
              claves de Supabase en el archivo <code className="text-foreground">.env</code>{" "}
              (instrucciones en el README, sección "Variables de entorno").
            </p>
          </div>
        )}

        {/* Selector login / registro */}
        <div className="grid grid-cols-2 mb-10 border border-g700">
          {(["login", "registro"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => cambiarModo(m)}
              className={`py-3 font-body text-[0.65rem] font-semibold tracking-[0.22em] uppercase transition-colors duration-300 ${
                modo === m
                  ? "bg-foreground text-background"
                  : "text-g300 hover:text-foreground"
              }`}
            >
              {m === "login" ? "Iniciar sesión" : "Registrarme"}
            </button>
          ))}
        </div>

        {registroOk ? (
          /* ── Registro exitoso ── */
          <div className="border border-g700 bg-g900 p-8">
            <h2 className="font-display text-[1.8rem] leading-none text-foreground mb-4">
              Revisa tu correo
            </h2>
            <p className="font-body font-light text-[0.88rem] text-g300 leading-[1.85] mb-6">
              Te enviamos un enlace para confirmar tu cuenta. Después de confirmarla
              podrás iniciar sesión y comprar en la tienda.
            </p>
            <button
              onClick={() => cambiarModo("login")}
              className="w-full py-3 bg-foreground text-background font-body font-semibold text-[0.72rem] tracking-[0.2em] uppercase transition-opacity hover:opacity-80"
            >
              Ir a iniciar sesión
            </button>
          </div>
        ) : (
          /* ── Form ── */
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">

            {modo === "registro" && (
              <div className="flex flex-col gap-2">
                <label htmlFor="full_name" className={inputLabelCls}>
                  Nombre completo
                </label>
                <input
                  id="full_name"
                  type="text"
                  autoComplete="name"
                  placeholder="Tu nombre y apellido"
                  {...register("full_name")}
                  className="login-input"
                />
                {errors.full_name && (
                  <span className="font-body text-[0.72rem] text-destructive">{errors.full_name.message}</span>
                )}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className={inputLabelCls}>
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
                <label htmlFor="password" className={inputLabelCls}>
                  Contraseña
                </label>
                {modo === "login" && (
                  <button
                    type="button"
                    onClick={() => { setResetMode(true); setError(null); setResetSent(false); }}
                    className="font-body text-[0.7rem] text-g300 hover:text-foreground transition-colors duration-300"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                )}
              </div>
              <input
                id="password"
                type="password"
                autoComplete={modo === "login" ? "current-password" : "new-password"}
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
              {loading
                ? (modo === "login" ? "Verificando…" : "Creando cuenta…")
                : (modo === "login" ? "Entrar" : "Crear mi cuenta")}
            </button>
          </form>
        )}

        {modo === "login" && !registroOk && (
          <>
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-g700" />
              <span className="font-body text-[0.65rem] tracking-[0.2em] uppercase text-g500">o</span>
              <div className="flex-1 h-px bg-g700" />
            </div>

            <p className="font-body text-[0.78rem] text-g300 text-center">
              ¿Acceso de prensa o contenido exclusivo?{" "}
              <a href="mailto:contact@jhonkarly.com" className="text-foreground hover:text-g300 transition-colors duration-300">
                Solicitar acceso
              </a>
            </p>
          </>
        )}
        </>
        )}

        <div className="mt-10 text-center">
          <Link to="/" className="font-body text-[0.65rem] font-semibold tracking-[0.22em] uppercase text-g500 hover:text-g300 transition-colors duration-300">
            ← Volver al inicio
          </Link>
        </div>

      </div>

      {/* ── Password Reset Modal ── */}
      {resetMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => !resetLoading && setResetMode(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Restablecer contraseña"
            className="relative w-full max-w-[420px] mx-4 bg-background border border-g700 p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="font-body text-[0.58rem] font-semibold tracking-[0.38em] uppercase text-g500 block mb-2">
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
