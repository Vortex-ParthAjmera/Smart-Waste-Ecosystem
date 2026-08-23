"use client";

import { useEffect, useState, type FormEvent } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { User, Mail, MapPin, Navigation, Loader2, CheckCircle2, Pencil, X } from "lucide-react";
import { useCitizenProfile } from "@/lib/useCitizenProfile";

export default function CitizenProfilePage() {
  const { profile, loading, refresh } = useCitizenProfile();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [locality, setLocality] = useState("");
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile && !editing) {
      setName(profile.fullName ?? "");
      setLocality(profile.locality ?? "");
      setUsername(profile.username ?? "");
    }
  }, [profile, editing]);

  async function detectLocality() {
    if (!navigator.geolocation) { setError("Geolocation not supported."); return; }
    setGpsLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const parts = [
            data.address?.suburb || data.address?.neighbourhood || data.address?.village,
            data.address?.city || data.address?.town || data.address?.county,
          ].filter(Boolean);
          setLocality(parts.join(", ") || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } catch { setError("Could not look up location."); }
        finally { setGpsLoading(false); }
      },
      () => { setError("Location access denied."); setGpsLoading(false); }
    );
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setSaving(true); setError(null);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: name, locality, username }),
    });
    const json = await res.json();
    if (!res.ok) { setError(json.error || "Save failed."); setSaving(false); return; }
    await refresh();
    setSaving(false); setSaved(true); setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  }

  const TIER_COLORS: Record<string, string> = {
    BRONZE: "bg-amber-100 text-amber-800",
    SILVER: "bg-slate-200 text-slate-700",
    GOLD: "bg-yellow-100 text-yellow-700",
    PLATINUM: "bg-violet-100 text-violet-700",
  };

  if (loading) return (
    <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-brand-muted-fg" /></div>
  );

  return (
    <div>
      <PageHeader
        title="Profile"
        action={
          !editing ? (
            <button onClick={() => setEditing(true)} className="flex items-center gap-1 text-xs font-medium text-brand-primary">
              <Pencil className="h-3.5 w-3.5" /> Edit
            </button>
          ) : (
            <button onClick={() => { setEditing(false); setError(null); }} className="flex items-center gap-1 text-xs font-medium text-brand-muted-fg">
              <X className="h-3.5 w-3.5" /> Cancel
            </button>
          )
        }
      />

      {saved && (
        <div className="mb-3 flex items-center gap-2 rounded-xl bg-brand-primary-light px-3 py-2 text-xs font-medium text-brand-primary-dark">
          <CheckCircle2 className="h-4 w-4" /> Profile saved successfully
        </div>
      )}

      {!editing ? (
        <div className="space-y-4">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary-light text-brand-primary-dark text-lg font-bold">
                {profile?.fullName?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div>
                <p className="text-sm font-semibold">{profile?.fullName}</p>
                {profile?.username && <p className="text-xs text-brand-muted-fg">@{profile.username}</p>}
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${TIER_COLORS[profile?.tier ?? "BRONZE"]}`}>
                  {profile?.tier ?? "BRONZE"}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="divide-y divide-brand-border p-0">
              <div className="flex items-center gap-3 p-4 text-sm">
                <Mail className="h-4 w-4 text-brand-muted-fg shrink-0" />
                <span className="text-brand-muted-fg">{profile?.email ?? "—"}</span>
              </div>
              <div className="flex items-center gap-3 p-4 text-sm">
                <MapPin className="h-4 w-4 text-brand-muted-fg shrink-0" />
                <span>{profile?.locality || <span className="text-brand-muted-fg">Locality not set — tap Edit</span>}</span>
              </div>
              <div className="flex items-center gap-3 p-4 text-sm">
                <User className="h-4 w-4 text-brand-muted-fg shrink-0" />
                <span className="font-mono text-xs">{profile?.id?.slice(0, 8)}…</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-brand-primary">{profile?.pointsBalance ?? 0}</p>
              <p className="text-xs text-brand-muted-fg">EcoCredits balance</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <form onSubmit={save} className="space-y-4">
          <Card>
            <CardContent className="space-y-3 p-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-brand-muted-fg">Full name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-lg border border-brand-border bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-brand-muted-fg">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="your_username"
                  className="w-full rounded-lg border border-brand-border bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-primary font-mono"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-brand-muted-fg">Locality / Ward</label>
                <div className="flex gap-2">
                  <input
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Indore, Ward 12"
                    className="flex-1 rounded-lg border border-brand-border bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-primary"
                  />
                  <button
                    type="button"
                    onClick={detectLocality}
                    disabled={gpsLoading}
                    title="Detect my location"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-border text-brand-muted-fg transition hover:border-brand-primary hover:text-brand-primary disabled:opacity-50"
                  >
                    {gpsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-brand-muted-fg">Tap the arrow to detect from GPS</p>
              </div>
            </CardContent>
          </Card>

          {error && <p className="text-xs font-medium text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}
          </button>
        </form>
      )}
    </div>
  );
}
