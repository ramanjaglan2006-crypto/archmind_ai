import { GoogleGenerativeAI } from "@google/generative-ai";
import { ArchitectureResult } from "./supabase";


const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_ARCHITECTURE: ArchitectureResult = {
    architecture_explanation: "This is a pre-generated high-quality system architecture for a scalable web application. It uses a microservices approach to ensure independent scalability and fault tolerance. The front-end consists of a React-based SPA served via a CDN, while the back-end services are containerized and orchestrated via Kubernetes. A distributed caching layer (Redis) is used to reduce database load, and an asynchronous messaging system (Kafka) handles inter-service communication.",
    architecture_diagram: "graph TD\n  Client[Web/Mobile Client] --> API[API Gateway]\n  API --> ServiceA[User Service]\n  API --> ServiceB[Order Service]\n  API --> ServiceC[Catalog Service]\n  ServiceA --> DBA[(User DB)]\n  ServiceB --> DBB[(Order DB)]\n  ServiceC --> DBC[(Catalog DB)]\n  ServiceB --> MQ[Message Queue]\n  MQ --> ServiceAnalytics[Analytics Service]",
    database_schema: "erDiagram\n  USER ||--o{ ORDER : places\n  ORDER ||--|{ ORDER_ITEM : contains\n  PRODUCT ||--o{ ORDER_ITEM : included_in\n  USER {\n    string id\n    string email\n    string name\n  }\n  ORDER {\n    string id\n    timestamp created_at\n    float total\n  }",
    api_endpoints: "- GET /api/v1/health: Health check\n- POST /api/v1/auth/login: User authentication\n- GET /api/v1/products: List all products\n- GET /api/v1/orders: Get user order history\n- POST /api/v1/orders: Place a new order",
    tech_stack: "- **Frontend**: Next.js, Tailwind CSS, Shadcn UI\n- **Backend**: Node.js, Express, TypeScript\n- **Database**: PostgreSQL (Supabase)\n- **Caching**: Redis\n- **Infrastructure**: AWS (ALB, ECS, RDS)",
    folder_structure: "project-root/\n├── src/\n│   ├── app/\n│   ├── components/\n│   ├── services/\n│   ├── lib/\n│   └── types/\n├── public/\n├── supabase/\n│   └── migrations/\n├── package.json\n└── tsconfig.json"
};

async function callGeminiWithRetry(
    model: any,
    prompt: string,
    maxRetries = 3
): Promise<string> {
    let lastError: any = null;
    for (let i = 0; i < maxRetries; i++) {
        try {
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (error: any) {
            lastError = error;
            if (error.status === 429 || error.message?.includes("429")) {
                const waitTime = Math.pow(2, i) * 1000 + Math.random() * 1000;
                console.warn(`Rate limit hit. Retrying in ${Math.round(waitTime)}ms...`);
                await sleep(waitTime);
                continue;
            }
            throw error;
        }
    }
    throw lastError;
}

export async function generateArchitecture(
    prompt: string,
    ragContext?: string
): Promise<ArchitectureResult> {
    const apiKey = process.env.GEMINI_API_KEY;
    const useMock = process.env.ENABLE_MOCK_FALLBACK === 'true';

    if (!apiKey && !useMock) {
        throw new Error("GEMINI_API_KEY is not defined");
    }

    const ragSection = ragContext
        ? `\n\nExpert context from knowledge base:\n${ragContext}\n`
        : "";

    const systemInstruction = `You are a Senior Software Architect. Return valid JSON only.
Structure:
{
  "architecture_explanation": "...",
  "architecture_diagram": "...",
  "database_schema": "...",
  "api_endpoints": "...",
  "tech_stack": "...",
  "folder_structure": "..."
}
${ragSection}`;

    const fullPrompt = `${systemInstruction}\n\nUser Request: ${prompt}`;

    try {
        if (!apiKey && useMock) {
            console.log("Mock Mode: No API key found, returning mock response.");
            return MOCK_ARCHITECTURE;
        }

        const genAI = new GoogleGenerativeAI(apiKey!);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                temperature: 0.7,
                responseMimeType: "application/json",
            },
        });

        const text = await callGeminiWithRetry(model, fullPrompt);

        // Remove potential markdown wrappers
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(cleanedText) as ArchitectureResult;
    } catch (error: any) {
        console.error("Gemini Error:", error.message);

        if (useMock || error.status === 429 || error.message?.includes("429")) {
            console.warn("Falling back to mock architecture due to API issues.");
            return MOCK_ARCHITECTURE;
        }

        throw new Error(`AI generation failed: ${error.message}`);
    }
}
