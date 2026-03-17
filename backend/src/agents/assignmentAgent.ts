import { z } from "zod";
import { getLLM, AI_MODE, withRetry } from "../lib/llm";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { GeneratedTask } from "./taskBreaker";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TeamMemberInput {
    id: string;
    name: string;
    initials: string;
    role: string;
    skills: string[];
    experience: string;
    weeklyHours: number;
}

export interface AssignedTask extends GeneratedTask {
    assigneeId: string;
    assigneeName: string;
    assigneeInitials: string;
    assigneeRole: string;
    fitScore: number;
    aiReasoning: string;
    alternatives: Array<{ name: string; role: string; score: number }>;
}

// ─── Helper: compute a simple skill-match fit score ──────────────────────────

function computeFitScore(task: GeneratedTask, member: TeamMemberInput): number {
    const taskSkills = task.skills.map((s) => s.toLowerCase());
    const memberSkills = member.skills.map((s) => s.toLowerCase());

    const matched = taskSkills.filter((ts) =>
        memberSkills.some((ms) => ms.includes(ts) || ts.includes(ms))
    );

    const skillScore = Math.round((matched.length / Math.max(taskSkills.length, 1)) * 60);

    const experienceBonus =
        member.experience === "senior" || member.experience === "lead"
            ? 25
            : member.experience === "mid"
                ? 15
                : 5;

    const availabilityBonus = member.weeklyHours >= 32 ? 15 : 8;

    return Math.min(99, skillScore + experienceBonus + availabilityBonus);
}

function getReasoning(member: TeamMemberInput, task: GeneratedTask, score: number): string {
    const matchedSkills = task.skills.filter((ts) =>
        member.skills.some((ms) => ms.toLowerCase().includes(ts.toLowerCase()) || ts.toLowerCase().includes(ms.toLowerCase()))
    );
    return `Assigned to ${member.name} (fit score: ${score}/100). Skill match: ${matchedSkills.length > 0 ? matchedSkills.join(", ") : "general engineering expertise"}. Experience level: ${member.experience}. Available bandwidth: ${member.weeklyHours}h/week.`;
}

// ─── Mock ────────────────────────────────────────────────────────────────────

function mockAssignment(
    tasks: GeneratedTask[],
    team: TeamMemberInput[]
): AssignedTask[] {
    if (team.length === 0) {
        // No team provided — assign all to a placeholder
        return tasks.map((t) => ({
            ...t,
            assigneeId: "unassigned",
            assigneeName: "Unassigned",
            assigneeInitials: "?",
            assigneeRole: "TBD",
            fitScore: 0,
            aiReasoning: "No team members provided.",
            alternatives: [],
        }));
    }

    return tasks.map((task) => {
        // Score every team member
        const scored = team
            .map((m) => ({ member: m, score: computeFitScore(task, m) }))
            .sort((a, b) => b.score - a.score);

        const best = scored[0];
        const alts = scored.slice(1, 3).map((s) => ({
            name: s.member.name,
            role: s.member.role,
            score: s.score,
        }));

        return {
            ...task,
            assigneeId: best.member.id,
            assigneeName: best.member.name,
            assigneeInitials: best.member.initials,
            assigneeRole: best.member.role,
            fitScore: best.score,
            aiReasoning: getReasoning(best.member, task, best.score),
            alternatives: alts,
        };
    });
}

// ─── Real LLM ────────────────────────────────────────────────────────────────

async function realAssignment(
    tasks: GeneratedTask[],
    team: TeamMemberInput[]
): Promise<AssignedTask[]> {
    if (team.length === 0) return mockAssignment(tasks, team);

    const llm = getLLM();

    const teamSummary = team
        .map(
            (m) =>
                `- id:${m.id} | ${m.name} (${m.role}, ${m.experience}): ${m.skills.join(", ")}, ${m.weeklyHours}h/week`
        )
        .join("\n");

    const taskList = tasks
        .map((t, i) => `${i}: ${t.name} | skills: ${t.skills.join(", ")} | effort: ${t.effort}h | priority: ${t.priority}`)
        .join("\n");

    // ── Single batch call: assign ALL tasks at once ───────────────────────────
    const prompt = ChatPromptTemplate.fromTemplate(`
You are an AI engineering manager. Assign each task below to the best-fit team member.

Team:
{team}

Tasks (index: name | skills | effort | priority):
{tasks}

Respond ONLY with a valid JSON array, one entry per task in the SAME ORDER as the task list:
[{{
  "index": number,
  "assigneeId": string (id from team),
  "fitScore": number (0-100),
  "aiReasoning": string (1-2 sentences),
  "alternatives": [{{"name": string, "role": string, "score": number}}]
}}]
`);

    try {
        const chain = prompt.pipe(llm).pipe(new JsonOutputParser());
        const result = (await withRetry(() => chain.invoke({
            team: teamSummary,
            tasks: taskList,
        }))) as Array<{
            index: number;
            assigneeId: string;
            fitScore: number;
            aiReasoning: string;
            alternatives: Array<{ name: string; role: string; score: number }>;
        }>;

        const assignments = Array.isArray(result) ? result : [];
        console.log(`  ✓ Assignment: ${assignments.length}/${tasks.length} tasks assigned in one batch call`);

        return tasks.map((task, i) => {
            const assignment = assignments.find((a) => a.index === i);
            const member = team.find((m) => m.id === assignment?.assigneeId) || team[0];

            // local score as fallback if LLM didn't return one
            const fitScore = assignment?.fitScore ?? computeFitScore(task, member);

            return {
                ...task,
                assigneeId: member.id,
                assigneeName: member.name,
                assigneeInitials: member.initials,
                assigneeRole: member.role,
                fitScore,
                aiReasoning: assignment?.aiReasoning ?? getReasoning(member, task, fitScore),
                alternatives: assignment?.alternatives ?? [],
            };
        });
    } catch (err) {
        console.warn("Batch assignment failed, falling back to local skill-match:", err);
        return mockAssignment(tasks, team);
    }
}

// ─── Exported Agent ──────────────────────────────────────────────────────────

export async function assignmentAgent(
    tasks: GeneratedTask[],
    team: TeamMemberInput[]
): Promise<AssignedTask[]> {
    if (AI_MODE === "mock") {
        await new Promise((r) => setTimeout(r, 600));
        return mockAssignment(tasks, team);
    }
    return realAssignment(tasks, team);
}
