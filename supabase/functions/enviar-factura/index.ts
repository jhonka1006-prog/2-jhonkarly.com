// ============================================================
// Edge Function: enviar-factura
// Envía la factura de un pedido por correo al cliente.
//
// DESPLIEGUE (una sola vez):
//   1. Crea una cuenta gratis en https://resend.com y verifica el
//      dominio jhonkarly.com (o usa el remitente de pruebas).
//   2. Supabase Dashboard → Edge Functions → Deploy new function
//      → nombre: enviar-factura → pega este archivo.
//   3. Edge Functions → enviar-factura → Secrets:
//      RESEND_API_KEY = re_xxxxxxxxx
// ============================================================

import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const fmtCOP = (v: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // ── Autorización: solo staff (admin / master) puede enviar facturas ──
    const jwt = req.headers.get("Authorization")?.replace("Bearer ", "") ?? "";
    const { data: { user } } = await supabase.auth.getUser(jwt);
    if (!user) return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401, headers: cors });

    const { data: perfil } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (!perfil || !["admin", "master"].includes(perfil.role)) {
      return new Response(JSON.stringify({ error: "Solo el staff puede enviar facturas" }), { status: 403, headers: cors });
    }

    // ── Datos del pedido, factura y vendedor ──
    const { order_id } = await req.json();
    const { data: order } = await supabase.from("orders").select("*").eq("id", order_id).single();
    const { data: invoice } = await supabase.from("invoices").select("*").eq("order_id", order_id).single();
    const { data: s } = await supabase.from("billing_settings").select("*").eq("id", 1).single();
    if (!order || !invoice || !s) {
      return new Response(JSON.stringify({ error: "Pedido, factura o datos fiscales no encontrados" }), { status: 404, headers: cors });
    }

    const num = `${s.invoice_prefix}-${String(invoice.number).padStart(5, "0")}`;
    const filas = (order.items as { name: string; qty: number; price: number }[])
      .map((i) => `<tr><td style="padding:6px 8px;border-bottom:1px solid #ddd">${i.qty}× ${i.name}</td><td style="padding:6px 8px;border-bottom:1px solid #ddd;text-align:right">${fmtCOP(i.price * i.qty)}</td></tr>`)
      .join("");

    const html = `
<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#111">
  <h1 style="letter-spacing:3px;font-size:18px;border-bottom:2px solid #111;padding-bottom:12px">JHONKARLY ALVAREZ</h1>
  <p style="font-size:14px">Hola <strong>${order.customer_name}</strong>, gracias por tu compra. Adjunto el detalle de tu factura <strong>${num}</strong>:</p>
  <table style="width:100%;border-collapse:collapse;font-size:13px;margin:16px 0">${filas}
    <tr><td style="padding:6px 8px;font-size:11px;color:#666">Subtotal</td><td style="padding:6px 8px;text-align:right">${fmtCOP(invoice.subtotal)}</td></tr>
    <tr><td style="padding:6px 8px;font-size:11px;color:#666">IVA</td><td style="padding:6px 8px;text-align:right">${fmtCOP(invoice.iva)}</td></tr>
    <tr><td style="padding:8px;border-top:2px solid #111;font-weight:bold">TOTAL</td><td style="padding:8px;border-top:2px solid #111;text-align:right;font-weight:bold">${fmtCOP(invoice.total)}</td></tr>
  </table>
  <p style="font-size:12px;color:#555">Envío a: ${order.address}, ${order.city}, ${order.department}</p>
  <p style="font-size:12px;color:#555">Vendedor: ${s.business_name} · NIT/CC ${s.nit} · ${s.regimen}${s.dian_resolution ? ` · Res. DIAN ${s.dian_resolution}` : ""}</p>
  ${!invoice.cufe ? `<p style="font-size:10px;color:#999">Documento de venta generado por jhonkarly.com. No constituye factura electrónica validada ante la DIAN.</p>` : ""}
  <p style="font-size:11px;color:#888;letter-spacing:1px;margin-top:24px">JHONKARLY.COM · RUMBO A LOS ÁNGELES 2028</p>
</div>`;

    // ── Envío con Resend ──
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${s.business_name} <facturas@jhonkarly.com>`,
        to: [order.customer_email],
        subject: `Tu factura ${num} — Tienda oficial Jhonkarly Alvarez`,
        html,
      }),
    });

    if (!res.ok) {
      const detalle = await res.text();
      return new Response(JSON.stringify({ error: `Resend: ${detalle}` }), { status: 502, headers: cors });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500, headers: cors });
  }
});
