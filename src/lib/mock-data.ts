import { AIAnalysisResult } from "./ai-engine";

export interface Grievance extends AIAnalysisResult {
    id: string;
    timestamp: Date;
    status: "Pending" | "In Progress" | "Resolved" | "Escalated";
    location: string;
}

const LOCATIONS = ["Sector 4", "Main Market", "Railway Station", "Civil Lines", "Tech Park", "Old City"];

export function generateMockGrievance(id: string): Grievance {
    const categories = ["Water", "Electricity", "Roads", "Sanitation", "Law & Order"] as const;
    const priorities = ["Low", "Medium", "High", "Critical"] as const;
    const sentiments = ["Negative", "Angry", "Neutral"] as const;

    const category = categories[Math.floor(Math.random() * categories.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];

    return {
        id,
        timestamp: new Date(),
        status: priority === "Critical" ? "Escalated" : "Pending",
        location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
        category,
        priority,
        sentiment,
        summary: `Reported issue regarding ${category.toLowerCase()} in the area.`,
        confidence: 0.85 + Math.random() * 0.1,
        tags: [category, priority, sentiment]
    };
}
