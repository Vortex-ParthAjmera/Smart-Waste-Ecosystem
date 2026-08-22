/**
 * apps/web/src/app/layout.tsx
 * Next.js root layout — one app with citizen, municipal, developer role experiences.
 *
 * Owner: YASHVARDHAN DOBHAL
 * This is a scaffold stub. Full implementation by Yashvardhan.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smart Waste Ecosystem",
  description: "SGV 2.0 — Auditable waste segregation with citizen points and municipal review.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
