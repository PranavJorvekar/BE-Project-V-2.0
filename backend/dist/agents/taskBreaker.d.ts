import { z } from "zod";
import { GeneratedEpic } from "./epicGenerator";
import { Requirements } from "./requirementsAgent";
export declare const TaskSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    skills: z.ZodArray<z.ZodString, "many">;
    effort: z.ZodNumber;
    priority: z.ZodEnum<["High", "Medium", "Low"]>;
    definitionOfDone: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        text: z.ZodString;
        done: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        id: number;
        text: string;
        done: boolean;
    }, {
        id: number;
        text: string;
        done: boolean;
    }>, "many">;
    orderIndex: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    skills: string[];
    orderIndex: number;
    priority: "Low" | "Medium" | "High";
    effort: number;
    definitionOfDone: {
        id: number;
        text: string;
        done: boolean;
    }[];
}, {
    name: string;
    description: string;
    skills: string[];
    orderIndex: number;
    priority: "Low" | "Medium" | "High";
    effort: number;
    definitionOfDone: {
        id: number;
        text: string;
        done: boolean;
    }[];
}>;
export declare const TasksForEpicSchema: z.ZodObject<{
    tasks: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        skills: z.ZodArray<z.ZodString, "many">;
        effort: z.ZodNumber;
        priority: z.ZodEnum<["High", "Medium", "Low"]>;
        definitionOfDone: z.ZodArray<z.ZodObject<{
            id: z.ZodNumber;
            text: z.ZodString;
            done: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            id: number;
            text: string;
            done: boolean;
        }, {
            id: number;
            text: string;
            done: boolean;
        }>, "many">;
        orderIndex: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        skills: string[];
        orderIndex: number;
        priority: "Low" | "Medium" | "High";
        effort: number;
        definitionOfDone: {
            id: number;
            text: string;
            done: boolean;
        }[];
    }, {
        name: string;
        description: string;
        skills: string[];
        orderIndex: number;
        priority: "Low" | "Medium" | "High";
        effort: number;
        definitionOfDone: {
            id: number;
            text: string;
            done: boolean;
        }[];
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    tasks: {
        name: string;
        description: string;
        skills: string[];
        orderIndex: number;
        priority: "Low" | "Medium" | "High";
        effort: number;
        definitionOfDone: {
            id: number;
            text: string;
            done: boolean;
        }[];
    }[];
}, {
    tasks: {
        name: string;
        description: string;
        skills: string[];
        orderIndex: number;
        priority: "Low" | "Medium" | "High";
        effort: number;
        definitionOfDone: {
            id: number;
            text: string;
            done: boolean;
        }[];
    }[];
}>;
export type GeneratedTask = z.infer<typeof TaskSchema> & {
    epicCode: string;
};
export declare function taskBreaker(epics: GeneratedEpic[], requirements: Requirements): Promise<GeneratedTask[]>;
//# sourceMappingURL=taskBreaker.d.ts.map