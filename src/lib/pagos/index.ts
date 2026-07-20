import { PasarelaAdapter } from "./types";
import { wompi } from "./wompi";
import { mercadopago } from "./mercadopago";

export * from "./types";

/** Pasarelas registradas, en orden de preferencia. */
const PASARELAS: PasarelaAdapter[] = [wompi, mercadopago];

/** La primera pasarela activa, o null si ninguna está configurada.
 *  El checkout usa esto para mostrar (o no) el pago con tarjeta/PSE. */
export const getPasarelaActiva = (): PasarelaAdapter | null =>
  PASARELAS.find((p) => p.disponible) ?? null;
