import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const bricolage = Bricolage_Grotesque({ 
  subsets: ["latin"],
  variable: '--font-bricolage',
});

export const metadata: Metadata = {
  title: "MindLoom - AI-Powered Voice Journal & Goal Tracker",
  description: "Transform your thoughts into insights with conversational AI journaling and intelligent goal tracking.",
  keywords: ["journal", "ai journal", "voice journal", "goal tracking", "mindfulness", "productivity"],
  authors: [{ name: "Sathvik" }],
  openGraph: {
    title: "MindLoom - AI-Powered Voice Journal & Goal Tracker",
    description: "Transform your thoughts into insights with conversational AI journaling and intelligent goal tracking.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${bricolage.variable}`}>
      <body className="font-inter bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}