import { MapPin } from "lucide-react";

export function PreviewBanner() {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-2 rounded-xl border border-brand-primary/30 bg-brand-primary-light px-3 py-2 text-xs font-medium text-brand-primary-dark">
      <MapPin className="h-4 w-4 shrink-0" aria-hidden />
      <span>Live route tracking coming soon — ETA updates are estimated.</span>
    </div>
  );
}
