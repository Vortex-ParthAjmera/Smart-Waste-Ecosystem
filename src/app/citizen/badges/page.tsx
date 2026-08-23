"use client";

import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Lock, Star, Zap, Recycle, Clock, Droplets } from "lucide-react";
import { useCitizenProfile } from "@/lib/useCitizenProfile";
import { useDisposalHistory } from "@/lib/useDisposalHistory";
import { TIER_THRESHOLDS, pointsToNextTier } from "@/lib/mock/citizens";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// Computed badges based on real disposal history
function computeBadges(records: { compartment: string; points_earned: number; created_at: string }[], points: number) {
  const total = records.length;
  const wetCount = records.filter((r) => r.compartment === "WET").length;
  const dryCount = records.filter((r) => r.compartment === "DRY").length;
  const earlyCount = records.filter((r) => {
    const h = new Date(r.created_at).getHours();
    return h < 8;
  }).length;

  return [
    {
      id: "first_disposal",
      name: "First Step",
      description: "Logged your first disposal.",
      icon: Recycle,
      earned: total >= 1,
      unlockCriteria: "Log your first disposal.",
    },
    {
      id: "ten_disposals",
      name: "Getting Started",
      description: "10 disposals logged.",
      icon: Star,
      earned: total >= 10,
      unlockCriteria: `${Math.max(0, 10 - total)} more to unlock.`,
    },
    {
      id: "wet_pro",
      name: "Wet Waste Pro",
      description: "20 wet waste disposals.",
      icon: Droplets,
      earned: wetCount >= 20,
      unlockCriteria: `${Math.max(0, 20 - wetCount)} more wet disposals.`,
    },
    {
      id: "dry_pro",
      name: "Dry Waste Expert",
      description: "20 dry waste disposals.",
      icon: Zap,
      earned: dryCount >= 20,
      unlockCriteria: `${Math.max(0, 20 - dryCount)} more dry disposals.`,
    },
    {
      id: "early_bird",
      name: "Early Bird",
      description: "5 disposals before 8 AM.",
      icon: Clock,
      earned: earlyCount >= 5,
      unlockCriteria: `${Math.max(0, 5 - earlyCount)} more early-morning disposals.`,
    },
    {
      id: "century",
      name: "Century",
      description: "100 disposals total.",
      icon: Award,
      earned: total >= 100,
      unlockCriteria: `${Math.max(0, 100 - total)} more to unlock.`,
    },
  ];
}

export default function CitizenBadgesPage() {
  const { profile, loading: profileLoading } = useCitizenProfile();
  const { records, loading: historyLoading } = useDisposalHistory();

  const loading = profileLoading || historyLoading;
  const balance = profile?.pointsBalance ?? 0;
  const tier = profile?.tier ?? "BRONZE";
  const { nextTier, remaining } = pointsToNextTier(balance);
  const badges = computeBadges(records ?? [], balance);

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-brand-muted-fg" /></div>;

  return (
    <div>
      <PageHeader title="Badges & Tier" />

      <div className="mb-4 space-y-4">
        <Card>
          <CardContent className="p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-muted-fg">Tier boundaries</p>
            <div className="space-y-2">
              {TIER_THRESHOLDS.map((t) => (
                <div key={t.tier} className={cn("flex items-center justify-between rounded-lg px-3 py-2 text-sm",
                  tier === t.tier ? "bg-brand-primary-light font-semibold text-brand-primary-dark" : "bg-brand-surface-muted text-brand-muted-fg")}>
                  <span>{t.tier}</span>
                  <span className="text-xs">{t.min}–{t.max ?? "∞"} pts</span>
                </div>
              ))}
            </div>
            {nextTier && <p className="mt-2 text-xs text-brand-muted-fg">{remaining} points to {nextTier}</p>}
          </CardContent>
        </Card>

        <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-fg">Badges</p>
        <div className="grid grid-cols-2 gap-3">
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <Card key={b.id} className={cn(!b.earned && "opacity-60")}>
                <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-full",
                    b.earned ? "bg-brand-gold-light text-brand-gold" : "bg-brand-surface-muted text-brand-muted-fg")}>
                    {b.earned ? <Icon className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                  </div>
                  <p className="text-xs font-semibold">{b.name}</p>
                  <p className="text-[10px] text-brand-muted-fg">{b.earned ? b.description : b.unlockCriteria}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
