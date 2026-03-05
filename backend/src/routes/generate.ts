import { FastifyInstance } from "fastify";
import { runPipeline } from "../agents/pipeline";

export async function generateRoutes(fastify: FastifyInstance) {
    // POST /api/v1/projects/:id/generate — trigger the AI pipeline
    fastify.post<{ Params: { id: string } }>(
        "/api/v1/projects/:id/generate",
        async (request, reply) => {
            const { id } = request.params;

            // Fire the pipeline in the background (don't await)
            runPipeline(id).catch((err) => {
                console.error(`Pipeline failed for project ${id}:`, err);
            });

            // Return immediately — client polls /status
            return reply.status(202).send({
                message: "Generation started",
                projectId: id,
                statusUrl: `/api/v1/projects/${id}/status`,
            });
        }
    );
}
