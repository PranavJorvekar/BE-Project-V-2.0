import { z } from "zod";
import { Requirements } from "./requirementsAgent";
export declare const EpicSchema: z.ZodObject<{
    code: z.ZodString;
    name: z.ZodString;
    goal: z.ZodString;
    priority: z.ZodEnum<["High", "Medium", "Low"]>;
    estimatedHours: z.ZodNumber;
    scopeHighlights: z.ZodArray<z.ZodString, "many">;
    orderIndex: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    name: string;
    code: string;
    orderIndex: number;
    goal: string;
    priority: "Low" | "Medium" | "High";
    scopeHighlights: string[];
    estimatedHours: number;
}, {
    name: string;
    code: string;
    orderIndex: number;
    goal: string;
    priority: "Low" | "Medium" | "High";
    scopeHighlights: string[];
    estimatedHours: number;
}>;
export declare const EpicsOutputSchema: z.ZodObject<{
    epics: z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        name: z.ZodString;
        goal: z.ZodString;
        priority: z.ZodEnum<["High", "Medium", "Low"]>;
        estimatedHours: z.ZodNumber;
        scopeHighlights: z.ZodArray<z.ZodString, "many">;
        orderIndex: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        name: string;
        code: string;
        orderIndex: number;
        goal: string;
        priority: "Low" | "Medium" | "High";
        scopeHighlights: string[];
        estimatedHours: number;
    }, {
        name: string;
        code: string;
        orderIndex: number;
        goal: string;
        priority: "Low" | "Medium" | "High";
        scopeHighlights: string[];
        estimatedHours: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    epics: {
        name: string;
        code: string;
        orderIndex: number;
        goal: string;
        priority: "Low" | "Medium" | "High";
        scopeHighlights: string[];
        estimatedHours: number;
    }[];
}, {
    epics: {
        name: string;
        code: string;
        orderIndex: number;
        goal: string;
        priority: "Low" | "Medium" | "High";
        scopeHighlights: string[];
        estimatedHours: number;
    }[];
}>;
export type GeneratedEpic = z.infer<typeof EpicSchema>;
export declare function epicGenerator(requirements: Requirements): Promise<GeneratedEpic[]>;
//# sourceMappingURL=epicGenerator.d.ts.map