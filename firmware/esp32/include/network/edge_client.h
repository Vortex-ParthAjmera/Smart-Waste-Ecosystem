#pragma once

#include "../contracts/contract_types.h"

struct SgvSendResult {
  int httpStatus;
  bool queuedLocally;
};

SgvSendResult sendDisposalEvent(const SgvSession& session, const SgvTriggerSample& trigger, unsigned long sequence);
