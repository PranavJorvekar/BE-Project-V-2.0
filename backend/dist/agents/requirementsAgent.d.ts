import { z } from "zod";
export declare const RequirementsSchema: z.ZodObject<{
    productName: z.ZodString;
    coreObjective: z.ZodString;
    targetUsers: z.ZodString;
    keyFeatures: z.ZodArray<z.ZodString, "many">;
    techStack: z.ZodArray<z.ZodString, "many">;
    priorities: z.ZodArray<z.ZodString, "many">;
    timeline: z.ZodNumber;
    complexityLevel: z.ZodEnum<["Low", "Medium", "High"]>;
    suggestedEpicCount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    techStack: string[];
    priorities: string[];
    timeline: number;
    productName: string;
    coreObjective: string;
    targetUsers: string;
    keyFeatures: string[];
    complexityLevel: "Low" | "Medium" | "High";
    suggestedEpicCount: number;
}, {
    techStack: string[];
    priorities: string[];
    timeline: number;
    productName: string;
    coreObjective: string;
    targetUsers: string;
    keyFeatures: string[];
    complexityLevel: "Low" | "Medium" | "High";
    suggestedEpicCount: number;
}>;
export type Requirements = z.infer<typeof RequirementsSchema>;
export declare function requirementsAgent(input: {
    name: string;
    description: string;
    features: string[];
    techStack: string[];
    priorities: string[];
    timeline: number;
}): Promise<Requirements>;
//# sourceMappingURL=requirementsAgent.d.ts.map