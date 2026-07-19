import { supabase } from "@/lib/supabase";

export type OrderStatus = "pendiente" | "pagado" | "enviado" | "entregado" | "cancelado";
export type PaymentMethod = "transferencia" | "contra_entrega" | "pasarela";

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_id_doc: string | null; // cédula / NIT para la factura
  address: string;
  city: string;
  department: string;
  notes: string | null;
  items: OrderItem[];
  total: number;
  payment_method: PaymentMethod;
  payment_ref: string | null;
  status: OrderStatus;
  created_at: string;
}

export type NewOrder = Omit<Order, "id" | "status" | "created_at" | "payment_ref">;

export const ESTADOS: Record<OrderStatus, string> = {
  pendiente: "Pendiente de pago",
  pagado: "Pago confirmado",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export const METODOS_PAGO: Record<PaymentMethod, string> = {
  transferencia: "Transferencia (Nequi / Bancolombia)",
  contra_entrega: "Contra entrega",
  pasarela: "Pasarela de pago",
};

export async function createOrder(order: NewOrder): Promise<Order> {
  const { data, error } = await supabase.from("orders").insert(order).select().single();
  if (error) throw new Error(error.message);
  return data as Order;
}

/** Pedidos del usuario autenticado (RLS limita a los propios) */
export async function getMyOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Order[];
}

/** Todos los pedidos (solo staff: RLS lo garantiza) */
export async function getAllOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Order[];
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}
