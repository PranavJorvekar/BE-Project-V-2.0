import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.findFirst();
    if (!user) {
        console.error("No user found. Please create a user first.");
        return;
    }

    // 1. Update existing employees with random availability
    const employees = await prisma.employee.findMany();
    const statuses = ["available", "busy", "on_leave"];

    for (const emp of employees) {
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        await prisma.employee.update({
            where: { id: emp.id },
            data: { availabilityStatus: randomStatus }
        });
    }
    console.log("Updated employee availability statuses.");

    // 2. Create Dummy Projects
    const projectData = [
        {
            name: "E-Commerce Platform Rebrand",
            description: "Modernizing the frontend and backend for a major retailer.",
            features: JSON.stringify(["User Auth", "Cart", "Checkout", "Inventory"]),
            techStack: JSON.stringify(["Next.js", "Node.js", "PostgreSQL"]),
            priorities: JSON.stringify(["Performance", "Security"]),
            timeline: 12,
            status: "IN_PROGRESS",
            teamMemberCount: 4
        },
        {
            name: "Healthcare Mobile App",
            description: "Patient monitoring system with real-time updates.",
            features: JSON.stringify(["Dashboard", "Vitals Tracking", "Doctor Chat"]),
            techStack: JSON.stringify(["React Native", "Firebase", "Node.js"]),
            priorities: JSON.stringify(["Reliability", "UX"]),
            timeline: 16,
            status: "IN_PLANNING",
            teamMemberCount: 3
        }
    ];

    for (const p of projectData) {
        const project = await prisma.project.create({
            data: {
                name: p.name,
                description: p.description,
                features: p.features,
                techStack: p.techStack,
                priorities: p.priorities,
                timeline: p.timeline,
                status: p.status,
                userId: user.id
            }
        });

        // Assign random employees to the project
        const shuffled = employees.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, p.teamMemberCount);

        for (const emp of selected) {
            await prisma.teamMember.create({
                data: {
                    projectId: project.id,
                    employeeId: emp.id,
                    name: emp.name,
                    role: emp.role,
                    initials: emp.initials,
                    specialization: emp.specialization,
                    skills: emp.skills,
                    experience: emp.experience,
                    weeklyHours: emp.weeklyHours
                }
            });
        }
        console.log(`Created project: ${p.name} with ${p.teamMemberCount} members.`);
    }

    console.log("Dummy projects and assignments created.");
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
