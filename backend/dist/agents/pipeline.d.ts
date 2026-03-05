export interface PipelineInput {
    projectId: string;
}
export interface PipelineResult {
    success: boolean;
    error?: string;
}
export declare function runPipeline(projectId: string): Promise<PipelineResult>;
//# sourceMappingURL=pipeline.d.ts.map