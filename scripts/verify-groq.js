const Groq = require("groq-sdk");
const fs = require('fs');
const path = require('path');

// Load .env.local manually
try {
    const envPath = path.resolve(__dirname, '../.env.local');
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
} catch (e) {
    console.error("Could not load .env.local", e);
}

async function verify() {
    console.log("Testing Groq API Key...");

    if (!process.env.GROQ_API_KEY) {
        console.error("❌ Error: GROQ_API_KEY is missing in .env.local");
        return;
    }

    try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: "Hello" }],
            model: "llama-3.3-70b-versatile",
        });
        console.log("✅ Success! API Key is valid.");
        console.log("Response:", completion.choices[0]?.message?.content);
    } catch (error) {
        console.error("❌ API Connection Failed:");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data: ${JSON.stringify(error.response.data)}`);
        } else {
            console.error(error.message);
        }
    }
}

verify();
