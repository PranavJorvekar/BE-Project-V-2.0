import { z } from "zod";
import { getLLM, AI_MODE } from "../lib/llm";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { GeneratedEpic } from "./epicGenerator";
import { Requirements } from "./requirementsAgent";

// ─── Schema ──────────────────────────────────────────────────────────────────

export const TaskSchema = z.object({
    name: z.string(),
    description: z.string(),
    skills: z.array(z.string()),
    effort: z.number(),
    priority: z.enum(["High", "Medium", "Low"]),
    definitionOfDone: z.array(z.object({ id: z.number(), text: z.string(), done: z.boolean() })),
    orderIndex: z.number(),
});

export const TasksForEpicSchema = z.object({
    tasks: z.array(TaskSchema),
});

export type GeneratedTask = z.infer<typeof TaskSchema> & { epicCode: string };

// ─── Task Templates per SDLC Phase ───────────────────────────────────────────

const EPIC_TASKS: Record<string, Omit<GeneratedTask, "epicCode">[]> = {
    "EPIC-01": [
        { name: "Define core data entities & relations", description: "Model the main domain entities (users, projects, etc.) and define relationships between them.", skills: ["System Design", "Database Design"], effort: 8, priority: "High", definitionOfDone: [{ id: 1, text: "Entity-relationship diagram created", done: false }, { id: 2, text: "Data dictionary documented", done: false }], orderIndex: 0 },
        { name: "Write user stories and acceptance criteria", description: "Document all user-facing features as user stories with clear acceptance criteria.", skills: ["Product Management", "Technical Writing"], effort: 6, priority: "High", definitionOfDone: [{ id: 1, text: "All stories in backlog", done: false }, { id: 2, text: "Acceptance criteria reviewed", done: false }], orderIndex: 1 },
        { name: "Technical feasibility analysis", description: "Assess technical risks, third-party API limitations, and potential blockers.", skills: ["System Architecture", "Research"], effort: 8, priority: "High", definitionOfDone: [{ id: 1, text: "Risk register created", done: false }, { id: 2, text: "Go/no-go decision documented", done: false }], orderIndex: 2 },
        { name: "API contract definitions (OpenAPI spec)", description: "Define all API endpoints, request/response shapes, and error codes using OpenAPI 3.x.", skills: ["API Design", "OpenAPI"], effort: 10, priority: "Medium", definitionOfDone: [{ id: 1, text: "OpenAPI spec complete", done: false }, { id: 2, text: "Endpoints reviewed with team", done: false }], orderIndex: 3 },
    ],
    "EPIC-02": [
        { name: "Set up project boilerplate & CI/CD pipeline", description: "Initialize the project with linting, formatting, git hooks, and automated CI/CD pipeline.", skills: ["DevOps", "GitHub Actions", "TypeScript"], effort: 12, priority: "High", definitionOfDone: [{ id: 1, text: "Repo initialized with ESLint + Prettier", done: false }, { id: 2, text: "CI pipeline runs on PR", done: false }], orderIndex: 0 },
        { name: "Design and implement database schema", description: "Create database migrations and seed scripts for all core entities.", skills: ["PostgreSQL", "Prisma", "Database Design"], effort: 8, priority: "High", definitionOfDone: [{ id: 1, text: "All migrations run cleanly", done: false }, { id: 2, text: "Seed data verified", done: false }], orderIndex: 1 },
        { name: "OAuth integration (Google + GitHub)", description: "Implement OAuth 2.0 flows for Google and GitHub sign-in using Clerk or NextAuth.", skills: ["OAuth", "Node.js", "Security"], effort: 16, priority: "High", definitionOfDone: [{ id: 1, text: "Google OAuth working", done: false }, { id: 2, text: "GitHub OAuth working", done: false }, { id: 3, text: "Session management verified", done: false }], orderIndex: 2 },
        { name: "Containerize services with Docker", description: "Create Dockerfiles and docker-compose for local development environment.", skills: ["Docker", "DevOps"], effort: 8, priority: "Medium", definitionOfDone: [{ id: 1, text: "docker-compose up works", done: false }, { id: 2, text: "Environment variables documented", done: false }], orderIndex: 3 },
    ],
    "EPIC-03": [
        { name: "Implement CRUD API endpoints", description: "Build all create, read, update, delete endpoints with proper validation and error handling.", skills: ["Node.js", "TypeScript", "REST API"], effort: 20, priority: "High", definitionOfDone: [{ id: 1, text: "All endpoints return correct status codes", done: false }, { id: 2, text: "Request validation via Zod", done: false }], orderIndex: 0 },
        { name: "Role-based access control (RBAC)", description: "Implement permission checks at API layer for admin, manager, member, and viewer roles.", skills: ["Security", "Node.js", "TypeScript"], effort: 12, priority: "High", definitionOfDone: [{ id: 1, text: "All routes protected by role middleware", done: false }, { id: 2, text: "Permission matrix tested", done: false }], orderIndex: 1 },
        { name: "Third-party API integrations", description: "Integrate with external APIs identified in requirements (e.g., payment, email, analytics).", skills: ["API Integration", "Node.js", "Webhooks"], effort: 24, priority: "Medium", definitionOfDone: [{ id: 1, text: "Integration tested end-to-end", done: false }, { id: 2, text: "Error handling for external failures", done: false }], orderIndex: 2 },
        { name: "Real-time data features (WebSocket/SSE)", description: "Implement real-time updates for collaborative or live-data features using WebSockets or Server-Sent Events.", skills: ["WebSocket", "Node.js", "TypeScript"], effort: 16, priority: "Medium", definitionOfDone: [{ id: 1, text: "Real-time connection stable", done: false }, { id: 2, text: "Reconnection logic implemented", done: false }], orderIndex: 3 },
        { name: "Background job processing", description: "Set up BullMQ queues for long-running operations (AI generation, exports, emails).", skills: ["BullMQ", "Redis", "Node.js"], effort: 12, priority: "Medium", definitionOfDone: [{ id: 1, text: "Jobs process reliably", done: false }, { id: 2, text: "Retry logic configured", done: false }], orderIndex: 4 },
    ],
    "EPIC-04": [
        { name: "Design system & component library", description: "Build reusable UI components following the design system (tokens, typography, spacing).", skills: ["React", "CSS", "Storybook"], effort: 20, priority: "Medium", definitionOfDone: [{ id: 1, text: "Core components documented", done: false }, { id: 2, text: "Design tokens applied consistently", done: false }], orderIndex: 0 },
        { name: "Responsive layout implementation", description: "Make all pages fully responsive from mobile (375px) to desktop (1440px).", skills: ["CSS", "React", "Tailwind CSS"], effort: 16, priority: "Medium", definitionOfDone: [{ id: 1, text: "Tested on mobile/tablet/desktop", done: false }, { id: 2, text: "No horizontal scroll on mobile", done: false }], orderIndex: 1 },
        { name: "Loading states, skeleton screens, and error boundaries", description: "Implement loading, empty, error states for all async operations.", skills: ["React", "TypeScript"], effort: 8, priority: "Low", definitionOfDone: [{ id: 1, text: "All async operations show loader", done: false }, { id: 2, text: "Error boundaries catch runtime errors", done: false }], orderIndex: 2 },
        { name: "Accessibility audit and fixes (WCAG 2.1 AA)", description: "Run accessibility audit and fix all critical issues.", skills: ["Accessibility", "HTML", "ARIA"], effort: 8, priority: "Medium", definitionOfDone: [{ id: 1, text: "0 critical a11y errors", done: false }, { id: 2, text: "Keyboard navigation verified", done: false }], orderIndex: 3 },
    ],
    "EPIC-05": [
        { name: "Unit tests for business logic", description: "Write unit tests for all service functions, utility helpers, and API handlers.", skills: ["Testing", "Vitest", "TypeScript"], effort: 16, priority: "Medium", definitionOfDone: [{ id: 1, text: "Test coverage ≥ 70%", done: false }, { id: 2, text: "All tests pass in CI", done: false }], orderIndex: 0 },
        { name: "Integration tests for API endpoints", description: "Write integration tests covering all CRUD operations and auth flows.", skills: ["Testing", "Supertest", "Node.js"], effort: 12, priority: "Medium", definitionOfDone: [{ id: 1, text: "All API routes tested", done: false }, { id: 2, text: "Database transactions verified", done: false }], orderIndex: 1 },
        { name: "End-to-end (E2E) tests for critical flows", description: "Implement Playwright E2E tests for registration, login, and core user journey.", skills: ["Playwright", "E2E Testing"], effort: 12, priority: "Medium", definitionOfDone: [{ id: 1, text: "E2E tests run in CI", done: false }, { id: 2, text: "Core user journey verified", done: false }], orderIndex: 2 },
        { name: "Security audit and penetration testing basics", description: "Review for OWASP Top 10 vulnerabilities, test authentication edge cases.", skills: ["Security", "OWASP"], effort: 8, priority: "High", definitionOfDone: [{ id: 1, text: "OWASP Top 10 checklist reviewed", done: false }, { id: 2, text: "Critical vulnerabilities resolved", done: false }], orderIndex: 3 },
    ],
    "EPIC-06": [
        { name: "Production environment setup", description: "Configure Vercel (frontend) and Railway/Render (backend) production environments.", skills: ["DevOps", "Vercel", "Railway"], effort: 8, priority: "High", definitionOfDone: [{ id: 1, text: "Prod environments live", done: false }, { id: 2, text: "Environment variables configured", done: false }], orderIndex: 0 },
        { name: "Production database migration and seeding", description: "Run migrations on production PostgreSQL and seed initial data.", skills: ["PostgreSQL", "Prisma", "DevOps"], effort: 4, priority: "High", definitionOfDone: [{ id: 1, text: "Migrations applied cleanly", done: false }, { id: 2, text: "Rollback procedure documented", done: false }], orderIndex: 1 },
        { name: "Monitoring, alerting, and logging setup", description: "Configure Sentry for error tracking and set up alerts for critical thresholds.", skills: ["Sentry", "DevOps", "Monitoring"], effort: 6, priority: "Medium", definitionOfDone: [{ id: 1, text: "Sentry integrated", done: false }, { id: 2, text: "Alerts configured", done: false }], orderIndex: 2 },
        { name: "Launch checklist and go-live", description: "Complete the pre-launch checklist, do a final smoke test, and execute the launch.", skills: ["Product Management", "DevOps"], effort: 4, priority: "High", definitionOfDone: [{ id: 1, text: "Checklist completed", done: false }, { id: 2, text: "Product live in production", done: false }], orderIndex: 3 },
    ],
};

