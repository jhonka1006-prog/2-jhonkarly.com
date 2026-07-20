import { CarrierAdapter } from "./types";

/* ════════════════════════════════════════════════════════════
   Adaptador FedEx — PRE-INTEGRACIÓN, aún inactivo.

   Para activarlo (pasos completos en INTEGRACIONES.md):
   1. Cuenta FedEx + proyecto API en https://developer.fedex.com
      (APIs "Rates & Transit Times" y "Ship").
   2. Igual que DHL: credenciales privadas → Edge Function
      (supabase/functions/envios); el navegador nunca las ve.
   3. FedEx usa OAuth2 (token con client_id/client_secret) y luego
      POST /rate/v1/rates/quotes y POST /ship/v1/shipments.
   4. Cambiar `disponible` a true.
   ════════════════════════════════════════════════════════════ */

export const fedex: CarrierAdapter = {
  nombre: "FedEx",
  disponible: false, // ← poner true al completar los pasos de arriba

  async cotizar() {
    throw new Error("Adaptador FedEx pendiente de implementación (ver INTEGRACIONES.md).");
  },

  async crearGuia() {
    throw new Error("Adaptador FedEx pendiente de implementación (ver INTEGRACIONES.md).");
  },
};
