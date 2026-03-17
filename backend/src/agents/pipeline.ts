import { prisma } from "../lib/prisma";
import { requirementsAgent } from "./requirementsAgent";
import { epicGenerator } from "./epicGenerator";
import { taskBreaker } from "./taskBreaker";
import { assignmentAgent, TeamMemberInput } from "./assignmentAgent";
import { riskDetector } from "./riskDetector";

export interface PipelineInput {
    projectId: string;
}

export interface PipelineResult {
    success: boolean;
    error?: string;
}

// ─── Progress Store ────────────────────────────────────────────────────────────
// In-memory store for real-time step progress. Queried by the SSE endpoint.

export interface PipelineProgress {
    step: number;       // 0 = not started, 1-5 = agent steps, 6 = done
    stepLabel: string;
    done: boolean;
    error?: string;
    startedAt: number;  // epoch ms
}

const progressStore = new Map<string, PipelineProgress>();

export function getProgress(projectId: string): PipelineProgress | undefined {
    return progressStore.get(projectId);
}

function setProgress(
    projectId: string,
    step: number,
    stepLabel: string,
    done = false,
    error?: string
) {
    const existing = progressStore.get(projectId);
    progressStore.set(projectId, {
        step,
        stepLabel,
        done,
        error,
        startedAt: existing?.startedAt ?? Date.now(),
    });
}

// ─── Main Pipeline ────────────────────────────────────────────────────────────
// Flow: Project → Requirements → Epics → Tasks → Assignments → Risks → Save

