"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TruthBadge } from "@/components/TruthBadge";
import { EmptyState } from "@/components/StateViews";
import { apiClient } from "@/lib/api-client";
import { truthBadgeForEvent } from "@/lib/mock/disposalEvents";
import { formatDateTime, cn } from "@/lib/utils";
import { Search } from "lucide-react";

export default function CitizenLookupPage() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const results = apiClient
    .listCitizens()
    .filter((c) => q.length === 0 || c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q));

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader title="Citizen Lookup" description="Search by name, phone, or scanned ID" />
      <div className="mb-4 flex items-center gap-2 rounded-xl border border-brand-border bg-brand-surface px-3 py-2">
        <Search className="h-4 w-4 text-brand-muted-fg" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search citizens…"
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      {results.length === 0 ? (
        <EmptyState title="No citizen matches this search" description="Try a different name or scan their QR instead." />
      ) : (
        <div className="space-y-6">
          {results.map((citizen) => {
            const ledger = apiClient.getLedgerForCitizen(citizen.id).slice(0, 6);
            return (
              <div key={citizen.id} className="space-y-3">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm font-semibold">{citizen.name}</p>
                    <p className="text-xs text-brand-muted-fg">{citizen.locality} · {citizen.phone}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="primary">{citizen.tier}</Badge>
                      <Badge variant="outline">{citizen.pointsBalance.toLocaleString("en-IN")} pts</Badge>
                      <Badge variant="outline">Segregation score {citizen.segregationScore}</Badge>
                    </div>
                  </CardContent>
                </Card>

                {ledger.length > 0 && (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted-fg">Recent ledger entries</p>
                    <div className="space-y-2">
                      {ledger.map((t) => (
                        <Card key={t.id}>
                          <CardContent className="flex items-center justify-between p-3">
                            <div>
                              <p className="text-sm">{t.reason}</p>
                              <div className="mt-1 flex items-center gap-2">
                                <TruthBadge value={truthBadgeForEvent(t.provenance)} />
                                <span className="text-[11px] text-brand-muted-fg">{formatDateTime(t.timestamp)}</span>
                              </div>
                            </div>
                            <span className={cn("font-semibold", t.amount >= 0 ? "text-brand-primary" : "text-brand-danger")}>
                              {t.amount > 0 ? "+" : ""}
                              {t.amount}
                            </span>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
