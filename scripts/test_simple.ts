import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function testSimple() {
    const apiKey = process.env.GEMINI_API_KEY || "";
    console.log("API Key start:", apiKey.substring(0, 5));

    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        console.log("Calling generateContent...");
        const result = await model.generateContent("Hello!");
        console.log("Response:", result.response.text());
    } catch (error: any) {
        console.error("FULL ERROR:", error);
        if (error.status) console.error("Status:", error.status);
        if (error.response) console.error("Response:", error.response);
    }
}

testSimple();
