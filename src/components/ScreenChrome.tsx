"use client";

import { useEffect, useState } from "react";

export type ScreenStatus = "loading" | "ready" | "error" | "offline";

export function useDemoScreenState(delayMs = 450) {
  const [status, setStatus] = useState<ScreenStatus>("loading");
  useEffect(() => {
    const t = setTimeout(() => setStatus("ready"), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);
  return { status, setStatus };
}
