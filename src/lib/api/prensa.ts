import { supabase } from "@/lib/supabase";

export interface PressNote {
  id: string;
  title: string;
  outlet: string;
  url: string;
  published: string;
  created_at: string;
}

export interface PressPhoto {
  id: string;
  url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
}

/* ── Notas de prensa (GET / POST / DELETE) ── */

export async function getPressNotes(): Promise<PressNote[]> {
  const { data, error } = await supabase
    .from("press_notes")
    .select("*")
    .order("published", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createPressNote(note: Pick<PressNote, "title" | "outlet" | "url" | "published">) {
  const { error } = await supabase.from("press_notes").insert(note);
  if (error) throw new Error(error.message);
}

export async function deletePressNote(id: string) {
  const { error } = await supabase.from("press_notes").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ── Galería de fotos (GET / POST / DELETE) ── */

export async function getPressPhotos(): Promise<PressPhoto[]> {
  const { data, error } = await supabase
    .from("press_photos")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createPressPhoto(photo: { url: string; caption?: string; sort_order?: number }) {
  const { error } = await supabase.from("press_photos").insert(photo);
  if (error) throw new Error(error.message);
}

export async function deletePressPhoto(id: string) {
  const { error } = await supabase.from("press_photos").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
