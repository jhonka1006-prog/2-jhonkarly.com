/* ════════════════════════════════════════════════════════════
   Pre-integración de pasarelas de pago (tarjetas Visa/Mastercard
   y PSE). Contrato común para que activar una pasarela sea solo
   implementar un adaptador y poner sus claves en el .env.
   Guía de activación: INTEGRACIONES.md en la raíz del repo.
   ════════════════════════════════════════════════════════════ */

export type MetodoPasarela = "tarjeta" | "pse";

export interface DatosPago {
  /** Id del pedido ya creado en la tabla orders (la referencia de pago) */
  orderId: string;
  /** Total en COP (pesos, sin centavos) */
  totalCop: number;
  email: string;
  metodo: MetodoPasarela;
}

export interface ResultadoPago {
  /** URL externa a la que se redirige al cliente para completar el pago */
  urlPago: string;
  /** Referencia de la transacción en la pasarela (se guarda en orders.payment_ref) */
  referencia: string;
}

export interface PasarelaAdapter {
  /** Nombre visible ("Wompi", "MercadoPago"…) */
  nombre: string;
  /** true solo cuando las claves están en el .env y el adaptador está implementado */
  disponible: boolean;
  /** Métodos que soporta esta pasarela */
  metodos: MetodoPasarela[];
  /** Crea la transacción y devuelve la URL de pago externa */
  iniciarPago(datos: DatosPago): Promise<ResultadoPago>;
}
