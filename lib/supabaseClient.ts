import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);


// 2. CLIENTE PARA EL SERVIDOR (Server Actions / API)
// Este es el que necesita el truco del fetch para las RLS.
export const getSupabaseServer = async () => {
  const { cookies } = await import("next/headers"); // Importación dinámica para que no rompa el cliente
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
  });
};