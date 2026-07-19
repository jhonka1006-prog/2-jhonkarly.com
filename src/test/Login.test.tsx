import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Login from "@/pages/Login";
import { AuthContext } from "@/context/AuthContext";
import type { UserRole } from "@/context/AuthContext";

/* ── Mock react-router-dom ─────────────────────────────────────────────── */
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const mod = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...mod,
    useNavigate: () => mockNavigate,
    useLocation:  () => ({ pathname: "/login", state: null }),
    Link: ({ to, children, ...props }: { to: string; children: React.ReactNode }) =>
      <a href={to} {...props}>{children}</a>,
  };
});

/* ── Mock supabase (reset de contraseña y enlaces de correo) ───────────── */
vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
      updateUser: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
  },
  supabaseReady: true,
}));

/* ── Helper ────────────────────────────────────────────────────────────── */
const mockSignIn = vi.fn();

const makeCtx = (signInImpl = mockSignIn) => ({
  session: null,
  user: null,
  profile: null,
  role: "public" as UserRole,
  loading: false,
  signIn: signInImpl,
  signOut: vi.fn(),
});

const renderLogin = (signInImpl = mockSignIn) =>
  render(
    <AuthContext.Provider value={makeCtx(signInImpl) as never}>
      <Login />
    </AuthContext.Provider>
  );

/* ── Tests ─────────────────────────────────────────────────────────────── */
describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza los campos de correo y contraseña", () => {
    renderLogin();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("muestra error de validación con correo inválido", async () => {
    renderLogin();

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "correo-invalido" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "password123" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /entrar/i }).closest("form")!);

    await waitFor(() => {
      expect(screen.getByText(/correo electrónico inválido/i)).toBeInTheDocument();
    });
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it("muestra error de validación con contraseña corta", async () => {
    renderLogin();

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "test@jhonkarly.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "123" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /entrar/i }).closest("form")!);

    await waitFor(() => {
      expect(screen.getByText(/al menos 6 caracteres/i)).toBeInTheDocument();
    });
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it("llama a signIn con los datos del formulario cuando son válidos", async () => {
    mockSignIn.mockResolvedValue({ error: null, role: "public" });

    renderLogin();

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "admin@jhonkarly.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "password123" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /entrar/i }).closest("form")!);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("admin@jhonkarly.com", "password123");
    });
  });

  it("muestra el mensaje de error cuando signIn falla", async () => {
    mockSignIn.mockResolvedValue({
      error: "Credenciales incorrectas. Inténtalo de nuevo.",
      role: null,
    });

    renderLogin();

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "wrong@email.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "wrongpassword" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /entrar/i }).closest("form")!);

    await waitFor(() => {
      expect(
        screen.getByText("Credenciales incorrectas. Inténtalo de nuevo.")
      ).toBeInTheDocument();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("redirige al dashboard cuando el rol es admin tras login exitoso", async () => {
    mockSignIn.mockResolvedValue({ error: null, role: "admin" });

    renderLogin();

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "admin@jhonkarly.com" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "securepass123" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /entrar/i }).closest("form")!);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard", { replace: true });
    });
  });

  it("abre el modal de recuperación al hacer click en '¿Olvidaste tu contraseña?'", async () => {
    renderLogin();

    fireEvent.click(screen.getByText(/olvidaste tu contraseña/i));

    await waitFor(() => {
      expect(screen.getByText(/restablecer contraseña/i)).toBeInTheDocument();
    });
  });
});
