import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const employees = [
    { name: "Arjun Mehta", role: "Full-Stack Engineer", initials: "AM", specialization: "Node.js & React", skills: JSON.stringify(["React", "Node.js", "TypeScript", "PostgreSQL"]), experience: "senior", weeklyHours: 40 },
    { name: "Priya Sharma", role: "Frontend Developer", initials: "PS", specialization: "UI/UX", skills: JSON.stringify(["React", "Tailwind CSS", "Figma", "TypeScript"]), experience: "mid", weeklyHours: 40 },
    { name: "Rohan Gupta", role: "Backend Developer", initials: "RG", specialization: "Microservices", skills: JSON.stringify(["Node.js", "Docker", "Kubernetes", "Redis"]), experience: "senior", weeklyHours: 40 },
    { name: "Ananya Iyer", role: "UI/UX Designer", initials: "AI", specialization: "Mobile Design", skills: JSON.stringify(["Figma", "Adobe XD", "Prototyping", "User Research"]), experience: "mid", weeklyHours: 35 },
    { name: "Vikram Singh", role: "DevOps Engineer", initials: "VS", specialization: "Cloud Infrastructure", skills: JSON.stringify(["AWS", "Terraform", "CI/CD", "Docker"]), experience: "lead", weeklyHours: 45 },
    { name: "Sanya Malhotra", role: "QA Engineer", initials: "SM", specialization: "Automation Testing", skills: JSON.stringify(["Playwright", "Jest", "Selenium", "Postman"]), experience: "mid", weeklyHours: 40 },
    { name: "Ishaan Verma", role: "Product Manager", initials: "IV", specialization: "Agile Growth", skills: JSON.stringify(["Product Strategy", "Agile", "Jira", "Analytics"]), experience: "senior", weeklyHours: 40 },
    { name: "Kavya Reddy", role: "Full-Stack Engineer", initials: "KR", specialization: "Ruby on Rails", skills: JSON.stringify(["Ruby", "Rails", "React", "PostgreSQL"]), experience: "mid", weeklyHours: 40 },
    { name: "Aditya Das", role: "Data Engineer", initials: "AD", specialization: "ETL Pipelines", skills: JSON.stringify(["Python", "Spark", "SQL", "Airflow"]), experience: "senior", weeklyHours: 40 },
    { name: "Meera Nair", role: "Mobile Developer", initials: "MN", specialization: "React Native", skills: JSON.stringify(["React Native", "iOS", "Android", "TypeScript"]), experience: "mid", weeklyHours: 40 },
    { name: "Rahul Deshmukh", role: "Backend Developer", initials: "RD", specialization: "Java Systems", skills: JSON.stringify(["Java", "Spring Boot", "MySQL", "Kafka"]), experience: "senior", weeklyHours: 40 },
    { name: "Zoya Khan", role: "Frontend Developer", initials: "ZK", specialization: "Accessibility", skills: JSON.stringify(["React", "A11y", "CSS", "Javascript"]), experience: "junior", weeklyHours: 40 },
    { name: "Siddharth Rao", role: "Security Engineer", initials: "SR", specialization: "Cybersecurity", skills: JSON.stringify(["Penetration Testing", "Security Audit", "Network Security"]), experience: "senior", weeklyHours: 40 }
]

async function main() {
    console.log("Cleaning up existing employees...")
    // Only delete employees that aren't assigned to any projects to avoid foreign key issues
    // For a forced clean seed, we could delete all, but let's be safe.
    // Actually, for dummy data verification, clearing is usually intended.
    try {
        await prisma.employee.deleteMany({})
        console.log("Deleted existing employees.")
    } catch (e) {
        console.log("Note: Could not clear all employees (possibly due to active project assignments).")
    }

    console.log("Seeding employees...")
    for (const emp of employees) {
        await prisma.employee.create({ data: emp })
    }
    console.log("Seeding finished.")
}

main()
    .catch(e => {
        console.error(e)
        // @ts-ignore
        if (typeof process !== 'undefined') process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
