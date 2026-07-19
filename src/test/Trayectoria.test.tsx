import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Trayectoria from "@/pages/Trayectoria";

/* Sin VITE_SUPABASE_URL configurada (como en este entorno de test),
   la página debe mostrar igualmente los hitos y logros de respaldo. */
const renderPage = () => {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={qc}>
      <Trayectoria />
    </QueryClientProvider>
  );
};

describe("Trayectoria (sin Supabase configurado)", () => {
  it("muestra la descripción de la trayectoria", () => {
    renderPage();
    expect(screen.getByText(/ha construido su trayectoria desde la disciplina/i)).toBeInTheDocument();
  });

  it("muestra los hitos del recorrido, incluidas las próximas competencias", async () => {
    renderPage();
    expect(await screen.findByText("Juegos Paralímpicos — Los Ángeles")).toBeInTheDocument();
    expect(screen.getAllByText("World Series Abu Dhabi").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Inicio en la Natación")).toBeInTheDocument();
    expect(screen.getAllByText("VI Juegos Paranacionales").length).toBeGreaterThanOrEqual(1);
  });

  it("muestra la sección de logros con sus tarjetas", async () => {
    renderPage();
    expect(await screen.findByText("Logros")).toBeInTheDocument();
    expect(screen.getByText("Preselección Colombia")).toBeInTheDocument();
    expect(screen.getByText("Clasificatorios a Juegos Nacionales")).toBeInTheDocument();
  });

  it("muestra las estadísticas del atleta", () => {
    renderPage();
    expect(screen.getByText("14")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("COL")).toBeInTheDocument();
  });
});
