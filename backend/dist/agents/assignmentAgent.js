"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignmentAgent = assignmentAgent;
const llm_1 = require("../lib/llm");
const prompts_1 = require("@langchain/core/prompts");
const output_parsers_1 = require("@langchain/core/output_parsers");
// ─── Helper: compute a simple skill-match fit score ──────────────────────────
function computeFitScore(task, member) {
    const taskSkills = task.skills.map((s) => s.toLowerCase());
    const memberSkills = member.skills.map((s) => s.toLowerCase());
    const matched = taskSkills.filter((ts) => memberSkills.some((ms) => ms.includes(ts) || ts.includes(ms)));
    const skillScore = Math.round((matched.length / Math.max(taskSkills.length, 1)) * 60);
    const experienceBonus = member.experience === "senior" || member.experience === "lead"
        ? 25
        : member.experience === "mid"
            ? 15
            : 5;
    const availabilityBonus = member.weeklyHours >= 32 ? 15 : 8;
    return Math.min(99, skillScore + experienceBonus + availabilityBonus);
}
function getReasoning(member, task, score) {
    const matchedSkills = task.skills.filter((ts) => member.skills.some((ms) => ms.toLowerCase().includes(ts.toLowerCase()) || ts.toLowerCase().includes(ms.toLowerCase())));
    return `Assigned to ${member.name} (fit score: ${score}/100). Skill match: ${matchedSkills.length > 0 ? matchedSkills.join(", ") : "general engineering expertise"}. Experience level: ${member.experience}. Available bandwidth: ${member.weeklyHours}h/week.`;
}
// ─── Mock ────────────────────────────────────────────────────────────────────
function mockAssignment(tasks, team) {
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
async function realAssignment(tasks, team) {
    const llm = (0, llm_1.getLLM)("gpt-4o");
    const teamSummary = team
        .map((m) => `- ${m.name} (${m.role}, ${m.experience}): ${m.skills.join(", ")}, ${m.weeklyHours}h/week`)
        .join("\n");
    const assigned = [];
    for (const task of tasks) {
        const prompt = prompts_1.ChatPromptTemplate.fromTemplate(`
You are an AI engineering manager. Assign this task to the best-fit team member.

Task: {taskName}
Required Skills: {skills}
Effort: {effort}h
Priority: {priority}

Team Members:
{team}

Respond ONLY with valid JSON:
{{
  "assigneeId": string (id from team),
  "fitScore": number (0-100),
  "aiReasoning": string (2-3 sentences explaining why this person was chosen),
  "alternatives": [{{ "name": string, "role": string, "score": number }}]
}}
`);
        const chain = prompt.pipe(llm).pipe(new output_parsers_1.JsonOutputParser());
        const result = (await chain.invoke({
            taskName: task.name,
            skills: task.skills.join(", "),
            effort: String(task.effort),
            priority: task.priority,
            team: teamSummary,
        }));
        const member = team.find((m) => m.id === result.assigneeId) || team[0];
        assigned.push({
            ...task,
            assigneeId: member.id,
            assigneeName: member.name,
            assigneeInitials: member.initials,
            assigneeRole: member.role,
            fitScore: result.fitScore,
            aiReasoning: result.aiReasoning,
            alternatives: result.alternatives || [],
        });
    }
    return assigned;
}
// ─── Exported Agent ──────────────────────────────────────────────────────────
async function assignmentAgent(tasks, team) {
    if (llm_1.AI_MODE === "mock") {
        await new Promise((r) => setTimeout(r, 600));
        return mockAssignment(tasks, team);
    }
    return realAssignment(tasks, team);
}
//# sourceMappingURL=assignmentAgent.js.map