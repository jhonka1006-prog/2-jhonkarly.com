import { supabase } from "@/lib/supabase";

const BUCKET = "media";

/** Nombre de archivo seguro: sin acentos, espacios ni caracteres raros */
const sanitize = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .toLowerCase();

/**
 * Sube un archivo al bucket público "media" y devuelve su URL pública.
 * @param folder carpeta lógica: "tienda" | "prensa" | "kit" …
 */
export async function uploadPublicFile(folder: string, file: File): Promise<string> {
  const path = `${folder}/${Date.now()}-${sanitize(file.name)}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
