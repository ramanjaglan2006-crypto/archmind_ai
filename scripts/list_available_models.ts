import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY || "";
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await axios.get(url);
        console.log("Models available:");
        response.data.models.forEach((model: any) => {
            console.log(`- ${model.name} (${model.supportedGenerationMethods.join(", ")})`);
        });
    } catch (error: any) {
        if (error.response) {
            console.error("Failed to list models:", error.response.status, error.response.data);
        } else {
            console.error("Error:", error.message);
        }
    }
}

listModels().catch(console.error);
