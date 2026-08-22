"use client";

// =========================================================================
// A minimal, dependency-free shared store (module singleton + React's
// built-in useSyncExternalStore) so the "Inject Test Event" action on the
// Developer surface can update Citizen + Municipal views in the same
// browser session. This is plain React state, not Redux/Zustand.
// =========================================================================

import { useSyncExternalStore } from "react";
import { DisposalEvent, ComponentHealth } from "@/lib/mock/types";
import { DEMO_CITIZEN_ID } from "@/lib/mock/citizens";

export type DemoDeviceOverride = Partial<Record<string, ComponentHealth>>;

interface DemoState {
  injectedEvents: DisposalEvent[];
  activeDisposal: DisposalEvent | null;
  demoSimulationEnabled: boolean;
  deviceOverride: DemoDeviceOverride; // componentKey -> forced health, for ESP32-001
  offlineMode: boolean; // simulated WAN offline banner toggle
}

let state: DemoState = {
  injectedEvents: [],
  activeDisposal: null,
  demoSimulationEnabled: true,
  deviceOverride: {},
  offlineMode: false,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function setState(patch: Partial<DemoState>) {
  state = { ...state, ...patch };
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): DemoState {
  return state;
}

const FIXTURES: { id: string; label: string; compartment: "WET" | "DRY"; wasteType: string; category: "WET" | "DRY" | "UNKNOWN"; confidence: number; correct: boolean }[] = [
  { id: "fx_correct_wet", label: "Correct wet disposal — Vegetable Peels", compartment: "WET", wasteType: "Vegetable Peels", category: "WET", confidence: 0.93, correct: true },
  { id: "fx_correct_dry", label: "Correct dry disposal — Cardboard Box", compartment: "DRY", wasteType: "Cardboard Box", category: "DRY", confidence: 0.9, correct: true },
  { id: "fx_wrong_wet_in_dry", label: "Violation — Banana Peels in Dry compartment", compartment: "DRY", wasteType: "Banana Peels", category: "WET", confidence: 0.86, correct: false },
  { id: "fx_low_confidence", label: "Low-confidence detection (flag only, no penalty)", compartment: "DRY", wasteType: "Unidentified Wrapper", category: "UNKNOWN", confidence: 0.42, correct: true },
];

export function getFixtures() {
  return FIXTURES;
}

let counter = 1;

export function injectTestEvent(fixtureId: string): DisposalEvent {
  const fx = FIXTURES.find((f) => f.id === fixtureId) ?? FIXTURES[0];
  const now = new Date().toISOString();
  const eventId = `evt_sim_${Date.now()}_${counter++}`;
  const pointsAwarded = !fx.correct ? -10 : fx.category === "UNKNOWN" ? 0 : 10;

  const event: DisposalEvent = {
    eventId,
    sessionId: `sess_sim_${Date.now()}`,
    citizenId: DEMO_CITIZEN_ID,
    deviceCode: "ESP32-001",
    timestamp: now,
    eventSource: "SIMULATED",
    selectedCompartment: fx.compartment,
    mlDetection: {
      status: fx.category === "UNKNOWN" ? "UNAVAILABLE" : "SUPPORTED",
      wasteType: fx.wasteType,
      category: fx.category,
      confidence: fx.confidence,
      scoreBand: fx.confidence >= 0.8 ? "HIGH" : fx.confidence >= 0.6 ? "MEDIUM" : "LOW",
      evidenceSource: "SIMULATED",
      modelVersion: "yolov8n-waste-v1.3",
    },
    measurements: {
      irConfirmation: { triggered: true, quality: "GOOD" },
      moisturePercent: { value: fx.compartment === "WET" ? 58 : 21, quality: "GOOD" },
      ultrasonicFill: { wetPercent: 30, dryPercent: 38, quality: "GOOD" },
    },
    location: { latitude: 22.7196, longitude: 75.8577, fixQuality: "GPS" },
    processingState: "DISPOSAL_STARTED",
    decisionState: "CAPTURED",
    transportState: "QUEUED_LOCALLY",
    pointsAwarded: 0,
    reasonPlain: "Synthetic disposal injected from the Developer surface. Physical hardware was not exercised.",
  };

  setState({ activeDisposal: event, injectedEvents: [event, ...state.injectedEvents] });

  // Simulate the pipeline advancing over ~4.5s, same result/points/UI path
  // a real disposal would take.
  setTimeout(() => {
    updateActive(eventId, { processingState: "SENSOR_CAPTURED" });
  }, 500);
  setTimeout(() => {
    updateActive(eventId, { processingState: "ML_PENDING", decisionState: "EVALUATING" });
  }, 1300);
  setTimeout(() => {
    updateActive(eventId, {
      processingState: "ML_RECEIVED",
      transportState: "PENDING",
    });
  }, 2400);
  setTimeout(() => {
    const finalDecision: DisposalEvent["decisionState"] = fx.correct
      ? fx.category === "UNKNOWN"
        ? "FLAGGED"
        : "ACCEPTED"
      : "FLAGGED";
    updateActive(eventId, {
      processingState: "COMPLETED",
      decisionState: finalDecision,
      transportState: "IN_FLIGHT",
      pointsAwarded,
    });
  }, 3400);
  setTimeout(() => {
    updateActive(eventId, { transportState: "ACKED" });
  }, 4300);

  return event;
}

function updateActive(eventId: string, patch: Partial<DisposalEvent>) {
  if (state.activeDisposal?.eventId !== eventId) return;
  const updated = { ...state.activeDisposal, ...patch };
  const nextInjected = state.injectedEvents.map((e) => (e.eventId === eventId ? updated : e));
  setState({ activeDisposal: updated, injectedEvents: nextInjected });
}

export function clearActiveDisposal() {
  setState({ activeDisposal: null });
}

export function setDemoSimulationEnabled(enabled: boolean) {
  setState({ demoSimulationEnabled: enabled });
}

export function setDeviceComponentOverride(component: string, health: ComponentHealth | null) {
  const next = { ...state.deviceOverride };
  if (health === null) delete next[component];
  else next[component] = health;
  setState({ deviceOverride: next });
}

export function setOfflineMode(offline: boolean) {
  setState({ offlineMode: offline });
}

export function useDemoStore(): DemoState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
