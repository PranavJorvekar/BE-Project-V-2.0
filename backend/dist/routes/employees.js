"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeRoutes = employeeRoutes;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const crypto_1 = require("crypto");
const EmployeeBody = zod_1.z.object({
    name: zod_1.z.string().min(1),
    role: zod_1.z.string().min(1),
    initials: zod_1.z.string().optional(),
    specialization: zod_1.z.string().optional(),
    skills: zod_1.z.array(zod_1.z.string()).default([]),
    experience: zod_1.z.enum(["junior", "mid", "senior", "lead"]).default("mid"),
    weeklyHours: zod_1.z.number().default(40),
    availabilityStatus: zod_1.z.enum(["available", "busy", "on_leave"]).default("available"),
});
async function employeeRoutes(fastify) {
    // GET /api/v1/employees
    fastify.get("/api/v1/employees", async (_request, reply) => {
        try {
            const employees = await prisma_1.prisma.employee.findMany({
                include: {
                    teamMembers: {
                        select: {
                            weeklyHours: true,
                        }
                    }
                },
                orderBy: { name: "asc" },
            });
            const formatted = employees.map((e) => {
                const assignedHours = e.teamMembers.reduce((sum, tm) => sum + tm.weeklyHours, 0);
                const projectCount = e.teamMembers.length;
                // Determine status dynamically
                let status = e.availabilityStatus; // Default to stored (useful for on_leave override)
                if (status !== "on_leave") {
                    if (assignedHours >= e.weeklyHours) {
                        status = "busy";
                    }
                    else {
                        status = "available";
                    }
                }
                return {
                    ...e,
                    skills: JSON.parse(e.skills),
                    assignedHours,
                    projectCount,
                    availabilityStatus: status,
                    teamMembers: undefined,
                };
            });
            return reply.send({ employees: formatted });
        }
        catch (err) {
            fastify.log.error(err);
            return reply.status(500).send({ error: "Failed to fetch employees" });
        }
    });
    // POST /api/v1/employees
    fastify.post("/api/v1/employees", async (request, reply) => {
        try {
            const body = EmployeeBody.parse(request.body);
            const initials = body.initials || body.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
            const employee = await prisma_1.prisma.employee.create({
                data: {
                    id: (0, crypto_1.randomUUID)(),
                    name: body.name,
                    role: body.role,
                    initials,
                    specialization: body.specialization || body.role,
                    skills: JSON.stringify(body.skills),
                    experience: body.experience,
                    weeklyHours: body.weeklyHours,
                    availabilityStatus: body.availabilityStatus,
                },
            });
            return reply.status(201).send({ employee: { ...employee, skills: JSON.parse(employee.skills) } });
        }
        catch (err) {
            if (err instanceof zod_1.z.ZodError) {
                return reply.status(400).send({ error: "Validation error", details: err.issues });
            }
            fastify.log.error(err);
            return reply.status(500).send({ error: "Failed to create employee" });
        }
    });
    // PATCH /api/v1/employees/:id
    fastify.patch("/api/v1/employees/:id", async (request, reply) => {
        try {
            const body = EmployeeBody.partial().parse(request.body);
            const updateData = { ...body };
            if (body.skills) {
                updateData.skills = JSON.stringify(body.skills);
            }
            const employee = await prisma_1.prisma.employee.update({
                where: { id: request.params.id },
                data: updateData,
            });
            return reply.send({ employee: { ...employee, skills: JSON.parse(employee.skills) } });
        }
        catch (err) {
            if (err instanceof zod_1.z.ZodError) {
                return reply.status(400).send({ error: "Validation error", details: err.issues });
            }
            fastify.log.error(err);
            return reply.status(500).send({ error: "Failed to update employee" });
        }
    });
    // DELETE /api/v1/employees/:id
    fastify.delete("/api/v1/employees/:id", async (request, reply) => {
        try {
            await prisma_1.prisma.employee.delete({
                where: { id: request.params.id },
            });
            return reply.status(204).send();
        }
        catch (err) {
            fastify.log.error(err);
            return reply.status(500).send({ error: "Failed to delete employee" });
        }
    });
}
//# sourceMappingURL=employees.js.map