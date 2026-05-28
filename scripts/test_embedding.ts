import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function testEmbedding() {
    const apiKey = process.env.GEMINI_API_KEY || "";
    console.log("Testing embedding with key:", apiKey.substring(0, 5) + "...");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "models/gemini-embedding-001" });

    try {
        const result = await model.embedContent("Hello World");
        console.log("Success! Embedding length:", result.embedding.values.length);
    } catch (error) {
        console.error("Embedding failed:", error);
    }
}

testEmbedding().catch(console.error);
