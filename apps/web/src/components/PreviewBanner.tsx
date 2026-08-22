import { FileClock } from "lucide-react";

export function PreviewBanner() {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-2 rounded-xl border border-brand-gold bg-brand-gold-light px-3 py-2 text-xs font-medium text-brand-gold">
      <FileClock className="h-4 w-4 shrink-0" aria-hidden />
      <span>
        <span className="font-semibold">PREVIEW/SEEDED —</span> Roadmap interface, not connected to a
        live backend.
      </span>
    </div>
  );
}
