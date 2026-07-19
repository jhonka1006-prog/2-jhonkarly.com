import { supabase, supabaseReady } from "@/lib/supabase";

/* ── Hitos de la trayectoria ── */
export interface Milestone {
  id: string;
  year_label: string;
  title: string;
  category: string;
  description: string | null;
  details: string[] | null;
  link_url: string | null;
  link_label: string | null;
  is_future: boolean;
  sort_order: number;
  created_at: string;
}

export type NewMilestone = Omit<Milestone, "id" | "created_at">;

/* ── Logros: medallas y récords ── */
export type Medal = 1 | 2 | 3;
export type Scope = "nacional" | "internacional";

export interface Achievement {
  id: string;
  title: string;
  event_name: string | null;
  year_label: string | null;
  medal: Medal | null;
  scope: Scope;
  is_record: boolean;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export type NewAchievement = Omit<Achievement, "id" | "created_at">;

/* ════════════════════════════════════════════════════════════
   Datos de respaldo — se muestran mientras Supabase no esté
   configurado o la tabla aún no exista (migración 008 sin
   ejecutar). En cuanto la base de datos responda, manda ella.
════════════════════════════════════════════════════════════ */
const base = { link_url: null, link_label: null, details: null, description: null, created_at: "" };

export const DEFAULT_MILESTONES: Milestone[] = [
  {
    ...base, id: "local-2028", year_label: "2028", title: "Juegos Paralímpicos — Los Ángeles",
    category: "Meta Paralímpica", is_future: true, sort_order: 10,
    description: "El objetivo máximo. Clasificar y competir en los Juegos Paralímpicos de Los Ángeles 2028 representando a Colombia en la máxima tarima del deporte paralímpico mundial. Cada entrenamiento desde hoy apunta a este momento.",
  },
  {
    ...base, id: "local-2026", year_label: "2026", title: "World Series Abu Dhabi",
    category: "Competencia Internacional", is_future: false, sort_order: 20,
    description: "Participación en el World Series de Abu Dhabi, consolidando presencia en el circuito paralímpico internacional y midiendo el nivel frente a los mejores nadadores del mundo.",
  },
  {
    ...base, id: "local-2025", year_label: "2025", title: "Bloque de Entrenamiento",
    category: "Preparación", is_future: false, sort_order: 30,
    description: "Ciclo intensivo de preparación física y técnica orientado al alto rendimiento paralímpico, afinando tiempos y construyendo la base para los próximos retos internacionales.",
  },
  {
    ...base, id: "local-2024", year_label: "2024", title: "I Juegos Paranacionales Juveniles",
    category: "Competencia Nacional", is_future: false, sort_order: 40,
    description: "Participación en los primeros Juegos Paranacionales Juveniles de Colombia. Competencia que consolidó la proyección nacional y reafirmó el compromiso con el alto rendimiento paralímpico.",
    link_url: "https://www.coldeportes.gov.co",
    link_label: "Jhonkarly Alvarez Pantoja | I Juegos Paranacionales Juveniles",
  },
  {
    ...base, id: "local-2023", year_label: "2023", title: "VI Juegos Paranacionales",
    category: "Representación Nacional", is_future: false, sort_order: 50,
    description: "Representación de Colombia en los VI Juegos Paranacionales. Competencia que marcó la consolidación a nivel nacional y el inicio de la proyección hacia el circuito paralímpico internacional.",
    link_url: "https://www.coldeportes.gov.co",
    link_label: "Jhonkarly Alvarez Pantoja | VI Juegos Paranacionales 2023",
  },
  {
    ...base, id: "local-2022", year_label: "2022", title: "Proyección Nacional",
    category: "Hito de Carrera", is_future: false, sort_order: 60,
    details: [
      "Participación en clasificatorios a Juegos Nacionales, entrando al circuito competitivo de alto rendimiento.",
      "Convocado en dos ocasiones a preselecciones Colombia con miras a los Juegos Panamericanos Juveniles 2023 en Bogotá.",
      "Aunque finalmente no se integró la delegación final, estas convocatorias consolidaron y reconocieron su nivel deportivo a escala nacional.",
    ],
  },
  {
    ...base, id: "local-2021", year_label: "2021", title: "Primera Competencia Oficial",
    category: "Diciembre 2021", is_future: false, sort_order: 70,
    description: "Participación en la primera competencia federada, marcando el inicio formal de la carrera competitiva en natación. El primer escalón de un recorrido construido desde la disciplina y la constancia.",
  },
  {
    ...base, id: "local-2010-2020", year_label: "2010–2020", title: "Formación y Desarrollo Competitivo",
    category: "Década de construcción", is_future: false, sort_order: 80,
    description: "Etapa de aprendizaje, perfeccionamiento técnico y construcción de base física dentro del proceso deportivo. Diez años forjando los cimientos de todo lo que vendría después.",
  },
  {
    ...base, id: "local-2010", year_label: "2010", title: "Inicio en la Natación",
    category: "Origen", is_future: false, sort_order: 90,
    description: "Comienzo en la natación a los 3 años, iniciando el proceso de formación deportiva y desarrollo técnico básico. El agua como primer lenguaje, la disciplina como primer hábito.",
  },
];

const baseLogro = { medal: null, is_record: false, description: null, created_at: "" };

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    ...baseLogro, id: "local-l1", title: "World Series Abu Dhabi",
    event_name: "Circuito Paralímpico Internacional", year_label: "2026",
    scope: "internacional", sort_order: 10,
    description: "Participación internacional midiendo el nivel frente a los mejores nadadores del mundo.",
  },
  {
    ...baseLogro, id: "local-l2", title: "I Juegos Paranacionales Juveniles",
    event_name: "Juegos Paranacionales Juveniles de Colombia", year_label: "2024",
    scope: "nacional", sort_order: 20,
    description: "Participación en los primeros Juegos Paranacionales Juveniles de Colombia, consolidando la proyección nacional.",
  },
  {
    ...baseLogro, id: "local-l3", title: "VI Juegos Paranacionales",
    event_name: "Juegos Paranacionales de Colombia", year_label: "2023",
    scope: "nacional", sort_order: 30,
    description: "Representación de Colombia en los VI Juegos Paranacionales, consolidación a nivel nacional.",
  },
  {
    ...baseLogro, id: "local-l4", title: "Preselección Colombia",
    event_name: "Juegos Panamericanos Juveniles 2023 — Bogotá", year_label: "2022",
    scope: "nacional", sort_order: 40,
    description: "Convocado en dos ocasiones a preselecciones Colombia, reconocimiento del nivel deportivo a escala nacional.",
  },
  {
    ...baseLogro, id: "local-l5", title: "Clasificatorios a Juegos Nacionales",
    event_name: null, year_label: "2022",
    scope: "nacional", sort_order: 50,
    description: "Ingreso al circuito competitivo de alto rendimiento.",
  },
];

