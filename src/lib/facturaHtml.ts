import { Order, METODOS_PAGO } from "@/lib/api/pedidos";
import { BillingSettings, Invoice, numeroFactura } from "@/lib/api/facturas";
import { fmtPrecio } from "@/lib/api/tienda";

const fmtFecha = (iso: string) =>
  new Date(iso).toLocaleString("es-CO", { dateStyle: "long", timeStyle: "short" });

/** Genera el HTML imprimible (A4) de la factura de venta.
    Contenido mínimo según normativa colombiana: identificación del
    vendedor y del comprador, consecutivo, fecha, detalle, IVA
    discriminado, forma de pago y resolución DIAN si aplica. */
export function generarFacturaHTML(order: Order, invoice: Invoice, s: BillingSettings): string {
  const num = numeroFactura(s, invoice);
  const filas = order.items
    .map(
      (i) => `<tr>
        <td>${i.name}</td>
        <td class="c">${i.qty}</td>
        <td class="r">${fmtPrecio(i.price)}</td>
        <td class="r">${fmtPrecio(i.price * i.qty)}</td>
      </tr>`
    )
    .join("");

  const tarifaIva = Number(s.iva_rate) || 0;

  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>${num} — ${s.business_name}</title>
<style>
  @page { size: A4; margin: 18mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; color: #111; font-size: 13px; line-height: 1.55; }
  .head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #111; padding-bottom: 16px; margin-bottom: 20px; }
  h1 { font-size: 20px; letter-spacing: 3px; text-transform: uppercase; }
  .lbl { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: #666; font-family: Arial, sans-serif; }
  .num { font-size: 18px; font-weight: bold; text-align: right; }
  .cols { display: flex; gap: 24px; margin-bottom: 20px; }
  .col { flex: 1; border: 1px solid #ccc; padding: 12px 14px; }
  .col p { margin: 1px 0; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  th { font-family: Arial, sans-serif; font-size: 9px; letter-spacing: 2px; text-transform: uppercase; text-align: left; border-bottom: 1px solid #111; padding: 8px 6px; }
  td { padding: 8px 6px; border-bottom: 1px solid #ddd; vertical-align: top; }
  .c { text-align: center; } .r { text-align: right; }
  .tot { width: 280px; margin-left: auto; }
  .tot td { border: none; padding: 3px 6px; }
  .tot .grand td { border-top: 2px solid #111; font-size: 16px; font-weight: bold; padding-top: 8px; }
  .meta { margin-top: 18px; font-size: 12px; }
  .note { margin-top: 26px; padding: 10px 12px; border: 1px solid #ccc; font-size: 10.5px; color: #555; font-family: Arial, sans-serif; }
  .foot { margin-top: 26px; text-align: center; font-size: 10px; color: #888; font-family: Arial, sans-serif; letter-spacing: 1px; }
</style></head>
<body>
  <div class="head">
    <div>
      <h1>${s.business_name}</h1>
      <p class="lbl">NIT/CC: ${s.nit || "—"} · ${s.regimen}</p>
      <p class="lbl">${[s.address, s.city].filter(Boolean).join(", ")}</p>
      <p class="lbl">Tel: ${s.phone || "—"} · ${s.email}</p>
    </div>
    <div>
      <p class="lbl">Factura de venta</p>
      <p class="num">${num}</p>
      <p class="lbl" style="text-align:right">${fmtFecha(invoice.issued_at)}</p>
    </div>
  </div>

  <div class="cols">
    <div class="col">
      <p class="lbl">Cliente</p>
      <p><strong>${order.customer_name}</strong></p>
      <p>CC/NIT: ${order.customer_id_doc || "No informado"}</p>
      <p>${order.customer_email}</p>
      <p>Tel: ${order.customer_phone}</p>
    </div>
    <div class="col">
      <p class="lbl">Envío</p>
      <p>${order.address}</p>
      <p>${order.city}, ${order.department}</p>
      ${order.notes ? `<p>${order.notes}</p>` : ""}
      <p class="lbl" style="margin-top:6px">Pedido: ${order.id}</p>
    </div>
  </div>

  <table>
    <thead><tr><th>Descripción</th><th class="c">Cant.</th><th class="r">Vlr. unitario</th><th class="r">Vlr. total</th></tr></thead>
    <tbody>${filas}</tbody>
  </table>

  <table class="tot">
    <tr><td class="lbl">Subtotal</td><td class="r">${fmtPrecio(invoice.subtotal)}</td></tr>
    <tr><td class="lbl">IVA (${Math.round(tarifaIva * 100)}%)</td><td class="r">${fmtPrecio(invoice.iva)}</td></tr>
    <tr class="grand"><td>TOTAL</td><td class="r">${fmtPrecio(invoice.total)}</td></tr>
  </table>

  <p class="meta"><span class="lbl">Forma de pago:</span> ${METODOS_PAGO[order.payment_method]}</p>
  ${s.dian_resolution ? `<p class="meta"><span class="lbl">Resolución DIAN:</span> ${s.dian_resolution}</p>` : ""}
  ${invoice.cufe ? `<p class="meta"><span class="lbl">CUFE:</span> ${invoice.cufe}</p>` : ""}

  ${!invoice.cufe ? `<div class="note">
    Documento de venta generado por jhonkarly.com. No constituye factura electrónica
    validada ante la DIAN${s.regimen.toLowerCase().includes("no responsable") ? " (vendedor no responsable de IVA)" : ""}.
  </div>` : ""}

  <p class="foot">JHONKARLY ALVAREZ · jhonkarly.com · Gracias por apoyar el camino a LA 2028</p>
</body></html>`;
}

/** Abre la factura en una ventana lista para imprimir o guardar como PDF */
export function imprimirFactura(order: Order, invoice: Invoice, s: BillingSettings) {
  const win = window.open("", "_blank", "width=860,height=1000");
  if (!win) return;
  win.document.write(
    generarFacturaHTML(order, invoice, s).replace(
      "</body>",
      "<script>window.onload = () => window.print();</script></body>"
    )
  );
  win.document.close();
}
