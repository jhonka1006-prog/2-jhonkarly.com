import { render, screen, within } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Footer from "@/components/Footer";

vi.mock("react-router-dom", async (importOriginal) => {
  const mod = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...mod,
    Link: ({ to, children, ...props }: { to: string; children: React.ReactNode }) =>
      <a href={to} {...props}>{children}</a>,
  };
});

describe("Footer", () => {
  it("renderiza el nombre del atleta", () => {
    render(<Footer />);
    // El footer tiene el nombre en el link de marca y en el copyright — usamos getAllBy
    const matches = screen.getAllByText(/jhonkarly [áa]lvarez/i);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("muestra el correo de contacto correcto (contact@ con t)", () => {
    render(<Footer />);
    const emailLink = screen.getByRole("link", { name: /contact@jhonkarly\.com/i });
    expect(emailLink).toHaveAttribute("href", "mailto:contact@jhonkarly.com");
  });

  it("muestra el año de copyright 2026", () => {
    render(<Footer />);
    expect(screen.getByText(/2026/)).toBeInTheDocument();
  });

  it("tiene links de navegación principales", () => {
    render(<Footer />);
    // Scope al nav secundario para evitar colisión con el link de marca
    const nav = screen.getByRole("navigation", { name: /navegación secundaria/i });
    expect(within(nav).getByText("Inicio")).toBeInTheDocument();
    expect(within(nav).getByText("Sobre mí")).toBeInTheDocument();
    expect(within(nav).getByText("Tienda")).toBeInTheDocument();
    expect(within(nav).getByText("Prensa")).toBeInTheDocument();
  });

  it("tiene links a redes sociales con aria-label", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /instagram/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /youtube/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /tiktok/i })).toBeInTheDocument();
  });

  it("Instagram apunta al handle correcto", () => {
    render(<Footer />);
    const ig = screen.getByRole("link", { name: /instagram/i });
    expect(ig).toHaveAttribute("href", expect.stringContaining("instagram.com/jhonkarly__"));
  });

  it("links de redes sociales se abren en pestaña nueva con rel correcto", () => {
    render(<Footer />);
    const ig = screen.getByRole("link", { name: /instagram/i });
    expect(ig).toHaveAttribute("target", "_blank");
    expect(ig).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("tiene links legales a Privacidad y Términos", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /privacidad/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /términos/i })).toBeInTheDocument();
  });
});
