import * as https from "https";

const key = "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";
const model = "openai/gpt-oss-120b";

const testUrl = (hostname: string, path: string) => {
    return new Promise((resolve) => {
        const req = https.request({
            hostname,
            path,
            method: "POST",
            headers: {
                "Authorization": `Bearer ${key}`,
                "Content-Type": "application/json"
            }
        }, (res) => {
            let data = "";
            res.on("data", (chunk) => data += chunk);
            res.on("end", () => resolve({ host: hostname, status: res.statusCode, data }));
        });
        req.on("error", (e) => resolve({ host: hostname, error: e.message }));
        req.write(JSON.stringify({ model, messages: [{ role: "user", content: "hi" }] }));
        req.end();
    });
};

async function run() {
    const results = await Promise.all([
        testUrl("openrouter.ai", "/api/v1/chat/completions"),
        testUrl("api.groq.com", "/openai/v1/chat/completions"),
        testUrl("glhf.chat", "/api/openai/v1/chat/completions")
    ]);
    console.log(JSON.stringify(results, null, 2));
}

run();
