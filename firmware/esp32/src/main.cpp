#include "../include/config/app_config.h"
#include "../include/network/edge_client.h"
#include "../include/sensors/sensor_interfaces.h"

#ifdef ARDUINO
#include <Arduino.h>
#endif

CompartmentIrSensor wetIr(SGV_WET_IR_PIN, SgvCompartment::Wet);
CompartmentIrSensor dryIr(SGV_DRY_IR_PIN, SgvCompartment::Dry);
unsigned long sequenceNumber = 1;
unsigned long lockedUntilMs = 0;

static SgvSession demoSession() {
  return {"0191b9e8-eef4-7e5c-b43d-9f3668c37a5d", "0191b9e8-ee15-76af-89f9-ce1470a0812f", SgvCompartment::Dry, "2026-08-22T18:30:00.000Z"};
}

void setup() {
#ifdef ARDUINO
  Serial.begin(115200);
  pinMode(SGV_STATUS_LED_PIN, OUTPUT);
  Serial.println("SGV|INFO|device=ESP32-001|state=BOOT|fw=smart-waste-esp32-1.0.0");
#endif
  wetIr.begin();
  dryIr.begin();
}

void loop() {
#ifdef ARDUINO
  const unsigned long now = millis();
#else
  const unsigned long now = 0;
#endif
  if (now < lockedUntilMs) {
    return;
  }

  if (wetIr.update(now)) {
    sendDisposalEvent(demoSession(), wetIr.latest(), sequenceNumber++);
    lockedUntilMs = now + SGV_SESSION_LOCKOUT_MS;
  }
  if (dryIr.update(now)) {
    sendDisposalEvent(demoSession(), dryIr.latest(), sequenceNumber++);
    lockedUntilMs = now + SGV_SESSION_LOCKOUT_MS;
  }
}
