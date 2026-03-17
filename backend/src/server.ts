import * as dotenv from "dotenv";
dotenv.config();

import Fastify from "fastify";
import cors from "@fastify/cors";
import { projectRoutes } from "./routes/projects";
import { generateRoutes } from "./routes/generate";
import { employeeRoutes } from "./routes/employees";

const server = Fastify({
    logger: true,
});

// ─── CORS ──────────────────────────────────────────────────────────────────

server.register(cors, {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
});

// ─── Routes ──────────────────────────────────────────────────────────────────

// Health check
server.get("/api/v1/health", async () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
    aiMode: process.env.AI_MODE || "mock",
}));

// Feature routes
server.register(projectRoutes);
server.register(generateRoutes);
server.register(employeeRoutes);

// ─── Start ────────────────────────────────────────────────────────────────────

const PORT = Number(process.env.PORT) || 3001;
const HOST = "0.0.0.0";

server.listen({ port: PORT, host: HOST }, (err) => {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
    console.log(`\n🚀 AI SDLC Backend running at http://localhost:${PORT}`);
    console.log(`🤖 AI Mode: ${process.env.AI_MODE || "mock"}`);
    console.log(`📊 API: http://localhost:${PORT}/api/v1/health\n`);
});

export { server };
