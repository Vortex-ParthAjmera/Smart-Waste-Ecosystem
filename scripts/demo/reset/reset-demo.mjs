import manifest from "../fixtures/seed-manifest.json" with { type: "json" };

console.log({
  action: "reset-demo",
  safe: true,
  note: "Run Supabase local reset separately for the selected demo project only.",
  manifest
});
