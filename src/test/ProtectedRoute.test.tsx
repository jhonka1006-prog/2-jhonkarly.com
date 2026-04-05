import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthContext } from "@/context/AuthContext";
import type { UserRole } from "@/context/AuthContext";
import type { Session, User } from "@supabase/supabase-js";

/* ── Mock react-router-dom ─────────────────────────────────────────────── */
vi.mock("react-router-dom", async (importOriginal) => {
  const mod = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...mod,
    Navigate: ({ to }: { to: string }) => (
      <div data-testid="redirect" data-to={to} />
    ),
    useLocation: () => ({
      pathname: "/ruta-protegida",
      state: null,
      key: "default",
      hash: "",
      search: "",
    }),
  };
});

/* ── Helpers ───────────────────────────────────────────────────────────── */
const mockSession = { user: { id: "u1" } } as unknown as Session;
const mockUser = { id: "u1" } as unknown as User;

const makeCtx = (overrides: {
  session?: Session | null;
  user?: User | null;
  role?: UserRole;
  loading?: boolean;
}) => ({
  session: null as Session | null,
  user: null as User | null,
  profile: null,
  role: "public" as UserRole,
  loading: false,
  signIn: vi.fn(),
  signOut: vi.fn(),
  ...overrides,
});

const wrap = (ctxOverrides: Parameters<typeof makeCtx>[0], children: React.ReactNode) =>
  render(
    <AuthContext.Provider value={makeCtx(ctxOverrides)}>
      {children}
    </AuthContext.Provider>
  );

/* ── Tests ─────────────────────────────────────────────────────────────── */
describe("ProtectedRoute", () => {
  it("muestra spinner de carga cuando loading=true", () => {
    wrap({ loading: true, session: null }, (
      <ProtectedRoute>
        <div>contenido protegido</div>
      </ProtectedRoute>
    ));

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByText("contenido protegido")).not.toBeInTheDocument();
  });

  it("redirige a /login cuando no hay sesión", () => {
    wrap({ session: null }, (
      <ProtectedRoute>
        <div>contenido protegido</div>
      </ProtectedRoute>
    ));

    const redirect = screen.getByTestId("redirect");
    expect(redirect).toHaveAttribute("data-to", "/login");
    expect(screen.queryByText("contenido protegido")).not.toBeInTheDocument();
  });

  it("renderiza children cuando hay sesión y no hay restricción de rol", () => {
    wrap({ session: mockSession, user: mockUser, role: "public" }, (
      <ProtectedRoute>
        <div>contenido protegido</div>
      </ProtectedRoute>
    ));

    expect(screen.getByText("contenido protegido")).toBeInTheDocument();
    expect(screen.queryByTestId("redirect")).not.toBeInTheDocument();
  });

  it("renderiza children cuando el rol coincide con allowedRoles", () => {
    wrap({ session: mockSession, user: mockUser, role: "admin" }, (
      <ProtectedRoute allowedRoles={["admin", "prensa"]}>
        <div>panel de admin</div>
      </ProtectedRoute>
    ));

    expect(screen.getByText("panel de admin")).toBeInTheDocument();
  });

  it("redirige a /acceso-denegado cuando el rol no está en allowedRoles", () => {
    wrap({ session: mockSession, user: mockUser, role: "public" }, (
      <ProtectedRoute allowedRoles={["admin"]}>
        <div>solo admin</div>
      </ProtectedRoute>
    ));

    const redirect = screen.getByTestId("redirect");
    expect(redirect).toHaveAttribute("data-to", "/acceso-denegado");
    expect(screen.queryByText("solo admin")).not.toBeInTheDocument();
  });

  it("usuario premium puede acceder a ruta premium", () => {
    wrap({ session: mockSession, user: mockUser, role: "premium" }, (
      <ProtectedRoute allowedRoles={["admin", "premium"]}>
        <div>contenido exclusivo</div>
      </ProtectedRoute>
    ));

    expect(screen.getByText("contenido exclusivo")).toBeInTheDocument();
  });
});
