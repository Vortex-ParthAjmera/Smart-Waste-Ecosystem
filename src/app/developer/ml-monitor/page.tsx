"use client";

import { PageHeader } from "@/components/PageHeader";
import { DevCard, DevSectionLabel } from "@/components/developer/DevCard";
import { TruthBadge } from "@/components/TruthBadge";
import { EmptyState } from "@/components/StateViews";
import { apiClient } from "@/lib/api-client";
import { truthBadgeForEvent } from "@/lib/mock/disposalEvents";
import { useDemoStore } from "@/lib/demoStore";
import { formatDateTime } from "@/lib/utils";

const FRIENDLY_LABELS: Record<string, string> = {
  SUPPORTED: "Recognized item",
  UNSUPPORTED: "Unsupported class",
  MULTIPLE: "Multiple conflicting detections",
  UNAVAILABLE: "No detection",
  TIMEOUT: "Inference timeout",
};

export default function MlMonitorPage() {
  const demo = useDemoStore();
  const citizen = apiClient.getDemoCitizen();
  const seeded = apiClient.getEventsForCitizen(citizen.id).slice(0, 8);
  const events = [...demo.injectedEvents, ...seeded].slice(0, 10);

  return (
    <div>
      <PageHeader title="ML Monitor" description="Classification cards with technical + friendly labels" className="text-slate-100" />
      {events.length === 0 ? (
        <EmptyState title="No ML detections yet" />
      ) : (
        <div className="space-y-2">
          {events.map((e) => (
            <DevCard key={e.eventId}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-100">
                    {e.mlDetection?.status ? FRIENDLY_LABELS[e.mlDetection.status] : "No ML data"}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {e.mlDetection?.status ?? "N/A"} · mapped category {e.mlDetection?.category ?? "UNKNOWN"}
                  </p>
                </div>
                <TruthBadge value={truthBadgeForEvent(e.eventSource)} />
              </div>
              {e.mlDetection && (
                <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-400 sm:grid-cols-4">
                  <div>Confidence: <span className="text-slate-200">{(e.mlDetection.confidence * 100).toFixed(0)}%</span></div>
                  <div>Band: <span className="text-slate-200">{e.mlDetection.scoreBand}</span></div>
                  <div>Model: <span className="text-slate-200">{e.mlDetection.modelVersion}</span></div>
                  <div>Evidence: <span className="text-slate-200">{e.mlDetection.evidenceSource}</span></div>
                </div>
              )}
              <p className="mt-2 text-[10px] text-slate-600">Captured {formatDateTime(e.timestamp)} · device {e.deviceCode}</p>
            </DevCard>
          ))}
        </div>
      )}
    </div>
  );
}
