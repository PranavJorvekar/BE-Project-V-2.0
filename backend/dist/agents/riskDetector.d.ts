import { AssignedTask, TeamMemberInput } from "./assignmentAgent";
import { GeneratedEpic } from "./epicGenerator";
export interface GeneratedWarning {
    severity: "Critical" | "High" | "Medium";
    title: string;
    affectedArea: string;
    icon: string;
    problem: string;
    recommendations: string[];
    actionLabel: string;
}
export declare function riskDetector(tasks: AssignedTask[], team: TeamMemberInput[], epics: GeneratedEpic[]): Promise<GeneratedWarning[]>;
//# sourceMappingURL=riskDetector.d.ts.map