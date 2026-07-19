import { supabase } from "@/lib/supabase";

export interface Competition {
  id: string;
  event_name: string;
  location: string;
  event_date: string;
  race: string;
  mark: string;
  placement: string | null;
  result_url: string | null;
  created_at: string;
}

export type NewCompetition = Omit<Competition, "id" | "created_at">;

export async function getCompetitions(): Promise<Competition[]> {
  const { data, error } = await supabase
    .from("competitions")
    .select("*")
    .order("event_date", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Competition[];
}

export async function createCompetition(comp: NewCompetition) {
  const { error } = await supabase.from("competitions").insert(comp);
  if (error) throw new Error(error.message);
}

export async function deleteCompetition(id: string) {
  const { error } = await supabase.from("competitions").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
