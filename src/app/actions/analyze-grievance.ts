"use server";

import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "",
});

export interface AIAnalysisResult {
    category: "Sanitation" | "Roads" | "Electricity" | "Water" | "Law & Order" | "Other" | "Irrelevant";
    priority: "High" | "Medium" | "Low";
    sentiment: "Negative" | "Neutral" | "Positive";
    summary: string;
    confidence: number;
}

export async function analyzeGrievanceAction(description: string): Promise<AIAnalysisResult | null> {
    console.log("Analyze Action Called (Groq)");

    if (!process.env.GROQ_API_KEY) {
        console.error("GROQ_API_KEY is not set");
        return null;
    }

    try {
        const prompt = `
      You are an AI governance assistant for a civic grievance platform called "Jan-Mitra".
      Your job is to analyze citizen complaints about public issues (roads, water, sanitation, crime, etc.).

      Analyze the following text and provide a structured JSON response.

      Input Text: "${description}"

      CRITICAL INSTRUCTIONS:
      1. First, determine if this is a valid civic grievance. 
      2. If the input is gibberish, code snippets, error logs, random text, or unrelated to civic issues, mark it as "Irrelevant".
      3. If it is a valid grievance, categorize and prioritize it normally.

      Output Format (JSON only, no markdown):
      {
        "category": "Sanitation" | "Roads" | "Electricity" | "Water" | "Law & Order" | "Other" | "Irrelevant",
        "priority": "High" | "Medium" | "Low",
        "sentiment": "Negative" | "Neutral" | "Positive",
        "summary": "A concise 1-sentence summary. If irrelevant, explain why.",
        "confidence": number (0-100)
      }
    `;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an AI governance assistant. Output only valid JSON. Do not include markdown formatting like ```json.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.1,
        });

        const text = completion.choices[0]?.message?.content || "";

        // Clean up any potential markdown just in case
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(jsonString) as AIAnalysisResult;
    } catch (error) {
        console.error("Groq Analysis Failed:", error);
        return null;
    }
}
