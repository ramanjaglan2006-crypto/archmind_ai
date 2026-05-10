import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

export type ArchitecturePrompt = {
    id: string;
    created_at: string;
    prompt: string;
    result: ArchitectureResult;
};

export type ArchitectureResult = {
    architecture_explanation: string;
    architecture_diagram: string;
    database_schema: string;
    api_endpoints: string;
    tech_stack: string;
    folder_structure: string;
};
