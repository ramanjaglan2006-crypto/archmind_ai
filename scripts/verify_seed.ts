import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function verify() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Fetching architecture patterns...");
    const { data, error } = await supabase
        .from("architecture_patterns")
        .select("id, title");

    if (error) {
        console.error("Error:", error.message);
    } else {
        console.log(`Found ${data?.length || 0} patterns.`);
        data?.forEach(p => console.log(`- ${p.title}`));
    }
}

verify().catch(console.error);
