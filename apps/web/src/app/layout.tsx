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
        <script
          // Runs before paint so the citizen/municipal screens never flash
          // light-then-dark (or vice versa) on load.
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem("sgv-theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark");}catch(e){}})();`,
          }}
        />
      </head>
      <body><LanguageProvider>{children}</LanguageProvider></body>
    </html>
  );
}
