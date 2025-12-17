export type Category = "Water" | "Electricity" | "Roads" | "Sanitation" | "Law & Order" | "Other";
export type Priority = "Low" | "Medium" | "High" | "Critical";
export type Sentiment = "Positive" | "Neutral" | "Negative" | "Angry";

export interface AIAnalysisResult {
    category: Category;
    priority: Priority;
    sentiment: Sentiment;
    summary: string;
    confidence: number;
    tags: string[];
}

const KEYWORDS: Record<Category, string[]> = {
    Water: ["leak", "water", "pipe", "supply", "dry", "flood", "sewage", "drain"],
    Electricity: ["power", "light", "voltage", "current", "pole", "wire", "shock", "outage"],
    Roads: ["pothole", "road", "street", "traffic", "signal", "accident", "block"],
    Sanitation: ["garbage", "trash", "dustbin", "smell", "clean", "waste", "dump"],
    "Law & Order": ["theft", "fight", "noise", "police", "crime", "unsafe", "harass"],
    Other: [],
};

const URGENCY_WORDS = ["urgent", "immediate", "danger", "critical", "emergency", "blood", "fire", "death", "accident", "massive", "severe"];
const NEGATIVE_WORDS = ["bad", "worst", "terrible", "useless", "pathetic", "angry", "frustrated", "fail", "disappoint"];

export function analyzeGrievance(text: string): AIAnalysisResult {
    const lowerText = text.toLowerCase();

    // 1. Auto-Categorization
    let detectedCategory: Category = "Other";
    let maxMatches = 0;

    (Object.keys(KEYWORDS) as Category[]).forEach((category) => {
        const matches = KEYWORDS[category].filter(word => lowerText.includes(word)).length;
        if (matches > maxMatches) {
            maxMatches = matches;
            detectedCategory = category;
        }
    });

    // 2. Priority Scoring
    let priority: Priority = "Low";
    const urgencyScore = URGENCY_WORDS.filter(word => lowerText.includes(word)).length;

    if (urgencyScore >= 2) priority = "Critical";
    else if (urgencyScore === 1) priority = "High";
    else if (lowerText.length > 200) priority = "Medium"; // Long complaints usually mean detail/effort

    // 3. Sentiment Analysis
    let sentiment: Sentiment = "Neutral";
    const negativeScore = NEGATIVE_WORDS.filter(word => lowerText.includes(word)).length;

    if (negativeScore >= 2) sentiment = "Angry";
    else if (negativeScore === 1) sentiment = "Negative";
    else if (lowerText.includes("thank") || lowerText.includes("good")) sentiment = "Positive";

    // 4. Summarization (Simple truncation for now)
    const summary = text.length > 100 ? text.substring(0, 97) + "..." : text;

    return {
        category: detectedCategory,
        priority,
        sentiment,
        summary,
        confidence: 0.85 + (Math.random() * 0.1), // Simulated confidence
        tags: [detectedCategory, priority, sentiment],
    };
}
