import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY || "";
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await axios.get(url);
        console.log("TOTAL MODELS:", response.data.models.length);
        for (const model of response.data.models) {
            if (model.name.includes("flash")) {
                console.log(`FOUND: ${model.name}`);
            }
        }
    } catch (error: any) {
        console.error("Error:", error.message);
    }
}

listModels().catch(console.error);
