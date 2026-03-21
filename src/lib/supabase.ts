import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const urlReady =
  supabaseUrl &&
  supabaseUrl !== "PENDIENTE_URL_DEL_PROYECTO" &&
  supabaseUrl.startsWith("https://");

if (!urlReady) {
  console.warn("⚠️  VITE_SUPABASE_URL no configurada. Agrega la URL de tu proyecto Supabase al archivo .env");
}

// Usa una URL válida de placeholder si la real aún no está configurada
// para evitar que el SDK crashee en desarrollo
export const supabase = createClient(
  urlReady ? supabaseUrl : "https://placeholder.supabase.co",
  supabaseAnonKey ?? "placeholder"
);

export const supabaseReady = urlReady;
