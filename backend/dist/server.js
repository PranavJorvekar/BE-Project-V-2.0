"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const dotenv = __importStar(require("dotenv"));
const projects_1 = require("./routes/projects");
const generate_1 = require("./routes/generate");
const employees_1 = require("./routes/employees");
dotenv.config();
const server = (0, fastify_1.default)({
    logger: true,
});
exports.server = server;
// ─── CORS ──────────────────────────────────────────────────────────────────
server.register(cors_1.default, {
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
server.register(projects_1.projectRoutes);
server.register(generate_1.generateRoutes);
server.register(employees_1.employeeRoutes);
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
//# sourceMappingURL=server.js.map