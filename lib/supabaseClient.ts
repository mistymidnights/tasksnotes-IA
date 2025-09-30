import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ ERROR: Variables de Supabase no definidas");
  console.log("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl);
  console.log(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY:",
    supabaseAnonKey ? "DEFINIDA" : "NO DEFINIDA"
  );

  throw new Error(`
    Missing Supabase environment variables. 
    Please check your .env.local file:
    - NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl || "MISSING"}
    - NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey ? "DEFINED" : "MISSING"}
  `);
}

console.log("✅ Supabase configurado correctamente");
console.log("URL:", supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
});
