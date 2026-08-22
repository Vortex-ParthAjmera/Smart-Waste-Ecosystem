#pragma once

enum class SgvCompartment {
  Wet,
  Dry
};

enum class SgvHealth {
  Ok,
  Degraded,
  Missing,
  Failed,
  Unknown
};

struct SgvSession {
  const char* sessionId;
  const char* eventId;
  SgvCompartment selectedCompartment;
  const char* expiresAt;
};

struct SgvTriggerSample {
  SgvCompartment triggeredCompartment;
  bool triggered;
  SgvHealth quality;
};
