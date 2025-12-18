"use server";

import Groq from "groq-sdk";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "",
});

export interface Message {
    role: "user" | "assistant" | "system";
    content: string;
}

export interface ChatResponse {
    message: string;
    suggestedReplies: string[];
    suretyScore: number;
    extractedData: {
        category?: string;
        location?: string;
        priority?: string;
        summary?: string;
        department?: string;
        sla?: string;
    };
    isComplete: boolean;
    requestEvidence?: boolean;
    requestLocation?: boolean;
}

export async function chatWithGrievanceAI(history: Message[], currentInput: string, imageBase64?: string | null): Promise<ChatResponse | null> {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    );

    // Verify Authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.error("Unauthorized: User must be logged in to use AI.");
        return {
            message: "Unauthorized: Please log in again.",
            suggestedReplies: [],
            suretyScore: 0,
            extractedData: {},
            isComplete: false,
            isError: true
        } as any;
    }

    if (!process.env.GROQ_API_KEY) {
        console.error("GROQ_API_KEY is not set");
        return {
            message: "Server Error: API Key missing. Please check .env.local",
            suggestedReplies: [],
            suretyScore: 0,
            extractedData: {},
            isComplete: false,
            isError: true
        } as any;
    }

    try {
        const systemPrompt = `
      You are "Jan-Mitra", a compassionate and efficient AI civic official. 
      Your goal is to interview a citizen to gather complete details about a grievance so it can be resolved quickly.

      **Evidence Handling:**
      - If the user mentions having "proof", "photo", "video", or "evidence", ask them to upload it.
      - Set the "requestEvidence" flag to true in your JSON response when you ask for this.
      - Do NOT try to analyze images yourself. Just acknowledge that the user has provided or wants to provide evidence.

      **Location Handling:**
      - If the location is missing or ambiguous (e.g., "near my home"), ask for the location.
      - Set the "requestLocation" flag to true in your JSON response when you ask for this.

      **Your Process:**
      1.  **Acknowledge**: Briefly validate the user's input.
      2.  **Analyze**: Check what information is missing (Location? Severity? Time? Evidence?).
      3.  **Ask**: Ask ONE clear follow-up question to get the missing info.
      4.  **Score**: Estimate a "Data Surety Score" (0-100%).
      5.  **Enrich**: If the report is complete (score > 90), infer the following:
          - **Department**: Assign the relevant Indian civic body (e.g., "Municipal Corporation (MCD/BBMP)", "Public Works Department (PWD)", "Electricity Board (BESCOM/TNEB)", "Jal Board / Water Supply", "Traffic Police").
          - **SLA**: Estimated time for resolution based on typical Citizen Charter (High=24hrs, Medium=48hrs, Low=7 Days).

      **Output Format:**
      You must output ONLY a valid JSON object. Do not include markdown formatting.
      {
        "message": "Your conversational response to the user.",
        "suggestedReplies": ["Option 1", "Option 2"],
        "suretyScore": number (0-100),
        "extractedData": {
          "category": "Sanitation" | "Roads" | "Electricity" | "Water" | "Law & Order" | "Other" | null,
          "location": "extracted location or null",
          "priority": "High" | "Medium" | "Low" | null,
          "summary": "current summary of the issue",
          "department": "Inferred Department Name (e.g. PWD, BBMP)",
          "sla": "Estimated Resolution Time"
        },
        "isComplete": boolean,
        "requestEvidence": boolean,
        "requestLocation": boolean
      }
    `;

        // We are NOT sending the image to the LLM anymore as per user request.
        // We just append a note if an image was attached so the AI knows.
        let finalInput = currentInput;
        if (imageBase64) {
            finalInput += " [System: User has attached an image/evidence]";
        }

        const messages: Message[] = [
            { role: "system", content: systemPrompt },
            ...history,
            { role: "user", content: finalInput }
        ];

        const completion = await groq.chat.completions.create({
            messages: messages as any,
            model: "llama-3.3-70b-versatile", // Reverted to text-only model
            temperature: 0.2,
            response_format: { type: "json_object" }
        });

        const text = completion.choices[0]?.message?.content || "";
        return JSON.parse(text) as ChatResponse;

    } catch (error: any) {
        console.error("Chat Action Failed:", error);

        let errorMessage = "AI Connection Failed";

        if (error?.response?.status === 401) {
            errorMessage = "Invalid API Key. Please check your settings.";
        } else if (error?.response?.status === 429) {
            errorMessage = "AI is busy (Rate Limit). Please try again later.";
        } else if (error?.message) {
            errorMessage = `AI Error: ${error.message}`;
        }

        return {
            message: errorMessage,
            suggestedReplies: [],
            suretyScore: 0,
            extractedData: {},
            isComplete: false,
            isError: true // Flag for frontend
        } as any;
    }
}
