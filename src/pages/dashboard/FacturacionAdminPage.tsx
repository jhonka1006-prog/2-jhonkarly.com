import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useBillingSettings, useSaveBillingSettings } from "@/hooks/use-facturas";
import { Receipt, Save } from "lucide-react";

const inputCls =
  "w-full bg-g900 border border-g700 font-body text-sm px-4 py-2.5 outline-none transition-colors placeholder:text-g500 text-foreground focus:border-g300";
const labelCls =
  "font-body text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-g500 block mb-2";

const FacturacionAdminPage = () => {
  const { toast } = useToast();
  const { data: settings, isLoading } = useBillingSettings();
  const guardar = useSaveBillingSettings();

  const [form, setForm] = useState({
    business_name: "",
    nit: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    regimen: "No responsable de IVA",
    iva_rate: "0",
    invoice_prefix: "FV",
    dian_resolution: "",
  });

  useEffect(() => {
    if (settings) {
      setForm({
        business_name: settings.business_name,
        nit: settings.nit,
        address: settings.address,
        city: settings.city,
        phone: settings.phone,
        email: settings.email,
        regimen: settings.regimen,
        iva_rate: String(settings.iva_rate),
        invoice_prefix: settings.invoice_prefix,
        dian_resolution: settings.dian_resolution ?? "",
      });
    }
  }, [settings]);

  const set = (campo: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [campo]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await guardar.mutateAsync({ ...form, iva_rate: Number(form.iva_rate) });
      toast({ title: "Datos de facturación guardados" });
    } catch (err) {
      toast({ title: "Error al guardar", description: (err as Error).message, variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <span className="font-body text-[0.6rem] font-semibold tracking-[0.38em] uppercase text-g500 block mb-2">
          Dashboard · Solo cuenta maestra
        </span>
        <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-none text-foreground">
          Facturación
        </h1>
        <p className="font-body text-sm text-g300 mt-2">
          Estos datos aparecen en todas las facturas de la tienda.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">

        {/* ══ Datos fiscales ══ */}
        <section className="border border-g700">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-g700 bg-g900">
            <Receipt className="w-4 h-4 text-g300" />
            <h2 className="font-body text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-foreground">
              Datos del vendedor
            </h2>
          </div>

          {isLoading ? (
            <p className="px-6 py-8 font-body text-sm text-g500">Cargando…</p>
          ) : (
            <form onSubmit={submit} className="px-6 py-5 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="f-nombre" className={labelCls}>Nombre / Razón social</label>
                  <input id="f-nombre" type="text" value={form.business_name} onChange={set("business_name")} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="f-nit" className={labelCls}>NIT o Cédula</label>
                  <input id="f-nit" type="text" placeholder="Ej: 1.087.xxx.xxx" value={form.nit} onChange={set("nit")} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="f-regimen" className={labelCls}>Régimen</label>
                  <select id="f-regimen" value={form.regimen} onChange={set("regimen")} className={inputCls}>
                    <option>No responsable de IVA</option>
                    <option>Responsable de IVA</option>
                    <option>Régimen Simple de Tributación</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="f-dir" className={labelCls}>Dirección</label>
                  <input id="f-dir" type="text" value={form.address} onChange={set("address")} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="f-ciudad" className={labelCls}>Ciudad</label>
                  <input id="f-ciudad" type="text" value={form.city} onChange={set("city")} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="f-tel" className={labelCls}>Teléfono</label>
                  <input id="f-tel" type="tel" value={form.phone} onChange={set("phone")} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="f-email" className={labelCls}>Correo de facturación</label>
                  <input id="f-email" type="email" value={form.email} onChange={set("email")} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="f-iva" className={labelCls}>Tarifa de IVA</label>
                  <select id="f-iva" value={form.iva_rate} onChange={set("iva_rate")} className={inputCls}>
                    <option value="0">0% (no responsable)</option>
                    <option value="0.05">5%</option>
                    <option value="0.19">19%</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="f-prefijo" className={labelCls}>Prefijo de factura</label>
                  <input id="f-prefijo" type="text" placeholder="FV" value={form.invoice_prefix} onChange={set("invoice_prefix")} className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="f-res" className={labelCls}>Resolución DIAN (cuando la tengas)</label>
                  <input id="f-res" type="text" placeholder="Ej: Resolución 18764XXXXXXX de 2026" value={form.dian_resolution} onChange={set("dian_resolution")} className={inputCls} />
                </div>
              </div>

              <button
                type="submit"
                disabled={guardar.isPending}
                className="flex items-center justify-center gap-2 py-3 bg-foreground text-background font-body font-semibold text-[0.7rem] tracking-[0.2em] uppercase transition-opacity hover:opacity-80 disabled:opacity-40"
              >
                <Save className="w-4 h-4" />
                {guardar.isPending ? "Guardando…" : "Guardar datos fiscales"}
              </button>
            </form>
          )}
        </section>

        {/* ══ Guía normativa ══ */}
        <section className="border border-g700">
          <div className="px-6 py-4 border-b border-g700 bg-g900">
            <h2 className="font-body text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-foreground">
              Normativa colombiana — en qué punto estás
            </h2>
          </div>
          <div className="px-6 py-5 font-body font-light text-[0.85rem] text-g300 leading-[1.85] flex flex-col gap-4">
            <p>
              <strong className="text-foreground font-semibold">Hoy:</strong> cada pedido genera una
              <strong className="text-foreground font-semibold"> factura de venta web</strong> con numeración
              consecutiva, IVA discriminado según tu régimen, datos del comprador (incluida su cédula/NIT)
              y envío por correo. Si eres persona natural no responsable de IVA y no superas los topes de
              la DIAN, este documento es suficiente como cuenta de venta.
            </p>
            <p>
              <strong className="text-foreground font-semibold">Cuando estés obligado a factura electrónica</strong> (o
              quieras emitirla voluntariamente): 1) actualiza tu RUT con la responsabilidad de facturador
              electrónico, 2) habilítate en el sistema gratuito de la DIAN o contrata un proveedor
              tecnológico (Siigo, Alegra, Factus…), 3) registra aquí tu resolución de numeración.
              El sistema ya tiene el campo <strong className="text-foreground font-semibold">CUFE</strong> reservado
              en cada factura para esa integración.
            </p>
            <p>
              <strong className="text-foreground font-semibold">Envío por correo:</strong> requiere desplegar la
              función <code className="text-foreground">enviar-factura</code> (el archivo está en
              <code className="text-foreground"> supabase/functions/</code> con las instrucciones) y una cuenta
              gratuita de Resend. Mientras tanto, el botón "Imprimir factura" permite guardarla como PDF
              y adjuntarla a mano.
            </p>
            <p className="text-g500 text-[0.78rem]">
              Nota del CTO: soy tu equipo técnico, no tu contador — cuando la tienda tome volumen,
              valida tu situación tributaria (topes, RST, IVA) con un contador.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default FacturacionAdminPage;
