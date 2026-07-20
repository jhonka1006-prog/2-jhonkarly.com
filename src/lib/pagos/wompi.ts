import { PasarelaAdapter } from "./types";

/* ════════════════════════════════════════════════════════════
   Adaptador Wompi (Bancolombia) — PRE-INTEGRACIÓN, aún inactivo.

   Wompi es la opción recomendada para Colombia: en un solo
   contrato cubre tarjetas Visa/Mastercard, PSE, Nequi y botón
   Bancolombia, con Web Checkout (redirección) que no requiere
   certificación PCI propia.

   Para activarlo (pasos completos en INTEGRACIONES.md):
   1. Crear cuenta de comercio en https://comercios.wompi.co
   2. Copiar la llave pública a VITE_WOMPI_PUBLIC_KEY en .env y Vercel.
   3. Implementar iniciarPago con el Web Checkout:
      https://checkout.wompi.co/p/?public-key=...&currency=COP
      &amount-in-cents=...&reference=<orderId>&redirect-url=...
   4. Crear la Edge Function `wompi-webhook` (supabase/functions/)
      que reciba el evento transaction.updated, verifique la firma
      con el secreto de eventos y marque orders.status = "pagado".
   5. Cambiar `disponible` a true.
   ════════════════════════════════════════════════════════════ */

const PUBLIC_KEY = import.meta.env.VITE_WOMPI_PUBLIC_KEY as string | undefined;

export const wompi: PasarelaAdapter = {
  nombre: "Wompi",
  disponible: false, // ← poner true al completar los pasos de arriba
  metodos: ["tarjeta", "pse"],

  async iniciarPago() {
    if (!PUBLIC_KEY) {
      throw new Error("Wompi no está configurado: falta VITE_WOMPI_PUBLIC_KEY.");
    }
    throw new Error("Adaptador Wompi pendiente de implementación (ver INTEGRACIONES.md).");
  },
};
