"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { DevCard, DevSectionLabel } from "@/components/developer/DevCard";
import { StatusPill } from "@/components/StatusPill";
import { EmptyState } from "@/components/StateViews";
import { apiClient } from "@/lib/api-client";

const LABELS: Record<string, string> = {
  wifi: "Wi-Fi / LAN",
  gps: "GPS",
  irWet: "Wet IR",
  irDry: "Dry IR",
  ultrasonicWet: "Wet ultrasonic",
  ultrasonicDry: "Dry ultrasonic",
  moisture: "Moisture sensor",
  camera: "Camera",
  model: "Local model",
};

export default function DeviceDetailPage({ params }: { params: Promise<{ deviceId: string }> }) {
  const { deviceId } = use(params);
  const device = apiClient.getDeviceByCode(deviceId);

  if (!device) {
    return (
      <div>
        <Link href="/developer/devices" className="mb-3 inline-flex items-center gap-1 text-xs text-slate-400">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to devices
        </Link>
        <EmptyState title="Device not found" />
      </div>
    );
  }

  return (
    <div>
      <Link href="/developer/devices" className="mb-3 inline-flex items-center gap-1 text-xs text-slate-400">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to devices
      </Link>
      <PageHeader title={device.deviceCode} description={device.label} className="text-slate-100" />
      <DevSectionLabel>Zone · {device.zone}</DevSectionLabel>
      <div className="grid gap-2 sm:grid-cols-2">
        {Object.entries(device.components).map(([key, value]) => (
          <DevCard key={key} className="flex items-center justify-between">
            <span className="text-sm text-slate-200">{LABELS[key] ?? key}</span>
            <StatusPill status={value} />
          </DevCard>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-slate-500">
        Firmware {device.firmwareVersion} · last seen {new Date(device.lastSeen).toLocaleString("en-IN")}
      </p>
    </div>
  );
}
