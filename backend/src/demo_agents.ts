import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables immediately
dotenv.config({ path: path.join(__dirname, '../.env') });

import { requirementsAgent } from '../src/agents/requirementsAgent';
import { epicGenerator } from '../src/agents/epicGenerator';
import { taskBreaker } from '../src/agents/taskBreaker';
import { riskDetector } from '../src/agents/riskDetector';
import { assignmentAgent } from '../src/agents/assignmentAgent';

async function runDemo() {
    console.log("🚀 STARTING AGENT DEMO (Using Gemini)\n");
    console.log("AI_MODE:", process.env.AI_MODE);

    if (process.env.AI_MODE !== 'real') {
        console.warn("⚠️  WARNING: AI_MODE is NOT 'real'. Agents will return MOCK data.");
    }

    const input = {
        name: "EcoTrack",
        description: "A mobile app for households to track their carbon footprint by scanning utility bills and grocery receipts.",
        features: ["OCR Scanning", "Monthly Carbon Report", "Community Challenges"],
        techStack: ["React Native", "Python (FastAPI)", "Tesseract OCR"],
        priorities: ["Privacy", "User Engagement"],
        timeline: 6
    };

    try {
        // Step 1: Requirements Agent
        console.log("--- 1. REQUIREMENTS AGENT ---");
        const requirements = await requirementsAgent(input);
        console.log("Result:", JSON.stringify(requirements, null, 2));
        console.log("\n");

        // Step 2: Epic Generator
        console.log("--- 2. EPIC GENERATOR ---");
        const epics = await epicGenerator(requirements);
        console.log("Result (First 2 Epics):", JSON.stringify(epics.slice(0, 2), null, 2));
        console.log("\n");

        // Step 3: Task Breaker
        console.log("--- 3. TASK BREAKER (Breaking down first Epic) ---");
        const tasks = await taskBreaker([epics[0]], requirements);
        console.log("Result:", JSON.stringify(tasks, null, 2));
        console.log("\n");

        // Step 4: Assignment Agent (Using mock team for demo)
        console.log("--- 4. ASSIGNMENT AGENT ---");
        const mockTeam = [
            { id: "1", name: "Aarav", role: "Mobile Lead", initials: "AS", skills: ["React Native", "Mobile Design"], experience: "senior", weeklyHours: 40 },
            { id: "2", name: "Meera", role: "Backend Dev", initials: "MK", skills: ["Python", "OCR", "FastAPI"], experience: "mid", weeklyHours: 40 }
        ];
        const assignments = await assignmentAgent(tasks, mockTeam);
        console.log("Result:", JSON.stringify(assignments, null, 2));
        console.log("\n");

        // Step 5: Risk Detector
        console.log("--- 5. RISK DETECTOR ---");
        const risks = await riskDetector(assignments, mockTeam, epics);
        console.log("Result:", JSON.stringify(risks, null, 2));

    } catch (error) {
        console.error("❌ DEMO FAILED:", error);
    }
}

runDemo();
