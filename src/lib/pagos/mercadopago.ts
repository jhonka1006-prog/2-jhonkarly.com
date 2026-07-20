import { PasarelaAdapter } from "./types";

/* ════════════════════════════════════════════════════════════
   Adaptador Mercado Pago — PRE-INTEGRACIÓN, aún inactivo.

   Alternativa a Wompi. También cubre Visa/Mastercard y PSE en
   Colombia mediante Checkout Pro (redirección a una "preferencia"
   de pago creada desde el backend).

   Para activarlo (pasos completos en INTEGRACIONES.md):
   1. Cuenta en https://www.mercadopago.com.co/developers
   2. La creación de la preferencia usa el ACCESS TOKEN privado →
      debe hacerse en una Edge Function (supabase/functions/mp-preferencia),
      nunca en el navegador. La función devuelve init_point (URL de pago).
   3. Edge Function `mp-webhook` para confirmar pagos (orders.status).
   4. Cambiar `disponible` a true.
   ════════════════════════════════════════════════════════════ */

export const mercadopago: PasarelaAdapter = {
  nombre: "Mercado Pago",
  disponible: false, // ← poner true al completar los pasos de arriba
  metodos: ["tarjeta", "pse"],

  async iniciarPago() {
    throw new Error("Adaptador Mercado Pago pendiente de implementación (ver INTEGRACIONES.md).");
  },
};
