import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "@/context/AuthContext";

/* ── Mock Supabase ─────────────────────────────────────────────────────── */
vi.mock("@/lib/supabase", () => {
  const makeChain = (resolved: { data: unknown; error: unknown }) => {
    const chain: Record<string, unknown> = {};
    chain.select = vi.fn().mockReturnValue(chain);
    chain.eq    = vi.fn().mockReturnValue(chain);
    chain.single = vi.fn().mockResolvedValue(resolved);
    return chain;
  };

  return {
    supabase: {
      auth: {
        getSession:        vi.fn().mockResolvedValue({ data: { session: null } }),
        onAuthStateChange: vi.fn(() => ({
          data: { subscription: { unsubscribe: vi.fn() } },
        })),
        signInWithPassword: vi.fn(),
        signOut:           vi.fn().mockResolvedValue({}),
      },
      from: vi.fn(() => makeChain({ data: null, error: null })),
    },
    supabaseReady: true,
  };
});

/* ── Consumer helper ───────────────────────────────────────────────────── */
const Consumer = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) return null;
  return (
    <>
      <div data-testid="loading">{String(ctx.loading)}</div>
      <div data-testid="role">{ctx.role}</div>
      <div data-testid="session">{ctx.session ? "con-sesion" : "sin-sesion"}</div>
    </>
  );
};

/* ── Import after mock ─────────────────────────────────────────────────── */
import { supabase } from "@/lib/supabase";

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
    } as never);
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    } as never);
  });

  it("empieza con loading=true", () => {
    // Usar una promesa que nunca resuelve para capturar el estado inicial
    vi.mocked(supabase.auth.getSession).mockReturnValue(new Promise(() => {}) as never);

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    expect(screen.getByTestId("loading").textContent).toBe("true");
  });

  it("loading pasa a false y role='public' cuando no hay sesión", async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });

    expect(screen.getByTestId("role").textContent).toBe("public");
    expect(screen.getByTestId("session").textContent).toBe("sin-sesion");
  });

  it("role refleja el perfil del usuario cuando hay sesión", async () => {
    const mockSession = {
      user: { id: "admin-123", email: "admin@jhonkarly.com" },
    };

    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession },
    } as never);

    const makeChain = (data: unknown) => {
      const chain: Record<string, unknown> = {};
      chain.select = vi.fn().mockReturnValue(chain);
      chain.eq     = vi.fn().mockReturnValue(chain);
      chain.single = vi.fn().mockResolvedValue({ data, error: null });
      return chain;
    };
    vi.mocked(supabase.from).mockReturnValue(
      makeChain({ id: "admin-123", role: "admin", full_name: "Jhonkarly" }) as never
    );

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("role").textContent).toBe("admin");
    });
  });

  it("signIn devuelve error de credenciales cuando Supabase falla con 'Invalid login credentials'", async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: "Invalid login credentials" },
    } as never);

    let signIn!: (e: string, p: string) => Promise<{ error: string | null; role: string | null }>;
    const Capturer = () => {
      const ctx = useContext(AuthContext)!;
      signIn = ctx.signIn;
      return null;
    };

    render(
      <AuthProvider>
        <Capturer />
      </AuthProvider>
    );

    await waitFor(() => expect(signIn).toBeDefined());
    const result = await signIn("bad@email.com", "wrongpass");

    expect(result.error).toBe("Credenciales incorrectas. Inténtalo de nuevo.");
    expect(result.role).toBeNull();
  });

  it("signIn devuelve error de red cuando Supabase falla con otro mensaje", async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: "Network request failed" },
    } as never);

    let signIn!: (e: string, p: string) => Promise<{ error: string | null; role: string | null }>;
    const Capturer = () => {
      const ctx = useContext(AuthContext)!;
      signIn = ctx.signIn;
      return null;
    };

    render(
      <AuthProvider>
        <Capturer />
      </AuthProvider>
    );

    await waitFor(() => expect(signIn).toBeDefined());
    const result = await signIn("test@email.com", "password123");

    expect(result.error).toBe("Error de conexión. Verifica tu red e inténtalo de nuevo.");
  });

  it("signIn devuelve role cuando el login es exitoso", async () => {
    const mockUser = { id: "user-1", email: "user@test.com" };
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: mockUser, session: {} },
      error: null,
    } as never);

    const makeChain = (data: unknown) => {
      const chain: Record<string, unknown> = {};
      chain.select = vi.fn().mockReturnValue(chain);
      chain.eq     = vi.fn().mockReturnValue(chain);
      chain.single = vi.fn().mockResolvedValue({ data, error: null });
      return chain;
    };
    vi.mocked(supabase.from).mockReturnValue(
      makeChain({ role: "prensa" }) as never
    );

    let signIn!: (e: string, p: string) => Promise<{ error: string | null; role: string | null }>;
    const Capturer = () => {
      const ctx = useContext(AuthContext)!;
      signIn = ctx.signIn;
      return null;
    };

    render(
      <AuthProvider>
        <Capturer />
      </AuthProvider>
    );

    await waitFor(() => expect(signIn).toBeDefined());
    const result = await signIn("prensa@test.com", "password123");

    expect(result.error).toBeNull();
    expect(result.role).toBe("prensa");
  });
});
