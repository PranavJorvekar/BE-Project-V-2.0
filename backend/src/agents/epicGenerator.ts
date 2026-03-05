import { z } from "zod";
import { getLLM, AI_MODE } from "../lib/llm";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { Requirements } from "./requirementsAgent";

// ─── Schema ──────────────────────────────────────────────────────────────────

export const EpicSchema = z.object({
    code: z.string(),
    name: z.string(),
    goal: z.string(),
    priority: z.enum(["High", "Medium", "Low"]),
    estimatedHours: z.number(),
    scopeHighlights: z.array(z.string()),
    orderIndex: z.number(),
});

export const EpicsOutputSchema = z.object({
    epics: z.array(EpicSchema),
});

export type GeneratedEpic = z.infer<typeof EpicSchema>;

// ─── Mock ────────────────────────────────────────────────────────────────────

const SDLC_PHASES = [
    {
        code: "EPIC-01",
        name: "Discovery & MVP Scoping",
        goal: "Validate requirements and define MVP scope with clear acceptance criteria.",
        priority: "High" as const,
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
        priority: "High" as const,
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
        priority: "High" as const,
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
        priority: "Medium" as const,
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
        priority: "Medium" as const,
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
        priority: "High" as const,
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

function mockEpics(requirements: Requirements): GeneratedEpic[] {
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

async function realEpics(requirements: Requirements): Promise<GeneratedEpic[]> {
    const llm = getLLM("gpt-4o");
    const prompt = ChatPromptTemplate.fromTemplate(`
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

    const chain = prompt.pipe(llm).pipe(new JsonOutputParser());
    const result = await chain.invoke({
        epicCount: String(requirements.suggestedEpicCount),
        productName: requirements.productName,
        coreObjective: requirements.coreObjective,
        features: requirements.keyFeatures.join(", "),
        techStack: requirements.techStack.join(", "),
        timeline: String(requirements.timeline),
        complexity: requirements.complexityLevel,
    });

    return EpicsOutputSchema.parse(result).epics;
}

// ─── Exported Agent ──────────────────────────────────────────────────────────

export async function epicGenerator(requirements: Requirements): Promise<GeneratedEpic[]> {
    if (AI_MODE === "mock") {
        await new Promise((r) => setTimeout(r, 500));
        return mockEpics(requirements);
    }
    return realEpics(requirements);
}
