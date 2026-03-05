"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequirementsSchema = void 0;
exports.requirementsAgent = requirementsAgent;
const zod_1 = require("zod");
const llm_1 = require("../lib/llm");
const prompts_1 = require("@langchain/core/prompts");
const output_parsers_1 = require("@langchain/core/output_parsers");
// ─── Zod Schemas ──────────────────────────────────────────────────────────────
exports.RequirementsSchema = zod_1.z.object({
    productName: zod_1.z.string(),
    coreObjective: zod_1.z.string(),
    targetUsers: zod_1.z.string(),
    keyFeatures: zod_1.z.array(zod_1.z.string()),
    techStack: zod_1.z.array(zod_1.z.string()),
    priorities: zod_1.z.array(zod_1.z.string()),
    timeline: zod_1.z.number(),
    complexityLevel: zod_1.z.enum(["Low", "Medium", "High"]),
    suggestedEpicCount: zod_1.z.number(),
});
// ─── Mock Response ──────────────────────────────────────────────────────────
function mockRequirements(input) {
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
async function realRequirements(input) {
    const llm = (0, llm_1.getLLM)("gpt-4o-mini");
    const prompt = prompts_1.ChatPromptTemplate.fromTemplate(`
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
    const chain = prompt.pipe(llm).pipe(new output_parsers_1.JsonOutputParser());
    const result = await chain.invoke({
        name: input.name,
        description: input.description,
        features: input.features.join(", "),
        techStack: input.techStack.join(", "),
        priorities: input.priorities.join(", "),
        timeline: String(input.timeline),
    });
    return exports.RequirementsSchema.parse(result);
}
// ─── Exported Agent ─────────────────────────────────────────────────────────
async function requirementsAgent(input) {
    if (llm_1.AI_MODE === "mock") {
        await new Promise((r) => setTimeout(r, 300)); // simulate latency
        return mockRequirements(input);
    }
    return realRequirements(input);
}
//# sourceMappingURL=requirementsAgent.js.map