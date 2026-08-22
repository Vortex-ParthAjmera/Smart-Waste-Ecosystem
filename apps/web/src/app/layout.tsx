import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Waste Ecosystem — SGV 2.0",
  description: "From physical disposal to a verifiable digital record — live, offline-resilient, explainable, and fair.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 antialiased">{children}</body>
    </html>
  );
}
