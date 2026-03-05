"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRoutes = generateRoutes;
const pipeline_1 = require("../agents/pipeline");
async function generateRoutes(fastify) {
    // POST /api/v1/projects/:id/generate — trigger the AI pipeline
    fastify.post("/api/v1/projects/:id/generate", async (request, reply) => {
        const { id } = request.params;
        // Fire the pipeline in the background (don't await)
        (0, pipeline_1.runPipeline)(id).catch((err) => {
            console.error(`Pipeline failed for project ${id}:`, err);
        });
        // Return immediately — client polls /status
        return reply.status(202).send({
            message: "Generation started",
            projectId: id,
            statusUrl: `/api/v1/projects/${id}/status`,
        });
    });
}
//# sourceMappingURL=generate.js.map