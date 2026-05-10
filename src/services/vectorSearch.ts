import { supabase } from "@/lib/supabase";
import { generateEmbedding } from "./embeddingService";

export interface PatternMatch {
    id: string;
    title: string;
    description: string;
    similarity: number;
}

export async function searchPatterns(query: string, limit: number = 5): Promise<PatternMatch[]> {
    if (!supabase) {
        console.warn("Supabase not configured, skipping vector search.");
        return [];
    }

    const embedding = await generateEmbedding(query);

    try {
        const { data, error } = await supabase.rpc("match_architecture_patterns", {
            query_embedding: embedding,
            match_threshold: 0.3,
            match_count: limit,
        });

        if (error) {
            console.error("Vector search error (check if SQL migration was run):", error.message);
            return [];
        }

        return (data || []).map((row: { id: string; title: string; description: string; similarity: number }) => ({
            id: row.id,
            title: row.title,
            description: row.description,
            similarity: row.similarity,
        }));
    } catch (err: any) {
        console.error("Unexpected vector search crash:", err.message);
        return [];
    }
}

export function formatPatternsAsContext(patterns: PatternMatch[]): string {
    if (patterns.length === 0) return "";

    const sections = patterns.map(
        (p, i) =>
            `### Pattern ${i + 1}: ${p.title} (Relevance: ${(p.similarity * 100).toFixed(1)}%)\n${p.description}`
    );

    return `## Relevant Architecture Patterns from Knowledge Base\nUse these patterns as references when designing the system. Apply them where appropriate.\n\n${sections.join("\n\n")}`;
}
