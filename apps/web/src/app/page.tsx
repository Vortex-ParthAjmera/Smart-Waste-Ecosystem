import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mb-6 text-6xl">♻️</div>
        <h1 className="text-3xl font-bold text-slate-800">Smart Waste Ecosystem</h1>
        <p className="mt-2 text-slate-500">SGV 2.0 — From disposal to verifiable digital record</p>
        <div className="mt-8 space-y-3">
          <Link
            href="/citizen"
            className="block w-full rounded-lg bg-emerald-600 px-6 py-3 text font-medium text-white hover:bg-emerald-700 transition-colors"
          >
            👤 Citizen Portal
          </Link>
          <Link
            href="/municipal"
            className="block w-full rounded-lg bg-blue-600 px-6 py-3 text font-medium text-white hover:bg-blue-700 transition-colors"
          >
            🏛️ Municipal Portal
          </Link>
          <Link
            href="/developer"
            className="block w-full rounded-lg bg-slate-700 px-6 py-3 text font-medium text-white hover:bg-slate-800 transition-colors"
          >
            🔧 Developer / IoT Portal
          </Link>
        </div>
        <p className="mt-6 text-xs text-slate-400">
          UI-Only Demo Pass — Mock data, no real backend
        </p>
      </div>
    </main>
  );
}
