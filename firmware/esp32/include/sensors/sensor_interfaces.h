#pragma once

#include "../contracts/contract_types.h"

class CompartmentIrSensor {
 public:
  CompartmentIrSensor(int pin, SgvCompartment compartment);
  void begin();
  bool update(unsigned long nowMs);
  SgvTriggerSample latest() const;

 private:
  int pin_;
  SgvCompartment compartment_;
  bool lastRaw_;
  bool debounced_;
  unsigned long changedAt_;
};
