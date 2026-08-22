"use client";

import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { DevCard, DevSectionLabel } from "@/components/developer/DevCard";
import { Button } from "@/components/ui/button";
import { TruthBadge } from "@/components/TruthBadge";
import { EmptyState } from "@/components/StateViews";
import { useDemoStore, injectTestEvent, getFixtures, clearActiveDisposal } from "@/lib/demoStore";
import { truthBadgeForEvent } from "@/lib/mock/disposalEvents";
import { formatDateTime } from "@/lib/utils";
import { FlaskConical, ArrowUpRight, RotateCcw } from "lucide-react";

export default function InjectTestEventPage() {
  const demo = useDemoStore();
  const fixtures = getFixtures();

  return (
    <div>
      <PageHeader
        title="Inject Test Event"
        description="Simulate a full disposal without touching hardware — drives Citizen + Municipal views live"
        className="text-slate-100"
      />

      <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-700 bg-amber-950/30 px-3 py-2 text-xs text-amber-300">
        <FlaskConical className="mt-0.5 h-4 w-4 shrink-0" />
        Every injected event is tagged <TruthBadge value="SIMULATED" className="mx-1" /> everywhere it appears —
        Citizen Live Disposal, Municipal Live Events, and here.
      </div>

      <DevSectionLabel>Choose a fixture</DevSectionLabel>
      <div className="grid gap-2 sm:grid-cols-2">
        {fixtures.map((f) => (
          <DevCard key={f.id} className="flex flex-col gap-2">
            <div>
              <p className="text-sm font-medium text-slate-100">{f.label}</p>
              <p className="text-[11px] text-slate-500">
                {f.compartment} compartment · confidence {(f.confidence * 100).toFixed(0)}% ·{" "}
                {f.correct ? "expected: accepted" : "expected: flagged/violation"}
              </p>
            </div>
            <Button size="sm" variant="secondary" onClick={() => injectTestEvent(f.id)}>
              <FlaskConical className="h-3.5 w-3.5" /> Inject this event
            </Button>
          </DevCard>
        ))}
      </div>

      <DevSectionLabel>
        <span className="mt-5 block">Live state</span>
      </DevSectionLabel>
      {!demo.activeDisposal ? (
        <EmptyState title="No active injected disposal" description="Inject a fixture above to see it propagate." />
      ) : (
        <DevCard className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-100">{demo.activeDisposal.eventId}</p>
            <TruthBadge value={truthBadgeForEvent(demo.activeDisposal.eventSource)} />
          </div>
          <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-400">
            <div>Processing: <span className="text-slate-200">{demo.activeDisposal.processingState}</span></div>
            <div>Decision: <span className="text-slate-200">{demo.activeDisposal.decisionState}</span></div>
            <div>Transport: <span className="text-slate-200">{demo.activeDisposal.transportState}</span></div>
          </div>
          <p className="text-[11px] text-slate-500">Injected {formatDateTime(demo.activeDisposal.timestamp)}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button size="sm" variant="outline" asChild>
              <Link href="/citizen/disposal">
                <ArrowUpRight className="h-3.5 w-3.5" /> View on Citizen
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/municipal/events">
                <ArrowUpRight className="h-3.5 w-3.5" /> View on Municipal
              </Link>
            </Button>
            <Button size="sm" variant="ghost" onClick={clearActiveDisposal}>
              <RotateCcw className="h-3.5 w-3.5" /> Clear
            </Button>
          </div>
        </DevCard>
      )}

      {demo.injectedEvents.length > 0 && (
        <>
          <DevSectionLabel>
            <span className="mt-5 block">Session history ({demo.injectedEvents.length})</span>
          </DevSectionLabel>
          <div className="space-y-1.5">
            {demo.injectedEvents.map((e) => (
              <DevCard key={e.eventId} className="flex items-center justify-between py-2 text-xs">
                <span className="text-slate-300">{e.eventId}</span>
                <span className="text-slate-500">{e.decisionState}</span>
                <span className="text-slate-500">{e.transportState}</span>
              </DevCard>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
