import { createClient } from '@supabase/supabase-js';

// Basic client for client-side usage (limited by RLS)
// For server-side actions, we'll use @supabase/ssr in the future if needed, 
// but for this MVP standard client is often sufficient for public reads.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

console.log("DEBUG: Supabase Config", {
    url: supabaseUrl ? "Found" : "Missing",
    key: supabaseKey ? "Found" : "Missing",
    allEnvKeys: Object.keys(process.env).filter(k => k.startsWith("NEXT_PUBLIC_"))
});

if (!supabaseUrl || !supabaseKey) {
    console.warn("Missing Supabase environment variables. Please check your .env.local file.");
}

export const supabase = createClient(supabaseUrl || "", supabaseKey || "");
