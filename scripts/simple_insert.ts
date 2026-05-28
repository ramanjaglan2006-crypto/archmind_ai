import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function simpleInsert() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Inserting test pattern...");
    const { data, error } = await supabase
        .from("architecture_patterns")
        .insert({ title: "Test", description: "Test description" })
        .select();

    if (error) {
        console.error("Insert error:", error.message);
    } else {
        console.log("Insert success:", data);
    }
}

simpleInsert().catch(console.error);
