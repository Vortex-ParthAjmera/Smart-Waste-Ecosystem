#include "../../include/sensors/sensor_interfaces.h"
#include "../../include/config/app_config.h"

#ifdef ARDUINO
#include <Arduino.h>
#endif

CompartmentIrSensor::CompartmentIrSensor(int pin, SgvCompartment compartment)
    : pin_(pin), compartment_(compartment), lastRaw_(false), debounced_(false), changedAt_(0) {}

void CompartmentIrSensor::begin() {
#ifdef ARDUINO
  pinMode(pin_, INPUT_PULLUP);
#endif
}

bool CompartmentIrSensor::update(unsigned long nowMs) {
#ifdef ARDUINO
  bool raw = digitalRead(pin_) == LOW;
#else
  bool raw = false;
#endif
  if (raw != lastRaw_) {
    lastRaw_ = raw;
    changedAt_ = nowMs;
  }
  if ((nowMs - changedAt_) >= SGV_DEBOUNCE_MS && debounced_ != raw) {
    debounced_ = raw;
    return debounced_;
  }
  return false;
}

SgvTriggerSample CompartmentIrSensor::latest() const {
  return {compartment_, debounced_, SgvHealth::Ok};
}
