"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpicsOutputSchema = exports.EpicSchema = void 0;
exports.epicGenerator = epicGenerator;
const zod_1 = require("zod");
const llm_1 = require("../lib/llm");
const prompts_1 = require("@langchain/core/prompts");
const output_parsers_1 = require("@langchain/core/output_parsers");
// ─── Schema ──────────────────────────────────────────────────────────────────
exports.EpicSchema = zod_1.z.object({
    code: zod_1.z.string(),
    name: zod_1.z.string(),
    goal: zod_1.z.string(),
    priority: zod_1.z.enum(["High", "Medium", "Low"]),
    estimatedHours: zod_1.z.number(),
    scopeHighlights: zod_1.z.array(zod_1.z.string()),
    orderIndex: zod_1.z.number(),
});
exports.EpicsOutputSchema = zod_1.z.object({
    epics: zod_1.z.array(exports.EpicSchema),
});
// ─── Mock ────────────────────────────────────────────────────────────────────
const SDLC_PHASES = [
    {
        code: "EPIC-01",
        name: "Discovery & MVP Scoping",
        goal: "Validate requirements and define MVP scope with clear acceptance criteria.",
        priority: "High",
        estimatedHours: 32,
        scopeHighlights: [
            "User research and stakeholder interviews",
            "Feature prioritization using MoSCoW method",
            "Technical feasibility analysis",
            "API contract definitions",
            "Architecture decision records (ADRs)",
        ],
    },
    {
        code: "EPIC-02",
        name: "Architecture & Technical Setup",
        goal: "Establish a solid development foundation with CI/CD and infrastructure.",
        priority: "High",
        estimatedHours: 40,
        scopeHighlights: [
            "Development environment setup",
            "Database schema design",
            "Core API structure",
            "Authentication scaffold",
            "CI/CD pipeline configuration",
        ],
    },
    {
        code: "EPIC-03",
        name: "Core Feature Implementation",
        goal: "Build the essential features required for the MVP launch.",
        priority: "High",
        estimatedHours: 80,
        scopeHighlights: [
            "User authentication and authorization",
            "Primary feature CRUD operations",
            "Third-party API integrations",
            "Real-time data updates",
            "Error handling and validation",
        ],
    },
    {
        code: "EPIC-04",
        name: "UI/UX Polish & Responsiveness",
        goal: "Deliver a premium, accessible, and responsive user interface.",
        priority: "Medium",
        estimatedHours: 40,
        scopeHighlights: [
            "Design system implementation",
            "Mobile-responsive layouts",
            "Loading states and skeleton screens",
            "Form validation and error messages",
            "Accessibility audit (WCAG 2.1 AA)",
        ],
    },
    {
        code: "EPIC-05",
        name: "Testing & Quality Assurance",
        goal: "Ensure reliability and security before MVP launch.",
        priority: "Medium",
        estimatedHours: 32,
        scopeHighlights: [
            "Unit tests for business logic",
            "Integration tests for API endpoints",
            "End-to-end test for critical user flows",
            "Security audit and penetration testing",
            "Performance benchmarking",
        ],
    },
    {
        code: "EPIC-06",
        name: "Deployment & Launch",
        goal: "Deploy to production and execute a smooth launch.",
        priority: "High",
        estimatedHours: 24,
        scopeHighlights: [
            "Production environment configuration",
            "Database migration and seeding",
            "Monitoring and alerting setup",
            "Rollback procedures",
            "Post-launch support protocol",
        ],
    },
];
function mockEpics(requirements) {
    const count = requirements.suggestedEpicCount;
    const weeksPerEpic = requirements.timeline / count;
    const selectedPhases = SDLC_PHASES.slice(0, count);
    return selectedPhases.map((phase, i) => ({
        ...phase,
        estimatedHours: Math.round(phase.estimatedHours * (requirements.complexityLevel === "High" ? 1.3 : 1)),
        orderIndex: i,
    }));
}
// ─── Real LLM ────────────────────────────────────────────────────────────────
async function realEpics(requirements) {
    const llm = (0, llm_1.getLLM)("gpt-4o");
    const prompt = prompts_1.ChatPromptTemplate.fromTemplate(`
You are a senior engineering manager. Generate {epicCount} SDLC epics for the following product.
Focus on startup MVP delivery. Each epic should represent a major phase.

Product: {productName}
Objective: {coreObjective}
Features: {features}
Tech Stack: {techStack}
Timeline: {timeline} weeks
Complexity: {complexity}

Respond ONLY with valid JSON:
{{
  "epics": [
    {{
      "code": "EPIC-01",
      "name": string,
      "goal": string,
      "priority": "High" | "Medium" | "Low",
      "estimatedHours": number,
      "scopeHighlights": string[] (4-6 bullet points),
      "orderIndex": number
    }}
  ]
}}
`);
    const chain = prompt.pipe(llm).pipe(new output_parsers_1.JsonOutputParser());
    const result = await chain.invoke({
        epicCount: String(requirements.suggestedEpicCount),
        productName: requirements.productName,
        coreObjective: requirements.coreObjective,
        features: requirements.keyFeatures.join(", "),
        techStack: requirements.techStack.join(", "),
        timeline: String(requirements.timeline),
        complexity: requirements.complexityLevel,
    });
    return exports.EpicsOutputSchema.parse(result).epics;
}
// ─── Exported Agent ──────────────────────────────────────────────────────────
async function epicGenerator(requirements) {
    if (llm_1.AI_MODE === "mock") {
        await new Promise((r) => setTimeout(r, 500));
        return mockEpics(requirements);
    }
    return realEpics(requirements);
}
//# sourceMappingURL=epicGenerator.js.map