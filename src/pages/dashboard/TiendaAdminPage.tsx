import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/use-tienda";
import { fmtPrecio } from "@/lib/api/tienda";
import { uploadPublicFile } from "@/lib/api/storage";
import { Trash2, Plus, ShoppingBag, Eye, EyeOff, Upload } from "lucide-react";

const inputCls =
  "w-full bg-g900 border border-g700 font-body text-sm px-4 py-2.5 outline-none transition-colors placeholder:text-g500 text-foreground focus:border-g300";

const labelCls =
  "font-body text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-g500 block mb-2";

const FORM_VACIO = { name: "", price: "", description: "", fotos: "", buy_url: "" };

const TiendaAdminPage = () => {
  const { toast } = useToast();
  const { data: productos, isLoading } = useProducts();
  const crear = useCreateProduct();
  const actualizar = useUpdateProduct();
  const borrar = useDeleteProduct();

  const [form, setForm] = useState(FORM_VACIO);
  const [subiendo, setSubiendo] = useState(false);

  /* Sube una o varias imágenes desde el PC y agrega sus URLs a la lista */
  const subirFotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setSubiendo(true);
    try {
      const urls: string[] = [];
      for (const file of files) {
        urls.push(await uploadPublicFile("tienda", file));
      }
      setForm((p) => ({ ...p, fotos: [p.fotos.trim(), ...urls].filter(Boolean).join("\n") }));
      toast({ title: `${urls.length} foto(s) subida(s)` });
    } catch (err) {
      toast({ title: "Error al subir fotos", description: (err as Error).message, variant: "destructive" });
    } finally {
      setSubiendo(false);
      e.target.value = "";
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const precio = Number(form.price);
    if (!form.name.trim()) {
      toast({ title: "El nombre del producto es obligatorio", variant: "destructive" });
      return;
    }
    if (!form.price.trim() || isNaN(precio) || precio < 0) {
      toast({ title: "Ingresa un precio válido en COP", variant: "destructive" });
      return;
    }
    const image_urls = form.fotos
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);

    try {
      await crear.mutateAsync({
        name: form.name.trim(),
        price: precio,
        description: form.description.trim(),
        image_urls,
        buy_url: form.buy_url.trim() || null,
      });
      toast({ title: "Producto publicado en la tienda" });
      setForm(FORM_VACIO);
    } catch (err) {
      toast({ title: "Error al publicar", description: (err as Error).message, variant: "destructive" });
    }
  };

  const toggleDisponible = async (id: string, available: boolean) => {
    try {
      await actualizar.mutateAsync({ id, changes: { available: !available } });
      toast({ title: available ? "Producto marcado como agotado" : "Producto disponible de nuevo" });
    } catch (err) {
      toast({ title: "Error al actualizar", description: (err as Error).message, variant: "destructive" });
    }
  };

  const eliminar = async (id: string, nombre: string) => {
    try {
      await borrar.mutateAsync(id);
      toast({ title: `"${nombre}" eliminado de la tienda` });
    } catch (err) {
      toast({ title: "Error al eliminar", description: (err as Error).message, variant: "destructive" });
    }
  };

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-8">
        <span className="font-body text-[0.6rem] font-semibold tracking-[0.38em] uppercase text-g500 block mb-2">
          Dashboard · Contenido
        </span>
        <h1 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-none text-foreground">
          Tienda
        </h1>
        <p className="font-body text-sm text-g300 mt-2">
          Los productos que publiques aquí aparecen al instante en la página pública /tienda.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">

        {/* ══ Formulario: nuevo producto ══ */}
        <section className="border border-g700">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-g700 bg-g900">
            <ShoppingBag className="w-4 h-4 text-g300" />
            <h2 className="font-body text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-foreground">
              Nuevo producto
            </h2>
          </div>

          <form onSubmit={submit} className="px-6 py-5 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="prod-nombre" className={labelCls}>Nombre</label>
                <input
                  id="prod-nombre"
                  type="text"
                  placeholder="Ej: Camiseta oficial LA 2028"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="prod-precio" className={labelCls}>Precio (COP)</label>
                <input
                  id="prod-precio"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="Ej: 85000"
                  value={form.price}
                  onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label htmlFor="prod-desc" className={labelCls}>Descripción</label>
              <textarea
                id="prod-desc"
                rows={3}
                placeholder="Material, tallas disponibles, detalles…"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                className={`${inputCls} resize-y`}
              />
            </div>

            <div>
              <label htmlFor="prod-fotos-archivo" className={labelCls}>Fotos del producto</label>
              <label
                htmlFor="prod-fotos-archivo"
                className={`flex items-center justify-center gap-2 border border-dashed border-g700 px-4 py-4 font-body text-[0.68rem] font-semibold tracking-[0.2em] uppercase cursor-pointer transition-colors mb-3 ${
                  subiendo ? "text-g700" : "text-g300 hover:border-g300 hover:text-foreground"
                }`}
              >
                <Upload className="w-4 h-4" />
                {subiendo ? "Subiendo fotos…" : "Subir fotos desde tu PC"}
              </label>
              <input
                id="prod-fotos-archivo"
                type="file"
                accept="image/*"
                multiple
                onChange={subirFotos}
                disabled={subiendo}
                className="sr-only"
              />

              <textarea
                id="prod-fotos"
                rows={3}
                placeholder={"…o pega URLs, una por línea:\nhttps://…/frente.jpg\nhttps://…/espalda.jpg"}
                value={form.fotos}
                onChange={(e) => setForm((p) => ({ ...p, fotos: e.target.value }))}
                className={`${inputCls} resize-y font-mono text-[0.78rem]`}
              />
              <p className="font-body text-[0.68rem] text-g500 mt-1.5">
                Puedes subir archivos, pegar URLs o combinar ambas. La primera foto es la
                principal; la segunda se muestra al pasar el mouse. Reordénalas moviendo las líneas.
              </p>
            </div>

            <div>
              <label htmlFor="prod-buyurl" className={labelCls}>Link de pago (opcional)</label>
              <input
                id="prod-buyurl"
                type="url"
                placeholder="https://… (MercadoPago, Wompi…) — si lo dejas vacío, el botón Comprar abre tu correo"
                value={form.buy_url}
                onChange={(e) => setForm((p) => ({ ...p, buy_url: e.target.value }))}
                className={inputCls}
              />
            </div>

            <button
              type="submit"
              disabled={crear.isPending}
              className="flex items-center justify-center gap-2 py-3 bg-foreground text-background font-body font-semibold text-[0.7rem] tracking-[0.2em] uppercase transition-opacity hover:opacity-80 disabled:opacity-40"
            >
              <Plus className="w-4 h-4" />
              {crear.isPending ? "Publicando…" : "Publicar producto"}
            </button>
          </form>
        </section>

        {/* ══ Lista de productos ══ */}
        <section className="border border-g700">
          <div className="flex items-center justify-between px-6 py-4 border-b border-g700 bg-g900">
            <h2 className="font-body text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-foreground">
              Productos publicados
            </h2>
            <span className="font-body text-[0.68rem] text-g500">
              {productos?.length ?? 0}
            </span>
          </div>

          <ul>
            {isLoading ? (
              <li className="px-6 py-8 text-center font-body text-sm text-g500">Cargando…</li>
            ) : !productos || productos.length === 0 ? (
              <li className="px-6 py-8 text-center font-body text-sm text-g500">
                Aún no hay productos. Publica el primero con el formulario.
              </li>
            ) : (
              productos.map((p) => (
                <li key={p.id} className="flex items-center gap-4 px-6 py-4 border-b border-g800 last:border-b-0">
                  {/* Miniatura */}
                  <div className="w-14 h-14 bg-g900 border border-g800 shrink-0 overflow-hidden">
                    {p.image_urls[0] ? (
                      <img src={p.image_urls[0]} alt={p.name} loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 text-g700" />
                      </div>
                    )}
                  </div>

                  {/* Datos */}
                  <div className="min-w-0 flex-1">
                    <p className={`font-body text-sm font-semibold truncate ${p.available ? "text-foreground" : "text-g700 line-through"}`}>
                      {p.name}
                    </p>
                    <span className="font-body text-[0.72rem] text-g300">
                      {fmtPrecio(p.price)}
                      {!p.available && " · agotado"}
                    </span>
                  </div>

                  {/* Acciones */}
                  <button
                    onClick={() => toggleDisponible(p.id, p.available)}
                    className="text-g500 hover:text-g300 transition-colors p-1 shrink-0"
                    aria-label={p.available ? `Marcar "${p.name}" como agotado` : `Marcar "${p.name}" como disponible`}
                    title={p.available ? "Marcar como agotado" : "Marcar como disponible"}
                  >
                    {p.available ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => eliminar(p.id, p.name)}
                    className="text-g500 hover:text-destructive transition-colors p-1 shrink-0"
                    aria-label={`Eliminar producto: ${p.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))
            )}
          </ul>
        </section>

      </div>
    </div>
  );
};

export default TiendaAdminPage;
