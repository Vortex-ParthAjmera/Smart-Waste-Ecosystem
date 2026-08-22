import fs from "node:fs";

const manifest = JSON.parse(fs.readFileSync("scripts/demo/fixtures/seed-manifest.json", "utf8"));
const migration = fs.readFileSync("supabase/migrations/202608220001_init_sgv.sql", "utf8");

const requiredTables = [
  "profiles",
  "citizens",
  "citizen_qr_tokens",
  "disposal_sessions",
  "gateways",
  "devices",
  "device_components",
  "ingest_messages",
  "idempotency_records",
  "rulesets",
  "disposal_events",
  "sensor_readings",
  "ml_detections",
  "segregation_results",
  "review_cases",
  "review_decisions",
  "point_transactions",
  "disputes",
  "badges",
  "citizen_badges",
  "device_heartbeats",
  "device_telemetry",
  "audit_logs"
];

for (const table of requiredTables) {
  if (!migration.includes(`create table ${table}`)) {
    throw new Error(`Missing table ${table}`);
  }
}

if (manifest.containsRealPii) {
  throw new Error("Seed manifest must not contain real PII");
}

console.log(`Seed verification passed for ${manifest.mainCitizenEventCount} main events and rules ${manifest.rulesetVersion}.`);
