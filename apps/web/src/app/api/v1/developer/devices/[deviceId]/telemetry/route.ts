import { list } from "@/lib/api-client/envelope";

export function GET(_request: Request, { params }: { params: { deviceId: string } }) {
  return list([
    { deviceId: params.deviceId, component: "dry-ultrasonic", value: 42, unit: "percent", quality: "OK" },
    { deviceId: params.deviceId, component: "gps", value: "NO_FIX", unit: "fixQuality", quality: "DEGRADED" }
  ]);
}
