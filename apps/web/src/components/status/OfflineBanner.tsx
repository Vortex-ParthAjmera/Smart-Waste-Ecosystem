import { cn } from "@/lib/utils";
import { WifiOff, Clock } from "lucide-react";

interface OfflineBannerProps {
  type?: "offline" | "stale";
  message?: string;
  className?: string;
}

export function OfflineBanner({ type = "offline", message, className }: OfflineBannerProps) {
  const isOffline = type === "offline";
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium",
        isOffline
          ? "bg-amber-50 text-amber-800 border border-amber-200"
          : "bg-orange-50 text-orange-800 border border-orange-200",
        className
      )}
      role="alert"
    >
      {isOffline ? <WifiOff className="h-4 w-4 shrink-0" /> : <Clock className="h-4 w-4 shrink-0" />}
      <span>
        {message ||
          (isOffline
            ? "You are offline. Data may not be up to date."
            : "Data may be stale. Last updated a few moments ago.")}
      </span>
    </div>
  );
}
