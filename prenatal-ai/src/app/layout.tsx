import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Prenatal Risk Analyzer — Advanced Maternal Health Intelligence",
  description:
    "Cutting-edge AI-powered prenatal risk assessment. Upload your medical data and receive instant, accurate risk analysis powered by advanced machine learning.",
  keywords: ["prenatal", "AI", "risk analysis", "maternal health", "pregnancy"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050810] text-slate-100`}
      >
        {children}
      </body>
    </html>
  );
}
