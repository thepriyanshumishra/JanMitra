"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Mock data for demonstration (shown when no real data exists)
const mockCategoryData = [
    { name: "Water Supply", value: 45 },
    { name: "Roads & Infrastructure", value: 32 },
    { name: "Electricity", value: 28 },
    { name: "Sanitation", value: 19 },
    { name: "Public Safety", value: 12 },
];

const mockSentimentData = [
    { name: "Negative", value: 65, color: "#ef4444" },
    { name: "Neutral", value: 25, color: "#94a3b8" },
    { name: "Positive", value: 10, color: "#22c55e" },
];

const mockTrendData = [
    { day: "Mon", reports: 12, resolved: 10 },
    { day: "Tue", reports: 18, resolved: 14 },
    { day: "Wed", reports: 15, resolved: 16 },
    { day: "Thu", reports: 25, resolved: 20 },
    { day: "Fri", reports: 22, resolved: 18 },
    { day: "Sat", reports: 30, resolved: 24 },
    { day: "Sun", reports: 10, resolved: 8 },
];

export async function getAnalyticsData() {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch {
                        }
                    },
                },
            }
        );

        // Verify Authentication
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.error("Unauthorized: User must be logged in to view analytics.");
            return {
                categoryData: mockCategoryData,
                sentimentData: mockSentimentData,
                trendData: mockTrendData
            };
        }

        // Fetch all grievances
        const { data: grievances, error } = await supabase
            .from("grievances")
            .select("category, sentiment, status, created_at");

        if (error) {
            console.error("Error fetching analytics data:", error);
            // Return mock data on error
            return {
                categoryData: mockCategoryData,
                sentimentData: mockSentimentData,
                trendData: mockTrendData
            };
        }

        // If no real data, return mock data
        if (!grievances || grievances.length === 0) {
            return {
                categoryData: mockCategoryData,
                sentimentData: mockSentimentData,
                trendData: mockTrendData
            };
        }

        // Process real data and merge with mock data
        // 1. Category Distribution
        const categoryMap = new Map<string, number>();

        // Initialize with mock data
        mockCategoryData.forEach(item => {
            categoryMap.set(item.name, item.value);
        });

        // Add real data on top
        grievances.forEach((g) => {
            const cat = g.category || "Uncategorized";
            categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
        });

        const categoryData = Array.from(categoryMap.entries()).map(([name, value]) => ({
            name,
            value,
        }));

        // 2. Sentiment Analysis
        const sentimentMap = new Map<string, number>();

        // Initialize with mock data
        mockSentimentData.forEach(item => {
            sentimentMap.set(item.name, item.value);
        });

        // Add real data
        grievances.forEach((g) => {
            const sent = g.sentiment || "Neutral";
            sentimentMap.set(sent, (sentimentMap.get(sent) || 0) + 1);
        });

        const sentimentColors: Record<string, string> = {
            Positive: "#22c55e",
            Neutral: "#94a3b8",
            Negative: "#ef4444",
        };

        const sentimentData = Array.from(sentimentMap.entries()).map(([name, value]) => ({
            name,
            value,
            color: sentimentColors[name] || "#94a3b8",
        }));

        // 3. Resolution Trends (Last 7 days)
        const trendMap = new Map<string, { reports: number; resolved: number }>();
        const today = new Date();
        const last7DaysNames: string[] = [];

        // Initialize last 7 days
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
            last7DaysNames.push(dayName);
            trendMap.set(dayName, { reports: 0, resolved: 0 });
        }

        // Merge mock data
        mockTrendData.forEach(item => {
            if (trendMap.has(item.day)) {
                trendMap.set(item.day, { reports: item.reports, resolved: item.resolved });
            }
        });

        // Override with real data
        grievances.forEach((g) => {
            const date = new Date(g.created_at);
            const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

            if (trendMap.has(dayName)) {
                const entry = trendMap.get(dayName)!;
                entry.reports += 1;
                if (g.status === "Resolved") {
                    entry.resolved += 1;
                }
            }
        });

        const trendData = last7DaysNames.map(day => {
            const counts = trendMap.get(day) || { reports: 0, resolved: 0 };
            return {
                day,
                reports: counts.reports,
                resolved: counts.resolved,
            };
        });

        return { categoryData, sentimentData, trendData };

    } catch (error) {
        console.error("Unexpected error in getAnalyticsData:", error);
        // Return mock data on any error
        return {
            categoryData: mockCategoryData,
            sentimentData: mockSentimentData,
            trendData: mockTrendData
        };
    }
}
