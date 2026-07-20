import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Product } from "@/lib/api/tienda";

/* ════════════════════════════════════════════════════════════
   Carrito de la tienda.
   Guarda un "snapshot" del producto (id, nombre, precio, foto)
   en vez del objeto completo: sobrevive en localStorage aunque
   el producto cambie o se agote entre visitas — el precio final
   siempre se valida al crear el pedido con los datos del carrito.
   ════════════════════════════════════════════════════════════ */

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  qty: number;
  image: string | null;
}

interface CartContextValue {
  items: CartItem[];
  /** Cantidad total de unidades (para el badge del botón flotante) */
  count: number;
  subtotal: number;
  abierto: boolean;
  setAbierto: (v: boolean) => void;
  agregar: (producto: Product, qty?: number) => void;
  quitar: (productId: string) => void;
  cambiarQty: (productId: string, qty: number) => void;
  vaciar: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "jk-carrito";
const MAX_QTY = 20;

const leerCarrito = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed.filter((i) => i.product_id && i.qty > 0) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(leerCarrito);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* localStorage lleno o bloqueado: el carrito sigue en memoria */
    }
  }, [items]);

  const agregar = (producto: Product, qty = 1) => {
    setItems((prev) => {
      const existente = prev.find((i) => i.product_id === producto.id);
      if (existente) {
        return prev.map((i) =>
          i.product_id === producto.id
            ? { ...i, qty: Math.min(MAX_QTY, i.qty + qty) }
            : i
        );
      }
      return [
        ...prev,
        {
          product_id: producto.id,
          name: producto.name,
          price: producto.price,
          qty: Math.min(MAX_QTY, qty),
          image: producto.image_urls[0] ?? null,
        },
      ];
    });
  };

  const quitar = (productId: string) =>
    setItems((prev) => prev.filter((i) => i.product_id !== productId));

  const cambiarQty = (productId: string, qty: number) =>
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.product_id !== productId)
        : prev.map((i) =>
            i.product_id === productId ? { ...i, qty: Math.min(MAX_QTY, qty) } : i
          )
    );

  const vaciar = () => setItems([]);

  const { count, subtotal } = useMemo(
    () => ({
      count: items.reduce((acc, i) => acc + i.qty, 0),
      subtotal: items.reduce((acc, i) => acc + i.price * i.qty, 0),
    }),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, count, subtotal, abierto, setAbierto, agregar, quitar, cambiarQty, vaciar }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
};
