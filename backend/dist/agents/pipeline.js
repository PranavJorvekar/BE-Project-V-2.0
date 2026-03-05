"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPipeline = runPipeline;
const prisma_1 = require("../lib/prisma");
const requirementsAgent_1 = require("./requirementsAgent");
const epicGenerator_1 = require("./epicGenerator");
const taskBreaker_1 = require("./taskBreaker");
const assignmentAgent_1 = require("./assignmentAgent");
const riskDetector_1 = require("./riskDetector");
// ─── Main Pipeline ────────────────────────────────────────────────────────────
// Flow: Project → Requirements → Epics → Tasks → Assignments → Risks → Save
async function runPipeline(projectId) {
    try {
        // 1. Load project + team from database
        const project = await prisma_1.prisma.project.findUnique({
            where: { id: projectId },
            include: { teamMembers: true },
        });
        if (!project)
            return { success: false, error: "Project not found" };
        // Mark as generating
        await prisma_1.prisma.project.update({
            where: { id: projectId },
            data: { status: "GENERATING" },
        });
        // 2. Clean up any previously generated plan
        await prisma_1.prisma.epic.deleteMany({ where: { projectId } });
        await prisma_1.prisma.warning.deleteMany({ where: { projectId } });
        // 3. Parse team members
        const team = project.teamMembers.map((m) => ({
            id: m.id,
            name: m.name,
            initials: m.initials,
            role: m.role,
            skills: JSON.parse(m.skills),
            experience: m.experience,
            weeklyHours: m.weeklyHours,
        }));
        // 4. Requirements Agent
        const requirements = await (0, requirementsAgent_1.requirementsAgent)({
            name: project.name,
            description: project.description,
            features: JSON.parse(project.features),
            techStack: JSON.parse(project.techStack),
            priorities: JSON.parse(project.priorities),
            timeline: project.timeline,
        });
        // 5. Epic Generator
        const generatedEpics = await (0, epicGenerator_1.epicGenerator)(requirements);
        // 6. Save Epics to DB
        const savedEpics = await Promise.all(generatedEpics.map((epic) => prisma_1.prisma.epic.create({
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
        })));
        // 7. Task Breaker
        const generatedTasks = await (0, taskBreaker_1.taskBreaker)(generatedEpics, requirements);
        // 8. Assignment Agent
        const assignedTasks = await (0, assignmentAgent_1.assignmentAgent)(generatedTasks, team);
        // 9. Save Tasks to DB (link to epic by code)
        const epicCodeToId = {};
        generatedEpics.forEach((e, i) => { epicCodeToId[e.code] = savedEpics[i].id; });
        let taskIndex = 0;
        for (const task of assignedTasks) {
            const epicId = epicCodeToId[task.epicCode];
            if (!epicId)
                continue;
            const teamMemberId = task.assigneeId && task.assigneeId !== "unassigned"
                ? task.assigneeId
                : null;
            await prisma_1.prisma.task.create({
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
            const tasks = await prisma_1.prisma.task.findMany({ where: { epicId: savedEpic.id } });
            const totalHours = tasks.reduce((s, t) => s + t.effort, 0);
            await prisma_1.prisma.epic.update({
                where: { id: savedEpic.id },
                data: { taskCount: tasks.length, totalHours },
            });
        }
        // 11. Risk Detector
        const generatedWarnings = await (0, riskDetector_1.riskDetector)(assignedTasks, team, generatedEpics);
        // 12. Save Warnings
        for (const w of generatedWarnings) {
            await prisma_1.prisma.warning.create({
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
        const allEpics = await prisma_1.prisma.epic.findMany({ where: { projectId } });
        await prisma_1.prisma.project.update({
            where: { id: projectId },
            data: {
                status: "IN_PLANNING",
                progress: 0,
            },
        });
        return { success: true };
    }
    catch (error) {
        console.error("Pipeline error:", error);
        // Mark project as failed
        await prisma_1.prisma.project.update({
            where: { id: projectId },
            data: { status: "DRAFT" },
        }).catch(() => { });
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown pipeline error",
        };
    }
}
//# sourceMappingURL=pipeline.js.map