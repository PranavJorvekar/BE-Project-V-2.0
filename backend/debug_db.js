const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const projectId = '1fefe32b-cf02-4df3-9dd7-016a4bf24268';
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { teamMembers: true }
    });
    console.log(JSON.stringify(project, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
