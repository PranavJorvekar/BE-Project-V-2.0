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

        // Mark as generating
        await prisma.project.update({
            where: { id: projectId },
            data: { status: "GENERATING" },
        });

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

        // 4. Requirements Agent
        const requirements = await requirementsAgent({
            name: project.name,
            description: project.description,
            features: JSON.parse(project.features),
            techStack: JSON.parse(project.techStack),
            priorities: JSON.parse(project.priorities),
            timeline: project.timeline,
        });

        // 5. Epic Generator
        const generatedEpics = await epicGenerator(requirements);

        // 6. Save Epics to DB
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

        // 7. Task Breaker
        const generatedTasks = await taskBreaker(generatedEpics, requirements);

        // 8. Assignment Agent
        const assignedTasks = await assignmentAgent(generatedTasks, team);

        // 9. Save Tasks to DB (link to epic by code)
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

        // 10. Update epicTaskCount and totalHours
        for (const savedEpic of savedEpics) {
            const tasks = await prisma.task.findMany({ where: { epicId: savedEpic.id } });
            const totalHours = tasks.reduce((s, t) => s + t.effort, 0);
            await prisma.epic.update({
                where: { id: savedEpic.id },
                data: { taskCount: tasks.length, totalHours },
            });
        }

        // 11. Risk Detector
        const generatedWarnings = await riskDetector(assignedTasks, team, generatedEpics);

        // 12. Save Warnings
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

        // 13. Mark project as IN_PLANNING
        const totalTasks = assignedTasks.length;
        const allEpics = await prisma.epic.findMany({ where: { projectId } });
        await prisma.project.update({
            where: { id: projectId },
            data: {
                status: "IN_PLANNING",
                progress: 0,
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Pipeline error:", error);
        // Mark project as failed
        await prisma.project.update({
            where: { id: projectId },
            data: { status: "DRAFT" },
        }).catch(() => { });

        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown pipeline error",
        };
    }
}
