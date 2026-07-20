import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "@/context/CartContext";
import { Product } from "@/lib/api/tienda";

const producto = (id: string, price: number): Product => ({
  id,
  name: `Producto ${id}`,
  description: "",
  price,
  image_urls: [],
  buy_url: null,
  available: true,
  sort_order: 0,
  created_at: "2026-01-01",
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe("CartContext", () => {
  beforeEach(() => localStorage.clear());

  it("agrega productos y acumula cantidades del mismo producto", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.agregar(producto("a", 50000)));
    act(() => result.current.agregar(producto("a", 50000)));
    act(() => result.current.agregar(producto("b", 30000), 2));
    expect(result.current.items).toHaveLength(2);
    expect(result.current.count).toBe(4);
    expect(result.current.subtotal).toBe(50000 * 2 + 30000 * 2);
  });

  it("cambia cantidades y elimina al llegar a cero", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.agregar(producto("a", 10000)));
    act(() => result.current.cambiarQty("a", 5));
    expect(result.current.subtotal).toBe(50000);
    act(() => result.current.cambiarQty("a", 0));
    expect(result.current.items).toHaveLength(0);
  });

  it("quita y vacía", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.agregar(producto("a", 10000)));
    act(() => result.current.agregar(producto("b", 20000)));
    act(() => result.current.quitar("a"));
    expect(result.current.items.map((i) => i.product_id)).toEqual(["b"]);
    act(() => result.current.vaciar());
    expect(result.current.count).toBe(0);
  });

  it("persiste en localStorage y se restaura", () => {
    const primera = renderHook(() => useCart(), { wrapper });
    act(() => primera.result.current.agregar(producto("a", 15000), 3));
    primera.unmount();

    const segunda = renderHook(() => useCart(), { wrapper });
    expect(segunda.result.current.count).toBe(3);
    expect(segunda.result.current.subtotal).toBe(45000);
  });
});
