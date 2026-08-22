import { describe, expect, it } from "vitest";
import fixture from "../fixtures/disposal-event.valid.json";

describe("canonical fixture", () => {
  it("keeps v1.1 LAN identity stable", () => {
    expect(fixture.schemaVersion).toBe("1.1");
    expect(fixture.messageType).toBe("DISPOSAL_EVENT_V1");
    expect(fixture.payload.eventSource).toBe("HARDWARE");
    expect(fixture.payload.selectedCompartment).toBe("DRY");
  });
});
