import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { randomUUID } from "crypto";

const EmployeeBody = z.object({
    name: z.string().min(1),
    role: z.string().min(1),
    initials: z.string().optional(),
    specialization: z.string().optional(),
    skills: z.array(z.string()).default([]),
    experience: z.enum(["junior", "mid", "senior", "lead"]).default("mid"),
    weeklyHours: z.number().default(40),
    availabilityStatus: z.enum(["available", "busy", "on_leave"]).default("available"),
});

export async function employeeRoutes(fastify: FastifyInstance) {
    // GET /api/v1/employees
    fastify.get("/api/v1/employees", async (_request, reply) => {
        try {
            const employees = await prisma.employee.findMany({
                include: {
                    teamMembers: {
                        select: {
                            weeklyHours: true,
                        }
                    }
                },
                orderBy: { name: "asc" },
            });

            const formatted = employees.map((e: any) => {
                const assignedHours = e.teamMembers.reduce((sum: number, tm: { weeklyHours: number }) => sum + tm.weeklyHours, 0);
                const projectCount = e.teamMembers.length;

                // Determine status dynamically
                let status = e.availabilityStatus; // Default to stored (useful for on_leave override)
                if (status !== "on_leave") {
                    if (assignedHours >= e.weeklyHours) {
                        status = "busy";
                    } else {
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
        } catch (err) {
            fastify.log.error(err);
            return reply.status(500).send({ error: "Failed to fetch employees" });
        }
    });

    // POST /api/v1/employees
    fastify.post("/api/v1/employees", async (request, reply) => {
        try {
            const body = EmployeeBody.parse(request.body);
            const initials = body.initials || body.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

            const employee = await prisma.employee.create({
                data: {
                    id: randomUUID(),
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
        } catch (err) {
            if (err instanceof z.ZodError) {
                return reply.status(400).send({ error: "Validation error", details: err.issues });
            }
            fastify.log.error(err);
            return reply.status(500).send({ error: "Failed to create employee" });
        }
    });

    // PATCH /api/v1/employees/:id
    fastify.patch<{ Params: { id: string } }>("/api/v1/employees/:id", async (request, reply) => {
        try {
            const body = EmployeeBody.partial().parse(request.body);
            const updateData: any = { ...body };

            if (body.skills) {
                updateData.skills = JSON.stringify(body.skills);
            }

            const employee = await prisma.employee.update({
                where: { id: request.params.id },
                data: updateData,
            });

            return reply.send({ employee: { ...employee, skills: JSON.parse(employee.skills) } });
        } catch (err) {
            if (err instanceof z.ZodError) {
                return reply.status(400).send({ error: "Validation error", details: err.issues });
            }
            fastify.log.error(err);
            return reply.status(500).send({ error: "Failed to update employee" });
        }
    });

    // DELETE /api/v1/employees/:id
    fastify.delete<{ Params: { id: string } }>("/api/v1/employees/:id", async (request, reply) => {
        try {
            await prisma.employee.delete({
                where: { id: request.params.id },
            });
            return reply.status(204).send();
        } catch (err) {
            fastify.log.error(err);
            return reply.status(500).send({ error: "Failed to delete employee" });
        }
    });
}
