import { GeneratedTask } from "./taskBreaker";
export interface TeamMemberInput {
    id: string;
    name: string;
    initials: string;
    role: string;
    skills: string[];
    experience: string;
    weeklyHours: number;
}
export interface AssignedTask extends GeneratedTask {
    assigneeId: string;
    assigneeName: string;
    assigneeInitials: string;
    assigneeRole: string;
    fitScore: number;
    aiReasoning: string;
    alternatives: Array<{
        name: string;
        role: string;
        score: number;
    }>;
}
export declare function assignmentAgent(tasks: GeneratedTask[], team: TeamMemberInput[]): Promise<AssignedTask[]>;
//# sourceMappingURL=assignmentAgent.d.ts.map