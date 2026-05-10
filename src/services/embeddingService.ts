import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateEmbedding(text: string): Promise<number[]> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not defined for embeddings");
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    try {
        const model = genAI.getGenerativeModel({ model: "models/gemini-embedding-001" });
        const result = await model.embedContent(text);
        return result.embedding.values;
    } catch (e: any) {
        console.error("Embedding service error:", e.message);
        throw e;
    }
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];

    for (const text of texts) {
        const embedding = await generateEmbedding(text);
        embeddings.push(embedding);
    }

    return embeddings;
}
