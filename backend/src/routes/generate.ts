import { FastifyInstance } from "fastify";
import { runPipeline } from "../agents/pipeline";
import { getProgress } from "../agents/pipeline";

export async function generateRoutes(fastify: FastifyInstance) {
    // POST /api/v1/projects/:id/generate — trigger the AI pipeline (fire & forget)
    fastify.post<{ Params: { id: string } }>(
        "/api/v1/projects/:id/generate",
        async (request, reply) => {
            const { id } = request.params;

            runPipeline(id).catch((err) => {
                console.error(`Pipeline failed for project ${id}:`, err);
            });

            return reply.status(202).send({
                message: "Generation started",
                projectId: id,
                statusUrl: `/api/v1/projects/${id}/status`,
                progressUrl: `/api/v1/projects/${id}/progress`,
            });
        }
    );

    // GET /api/v1/projects/:id/progress — SSE stream of real-time pipeline progress
    fastify.get<{ Params: { id: string } }>(
        "/api/v1/projects/:id/progress",
        async (request, reply) => {
            const { id } = request.params;

            reply.raw.writeHead(200, {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*",
            });

            const send = (data: object) => {
                reply.raw.write(`data: ${JSON.stringify(data)}\n\n`);
            };

            // Send initial state immediately
            const initial = getProgress(id);
            if (initial) {
                send(initial);
                if (initial.done) {
                    reply.raw.end();
                    return;
                }
            } else {
                send({ step: 0, stepLabel: "Waiting for pipeline…", done: false });
            }

            // Poll the progress store every 800ms and stream updates
            const interval = setInterval(() => {
                const progress = getProgress(id);
                if (!progress) {
                    // Pipeline not started or cleaned up — keep sending waiting state
                    send({ step: 0, stepLabel: "Waiting for pipeline…", done: false });
                    return;
                }

                send(progress);

                if (progress.done) {
                    clearInterval(interval);
                    reply.raw.end();
                }
            }, 800);

            // Clean up when client disconnects
            request.raw.on("close", () => {
                clearInterval(interval);
            });
        }
    );
}