export async function runPipeline(projectId: string): Promise<PipelineResult> {
    try {
        // 1. Load project + team from database
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: { teamMembers: true },
        });

        if (!project) return { success: false, error: "Project not found" };

        // Mark as generating + init progress
        await prisma.project.update({
            where: { id: projectId },
            data: { status: "GENERATING" },
        });
        setProgress(projectId, 0, "Starting AI pipeline…");

        // 2. Clean up any previously generated plan
        await prisma.epic.deleteMany({ where: { projectId } });
        await prisma.warning.deleteMany({ where: { projectId } });

        // 3. Parse team members
        const team: TeamMemberInput[] = project.teamMembers.map((m) => ({
            id: m.id,
            name: m.name,
            initials: m.initials,
            role: m.role,
            skills: JSON.parse(m.skills),
            experience: m.experience,
            weeklyHours: m.weeklyHours,
        }));

        // ── Step 1: Requirements ──────────────────────────────────────────────
        setProgress(projectId, 1, "Parsing product requirements");
        console.log("🔍 [1/5] Requirements Agent...");
        const requirements = await requirementsAgent({
            name: project.name,
            description: project.description,
            features: JSON.parse(project.features),
            techStack: JSON.parse(project.techStack),
            priorities: JSON.parse(project.priorities),
            timeline: project.timeline,
        });
        console.log(`  ✓ Requirements parsed (complexity: ${requirements.complexityLevel}, epics: ${requirements.suggestedEpicCount})`);

        // ── Step 2: Epics ─────────────────────────────────────────────────────
        setProgress(projectId, 2, "Generating SDLC epics");
        console.log("📋 [2/5] Epic Generator...");
        const generatedEpics = await epicGenerator(requirements);
        console.log(`  ✓ ${generatedEpics.length} epics generated`);

        // Save Epics to DB
        const savedEpics = await Promise.all(
            generatedEpics.map((epic) =>
                prisma.epic.create({
                    data: {
                        projectId,
                        code: epic.code,
                        name: epic.name,
                        goal: epic.goal,
                        priority: epic.priority,
                        totalHours: epic.estimatedHours,
                        scopeHighlights: JSON.stringify(epic.scopeHighlights),
                        orderIndex: epic.orderIndex,
                    },
                })
            )
        );

        // ── Step 3: Tasks (parallel) ──────────────────────────────────────────
        setProgress(projectId, 3, "Breaking epics into tasks");
        console.log("🔨 [3/5] Task Breaker (parallel)...");
        const generatedTasks = await taskBreaker(generatedEpics, requirements);
        console.log(`  ✓ ${generatedTasks.length} tasks generated across ${generatedEpics.length} epics`);

        // ── Step 4: Assignments (single batch call) ───────────────────────────
        setProgress(projectId, 4, "Assigning tasks to team");
        console.log("👤 [4/5] Assignment Agent (batch)...");
        const assignedTasks = await assignmentAgent(generatedTasks, team);
        console.log(`  ✓ ${assignedTasks.length} tasks assigned`);

        // Save Tasks to DB (link to epic by code)
        const epicCodeToId: Record<string, string> = {};
        generatedEpics.forEach((e, i) => { epicCodeToId[e.code] = savedEpics[i].id; });

        let taskIndex = 0;
        for (const task of assignedTasks) {
            const epicId = epicCodeToId[task.epicCode];
            if (!epicId) continue;

            const teamMemberId =
                task.assigneeId && task.assigneeId !== "unassigned"
                    ? task.assigneeId
                    : null;

            await prisma.task.create({
                data: {
                    epicId,
                    teamMemberId,
                    name: task.name,
                    description: task.description,
                    skills: JSON.stringify(task.skills),
                    effort: task.effort,
                    priority: task.priority,
                    fitScore: task.fitScore,
                    aiReasoning: task.aiReasoning,
                    definitionOfDone: JSON.stringify(task.definitionOfDone),
                    prerequisites: "[]",
                    blocks: "[]",
                    alternatives: JSON.stringify(task.alternatives),
                    orderIndex: taskIndex++,
                },
            });
        }

        // Update epicTaskCount and totalHours
        await Promise.all(
            savedEpics.map(async (savedEpic) => {
                const tasks = await prisma.task.findMany({ where: { epicId: savedEpic.id } });
                const totalHours = tasks.reduce((s, t) => s + t.effort, 0);
                await prisma.epic.update({
                    where: { id: savedEpic.id },
                    data: { taskCount: tasks.length, totalHours },
                });
            })
        );

        // ── Step 5: Risks ─────────────────────────────────────────────────────
        setProgress(projectId, 5, "Detecting risks & warnings");
        console.log("⚠️  [5/5] Risk Detector...");
        const generatedWarnings = await riskDetector(assignedTasks, team, generatedEpics);
        console.log(`  ✓ ${generatedWarnings.length} warnings detected`);

        // Save Warnings
        for (const w of generatedWarnings) {
            await prisma.warning.create({
                data: {
                    projectId,
                    severity: w.severity,
                    title: w.title,
                    affectedArea: w.affectedArea,
                    icon: w.icon,
                    problem: w.problem,
                    recommendations: JSON.stringify(w.recommendations),
                    actionLabel: w.actionLabel,
                },
            });
        }

        // 13. Mark project as IN_PLANNING & done
        await prisma.project.update({
            where: { id: projectId },
            data: { status: "IN_PLANNING", progress: 0 },
        });

        const elapsed = ((Date.now() - (progressStore.get(projectId)?.startedAt ?? Date.now())) / 1000).toFixed(1);
        console.log(`✅ Pipeline complete for project ${projectId} in ${elapsed}s`);
        setProgress(projectId, 6, "Plan ready!", true);

        // Clean up progress after 30s
        setTimeout(() => progressStore.delete(projectId), 30_000);

        return { success: true };
    } catch (error) {
        console.error("Pipeline error:", error);
        const msg = error instanceof Error ? error.message : "Unknown pipeline error";
        setProgress(projectId, 0, "Pipeline failed", true, msg);

        await prisma.project.update({
            where: { id: projectId },
            data: { status: "DRAFT" },
        }).catch(() => { });

        setTimeout(() => progressStore.delete(projectId), 30_000);
        return { success: false, error: msg };
    }
}
