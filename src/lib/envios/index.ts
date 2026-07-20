import { CarrierAdapter } from "./types";
import { dhl } from "./dhl";
import { fedex } from "./fedex";

export * from "./types";

/** Paqueteras registradas, en orden de preferencia. */
const CARRIERS: CarrierAdapter[] = [dhl, fedex];

/** Paqueteras activas (con credenciales configuradas).
 *  Mientras esté vacío, la tienda solo ofrece envío nacional (Colombia). */
export const getCarriersActivos = (): CarrierAdapter[] =>
  CARRIERS.filter((c) => c.disponible);

export const hayEnvioInternacional = (): boolean => getCarriersActivos().length > 0;
