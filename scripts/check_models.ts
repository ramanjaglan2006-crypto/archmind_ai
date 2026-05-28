import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function checkModels() {
    const apiKey = process.env.GEMINI_API_KEY || "";
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        // There is no listModels in the browser/Node SDK directly without some specialized setup usually,
        // but we can try to catch the error when using a known model.
        console.log("Testing with models/text-embedding-004...");
        const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const result = await model.embedContent("test");
        console.log("text-embedding-004 worked!");
    } catch (e: any) {
        console.log("text-embedding-004 failed:", e.message);

        try {
            console.log("Testing with models/embedding-001...");
            const model = genAI.getGenerativeModel({ model: "embedding-001" });
            const result = await model.embedContent("test");
            console.log("embedding-001 worked!");
        } catch (e2: any) {
            console.log("embedding-001 failed:", e2.message);
        }
    }
}

checkModels().catch(console.error);
