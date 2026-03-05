import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const teamMembers = await prisma.teamMember.findMany({
        include: {
            employee: true,
            project: true
        }
    });

    console.log("Team Members with Employee Links:");
    teamMembers.forEach((tm: any) => {
        console.log(`- Project: ${tm.project.name}, Member: ${tm.name}, EmployeeID: ${tm.employeeId}, Linked Employee: ${tm.employee?.name || 'NONE'}`);
    });

    const employees = await prisma.employee.findMany({
        include: {
            teamMembers: true
        }
    });

    console.log("\nEmployee Load Stats:");
    employees.forEach((e: any) => {
        const hours = e.teamMembers.reduce((sum: number, tm: any) => sum + tm.weeklyHours, 0);
        console.log(`- Employee: ${e.name}, Projects: ${e.teamMembers.length}, Total Hours: ${hours}/${e.weeklyHours}`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