// ─── Mock ────────────────────────────────────────────────────────────────────

function mockTasks(epics: GeneratedEpic[]): GeneratedTask[] {
    const all: GeneratedTask[] = [];
    epics.forEach((epic) => {
        const epicTasks = EPIC_TASKS[epic.code] || EPIC_TASKS["EPIC-03"];
        epicTasks.forEach((t) => all.push({ ...t, epicCode: epic.code }));
    });
    return all;
}

// ─── Real LLM ────────────────────────────────────────────────────────────────

async function realTasks(epics: GeneratedEpic[], requirements: Requirements): Promise<GeneratedTask[]> {
    const llm = getLLM("gpt-4o");
    const all: GeneratedTask[] = [];

    for (const epic of epics) {
        const prompt = ChatPromptTemplate.fromTemplate(`
You are a senior tech lead. Break down this epic into 4-6 specific, actionable engineering tasks.
Each task should be completable by one developer in 4-24 hours.

Epic: {epicName}
Goal: {epicGoal}
Product: {productName} — {coreObjective}
Tech Stack: {techStack}

Respond ONLY with valid JSON:
{{
  "tasks": [
    {{
      "name": string,
      "description": string (2-3 sentences),
      "skills": string[] (2-4 skills),
      "effort": number (hours, 4-24),
      "priority": "High" | "Medium" | "Low",
      "definitionOfDone": [{{ "id": number, "text": string, "done": false }}],
      "orderIndex": number
    }}
  ]
}}
`);
        const chain = prompt.pipe(llm).pipe(new JsonOutputParser());
        const result = await chain.invoke({
            epicName: epic.name,
            epicGoal: epic.goal,
            productName: requirements.productName,
            coreObjective: requirements.coreObjective,
            techStack: requirements.techStack.join(", "),
        });
        const parsed = TasksForEpicSchema.parse(result);
        parsed.tasks.forEach((t) => all.push({ ...t, epicCode: epic.code }));
    }
    return all;
}

// ─── Exported Agent ──────────────────────────────────────────────────────────

export async function taskBreaker(
    epics: GeneratedEpic[],
    requirements: Requirements
): Promise<GeneratedTask[]> {
    if (AI_MODE === "mock") {
        await new Promise((r) => setTimeout(r, 800));
        return mockTasks(epics);
    }
    return realTasks(epics, requirements);
}
