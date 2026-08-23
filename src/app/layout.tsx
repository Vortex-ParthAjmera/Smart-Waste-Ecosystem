import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Swachh Saathi - Smart Waste Management Platform",
  description: "UI-only prototype for the Smart Waste Management civic-tech platform (Citizen / Municipal / Developer).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-background">{children}</body>
    </html>
  );
}
