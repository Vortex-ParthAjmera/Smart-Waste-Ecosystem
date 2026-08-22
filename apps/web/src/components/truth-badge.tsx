import type { UiTruthBadge } from "@sgv/contracts";

export function TruthBadge({ badge }: { badge: UiTruthBadge }) {
  return <span className={`truth-badge truth-${badge.toLowerCase().replace("/", "-")}`}>{badge}</span>;
}

export function StatusPill({ tone, children }: { tone: "ok" | "warn" | "bad" | "info" | "neutral"; children: React.ReactNode }) {
  return <span className={`status-pill status-${tone}`}>{children}</span>;
}
