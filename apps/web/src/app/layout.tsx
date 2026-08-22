import type { Metadata } from "next";
import { LanguageProvider } from "@/context/language-context";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "SGV 2.0 Smart Waste Ecosystem",
  description: "Truth-labelled smart waste collection with traceable disposal events for citizens and municipal review."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body><LanguageProvider>{children}</LanguageProvider></body>
    </html>
  );
}
