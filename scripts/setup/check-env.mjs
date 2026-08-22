const required = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "DEVICE_HMAC_SECRET", "EDGE_GATEWAY_SECRET"];
const missing = required.filter((name) => !process.env[name]);
if (missing.length > 0) {
  console.log({ status: "DEMO_FIXTURE_MODE", missing });
} else {
  console.log({ status: "CONFIGURED" });
}
