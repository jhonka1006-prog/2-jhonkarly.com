import { supabase } from "@/lib/supabase";

export type KitKind = "kit_es" | "kit_en" | "historia";

export interface KitFile {
  kind: KitKind;
  file_url: string;
  file_name: string | null;
  updated_at: string;
}

export const KIT_INFO: Record<KitKind, { titulo: string; desc: string }> = {
  kit_es: {
    titulo: "Kit de prensa — Español",
    desc: "Biografía oficial, fotografías en alta resolución y logotipos, listos para medios hispanohablantes.",
  },
  kit_en: {
    titulo: "Press kit — English",
    desc: "Official biography, high-resolution photos and logos for international media.",
  },
  historia: {
    titulo: "Mi historia — PDF",
    desc: "El relato integral de Jhonkarly: de los primeros metros en el agua al camino paralímpico.",
  },
};

export async function getKitFiles(): Promise<KitFile[]> {
  const { data, error } = await supabase.from("press_kit_files").select("*");
  if (error) throw new Error(error.message);
  return (data ?? []) as KitFile[];
}

export async function upsertKitFile(kind: KitKind, file_url: string, file_name: string) {
  const { error } = await supabase
    .from("press_kit_files")
    .upsert({ kind, file_url, file_name, updated_at: new Date().toISOString() }, { onConflict: "kind" });
  if (error) throw new Error(error.message);
}
