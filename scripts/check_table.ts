import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function checkTable() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Checking if 'architecture_patterns' table exists...");
    const { error } = await supabase
        .from("architecture_patterns")
        .select("count", { count: "exact", head: true });

    if (error) {
        console.error("Error/Table might not exist:", error);
    } else {
        console.log("Table exists.");
    }
}

checkTable().catch(console.error);
