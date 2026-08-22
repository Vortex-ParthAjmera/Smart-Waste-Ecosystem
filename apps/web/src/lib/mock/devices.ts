import { Device } from "./types";

export const DEVICES: Device[] = [
  {
    deviceCode: "ESP32-001",
    label: "Smart Bin — Ward 12 Collection Point",
    zone: "Indore Ward 12",
    lastSeen: new Date(Date.now() - 12_000).toISOString(),
    firmwareVersion: "fw-2.3.1",
    components: {
      wifi: "OK",
      gps: "OK",
      irWet: "OK",
      irDry: "OK",
      ultrasonicWet: "OK",
      ultrasonicDry: "DEGRADED",
      moisture: "OK",
      camera: "OK",
      model: "OK",
    },
  },
  {
    deviceCode: "ESP32-002",
    label: "Smart Bin — Ward 14 Market Point",
    zone: "Indore Ward 14",
    lastSeen: new Date(Date.now() - 5 * 60_000).toISOString(),
    firmwareVersion: "fw-2.3.1",
    components: {
      wifi: "OK",
      gps: "MISSING",
      irWet: "OK",
      irDry: "OK",
      ultrasonicWet: "OK",
      ultrasonicDry: "OK",
      moisture: "MISSING",
      camera: "OK",
      model: "OK",
    },
  },
  {
    deviceCode: "ESP32-003",
    label: "Smart Bin — Ward 9 Depot",
    zone: "Indore Ward 9",
    lastSeen: new Date(Date.now() - 42 * 60_000).toISOString(),
    firmwareVersion: "fw-2.2.9",
    components: {
      wifi: "FAILED",
      gps: "UNKNOWN",
      irWet: "UNKNOWN",
      irDry: "UNKNOWN",
      ultrasonicWet: "UNKNOWN",
      ultrasonicDry: "UNKNOWN",
      moisture: "UNKNOWN",
      camera: "UNKNOWN",
      model: "UNKNOWN",
    },
  },
];

export function getDeviceByCode(code: string): Device | undefined {
  return DEVICES.find((d) => d.deviceCode === code);
}
