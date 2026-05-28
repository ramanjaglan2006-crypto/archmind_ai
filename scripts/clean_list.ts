import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY || "";
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const names = response.data.models.map((m: any) => m.name);
        console.log(names.join("\n"));
    } catch (error: any) {
        console.error("Error:", error.message);
    }
}

listModels().catch(console.error);
