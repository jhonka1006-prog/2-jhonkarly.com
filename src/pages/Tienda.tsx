import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useProducts } from "@/hooks/use-tienda";
import { useCreateOrder } from "@/hooks/use-pedidos";
import { fmtPrecio, Product } from "@/lib/api/tienda";
import { Order, PaymentMethod, METODOS_PAGO } from "@/lib/api/pedidos";
import { useAuth } from "@/hooks/use-auth";
import { usePageMeta } from "@/lib/seo";

const inputCls =
  "w-full bg-g900 border border-g700 font-body text-sm px-4 py-2.5 outline-none transition-colors placeholder:text-g500 text-foreground focus:border-g300";
const labelCls =
  "font-body text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-g500 block mb-2";

/* ── Modal de compra ── */
const CheckoutModal = ({ producto, onClose }: { producto: Product; onClose: () => void }) => {
  const { user, profile } = useAuth();

  /* Cerrar con Escape (accesibilidad de teclado) */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const crearPedido = useCreateOrder();
  const [qty, setQty] = useState(1);
  const [pago, setPago] = useState<PaymentMethod>("transferencia");
  const [datos, setDatos] = useState({
    nombre: profile?.full_name ?? "",
    cedula: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    departamento: "",
    notas: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [pedidoCreado, setPedidoCreado] = useState<Order | null>(null);

  const total = producto.price * qty;

  const confirmar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!datos.nombre.trim() || !datos.telefono.trim() || !datos.direccion.trim() || !datos.ciudad.trim() || !datos.departamento.trim()) {
      setError("Completa todos los datos de envío.");
      return;
    }
    setError(null);
    try {
      const pedido = await crearPedido.mutateAsync({
        user_id: user.id,
        customer_name: datos.nombre.trim(),
        customer_email: user.email ?? "",
        customer_phone: datos.telefono.trim(),
        customer_id_doc: datos.cedula.trim() || null,
        address: datos.direccion.trim(),
        city: datos.ciudad.trim(),
        department: datos.departamento.trim(),
        notes: datos.notas.trim() || null,
        items: [{ product_id: producto.id, name: producto.name, price: producto.price, qty }],
        total,
        payment_method: pago,
      });
      setPedidoCreado(pedido);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-8" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Finalizar compra — ${producto.name}`}
        className="relative w-full max-w-[520px] mx-4 bg-background border border-g700 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {pedidoCreado ? (
          /* ── Confirmación ── */
          <div className="p-8">
            <span className="font-body text-[0.58rem] font-semibold tracking-[0.38em] uppercase text-g500 block mb-2">
              Pedido recibido
            </span>
            <h2 className="font-display text-[2rem] leading-none text-foreground mb-6">
              ¡Gracias por tu compra!
            </h2>
            <div className="border border-g700 bg-g900 p-5 mb-6">
              <p className="font-body text-[0.7rem] text-g500 uppercase tracking-[0.2em] mb-1">Nº de pedido</p>
              <p className="font-mono text-[0.8rem] text-foreground break-all">{pedidoCreado.id}</p>
              <p className="font-body text-[0.7rem] text-g500 uppercase tracking-[0.2em] mt-4 mb-1">Total</p>
              <p className="font-display text-[1.4rem] text-foreground">{fmtPrecio(pedidoCreado.total)}</p>
            </div>
            {pedidoCreado.payment_method === "transferencia" ? (
              <p className="font-body font-light text-[0.88rem] text-g300 leading-[1.85] mb-8">
                Para completar tu compra, escríbenos a{" "}
                <a href={`mailto:contact@jhonkarly.com?subject=Pago%20pedido%20${pedidoCreado.id.slice(0, 8)}`} className="text-foreground underline underline-offset-4">
                  contact@jhonkarly.com
                </a>{" "}
                con tu número de pedido y te enviaremos los datos de la cuenta (Nequi / Bancolombia).
                Al confirmar el pago, prepararemos tu envío.
              </p>
            ) : (
              <p className="font-body font-light text-[0.88rem] text-g300 leading-[1.85] mb-8">
                Pagarás al recibir tu pedido. Te contactaremos al teléfono indicado para coordinar la entrega.
              </p>
            )}
            <div className="flex gap-3">
              <Link
                to="/mi-cuenta"
                className="flex-1 text-center py-3 bg-foreground text-background font-body font-semibold text-[0.68rem] tracking-[0.2em] uppercase transition-opacity hover:opacity-80"
              >
                Ver mis pedidos
              </Link>
              <button
                onClick={onClose}
                className="flex-1 py-3 border border-g700 text-g300 font-body font-semibold text-[0.68rem] tracking-[0.2em] uppercase hover:border-g300 hover:text-foreground transition-colors"
              >
                Seguir viendo
              </button>
            </div>
          </div>
        ) : (
          /* ── Formulario de compra ── */
          <form onSubmit={confirmar}>
            <div className="flex items-start justify-between px-8 pt-8 pb-6 border-b border-g700">
              <div>
                <span className="font-body text-[0.58rem] font-semibold tracking-[0.38em] uppercase text-g500 block mb-2">
                  Finalizar compra
                </span>
                <h2 className="font-display text-[1.7rem] leading-none text-foreground">
                  {producto.name}
                </h2>
              </div>
              <button type="button" onClick={onClose} className="text-g500 hover:text-foreground transition-colors mt-1" aria-label="Cerrar">
                ✕
              </button>
            </div>

            <div className="px-8 py-6 flex flex-col gap-5">
              {/* Cantidad + total */}
              <div className="flex items-center justify-between border border-g700 bg-g900 px-5 py-4">
                <div className="flex items-center gap-4">
                  <span className={labelCls + " !mb-0"}>Cantidad</span>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-8 h-8 border border-g700 text-g300 hover:border-g300 hover:text-foreground transition-colors" aria-label="Menos">−</button>
                    <span className="font-display text-[1.2rem] text-foreground w-6 text-center">{qty}</span>
                    <button type="button" onClick={() => setQty((q) => Math.min(20, q + 1))} className="w-8 h-8 border border-g700 text-g300 hover:border-g300 hover:text-foreground transition-colors" aria-label="Más">+</button>
                  </div>
                </div>
                <div className="text-right">
                  <span className={labelCls + " !mb-0"}>Total</span>
                  <span className="font-display text-[1.3rem] text-foreground">{fmtPrecio(total)}</span>
                </div>
              </div>

              {/* Datos de envío */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="co-nombre" className={labelCls}>Nombre completo</label>
                  <input id="co-nombre" type="text" value={datos.nombre} onChange={(e) => setDatos((p) => ({ ...p, nombre: e.target.value }))} className={inputCls} autoComplete="name" />
                </div>
                <div>
                  <label htmlFor="co-tel" className={labelCls}>Teléfono / WhatsApp</label>
                  <input id="co-tel" type="tel" placeholder="300 000 0000" value={datos.telefono} onChange={(e) => setDatos((p) => ({ ...p, telefono: e.target.value }))} className={inputCls} autoComplete="tel" />
                </div>
                <div>
                  <label htmlFor="co-cedula" className={labelCls}>Cédula / NIT (para tu factura)</label>
                  <input id="co-cedula" type="text" placeholder="Opcional" value={datos.cedula} onChange={(e) => setDatos((p) => ({ ...p, cedula: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label htmlFor="co-depto" className={labelCls}>Departamento</label>
                  <input id="co-depto" type="text" placeholder="Ej: Nariño" value={datos.departamento} onChange={(e) => setDatos((p) => ({ ...p, departamento: e.target.value }))} className={inputCls} autoComplete="address-level1" />
                </div>
                <div>
                  <label htmlFor="co-ciudad" className={labelCls}>Ciudad</label>
                  <input id="co-ciudad" type="text" placeholder="Ej: Pasto" value={datos.ciudad} onChange={(e) => setDatos((p) => ({ ...p, ciudad: e.target.value }))} className={inputCls} autoComplete="address-level2" />
                </div>
                <div>
                  <label htmlFor="co-dir" className={labelCls}>Dirección de envío</label>
                  <input id="co-dir" type="text" placeholder="Calle, número, barrio" value={datos.direccion} onChange={(e) => setDatos((p) => ({ ...p, direccion: e.target.value }))} className={inputCls} autoComplete="street-address" />
                </div>
                <div>
                  <label htmlFor="co-notas" className={labelCls}>Indicaciones (opcional)</label>
                  <input id="co-notas" type="text" placeholder="Apto, torre, referencia…" value={datos.notas} onChange={(e) => setDatos((p) => ({ ...p, notas: e.target.value }))} className={inputCls} />
                </div>
              </div>

              {/* Método de pago */}
              <div>
                <span className={labelCls}>Método de pago</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(["transferencia", "contra_entrega"] as PaymentMethod[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPago(m)}
                      className={`font-body text-[0.65rem] font-semibold tracking-[0.15em] uppercase border px-3 py-3 transition-colors text-left ${
                        pago === m
                          ? "bg-foreground text-background border-foreground"
                          : "border-g700 text-g300 hover:border-g300"
                      }`}
                    >
                      {METODOS_PAGO[m]}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p className="font-body text-[0.78rem] text-destructive border border-destructive/30 bg-destructive/10 px-4 py-3">
                  {error}
                </p>
              )}
            </div>

            <div className="px-8 pb-8">
              <button
                type="submit"
                disabled={crearPedido.isPending}
                className="w-full py-4 bg-foreground text-background font-body font-semibold text-[0.72rem] tracking-[0.22em] uppercase transition-opacity hover:opacity-80 disabled:opacity-40"
              >
                {crearPedido.isPending ? "Creando pedido…" : `Confirmar pedido · ${fmtPrecio(total)}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

/* ── Tarjeta de producto ── */
const TarjetaProducto = ({ producto, onComprar }: { producto: Product; onComprar: (p: Product) => void }) => {
  const { session } = useAuth();
  const location = useLocation();
  const foto = producto.image_urls[0];
  const fotoHover = producto.image_urls[1];

  return (
    <article className={`group border border-g700 bg-g900 flex flex-col ${!producto.available ? "opacity-60" : ""}`}>
      {/* Foto */}
      <div className="relative aspect-square overflow-hidden bg-g800">
        {foto ? (
          <>
            <img
              src={foto}
              alt={producto.name}
              loading="lazy"
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${fotoHover ? "group-hover:opacity-0" : ""}`}
            />
            {fotoHover && (
              <img
                src={fotoHover}
                alt={`${producto.name} — vista alternativa`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-body text-[0.58rem] font-semibold tracking-[0.3em] uppercase text-g500">
              Sin foto
            </span>
          </div>
        )}
        {!producto.available && (
          <span className="absolute top-3 left-3 bg-background/90 border border-g700 px-3 py-1.5 font-body text-[0.58rem] font-semibold tracking-[0.28em] uppercase text-g300">
            Agotado
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="font-display text-[clamp(1.2rem,2vw,1.6rem)] text-foreground leading-tight">
            {producto.name}
          </h3>
          <span className="font-display text-[1.1rem] text-foreground shrink-0 tracking-[0.03em]">
            {fmtPrecio(producto.price)}
          </span>
        </div>
        {producto.description && (
          <p className="font-body font-light text-[0.83rem] text-g300 leading-[1.75] mb-6">
            {producto.description}
          </p>
        )}
        <div className="mt-auto">
          {!producto.available ? (
            <span className="block w-full text-center py-3.5 border border-g700 text-g500 font-body font-semibold text-[0.68rem] tracking-[0.22em] uppercase cursor-not-allowed">
              No disponible
            </span>
          ) : producto.buy_url ? (
            <a
              href={producto.buy_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-3.5 bg-foreground text-background font-body font-semibold text-[0.68rem] tracking-[0.22em] uppercase transition-opacity duration-300 hover:opacity-80"
            >
              Comprar
            </a>
          ) : session ? (
            <button
              onClick={() => onComprar(producto)}
              className="block w-full text-center py-3.5 bg-foreground text-background font-body font-semibold text-[0.68rem] tracking-[0.22em] uppercase transition-opacity duration-300 hover:opacity-80"
            >
              Comprar
            </button>
          ) : (
            <Link
              to="/login"
              state={{ from: location }}
              className="block w-full text-center py-3.5 bg-foreground text-background font-body font-semibold text-[0.68rem] tracking-[0.22em] uppercase transition-opacity duration-300 hover:opacity-80"
            >
              Inicia sesión para comprar
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};

const Tienda = () => {
  usePageMeta({
    titulo: "Tienda Oficial — Jhonkarly Alvarez",
    descripcion:
      "Merchandising oficial de Jhonkarly Alvarez. Cada compra apoya directamente el camino a los Juegos Paralímpicos de Los Ángeles 2028.",
    ruta: "/tienda",
  });

  const { data: productos, isLoading } = useProducts();
  const [comprando, setComprando] = useState<Product | null>(null);
  const hayProductos = !!productos && productos.length > 0;

  return (
    <div id="main-content" className="min-h-screen bg-background flex flex-col">

      {/* ── HEADER ── */}
      <section className="px-[var(--px)] pt-[calc(68px+clamp(48px,10vw,120px))] pb-[clamp(40px,6vw,80px)]">
        <div className="max-w-[var(--container-max)] mx-auto">
          <span className="font-body text-[0.68rem] font-semibold tracking-[0.38em] uppercase text-g300 block mb-6">
            Tienda oficial
          </span>
          <h1 className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.9] text-foreground">
            Tienda
          </h1>
          <p className="font-body font-light text-[clamp(0.88rem,1.1vw,1rem)] text-g300 max-w-[480px] mt-8 leading-[1.85]">
            Merchandising oficial de Jhonkarly Alvarez. Cada compra apoya
            directamente el camino a Los Ángeles 2028.
          </p>
        </div>
      </section>

      {/* ── PRODUCTOS ── */}
      <section className="border-t border-border py-[var(--section-py)] px-[var(--px)] flex-1">
        <div className="max-w-[var(--container-max)] mx-auto">
          {isLoading ? (
            <p
              className="font-body text-sm text-g300 tracking-widest uppercase animate-pulse py-16 text-center"
              role="status"
              aria-live="polite"
            >
              Cargando productos…
            </p>
          ) : !hayProductos ? (
            <div className="border border-g700 bg-g900 px-8 py-20 text-center">
              <p className="font-display text-[clamp(2rem,5vw,3.5rem)] text-foreground mb-5 leading-none">
                Próxima<span className="text-g300">mente</span>
              </p>
              <p className="font-body font-light text-[0.88rem] text-g300 leading-[1.85] max-w-[440px] mx-auto mb-8">
                Estamos preparando la primera colección oficial.
                Cada prenda contará la historia de una voluntad que no sabe rendirse.
              </p>
              <a
                href="mailto:contact@jhonkarly.com?subject=Tienda%20oficial%20—%20Avísame%20del%20lanzamiento"
                className="inline-block px-8 py-3 bg-foreground text-background font-body font-semibold text-[0.72rem] tracking-[0.2em] uppercase transition-opacity duration-300 hover:opacity-80"
              >
                Avísame del lanzamiento
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {productos.map((p) => (
                <TarjetaProducto key={p.id} producto={p} onComprar={setComprando} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-foreground py-12 px-[var(--px)]" aria-label="Tienda oficial">
        <div className="max-w-[var(--container-max)] mx-auto flex flex-wrap items-center gap-6 gap-x-12">
          {[
            { num: "100%", lbl: "Oficial" },
            { num: "LA 2028", lbl: "Rumbo a los Juegos" },
            { num: "COL", lbl: "Hecho con orgullo" },
          ].map((s) => (
            <div key={s.lbl}>
              <span className="font-display text-[clamp(2rem,4vw,3.2rem)] text-background leading-none block tracking-[0.02em]">
                {s.num}
              </span>
              <span className="font-body text-[0.65rem] font-semibold tracking-[0.22em] uppercase text-background/50 mt-1 block">
                {s.lbl}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Checkout ── */}
      {comprando && <CheckoutModal producto={comprando} onClose={() => setComprando(null)} />}

    </div>
  );
};

export default Tienda;