/* ── Hitos: API ── */
export async function getMilestones(): Promise<Milestone[]> {
  if (!supabaseReady) return DEFAULT_MILESTONES;
  const { data, error } = await supabase
    .from("trajectory_milestones")
    .select("*")
    .order("sort_order", { ascending: true });
  // Si la tabla aún no existe (migración pendiente), mostramos el respaldo
  if (error) return DEFAULT_MILESTONES;
  return (data ?? []) as Milestone[];
}

export async function createMilestone(m: NewMilestone) {
  const { error } = await supabase.from("trajectory_milestones").insert(m);
  if (error) throw new Error(error.message);
}

export async function updateMilestone(id: string, m: NewMilestone) {
  const { error } = await supabase.from("trajectory_milestones").update(m).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteMilestone(id: string) {
  const { error } = await supabase.from("trajectory_milestones").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ── Logros: API ── */
export async function getAchievements(): Promise<Achievement[]> {
  if (!supabaseReady) return DEFAULT_ACHIEVEMENTS;
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .order("sort_order", { ascending: true });
  // Si la tabla aún no existe (migración pendiente), mostramos el respaldo
  if (error) return DEFAULT_ACHIEVEMENTS;
  return (data ?? []) as Achievement[];
}

export async function createAchievement(a: NewAchievement) {
  const { error } = await supabase.from("achievements").insert(a);
  if (error) throw new Error(error.message);
}

export async function updateAchievement(id: string, a: NewAchievement) {
  const { error } = await supabase.from("achievements").update(a).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteAchievement(id: string) {
  const { error } = await supabase.from("achievements").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
