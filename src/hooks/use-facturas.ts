import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  getBillingSettings,
  saveBillingSettings,
  createInvoiceForOrder,
  markInvoiceSent,
  BillingSettings,
} from "@/lib/api/facturas";
import { Order } from "@/lib/api/pedidos";

export const useBillingSettings = () =>
  useQuery({ queryKey: ["billing_settings"], queryFn: getBillingSettings });

export const useSaveBillingSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (changes: Partial<BillingSettings>) => saveBillingSettings(changes),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["billing_settings"] }),
  });
};

export const useCreateInvoice = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ order, settings }: { order: Order; settings: BillingSettings }) =>
      createInvoiceForOrder(order, settings),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["invoices"] }),
  });
};

/** Envía la factura por correo vía la Edge Function "enviar-factura".
    (Requiere desplegar la función y configurar RESEND_API_KEY en Supabase). */
export const useEnviarFactura = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, invoiceId }: { orderId: string; invoiceId: string }) => {
      const { error } = await supabase.functions.invoke("enviar-factura", {
        body: { order_id: orderId },
      });
      if (error) throw new Error(error.message);
      await markInvoiceSent(invoiceId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["invoices"] }),
  });
};
