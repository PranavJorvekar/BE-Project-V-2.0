"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AI_MODE = void 0;
exports.getLLM = getLLM;
const openai_1 = require("@langchain/openai");
// Primary LLM: GPT-4o-mini by default (cost-effective), upgrades to GPT-4 for complex tasks
function getLLM(model = "gpt-4o-mini") {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === "your_openai_api_key_here") {
        throw new Error("OPENAI_API_KEY is not set. Set AI_MODE=mock to use mock responses instead.");
    }
    return new openai_1.ChatOpenAI({
        modelName: model,
        temperature: 0.3, // deterministic for planning tasks
        openAIApiKey: apiKey,
    });
}
exports.AI_MODE = process.env.AI_MODE || "mock"; // "real" | "mock"
//# sourceMappingURL=llm.js.map