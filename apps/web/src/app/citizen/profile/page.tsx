"use client";

import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSkeleton, ErrorState, OfflineBanner } from "@/components/StateViews";
import { useDemoScreenState, DemoStateToggle } from "@/components/ScreenChrome";
import { apiClient } from "@/lib/api-client";
import { User, Phone, MapPin, ChevronRight } from "lucide-react";

export default function CitizenProfilePage() {
  const { status, setStatus } = useDemoScreenState();
  const citizen = apiClient.getDemoCitizen();

  return (
    <div>
      <PageHeader title="Profile" />
      <DemoStateToggle status={status} setStatus={setStatus} />
      {status === "offline" && <OfflineBanner />}
      {status === "loading" && <LoadingSkeleton rows={3} />}
      {status === "error" && <ErrorState onRetry={() => setStatus("ready")} />}
      {(status === "ready" || status === "offline") && (
        <div className="space-y-4">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary-light text-brand-primary-dark">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold">{citizen.name}</p>
                <p className="text-xs text-brand-muted-fg">{citizen.locality}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="divide-y divide-brand-border p-0">
              <div className="flex items-center gap-3 p-4 text-sm">
                <Phone className="h-4 w-4 text-brand-muted-fg" /> {citizen.phone}
              </div>
              <div className="flex items-center gap-3 p-4 text-sm">
                <MapPin className="h-4 w-4 text-brand-muted-fg" /> {citizen.locality}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="divide-y divide-brand-border p-0">
              {["Notification preferences", "Language", "Privacy & data", "Help & support"].map((item) => (
                <button key={item} className="flex w-full items-center justify-between p-4 text-left text-sm">
                  {item}
                  <ChevronRight className="h-4 w-4 text-brand-muted-fg" />
                </button>
              ))}
            </CardContent>
          </Card>
          <p className="text-center text-[10px] text-brand-muted-fg">Settings are placeholders in this UI-only pass.</p>
        </div>
      )}
    </div>
  );
}
