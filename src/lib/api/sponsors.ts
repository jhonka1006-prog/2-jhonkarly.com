import { supabase } from "@/lib/supabase";

export interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
  link_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface NuevoSponsor {
  name: string;
  logo_url: string;
  link_url?: string | null;
  sort_order?: number;
}

export async function getSponsors(): Promise<Sponsor[]> {
  const { data, error } = await supabase
    .from("sponsors")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as Sponsor[];
}

export async function crearSponsor(sponsor: NuevoSponsor): Promise<void> {
  const { error } = await supabase.from("sponsors").insert({
    name: sponsor.name,
    logo_url: sponsor.logo_url,
    link_url: sponsor.link_url || null,
    sort_order: sponsor.sort_order ?? 0,
  });
  if (error) throw new Error(error.message);
}

export async function eliminarSponsor(id: string): Promise<void> {
  const { error } = await supabase.from("sponsors").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
