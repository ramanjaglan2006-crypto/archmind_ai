import { NextRequest, NextResponse } from "next/server";
import { generateArchitecture } from "@/lib/gemini";
import { supabase } from "@/lib/supabase";
import { searchPatterns, formatPatternsAsContext } from "@/services/vectorSearch";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json(
                { error: "Prompt is required" },
                { status: 400 }
            );
        }

        let ragContext = "";
        try {
            const patterns = await searchPatterns(prompt, 5);
            if (patterns.length > 0) {
                ragContext = formatPatternsAsContext(patterns);
                console.log(
                    `RAG: Retrieved ${patterns.length} patterns:`,
                    patterns.map((p) => `${p.title} (${(p.similarity * 100).toFixed(1)}%)`).join(", ")
                );
            }
        } catch (ragError) {
            console.warn("RAG retrieval failed, proceeding without context:", ragError);
        }

        const result = await generateArchitecture(prompt, ragContext || undefined);

        let savedId = Date.now().toString();
        try {
            if (supabase) {
                const { data, error } = await supabase
                    .from("prompts")
                    .insert([{ prompt, result }])
                    .select()
                    .single();

                if (error) {
                    console.warn("Supabase save error:", error.message);
                } else if (data) {
                    savedId = data.id.toString();
                }
            }
        } catch (e) {
            console.warn("Skipping DB save:", e);
        }

        return NextResponse.json({ id: savedId, result });
    } catch (error: any) {
        console.error("API Generation Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate architecture" },
            { status: 500 }
        );
    }
}
