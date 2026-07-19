import { supabase } from "@/lib/supabase";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_urls: string[];
  buy_url: string | null;
  available: boolean;
  sort_order: number;
  created_at: string;
}

export type NewProduct = Pick<Product, "name" | "description" | "price" | "image_urls"> &
  Partial<Pick<Product, "buy_url" | "available" | "sort_order">>;

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createProduct(product: NewProduct) {
  const { error } = await supabase.from("products").insert(product);
  if (error) throw new Error(error.message);
}

export async function updateProduct(id: string, changes: Partial<NewProduct>) {
  const { error } = await supabase.from("products").update(changes).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export const fmtPrecio = (valor: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor);
