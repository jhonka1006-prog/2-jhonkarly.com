import { supabase } from "@/lib/supabase";
import { Order } from "@/lib/api/pedidos";

export interface BillingSettings {
  id: number;
  business_name: string;
  nit: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  regimen: string;
  iva_rate: number;
  invoice_prefix: string;
  dian_resolution: string | null;
}

export interface Invoice {
  id: string;
  number: number;
  order_id: string;
  user_id: string | null;
  issued_at: string;
  subtotal: number;
  iva: number;
  total: number;
  cufe: string | null;
  sent_at: string | null;
}

export const numeroFactura = (s: BillingSettings, inv: Invoice) =>
  `${s.invoice_prefix}-${String(inv.number).padStart(5, "0")}`;

export async function getBillingSettings(): Promise<BillingSettings> {
  const { data, error } = await supabase.from("billing_settings").select("*").eq("id", 1).single();
  if (error) throw new Error(error.message);
  return data as BillingSettings;
}

export async function saveBillingSettings(changes: Partial<BillingSettings>) {
  const { error } = await supabase.from("billing_settings").update(changes).eq("id", 1);
  if (error) throw new Error(error.message);
}

export async function getInvoiceByOrder(orderId: string): Promise<Invoice | null> {
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("order_id", orderId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Invoice) ?? null;
}

/** Crea la factura de un pedido (si no existe) con IVA discriminado
    según la tarifa configurada. Los precios de la tienda incluyen IVA. */
export async function createInvoiceForOrder(order: Order, settings: BillingSettings): Promise<Invoice> {
  const existente = await getInvoiceByOrder(order.id);
  if (existente) return existente;

  const rate = Number(settings.iva_rate) || 0;
  const subtotal = rate > 0 ? Math.round(order.total / (1 + rate)) : order.total;
  const iva = order.total - subtotal;

  const { data, error } = await supabase
    .from("invoices")
    .insert({ order_id: order.id, user_id: order.user_id, subtotal, iva, total: order.total })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Invoice;
}

export async function markInvoiceSent(invoiceId: string) {
  const { error } = await supabase
    .from("invoices")
    .update({ sent_at: new Date().toISOString() })
    .eq("id", invoiceId);
  if (error) throw new Error(error.message);
}
