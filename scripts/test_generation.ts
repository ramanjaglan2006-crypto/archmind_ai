import { generateArchitecture } from "../src/lib/gemini";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function testGen() {
    console.log("Testing Gemini Architecture Generation...");
    console.log("Using API Key:", process.env.GEMINI_API_KEY?.substring(0, 5) + "...");

    try {
        const result = await generateArchitecture("Design a simple blog system");
        console.log("Success!");
        console.log(JSON.stringify(result, null, 2));
    } catch (error: any) {
        console.error("Generation failed:", error.message);
    }
}

testGen().catch(console.error);
