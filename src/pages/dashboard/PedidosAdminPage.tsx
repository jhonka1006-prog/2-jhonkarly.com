import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAllOrders, useUpdateOrderStatus } from "@/hooks/use-pedidos";
import { Order, OrderStatus, ESTADOS, METODOS_PAGO } from "@/lib/api/pedidos";
import { fmtPrecio } from "@/lib/api/tienda";
import { Printer, ChevronDown, ChevronUp, Package, Receipt, Mail } from "lucide-react";
import { useBillingSettings, useCreateInvoice, useEnviarFactura } from "@/hooks/use-facturas";
import { imprimirFactura } from "@/lib/facturaHtml";

const COLOR_ESTADO: Record<OrderStatus, string> = {
  pendiente: "border-g300 text-g300",
  pagado: "border-foreground text-foreground",
  enviado: "border-g100 text-g100",
  entregado: "border-g700 text-g500",
  cancelado: "border-destructive/60 text-destructive",
};

const fmtFecha = (iso: string) =>
  new Date(iso).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" });

/* ── Impresión del ticket de dirección ──
   Genera una ventana con formato de tiquete (ancho 80 mm, compatible con
   impresoras térmicas y también con impresoras normales) y abre el diálogo
   de impresión del sistema. */
const imprimirTicket = (o: Order) => {
  const filasItems = o.items
    .map((i) => `<tr><td>${i.qty}×</td><td>${i.name}</td><td class="r">${fmtPrecio(i.price * i.qty)}</td></tr>`)
    .join("");

  const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>Ticket ${o.id.slice(0, 8)}</title>
<style>
  @page { size: 80mm auto; margin: 4mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 72mm; font-family: "Courier New", monospace; font-size: 11px; color: #000; }
  .center { text-align: center; }
  .r { text-align: right; }
  h1 { font-size: 13px; letter-spacing: 2px; margin: 2mm 0 1mm; }
  hr { border: none; border-top: 1px dashed #000; margin: 2.5mm 0; }
  .lbl { font-size: 9px; letter-spacing: 1px; text-transform: uppercase; }
  .big { font-size: 13px; font-weight: bold; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 0.8mm 0; vertical-align: top; }
  .dir { font-size: 13px; font-weight: bold; line-height: 1.45; }
</style></head>
<body>
  <div class="center">
    <h1>JHONKARLY ALVAREZ</h1>
    <div class="lbl">Tienda oficial &middot; jhonkarly.com</div>
  </div>
  <hr>
  <div class="lbl">Pedido</div>
  <div>${o.id}</div>
  <div>${fmtFecha(o.created_at)}</div>
  <hr>
  <div class="lbl">Enviar a</div>
  <div class="dir">
    ${o.customer_name}<br>
    ${o.address}<br>
    ${o.city}, ${o.department}<br>
    Tel: ${o.customer_phone}
  </div>
  ${o.notes ? `<div style="margin-top:1.5mm"><span class="lbl">Indicaciones:</span> ${o.notes}</div>` : ""}
  <hr>
  <table>${filasItems}</table>
  <hr>
  <table>
    <tr><td class="lbl">Pago</td><td class="r">${METODOS_PAGO[o.payment_method]}</td></tr>
    <tr><td class="lbl">Estado</td><td class="r">${ESTADOS[o.status]}</td></tr>
    <tr><td class="big">TOTAL</td><td class="r big">${fmtPrecio(o.total)}</td></tr>
  </table>
  <hr>
  <div class="center lbl">Gracias por apoyar el camino a LA 2028</div>
  <script>window.onload = () => { window.print(); };</script>
</body></html>`;

  const win = window.open("", "_blank", "width=420,height=640");
  if (!win) return;
  win.document.write(html);
  win.document.close();
};

const PedidosAdminPage = () => {
  const { toast } = useToast();
  const { data: pedidos, isLoading } = useAllOrders();
  const cambiarEstado = useUpdateOrderStatus();
  const [filtro, setFiltro] = useState<OrderStatus | "all">("all");
  const [abierto, setAbierto] = useState<string | null>(null);

  /* ── Facturación ── */
  const { data: fiscales } = useBillingSettings();
  const crearFactura = useCreateInvoice();
  const enviarFactura = useEnviarFactura();

  const facturar = async (o: Order) => {
    if (!fiscales) {
      toast({ title: "Configura primero los datos fiscales", description: "Dashboard → Facturación", variant: "destructive" });
      return;
    }
    try {
      const factura = await crearFactura.mutateAsync({ order: o, settings: fiscales });
      imprimirFactura(o, factura, fiscales);
    } catch (err) {
      toast({ title: "Error al generar la factura", description: (err as Error).message, variant: "destructive" });
    }
  };

  const enviarPorCorreo = async (o: Order) => {
    if (!fiscales) {
      toast({ title: "Configura primero los datos fiscales", description: "Dashboard → Facturación", variant: "destructive" });
      return;
    }
    try {
      const factura = await crearFactura.mutateAsync({ order: o, settings: fiscales });
      await enviarFactura.mutateAsync({ orderId: o.id, invoiceId: factura.id });
      toast({ title: `Factura enviada a ${o.customer_email}` });
    } catch (err) {
      toast({
        title: "No se pudo enviar por correo",
        description: `${(err as Error).message} — ¿desplegaste la función "enviar-factura" con su RESEND_API_KEY? Mientras tanto usa "Imprimir factura" y guárdala como PDF.`,
        variant: "destructive",
      });
    }
  };

  const filtrados = (pedidos ?? []).filter((p) => filtro === "all" || p.status === filtro);

  const actualizar = async (id: string, status: OrderStatus) => {
    try {
      await cambiarEstado.mutateAsync({ id, status });
      toast({ title: `Pedido marcado como "${ESTADOS[status]}"` });
    } catch (err) {
      toast({ title: "Error al actualizar", description: (err as Error).message, variant: "destructive" });
    }
  };

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <span className="font-body text-[0.6rem] font-semibold tracking-[0.38em] uppercase text-g500 block mb-2">
            Dashboard · Tienda
          </span>
          <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-none text-foreground">
            Pedidos
          </h1>
          <p className="font-body text-sm text-g300 mt-2">
            {isLoading ? "Cargando…" : `${pedidos?.length ?? 0} pedidos en total`}
          </p>
        </div>

        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value as OrderStatus | "all")}
          className="bg-g900 border border-g700 text-g300 font-body text-[0.68rem] tracking-widest uppercase px-4 py-2.5 outline-none focus:border-g300 transition-colors cursor-pointer"
        >
          <option value="all">Todos los estados</option>
          {(Object.keys(ESTADOS) as OrderStatus[]).map((s) => (
            <option key={s} value={s}>{ESTADOS[s]}</option>
          ))}
        </select>
      </div>

      {/* ── Lista ── */}
      {isLoading ? (
        <p className="font-body text-sm text-g500 py-12 text-center">Cargando pedidos…</p>
      ) : filtrados.length === 0 ? (
        <div className="border border-g700 bg-g900 px-8 py-16 text-center">
          <Package className="w-6 h-6 text-g700 mx-auto mb-4" />
          <p className="font-body text-sm text-g500">
            {filtro === "all" ? "Aún no hay pedidos. Cuando alguien compre, aparecerá aquí." : "No hay pedidos con este estado."}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {filtrados.map((o) => {
            const expandido = abierto === o.id;
            return (
              <li key={o.id} className="border border-g700">
                {/* Fila resumen */}
                <button
                  onClick={() => setAbierto(expandido ? null : o.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-g900 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-body text-sm font-semibold text-foreground truncate">
                      {o.customer_name}
                    </p>
                    <p className="font-body text-[0.7rem] text-g500">
                      {fmtFecha(o.created_at)} · {o.city}, {o.department}
                    </p>
                  </div>
                  <span className={`font-body text-[0.58rem] font-semibold tracking-[0.2em] uppercase border px-2 py-1 shrink-0 ${COLOR_ESTADO[o.status]}`}>
                    {ESTADOS[o.status]}
                  </span>
                  <span className="font-display text-[1.05rem] text-foreground shrink-0">
                    {fmtPrecio(o.total)}
                  </span>
                  {expandido ? <ChevronUp className="w-4 h-4 text-g700 shrink-0" /> : <ChevronDown className="w-4 h-4 text-g700 shrink-0" />}
                </button>

                {/* Detalle */}
                {expandido && (
                  <div className="border-t border-g800 px-5 py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <span className="font-body text-[0.58rem] font-semibold tracking-[0.3em] uppercase text-g500 block mb-2">
                        Envío
                      </span>
                      <p className="font-body text-[0.85rem] text-g300 leading-[1.8]">
                        {o.customer_name}<br />
                        {o.address}<br />
                        {o.city}, {o.department}<br />
                        Tel: {o.customer_phone}<br />
                        {o.customer_email}
                        {o.customer_id_doc && <><br />CC/NIT: {o.customer_id_doc}</>}
                      </p>
                      {o.notes && (
                        <p className="font-body text-[0.78rem] text-g500 mt-2">
                          Indicaciones: {o.notes}
                        </p>
                      )}
                      <p className="font-body text-[0.78rem] text-g300 mt-3">
                        Pago: <strong className="text-foreground">{METODOS_PAGO[o.payment_method]}</strong>
                      </p>
                    </div>

                    <div>
                      <span className="font-body text-[0.58rem] font-semibold tracking-[0.3em] uppercase text-g500 block mb-2">
                        Productos
                      </span>
                      <ul className="mb-4">
                        {o.items.map((i, idx) => (
                          <li key={idx} className="flex justify-between font-body text-[0.85rem] text-g300 py-1 border-b border-g800">
                            <span>{i.qty}× {i.name}</span>
                            <span className="text-foreground">{fmtPrecio(i.price * i.qty)}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap items-center gap-3">
                        <select
                          value={o.status}
                          onChange={(e) => actualizar(o.id, e.target.value as OrderStatus)}
                          className="bg-g900 border border-g700 text-g300 font-body text-[0.65rem] tracking-widest uppercase px-3 py-2.5 outline-none focus:border-g300 transition-colors cursor-pointer"
                          aria-label="Cambiar estado del pedido"
                        >
                          {(Object.keys(ESTADOS) as OrderStatus[]).map((s) => (
                            <option key={s} value={s}>{ESTADOS[s]}</option>
                          ))}
                        </select>

                        <button
                          onClick={() => imprimirTicket(o)}
                          className="flex items-center gap-2 font-body text-[0.65rem] font-semibold tracking-[0.2em] uppercase border border-g700 px-4 py-2.5 text-g300 hover:border-g300 hover:text-foreground transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Imprimir ticket
                        </button>

                        <button
                          onClick={() => facturar(o)}
                          disabled={crearFactura.isPending}
                          className="flex items-center gap-2 font-body text-[0.65rem] font-semibold tracking-[0.2em] uppercase border border-g700 px-4 py-2.5 text-g300 hover:border-g300 hover:text-foreground transition-colors disabled:opacity-40"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          Imprimir factura
                        </button>

                        <button
                          onClick={() => enviarPorCorreo(o)}
                          disabled={enviarFactura.isPending}
                          className="flex items-center gap-2 font-body text-[0.65rem] font-semibold tracking-[0.2em] uppercase border border-g700 px-4 py-2.5 text-g300 hover:border-g300 hover:text-foreground transition-colors disabled:opacity-40"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          {enviarFactura.isPending ? "Enviando…" : "Factura por correo"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default PedidosAdminPage;
