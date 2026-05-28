import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function verifyKey() {
    const apiKey = process.env.GEMINI_API_KEY || "";
    console.log("Verifying key...");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const result = await model.generateContent("Hello");
        console.log("Content generation worked!");
        console.log("Response:", result.response.text());
    } catch (error: any) {
        console.error("Content generation failed:", error.message);
    }
}

verifyKey().catch(console.error);
