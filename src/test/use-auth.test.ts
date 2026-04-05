import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useAuth } from "@/hooks/use-auth";
import { AuthContext } from "@/context/AuthContext";
import type { UserRole } from "@/context/AuthContext";
import type { Session, User } from "@supabase/supabase-js";
import { createElement } from "react";

const mockSession = { user: { id: "u1" } } as unknown as Session;
const mockUser = { id: "u1", email: "test@test.com" } as unknown as User;

const makeProvider = (value: {
  session: Session | null;
  user: User | null;
  profile: null;
  role: UserRole;
  loading: boolean;
  signIn: () => Promise<{ error: null; role: UserRole }>;
  signOut: () => Promise<void>;
}) =>
  ({ children }: { children: React.ReactNode }) =>
    createElement(AuthContext.Provider, { value }, children);

describe("useAuth", () => {
  it("lanza error cuando se usa fuera de AuthProvider", () => {
    // Suprimir el log de error de React durante el test
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth debe usarse dentro de <AuthProvider>"
    );

    spy.mockRestore();
  });

  it("devuelve el valor del contexto cuando está dentro de AuthProvider", () => {
    const contextValue = {
      session: mockSession,
      user: mockUser,
      profile: null,
      role: "admin" as UserRole,
      loading: false,
      signIn: async () => ({ error: null, role: "admin" as UserRole }),
      signOut: async () => {},
    };

    const { result } = renderHook(() => useAuth(), {
      wrapper: makeProvider(contextValue),
    });

    expect(result.current.role).toBe("admin");
    expect(result.current.session).toBe(mockSession);
    expect(result.current.loading).toBe(false);
  });

  it("expone signIn y signOut como funciones", () => {
    const contextValue = {
      session: null,
      user: null,
      profile: null,
      role: "public" as UserRole,
      loading: false,
      signIn: async () => ({ error: null, role: "public" as UserRole }),
      signOut: async () => {},
    };

    const { result } = renderHook(() => useAuth(), {
      wrapper: makeProvider(contextValue),
    });

    expect(typeof result.current.signIn).toBe("function");
    expect(typeof result.current.signOut).toBe("function");
  });
});
