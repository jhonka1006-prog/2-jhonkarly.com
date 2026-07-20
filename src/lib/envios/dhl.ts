import { CarrierAdapter } from "./types";

/* ════════════════════════════════════════════════════════════
   Adaptador DHL Express — PRE-INTEGRACIÓN, aún inactivo.

   Para activarlo (pasos completos en INTEGRACIONES.md):
   1. Cuenta de negocio DHL Express + acceso API en
      https://developer.dhl.com (producto "DHL Express - MyDHL API").
   2. Las credenciales son privadas → cotización y creación de guías
      deben vivir en una Edge Function (supabase/functions/envios),
      nunca en el navegador. Este adaptador la llamará vía fetch.
   3. Endpoints principales: POST /rates (cotizar) y
      POST /shipments (guía + etiqueta PDF).
   4. Cambiar `disponible` a true.
   ════════════════════════════════════════════════════════════ */

export const dhl: CarrierAdapter = {
  nombre: "DHL Express",
  disponible: false, // ← poner true al completar los pasos de arriba

  async cotizar() {
    throw new Error("Adaptador DHL pendiente de implementación (ver INTEGRACIONES.md).");
  },

  async crearGuia() {
    throw new Error("Adaptador DHL pendiente de implementación (ver INTEGRACIONES.md).");
  },
};
