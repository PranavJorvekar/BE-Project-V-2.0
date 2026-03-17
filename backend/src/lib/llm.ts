import { ChatOpenAI } from "@langchain/openai";

// Primary LLM: configured for Groq
// Using llama-3.3-70b-versatile — fast, low-cost, excellent at structured JSON output
export function getLLM(model: string = "llama-3.3-70b-versatile") {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey || apiKey === "your_groq_api_key_here") {
        throw new Error(
            "GROQ_API_KEY is not set. Set AI_MODE=mock to use mock responses instead."
        );
    }

    return new ChatOpenAI({
        model: model,
        temperature: 0.3, // deterministic for planning tasks
        apiKey: apiKey,
        configuration: {
            baseURL: "https://api.groq.com/openai/v1",
        }
    });
}

export const AI_MODE = process.env.AI_MODE || "mock"; // "real" | "mock"

// ─── Retry Wrapper ────────────────────────────────────────────────────────────
// Handles 429 Too Many Requests (rate limit) errors.
// Retries up to maxRetries times with exponential backoff.

export async function withRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 4,
    initialDelayMs: number = 3000  // 3s initial wait (was 10s)
): Promise<T> {
    let attempt = 0;
    let delayMs = initialDelayMs;

    while (true) {
        try {
            return await fn();
        } catch (error: any) {
            const is429 = error?.status === 429 ||
                error?.message?.includes("429") ||
                error?.message?.includes("Too Many Requests") ||
                error?.message?.includes("RESOURCE_EXHAUSTED");

            if (is429 && attempt < maxRetries) {
                attempt++;
                const waitSec = Math.round(delayMs / 1000);
                console.log(`⏳ Rate limited. Waiting ${waitSec}s before retry (attempt ${attempt}/${maxRetries})...`);
                await new Promise((r) => setTimeout(r, delayMs));
                delayMs *= 2; // exponential backoff: 3s → 6s → 12s → 24s
            } else {
                throw error; // re-throw if not 429 or out of retries
            }
        }
    }
}
