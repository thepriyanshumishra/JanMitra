"use server";

interface EmailPayload {
    to: string;
    subject: string;
    body: string;
}

export async function sendEmail({ to, subject, body }: EmailPayload) {
    // Mock Email Sending
    console.log("📧 [MOCK EMAIL] Sending...");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log("✅ [MOCK EMAIL] Sent successfully.");
    return { success: true };
}
