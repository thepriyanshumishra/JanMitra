import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { GoogleTranslate } from "@/components/GoogleTranslate";
import { BroadcastBanner } from "@/components/ui/BroadcastBanner";
import { NotificationProvider } from "@/context/NotificationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://jan-mitra.vercel.app'), // Replace with actual domain
  title: {
    default: "JAN-MITRA | AI Governance Layer",
    template: "%s | JAN-MITRA"
  },
  description: "Next-Gen Intelligence & Accountability Layer for Public Grievances. Powered by AI, Secured by Blockchain.",
  applicationName: "JAN-MITRA",
  authors: [{ name: "Jan-Mitra Team" }],
  keywords: ["Governance", "AI", "Blockchain", "Grievance Redressal", "Smart City", "India", "Civic Tech"],
  openGraph: {
    title: "JAN-MITRA | AI Governance Layer",
    description: "Transforming public grievance redressal with AI agents and Blockchain transparency.",
    url: 'https://jan-mitra.vercel.app',
    siteName: 'JAN-MITRA',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "JAN-MITRA | AI Governance Layer",
    description: "The future of civic engagement. Report, Track, Resolve.",
    creator: "@janmitra_gov",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <AuthProvider>
              <NotificationProvider>
                <BroadcastBanner />
                {children}
                <Toaster />
              </NotificationProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
