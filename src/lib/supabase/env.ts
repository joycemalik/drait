export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Without these the app runs in read-only demo mode on bundled sample data. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
