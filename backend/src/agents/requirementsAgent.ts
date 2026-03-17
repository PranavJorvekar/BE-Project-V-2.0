import { z } from "zod";
import { getLLM, AI_MODE, withRetry } from "../lib/llm";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

export const RequirementsSchema = z.object({
    productName: z.string(),
    coreObjective: z.string(),
    targetUsers: z.string(),
    keyFeatures: z.array(z.string()),
    techStack: z.array(z.string()),
    priorities: z.array(z.string()),
    timeline: z.number(),
    complexityLevel: z.enum(["Low", "Medium", "High"]),
    suggestedEpicCount: z.number(),
});

export type Requirements = z.infer<typeof RequirementsSchema>;

// ─── Mock Response ──────────────────────────────────────────────────────────

function mockRequirements(input: {
    name: string;
    description: string;
    features: string[];
    techStack: string[];
    priorities: string[];
    timeline: number;
}): Requirements {
    return {
        productName: input.name,
        coreObjective: `Build a ${input.name}: ${input.description.slice(0, 100)}`,
        targetUsers: "Early-stage startup teams and technical founders",
        keyFeatures: input.features.length > 0 ? input.features : ["User authentication", "Core dashboard", "Data persistence", "API integrations"],
        techStack: input.techStack.length > 0 ? input.techStack : ["React", "Node.js", "PostgreSQL"],
        priorities: input.priorities.length > 0 ? input.priorities : ["Security", "Performance", "Scalability"],
        timeline: input.timeline,
        complexityLevel: input.timeline <= 6 ? "Medium" : "High",
        suggestedEpicCount: Math.min(6, Math.max(3, Math.floor(input.timeline / 2))),
    };
}

// ─── Real LLM Response ──────────────────────────────────────────────────────

async function realRequirements(input: {
    name: string;
    description: string;
    features: string[];
    techStack: string[];
    priorities: string[];
    timeline: number;
}): Promise<Requirements> {
    const llm = getLLM("openai/gpt-oss-120b");
    const prompt = ChatPromptTemplate.fromTemplate(`
You are a senior software architect. Parse the following product details into a structured requirements JSON.

Product Name: {name}
Description: {description}
Key Features: {features}
Tech Stack: {techStack}
Priorities: {priorities}
Timeline: {timeline} weeks

Respond ONLY with valid JSON matching this exact shape:
{{
  "productName": string,
  "coreObjective": string (1-2 sentences),
  "targetUsers": string,
  "keyFeatures": string[],
  "techStack": string[],
  "priorities": string[],
  "timeline": number,
  "complexityLevel": "Low" | "Medium" | "High",
  "suggestedEpicCount": number (3-6)
}}
`);

    const chain = prompt.pipe(llm).pipe(new JsonOutputParser());
    const result = await withRetry(() => chain.invoke({
        name: input.name,
        description: input.description,
        features: input.features.join(", "),
        techStack: input.techStack.join(", "),
        priorities: input.priorities.join(", "),
        timeline: String(input.timeline),
    }));

    return RequirementsSchema.parse(result);
}

// ─── Exported Agent ─────────────────────────────────────────────────────────

export async function requirementsAgent(input: {
    name: string;
    description: string;
    features: string[];
    techStack: string[];
    priorities: string[];
    timeline: number;
}): Promise<Requirements> {
    if (AI_MODE === "mock") {
        await new Promise((r) => setTimeout(r, 300)); // simulate latency
        return mockRequirements(input);
    }
    return realRequirements(input);
}
