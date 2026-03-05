"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRoutes = projectRoutes;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const crypto_1 = require("crypto");
// ─── Zod Schemas ──────────────────────────────────────────────────────────────
const CreateProjectBody = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().min(10).max(2000),
    features: zod_1.z.array(zod_1.z.string()).default([]),
    techStack: zod_1.z.array(zod_1.z.string()).default([]),
    priorities: zod_1.z.array(zod_1.z.string()).default([]),
    timeline: zod_1.z.number().min(1).max(52).default(8),
    teamMembers: zod_1.z
        .array(zod_1.z.object({
        employeeId: zod_1.z.string().optional(),
        name: zod_1.z.string(),
        role: zod_1.z.string(),
        initials: zod_1.z.string().optional(),
        specialization: zod_1.z.string().optional(),
        skills: zod_1.z.array(zod_1.z.string()).default([]),
        experience: zod_1.z.enum(["junior", "mid", "senior", "lead"]).default("mid"),
        weeklyHours: zod_1.z.number().default(40),
    }))
        .default([]),
});
// ─── Helper: format project for API response ──────────────────────────────────
async function getFullProject(id) {
    const project = await prisma_1.prisma.project.findUnique({
        where: { id },
        include: {
            epics: {
                include: { tasks: { include: { teamMember: true } } },
                orderBy: { orderIndex: "asc" },
            },
            teamMembers: true,
            warnings: { where: { dismissed: false } },
        },
    });
    if (!project)
        return null;
    return {
        id: project.id,
        name: project.name,
        description: project.description,
        status: project.status,
        progress: project.progress,
        timeline: project.timeline,
        features: JSON.parse(project.features),
        techStack: JSON.parse(project.techStack),
        priorities: JSON.parse(project.priorities),
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        epics: project.epics.map((epic) => ({
            id: epic.id,
            code: epic.code,
            name: epic.name,
            goal: epic.goal,
            priority: epic.priority,
            taskCount: epic.taskCount,
            totalHours: epic.totalHours,
            scopeHighlights: JSON.parse(epic.scopeHighlights),
            tasks: epic.tasks.map((task) => ({
                id: task.id,
                name: task.name,
                description: task.description,
                skills: JSON.parse(task.skills),
                effort: task.effort,
                priority: task.priority,
                fitScore: task.fitScore,
                aiReasoning: task.aiReasoning,
                definitionOfDone: JSON.parse(task.definitionOfDone),
                prerequisites: JSON.parse(task.prerequisites),
                blocks: JSON.parse(task.blocks),
                alternatives: JSON.parse(task.alternatives),
                epicName: epic.name,
                epicColor: "indigo",
                assignee: task.teamMember
                    ? {
                        id: task.teamMember.id,
                        name: task.teamMember.name,
                        initials: task.teamMember.initials,
                        role: task.teamMember.role,
                    }
                    : null,
            })),
        })),
        team: project.teamMembers.map((m) => ({
            id: m.id,
            name: m.name,
            initials: m.initials,
            role: m.role,
            specialization: m.specialization,
            skills: JSON.parse(m.skills),
            experience: m.experience,
            weeklyHours: m.weeklyHours,
            avgCapacity: m.avgCapacity,
            availableHours: m.availableHours,
            tasks: project.epics
                .flatMap((e) => e.tasks)
                .filter((t) => t.teamMemberId === m.id).length,
        })),
        warnings: project.warnings.map((w) => ({
            id: w.id,
            severity: w.severity,
            title: w.title,
            affectedArea: w.affectedArea,
            icon: w.icon,
            problem: w.problem,
            recommendations: JSON.parse(w.recommendations),
            actionLabel: w.actionLabel,
        })),
    };
}
// ─── Routes ──────────────────────────────────────────────────────────────────
async function projectRoutes(fastify) {
    // GET /api/v1/projects
    fastify.get("/api/v1/projects", async (_request, reply) => {
        try {
            const projects = await prisma_1.prisma.project.findMany({
                include: {
                    epics: { select: { id: true, taskCount: true } },
                    teamMembers: { select: { id: true, name: true, initials: true } },
                    warnings: { where: { dismissed: false }, select: { id: true, severity: true } },
                },
                orderBy: { createdAt: "desc" },
            });
            const formatted = projects.map((p) => ({
                id: p.id,
                name: p.name,
                description: p.description,
                status: p.status,
                progress: p.progress,
                timeline: p.timeline,
                createdAt: p.createdAt,
                epicCount: p.epics.length,
                taskCount: p.epics.reduce((s, e) => s + e.taskCount, 0),
                team: p.teamMembers.map((m) => ({ id: m.id, name: m.name, initials: m.initials })),
                warningCount: p.warnings.length,
            }));
            return reply.send({ projects: formatted });
        }
        catch (err) {
            fastify.log.error(err);
            return reply.status(500).send({ error: "Failed to fetch projects" });
        }
    });
    // POST /api/v1/projects
    fastify.post("/api/v1/projects", async (request, reply) => {
        try {
            const body = CreateProjectBody.parse(request.body);
            // MVP single-user mode: create placeholder user if none exists
            let user = await prisma_1.prisma.user.findFirst();
            if (!user) {
                user = await prisma_1.prisma.user.create({
                    data: { id: (0, crypto_1.randomUUID)(), email: "user@aisdlc.app", name: "Demo User" },
                });
            }
            const project = await prisma_1.prisma.project.create({
                data: {
                    id: (0, crypto_1.randomUUID)(),
                    userId: user.id,
                    name: body.name,
                    description: body.description,
                    features: JSON.stringify(body.features),
                    techStack: JSON.stringify(body.techStack),
                    priorities: JSON.stringify(body.priorities),
                    timeline: body.timeline,
                    status: "DRAFT",
                },
            });
            // Create team members
            for (const member of body.teamMembers) {
                const initials = member.initials ||
                    member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2);
                await prisma_1.prisma.teamMember.create({
                    data: {
                        id: (0, crypto_1.randomUUID)(),
                        projectId: project.id,
                        employeeId: member.employeeId,
                        name: member.name,
                        role: member.role,
                        initials,
                        specialization: member.specialization || member.role,
                        skills: JSON.stringify(member.skills),
                        experience: member.experience,
                        weeklyHours: member.weeklyHours,
                    },
                });
            }
            return reply.status(201).send({ project: { id: project.id, name: project.name } });
        }
        catch (err) {
            if (err instanceof zod_1.z.ZodError) {
                return reply.status(400).send({ error: "Validation error", details: err.issues });
            }
            fastify.log.error(err);
            return reply.status(500).send({ error: "Failed to create project" });
        }
    });
    // GET /api/v1/projects/:id
    fastify.get("/api/v1/projects/:id", async (request, reply) => {
        try {
            const project = await getFullProject(request.params.id);
            if (!project)
                return reply.status(404).send({ error: "Project not found" });
            return reply.send({ project });
        }
        catch (err) {
            fastify.log.error(err);
            return reply.status(500).send({ error: "Failed to fetch project" });
        }
    });
    // GET /api/v1/projects/:id/status
    fastify.get("/api/v1/projects/:id/status", async (request, reply) => {
        try {
            const project = await prisma_1.prisma.project.findUnique({
                where: { id: request.params.id },
                select: { id: true, status: true, progress: true },
            });
            if (!project)
                return reply.status(404).send({ error: "Project not found" });
            return reply.send(project);
        }
        catch (err) {
            fastify.log.error(err);
            return reply.status(500).send({ error: "Failed to fetch status" });
        }
    });
    // PATCH /api/v1/tasks/:id
    fastify.patch("/api/v1/tasks/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const body = zod_1.z.object({
                teamMemberId: zod_1.z.string().nullable(),
            }).parse(request.body);
            const task = await prisma_1.prisma.task.update({
                where: { id },
                data: { teamMemberId: body.teamMemberId },
                include: { teamMember: true }
            });
            return reply.send({
                task: {
                    id: task.id,
                    teamMemberId: task.teamMemberId,
                    assignee: task.teamMember ? {
                        id: task.teamMember.id,
                        name: task.teamMember.name,
                        initials: task.teamMember.initials,
                        role: task.teamMember.role
                    } : null
                }
            });
        }
        catch (err) {
            if (err instanceof zod_1.z.ZodError) {
                return reply.status(400).send({ error: "Validation error", details: err.issues });
            }
            fastify.log.error(err);
            return reply.status(500).send({ error: "Failed to update task" });
        }
    });
    // PATCH /api/v1/team-members/:id
    fastify.patch("/api/v1/team-members/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const body = zod_1.z.object({
                role: zod_1.z.string().optional(),
                skills: zod_1.z.array(zod_1.z.string()).optional(),
                weeklyHours: zod_1.z.number().optional(),
            }).parse(request.body);
            const updateData = { ...body };
            if (body.skills) {
                updateData.skills = JSON.stringify(body.skills);
            }
            const member = await prisma_1.prisma.teamMember.update({
                where: { id },
                data: updateData,
            });
            return reply.send({ member });
        }
        catch (err) {
            if (err instanceof zod_1.z.ZodError) {
                return reply.status(400).send({ error: "Validation error", details: err.issues });
            }
            fastify.log.error(err);
            return reply.status(500).send({ error: "Failed to update team member" });
        }
    });
}
//# sourceMappingURL=projects.js.map