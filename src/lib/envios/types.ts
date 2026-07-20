/* ════════════════════════════════════════════════════════════
   Pre-integración de paqueteras para envíos internacionales
   (DHL Express, FedEx…). Contrato común: cotizar y generar guía.
   Guía de activación: INTEGRACIONES.md en la raíz del repo.
   ════════════════════════════════════════════════════════════ */

export interface DireccionEnvio {
  pais: string; // código ISO-2, ej. "CO", "US", "ES"
  ciudad: string;
  direccion: string;
  codigoPostal?: string;
}

export interface PaqueteEnvio {
  pesoKg: number;
  largoCm: number;
  anchoCm: number;
  altoCm: number;
}

export interface CotizacionEnvio {
  carrier: string;
  servicio: string; // ej. "DHL Express Worldwide"
  costoCop: number;
  diasEstimados: number;
}

export interface GuiaEnvio {
  carrier: string;
  numeroGuia: string;
  urlRastreo: string;
  urlEtiqueta: string; // PDF de la etiqueta para imprimir
}

export interface CarrierAdapter {
  /** Nombre visible ("DHL Express", "FedEx"…) */
  nombre: string;
  /** true solo cuando hay credenciales en el backend y el adaptador está implementado */
  disponible: boolean;
  cotizar(destino: DireccionEnvio, paquete: PaqueteEnvio): Promise<CotizacionEnvio[]>;
  crearGuia(orderId: string, destino: DireccionEnvio, paquete: PaqueteEnvio): Promise<GuiaEnvio>;
}
