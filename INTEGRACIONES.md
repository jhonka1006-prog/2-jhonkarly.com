# Integraciones pendientes — guía de activación

El código ya tiene el andamiaje listo para estas integraciones. Cada una
tiene su adaptador con la interfaz definida; activarla es implementar el
adaptador, poner las credenciales y cambiar `disponible: true`.

- Pagos: `src/lib/pagos/` (interfaz `PasarelaAdapter`)
- Envíos: `src/lib/envios/` (interfaz `CarrierAdapter`)

El checkout ya reacciona solo: si `getPasarelaActiva()` devuelve una pasarela,
aparece el botón "Tarjeta · PSE"; si `hayEnvioInternacional()` es true,
desaparece el aviso de "solo Colombia".

---

## 1. Pagos con tarjeta (Visa / Mastercard) y PSE

### Opción recomendada: Wompi (`src/lib/pagos/wompi.ts`)

Wompi es de Bancolombia y con un solo contrato cubre **tarjetas, PSE, Nequi
y botón Bancolombia**. Sin mensualidad; cobra comisión por transacción
(~2,65 % + IVA tarjetas, menor en PSE — confirmar tarifa vigente).

**Requisitos del comercio** (los tramita Jhonkarly, una sola vez):
RUT, cámara de comercio o registro como persona natural, cuenta bancaria
donde recibir los desembolsos.

**Pasos técnicos:**
1. Crear cuenta en <https://comercios.wompi.co> → obtener llaves `pub_prod_...`
   y `prv_prod_...` y el secreto de eventos.
2. `VITE_WOMPI_PUBLIC_KEY` en `.env` local y en Vercel (production+preview).
   La llave **privada** y el secreto de eventos van solo como secrets de
   Supabase Edge Functions (`supabase secrets set`), nunca con prefijo VITE_.
3. Implementar `iniciarPago` en `wompi.ts` con Web Checkout (redirección):
   `https://checkout.wompi.co/p/?public-key=…&currency=COP&amount-in-cents=…&reference=<orderId>&redirect-url=https://jhonkarly.com/tienda`
   (la referencia ES el id del pedido creado en `orders`).
4. Edge Function `wompi-webhook`: recibe `transaction.updated`, verifica la
   firma (checksum con el secreto de eventos) y actualiza
   `orders.status = 'pagado'` + `orders.payment_ref`.
5. `disponible: true` en `wompi.ts`. El botón aparece solo en el checkout.

### Alternativa: Mercado Pago (`src/lib/pagos/mercadopago.ts`)

Checkout Pro (redirección). La preferencia de pago se crea con el
ACCESS TOKEN privado → Edge Function `mp-preferencia` que devuelve
`init_point`. Webhook `mp-webhook` para confirmar. Mismo patrón que Wompi.

> **Regla de seguridad para ambas:** el navegador solo conoce llaves
> públicas. Todo lo que firme o consulte con llaves privadas vive en
> Edge Functions de Supabase.

---

## 2. Envíos internacionales (DHL / FedEx)

Interfaz común en `src/lib/envios/types.ts`: `cotizar()` y `crearGuia()`.

### DHL Express (`src/lib/envios/dhl.ts`)
1. Cuenta de negocio DHL Express Colombia + registro en
   <https://developer.dhl.com> (producto **MyDHL API**).
2. Credenciales → secrets de una Edge Function `envios` (nunca en el front).
3. Endpoints: `POST /rates` (cotización) y `POST /shipments`
   (crea guía y devuelve etiqueta PDF + tracking).

### FedEx (`src/lib/envios/fedex.ts`)
1. Cuenta FedEx + proyecto en <https://developer.fedex.com>
   (APIs **Rates & Transit Times** y **Ship**).
2. OAuth2 con client_id/client_secret (también en la Edge Function).
3. `POST /rate/v1/rates/quotes` y `POST /ship/v1/shipments`.

**Cambios de producto cuando se active** (ya previstos, no implementados):
- El formulario de checkout gana selector de país (`DireccionEnvio.pais`).
- La cotización se muestra antes de confirmar y se suma al total.
- El panel de pedidos gana botón "Generar guía" (etiqueta PDF + nº rastreo).
- Aduanas: los envíos internacionales requieren declarar contenido y valor;
  DHL/FedEx lo piden en el API de shipment (campo commodities).

---

## 3. Ya activo (referencia)

| Integración | Estado |
|---|---|
| Supabase (auth, DB, storage) | ✅ activo — proyecto `jhonkarly-com` |
| Vercel (hosting, deploy por git) | ✅ activo |
| Resend (envío de facturas por correo) | ⏳ Edge Function lista, falta cuenta Resend + `RESEND_API_KEY` |
