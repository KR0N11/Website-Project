import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const isConfigured = supabaseUrl.startsWith("http");

// Create a real client only when configured, otherwise create a dummy that returns empty results
export const supabase: SupabaseClient = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new Proxy({} as SupabaseClient, {
      get() {
        const handler = () =>
          new Proxy(
            {},
            {
              get() {
                return handler;
              },
              apply() {
                return Promise.resolve({ data: null, error: null });
              },
            },
          );
        return handler;
      },
    });

export { isConfigured as isSupabaseConfigured };
