import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        if (!supabase) {
            return NextResponse.json({ history: [] });
        }

        const { data, error } = await supabase
            .from("prompts")
            .select("id, created_at, prompt")
            .order("created_at", { ascending: false })
            .limit(20);

        if (error) {
            console.warn("Supabase fetch error:", error.message);
            return NextResponse.json({ history: [] });
        }

        return NextResponse.json({ history: data || [] });
    } catch (error) {
        console.error("History API Error:", error);
        return NextResponse.json({ history: [] });
    }
}
