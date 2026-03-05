import { AI_MODE, getLLM } from "../lib/llm";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { AssignedTask, TeamMemberInput } from "./assignmentAgent";
import { GeneratedEpic } from "./epicGenerator";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GeneratedWarning {
    severity: "Critical" | "High" | "Medium";
    title: string;
    affectedArea: string;
    icon: string;
    problem: string;
    recommendations: string[];
    actionLabel: string;
}

// ─── Mock Risk Detection ──────────────────────────────────────────────────────

function mockRisks(
    tasks: AssignedTask[],
    team: TeamMemberInput[],
    epics: GeneratedEpic[]
): GeneratedWarning[] {
    const warnings: GeneratedWarning[] = [];

    // 1. Single Point of Failure: any team member with > 60% of tasks
    if (team.length > 0) {
        const taskCounts: Record<string, number> = {};
        tasks.forEach((t) => {
            taskCounts[t.assigneeName] = (taskCounts[t.assigneeName] || 0) + 1;
        });

        const overloaded = Object.entries(taskCounts).find(
            ([, count]) => count / tasks.length > 0.5
        );

        if (overloaded) {
            warnings.push({
                severity: "Critical",
                title: "Single Point of Failure",
                affectedArea: `Affects ${epics.length} Epics`,
                icon: "person_off",
                problem: `${overloaded[0]} is assigned to ${((overloaded[1] / tasks.length) * 100).toFixed(0)}% of all tasks. If unavailable, the entire project is at risk.`,
                recommendations: [
                    `Cross-train another team member to cover ${overloaded[0]}'s responsibilities`,
                    "Redistribute high-priority tasks to improve workload balance",
                    "Pair-program critical tasks to share knowledge",
                ],
                actionLabel: "Rebalance Tasks",
            });
        }
    }

    // 2. Timeline risk: if total hours exceed available capacity
    const totalHours = tasks.reduce((sum, t) => sum + t.effort, 0);
    const totalCapacityHours = team.reduce(
        (sum, m) => sum + m.weeklyHours * (epics.length > 0 ? epics.reduce((s, e) => s, 0) / team.length : 8),
        0
    );

    // Simplified: flag if avg task effort is high
    const avgEffort = totalHours / Math.max(tasks.length, 1);
    if (avgEffort > 16) {
        warnings.push({
            severity: "High",
            title: "Timeline Variance Risk",
            affectedArea: "Affects All Epics",
            icon: "schedule",
            problem: `Average task complexity is high (${avgEffort.toFixed(0)}h/task). Combined with unknowns and integration delays, the timeline may run 20-30% over.`,
            recommendations: [
                "Break down tasks > 16h into smaller sub-tasks",
                "Add a 20% buffer to the overall timeline estimate",
                "Identify the critical path and protect it from scope additions",
            ],
            actionLabel: "Review Timeline",
        });
    }

    // 3. Skill gap warning: if any task has 0 skill matches
    const unmatched = tasks.filter((t) => t.fitScore < 40 && team.length > 0);
    if (unmatched.length > 0) {
        warnings.push({
            severity: "Medium",
            title: "Skill Gap Detected",
            affectedArea: `${unmatched.length} Task${unmatched.length > 1 ? "s" : ""} Affected`,
            icon: "school",
            problem: `${unmatched.length} task(s) have no strong skill matches in the current team (fit score < 40). This may cause quality issues or delays.`,
            recommendations: [
                "Consider hiring a contractor for the identified skill gaps",
                "Allocate learning time (2-3h) for team members to upskill",
                "Pair low-fit assignees with a senior mentor",
            ],
            actionLabel: "Review Assignments",
        });
    }

    return warnings;
}

// ─── Real LLM ────────────────────────────────────────────────────────────────

async function realRisks(
    tasks: AssignedTask[],
    team: TeamMemberInput[],
    epics: GeneratedEpic[]
): Promise<GeneratedWarning[]> {
    const llm = getLLM("gpt-4o-mini");

    const taskSummary = tasks
        .slice(0, 20)
        .map((t) => `${t.name} (${t.effort}h, assigned: ${t.assigneeName}, fit: ${t.fitScore})`)
        .join("\n");

    const prompt = ChatPromptTemplate.fromTemplate(`
You are a risk assessment expert. Analyze this project plan and identify 2-4 key risks.

Team size: {teamSize}
Total tasks: {taskCount}
Total hours: {totalHours}
Timeline: {epicCount} epics

Task sample:
{tasks}

Respond ONLY with valid JSON array:
[{{
  "severity": "Critical" | "High" | "Medium",
  "title": string,
  "affectedArea": string,
  "icon": "warning" | "schedule" | "person_off" | "school" | "link_off",
  "problem": string,
  "recommendations": string[] (2-3 items),
  "actionLabel": string
}}]
`);

    const chain = prompt.pipe(llm).pipe(new JsonOutputParser());
    const result = (await chain.invoke({
        teamSize: String(team.length),
        taskCount: String(tasks.length),
        totalHours: String(tasks.reduce((s, t) => s + t.effort, 0)),
        epicCount: String(epics.length),
        tasks: taskSummary,
    })) as GeneratedWarning[];

    return Array.isArray(result) ? result : [];
}

// ─── Exported Agent ──────────────────────────────────────────────────────────

export async function riskDetector(
    tasks: AssignedTask[],
    team: TeamMemberInput[],
    epics: GeneratedEpic[]
): Promise<GeneratedWarning[]> {
    if (AI_MODE === "mock") {
        await new Promise((r) => setTimeout(r, 400));
        return mockRisks(tasks, team, epics);
    }
    return realRisks(tasks, team, epics);
}
