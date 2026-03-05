import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

async function main() {
    console.log("Starting project seeding...");

    // 1. Ensure Demo User exists
    let user = await prisma.user.findFirst();
    if (!user) {
        user = await prisma.user.create({
            data: { id: randomUUID(), email: "demo@aisdlc.app", name: "Demo User" },
        });
    }

    // --- Project 1: Healthcare Mobile App (In Progress) ---
    const p1Id = randomUUID();
    const p1 = await prisma.project.create({
        data: {
            id: p1Id,
            userId: user.id,
            name: "Healthcare Patient Portal",
            description: "A secure patient-facing mobile app for test results, appointment scheduling, and telemedicine.",
            features: JSON.stringify(["Secure Login/Biometrics", "Telehealth Video", "Lab Results Viewer", "Prescription Refill"]),
            techStack: JSON.stringify(["React Native", "Node.js", "PostgreSQL", "WebRTC"]),
            priorities: JSON.stringify(["HIPAA Compliance", "High Availability", "Accessibility"]),
            timeline: 12,
            status: "IN_PROGRESS",
            progress: 45,
        }
    });

    const tm1_1 = await prisma.teamMember.create({
        data: {
            projectId: p1Id,
            name: "Alice Chen",
            role: "Frontend Engineer",
            initials: "AC",
            specialization: "React Native",
            skills: JSON.stringify(["React Native", "TypeScript", "Redux"]),
            experience: "senior",
            weeklyHours: 40,
            avgCapacity: 85,
        }
    });

    const tm1_2 = await prisma.teamMember.create({
        data: {
            projectId: p1Id,
            name: "Bob Smith",
            role: "Backend Engineer",
            initials: "BS",
            specialization: "Node.js & Security",
            skills: JSON.stringify(["Node.js", "PostgreSQL", "Express", "Crypto"]),
            experience: "mid",
            weeklyHours: 40,
            avgCapacity: 70,
        }
    });

    const epic1_1 = await prisma.epic.create({
        data: {
            projectId: p1Id,
            code: "P1-EP1",
            name: "Core Authentication & Security",
            goal: "Establish zero-trust authentication architecture compliant with HIPAA standards.",
            priority: "High",
            taskCount: 3,
            totalHours: 120,
            scopeHighlights: JSON.stringify(["Biometric Auth", "MFA Setup", "JWT Rotation"]),
            orderIndex: 0,
        }
    });

    await prisma.task.createMany({
        data: [
            {
                epicId: epic1_1.id,
                name: "Implement Biometric Login (React Native)",
                description: "Integrate FaceID/TouchID libraries for passwordless login on mobile devices.",
                skills: JSON.stringify(["React Native", "Swift", "Kotlin"]),
                effort: 40,
                priority: "High",
                teamMemberId: tm1_1.id, // Assigned to Alice
                aiReasoning: "Assigned Alice as she has the highest experience in Swift/Kotlin native modules for React Native.",
            },
            {
                epicId: epic1_1.id,
                name: "Set up HIPAA-compliant database schema",
                description: "Design encrypted-at-rest data models for patient PHI records.",
                skills: JSON.stringify(["PostgreSQL", "Security"]),
                effort: 50,
                priority: "High",
                teamMemberId: tm1_2.id, // Assigned to Bob
                aiReasoning: "Bob is the security specialized backend engineer; critical for HIPAA core infrastructure.",
            },
            {
                epicId: epic1_1.id,
                name: "Configure Auth0 MFA",
                description: "Set up multi-factor auth requirements for new patient accounts.",
                skills: JSON.stringify(["Auth0", "Node.js"]),
                effort: 30,
                priority: "Medium",
                aiReasoning: "MFA is standard for PHI protection; Auth0 reduces implementation risk.",
            }
        ]
    });

    const epic1_2 = await prisma.epic.create({
        data: {
            projectId: p1Id,
            code: "P1-EP2",
            name: "Telehealth Video Integration",
            goal: "Build secure 1-on-1 video calling between doctors and patients.",
            priority: "Medium",
            taskCount: 2,
            totalHours: 90,
            scopeHighlights: JSON.stringify(["WebRTC Setup", "Call Queueing"]),
            orderIndex: 1,
        }
    });

    await prisma.task.createMany({
        data: [
            {
                epicId: epic1_2.id,
                name: "WebRTC Signaling Server",
                description: "Build the WebSockets signaling server necessary to connect peers.",
                skills: JSON.stringify(["Node.js", "WebSockets"]),
                effort: 45,
                priority: "High",
                teamMemberId: tm1_2.id,
                aiReasoning: "Scaling signaling requires deep understanding of WebSockets, which Bob possesses.",
            },
            {
                epicId: epic1_2.id,
                name: "React Native Call UI",
                description: "Design the UI for the active call screen, including mute, hide camera, and end controls.",
                skills: JSON.stringify(["React Native", "WebRTC"]),
                effort: 45,
                priority: "Medium",
                teamMemberId: tm1_1.id,
                aiReasoning: "Alice's frontend focus makes her ideal for complex real-time UI state management.",
            }
        ]
    });

    await prisma.warning.create({
        data: {
            projectId: p1Id,
            severity: "High",
            title: "Security Risk in Video SDK",
            affectedArea: "Telehealth Video Integration",
            problem: "The chosen WebRTC library dependency has a known vulnerability in its signaling protocol.",
            recommendations: JSON.stringify(["Update to version 2.4.1", "Implement custom TURN server rules"]),
        }
    });


    // --- Project 2: E-commerce Platform Migration (Planning) ---
    const p2Id = randomUUID();
    const p2 = await prisma.project.create({
        data: {
            id: p2Id,
            userId: user.id,
            name: "E-Commerce Migration to Shopify Plus",
            description: "Migrating legacy custom PHP storefront to Shopify Plus headless architecture.",
            features: JSON.stringify(["Headless Storefront", "Custom Checkout", "ERP Integration"]),
            techStack: JSON.stringify(["Next.js", "Shopify API", "GraphQL", "Tailwind CSS"]),
            priorities: JSON.stringify(["SEO Optimization", "Zero Downtime", "Performance"]),
            timeline: 16,
            status: "IN_PLANNING",
            progress: 0,
        }
    });

    const tm2_1 = await prisma.teamMember.create({
        data: {
            projectId: p2Id,
            name: "Diana Prince",
            role: "Tech Lead",
            initials: "DP",
            specialization: "Architecture",
            skills: JSON.stringify(["Next.js", "Shopify", "System Design"]),
            experience: "lead",
            weeklyHours: 40,
        }
    });

    const epic2_1 = await prisma.epic.create({
        data: {
            projectId: p2Id,
            code: "P2-EP1",
            name: "Data Migration & ETL",
            goal: "Safely export product catalogs, customer data, and history from legacy DB to Shopify.",
            priority: "High",
            taskCount: 4,
            totalHours: 160,
            scopeHighlights: JSON.stringify(["Sanitize Product HTML", "Map Customer Passwords"]),
            orderIndex: 0,
        }
    });

    await prisma.task.create({
        data: {
            epicId: epic2_1.id,
            name: "Map Customer Data Models",
            description: "Create the data mapping document for migrating old users to Shopify formats.",
            skills: JSON.stringify(["SQL", "Shopify API"]),
            effort: 20,
            priority: "Medium",
            teamMemberId: tm2_1.id,
            aiReasoning: "Tech leads must define core mappings to prevent data loss or mismatch during the migration phase.",
        }
    });

    await prisma.warning.create({
        data: {
            projectId: p2Id,
            severity: "Critical",
            title: "Data Loss Risk",
            affectedArea: "Data Migration & ETL",
            problem: "Legacy encrypted passwords cannot be decoded to plain text for Shopify migration.",
            recommendations: JSON.stringify(["Force password reset for all users post-launch", "Use Multipass login integration"]),
        }
    });


    // --- Project 3: Internal HR Tool (Completed) ---
    const p3Id = randomUUID();
    const p3 = await prisma.project.create({
        data: {
            id: p3Id,
            userId: user.id,
            name: "Internal Employee Directory",
            description: "A simple internal tool to manage employee profiles, org charts, and PTO tracking.",
            features: JSON.stringify(["Org Chart Visaulizer", "PTO Request Workflow", "Slack Integration"]),
            techStack: JSON.stringify(["React", "Firebase", "Google Workspace API"]),
            priorities: JSON.stringify(["Ease of use", "Fast deployment"]),
            timeline: 4,
            status: "COMPLETED",
            progress: 100,
        }
    });

    const tm3_1 = await prisma.teamMember.create({
        data: {
            projectId: p3Id,
            name: "Evan Wright",
            role: "Fullstack Developer",
            initials: "EW",
            skills: JSON.stringify(["React", "Firebase"]),
            experience: "mid",
        }
    });

    const epic3_1 = await prisma.epic.create({
        data: {
            projectId: p3Id,
            code: "P3-EP1",
            name: "Core Infrastructure",
            goal: "Set up the app and Auth",
            priority: "High",
            taskCount: 1,
            totalHours: 10,
            scopeHighlights: JSON.stringify(["Google SSO"]),
        }
    });

    await prisma.task.create({
        data: {
            epicId: epic3_1.id,
            name: "Configure Google Workspace SSO",
            description: "Allow employees to login using their company Google accounts.",
            skills: JSON.stringify(["Firebase Auth", "GCP"]),
            effort: 10,
            priority: "High",
            teamMemberId: tm3_1.id,
            aiReasoning: "Standard SSO setup via Firebase is efficient and secure for internal employee tools.",
        }
    });

    // --- Project 4: AI-Driven Wealth Management Platform (In Progress) ---
    const p4Id = randomUUID();
    await prisma.project.create({
        data: {
            id: p4Id,
            userId: user.id,
            name: "AI Wealth Management Platform",
            description: "An advanced wealth management platform featuring AI-driven portfolio optimization, real-time risk assessment, and automated tax-loss harvesting.",
            features: JSON.stringify(["AI Portfolio Optimization", "Real-time Risk Engine", "Multi-asset Trading", "Automated Rebalancing", "Secure Vault"]),
            techStack: JSON.stringify(["Next.js", "Python (FastAPI)", "Rust (Risk Engine)", "AWS SageMaker", "Redis"]),
            priorities: JSON.stringify(["Data Security", "Latency", "Regulatory Compliance"]),
            timeline: 24,
            status: "IN_PROGRESS",
            progress: 35,
        }
    });

    const p4Team = [
        { name: "John Miller", role: "Tech Lead", initials: "JM", exp: "lead" },
        { name: "Sarah Connor", role: "Frontend Dev", initials: "SC", exp: "senior" },
        { name: "Mike Ross", role: "Data Scientist", initials: "MR", exp: "senior" },
        { name: "Harvey Specter", role: "Backend Engineer", initials: "HS", exp: "senior" },
        { name: "Donna Paulsen", role: "Product Manager", initials: "DP", exp: "lead" },
        { name: "Louis Litt", role: "Security Analyst", initials: "LL", exp: "senior" },
    ];

    const p4TMs = [];
    for (const m of p4Team) {
        const tm = await prisma.teamMember.create({
            data: {
                projectId: p4Id,
                name: m.name,
                role: m.role,
                initials: m.initials,
                skills: JSON.stringify(["Finance", "AI", "Cloud"]),
                experience: m.exp as any,
                weeklyHours: 40,
            }
        });
        p4TMs.push(tm);
    }

    const p4Epics = [
        { code: "P4-E1", name: "User Onboarding & KYC", goal: "Securely onboard high-net-worth individuals with integrated KYC/AML.", priority: "High" },
        { code: "P4-E2", name: "Portfolio Risk Analysis Engine", goal: "Develop a Rust-based engine for sub-millisecond risk calculations.", priority: "Critical" },
        { code: "P4-E3", name: "Automated Trading Integration", goal: "Integrate with major banking APIs and brokerage platforms.", priority: "High" },
        { code: "P4-E4", name: "Real-time Multi-asset Rebalancing", goal: "AI-driven rebalancing of portfolios across stocks, crypto, and bonds.", priority: "Medium" },
        { code: "P4-E5", name: "Secure Document Vault", goal: "Encrypted storage for sensitive legal and financial documents.", priority: "Medium" },
        { code: "P4-E6", name: "AI Financial Advisor Bot", goal: "Large Language Model (LLM) powered advisor for client queries.", priority: "Low" },
        { code: "P4-E7", name: "Performance & Tax Reporting", goal: "Automated generation of tax-loss harvesting reports and annual audits.", priority: "High" },
    ];

    for (const e of p4Epics) {
        const epic = await prisma.epic.create({
            data: {
                projectId: p4Id,
                code: e.code,
                name: e.name,
                goal: e.goal,
                priority: e.priority,
                taskCount: 5,
                totalHours: 200,
                scopeHighlights: JSON.stringify(["Phase 1 Completion", "Compliance Check"]),
            }
        });
        // Create 2 tasks per epic to populate
        await prisma.task.create({
            data: {
                epicId: epic.id,
                name: `Implement ${e.name} Logic`,
                description: `Core logic and architecture for ${e.name}.`,
                skills: JSON.stringify(["Backend", "Architecture"]),
                effort: 80,
                teamMemberId: p4TMs[0].id,
                aiReasoning: "Assigned Tech Lead to ensure architectural integrity of high-frequency finance systems.",
            }
        });
        await prisma.task.create({
            data: {
                epicId: epic.id,
                name: `Build ${e.name} UI Components`,
                description: `Interactive frontend dashboards for ${e.name}.`,
                skills: JSON.stringify(["Frontend", "UI/UX"]),
                effort: 40,
                teamMemberId: p4TMs[1].id,
                aiReasoning: "Sarah has specialized experience in financial data visualization widgets.",
            }
        });
    }

    // --- Project 5: Global Smart Logistics Hub (In Planning) ---
    const p5Id = randomUUID();
    await prisma.project.create({
        data: {
            id: p5Id,
            userId: user.id,
            name: "Global Smart Logistics Hub",
            description: "A large-scale logistics platform integrating IoT, predictive analytics, and automated warehousing for global supply chain optimization.",
            features: JSON.stringify(["IoT Sensory Mesh", "Route Optimization", "Inventory Forecasting", "Warehouse Automation", "Freight Hub"]),
            techStack: JSON.stringify(["Go", "Kafka", "InfluxDB", "TensorFlow", "React"]),
            priorities: JSON.stringify(["Scalability", "Reliability", "Visibility"]),
            timeline: 36,
            status: "IN_PLANNING",
            progress: 10,
        }
    });

    const p5Team = [
        { name: "Peter Parker", role: "IoT Engineer", initials: "PP", exp: "mid" },
        { name: "Tony Stark", role: "Systems Architect", initials: "TS", exp: "lead" },
        { name: "Bruce Banner", role: "DevOps Lead", initials: "BB", exp: "senior" },
        { name: "Natasha Romanoff", role: "Data Analyst", initials: "NR", exp: "senior" },
        { name: "Steve Rogers", role: "Project Lead", initials: "SR", exp: "lead" },
        { name: "Clint Barton", role: "Backend Developer", initials: "CB", exp: "mid" },
    ];

    const p5TMs = [];
    for (const m of p5Team) {
        const tm = await prisma.teamMember.create({
            data: {
                projectId: p5Id,
                name: m.name,
                role: m.role,
                initials: m.initials,
                skills: JSON.stringify(["Logistics", "Cloud", "Analytics"]),
                experience: m.exp as any,
                weeklyHours: 40,
            }
        });
        p5TMs.push(tm);
    }

    const p5Epics = [
        { code: "P5-E1", name: "IoT Sensory Integration", goal: "Connect 1M+ active sensors across containers and warehouse equipment.", priority: "Critical" },
        { code: "P5-E2", name: "Predictive Route Optimization", goal: "ML models to reduce fuel consumption and transit times by 15%.", priority: "High" },
        { code: "P5-E3", name: "Dynamic Inventory Forecasting", goal: "Real-time stock level predictions based on market volatility.", priority: "High" },
        { code: "P5-E4", name: "Automated Warehouse Management", goal: "Integration with AGVs and robotic pickers in regional hubs.", priority: "Medium" },
        { code: "P5-E5", name: "Multi-modal Freight Tracking", goal: "Unified tracking dashboard for rail, sea, air, and road cargo.", priority: "High" },
        { code: "P5-E6", name: "Supplier Risk Assessment", goal: "Geopolitical and financial risk scoring for tier-1 suppliers.", priority: "Medium" },
        { code: "P5-E7", name: "Customer Delivery Experience", goal: "Direct-to-consumer tracking portal with precision delivery windows.", priority: "Low" },
    ];

    for (const e of p5Epics) {
        const epic = await prisma.epic.create({
            data: {
                projectId: p5Id,
                code: e.code,
                name: e.name,
                goal: e.goal,
                priority: e.priority,
                taskCount: 6,
                totalHours: 250,
                scopeHighlights: JSON.stringify(["System Architecture", "Deployment Plan"]),
            }
        });
        await prisma.task.create({
            data: {
                epicId: epic.id,
                name: `${e.name} Engineering`,
                description: `Design and implementation of ${e.name}.`,
                skills: JSON.stringify(["System Design", "Engineering"]),
                effort: 100,
                teamMemberId: p5TMs[1].id,
                aiReasoning: "Complex logistics systems require Tony's systems-level architectural oversight from the start.",
            }
        });
    }

    console.log("Seeding complete!");
    console.log(`Created 5 placeholder projects.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
