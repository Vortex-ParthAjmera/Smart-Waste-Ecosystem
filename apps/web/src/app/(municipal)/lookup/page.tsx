"use client";

import { useState } from "react";
import { citizens } from "@/lib/mock/data";

export default function MunicipalLookup() {
  const [query, setQuery] = useState("");
  const results = query.length > 1 ? citizens.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.id.includes(query)) : [];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800">Citizen Lookup</h2>
      <input
        type="text"
        placeholder="Search by name or ID..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
      />
      {results.length > 0 ? (
        <div className="space-y-2">
          {results.map(c => (
            <div key={c.id} className="rounded-xl bg-white border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-lg">👤</div>
                <div>
                  <p className="font-semibold text-slate-800">{c.name}</p>
                  <p className="text-xs text-slate-400">ID: {c.id.toUpperCase()}</p>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                <div className="rounded bg-slate-50 p-2 text-center"><p className="text-slate-400">Credits</p><p className="font-bold text-emerald-600">{c.pointsBalance}</p></div>
                <div className="rounded bg-slate-50 p-2 text-center"><p className="text-slate-400">Tier</p><p className="font-bold">{c.tier}</p></div>
                <div className="rounded bg-slate-50 p-2 text-center"><p className="text-slate-400">Score</p><p className="font-bold">{c.segregationScore}%</p></div>
              </div>
            </div>
          ))}
        </div>
      ) : query.length > 1 ? (
        <p className="py-8 text-center text-sm text-slate-400">No citizens found matching &ldquo;{query}&rdquo;</p>
      ) : (
        <p className="py-8 text-center text-sm text-slate-400">Type at least 2 characters to search</p>
      )}
    </div>
  );
}
