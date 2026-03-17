import { getLLM } from "./src/lib/llm";
import { HumanMessage } from "@langchain/core/messages";
import * as dotenv from "dotenv";

dotenv.config();

async function testOpenRouter() {
    try {
        console.log("Testing OpenRouter API connection...");
        const llm = getLLM("openai/gpt-oss-120b"); // Test with the requested model
        const response = await llm.invoke([
            new HumanMessage({ content: "Say 'Hello, OpenRouter is working!' if you receive this message." })
        ]);
        console.log("Response:", response.content);
        console.log("✅ Success");
    } catch (error) {
        console.error("❌ Error connecting to OpenRouter:", error);
    }
}

testOpenRouter();
