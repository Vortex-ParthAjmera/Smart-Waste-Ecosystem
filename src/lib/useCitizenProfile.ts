"use client";

import { useCallback, useEffect, useState } from "react";

export interface CitizenProfileData {
  id: string;
  username: string | null;
  fullName: string;
  email: string | null;
  locality: string | null;
  tier: string;
  pointsBalance: number;
}

export function useCitizenProfile() {
  const [profile, setProfile] = useState<CitizenProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile", { cache: "no-store" });
      setProfile(res.ok ? await res.json() : null);
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchProfile(); }, [fetchProfile]);

  return { profile, loading, refresh: fetchProfile };
}
