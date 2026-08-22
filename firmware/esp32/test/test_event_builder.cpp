#include <unity.h>
#include "../include/contracts/contract_types.h"
#include "../include/network/edge_client.h"

void test_native_send_result_is_queued_locally() {
  SgvSession session = {"session", "event", SgvCompartment::Dry, "expires"};
  SgvTriggerSample trigger = {SgvCompartment::Dry, true, SgvHealth::Ok};
  SgvSendResult result = sendDisposalEvent(session, trigger, 1);
  TEST_ASSERT_EQUAL(202, result.httpStatus);
  TEST_ASSERT_TRUE(result.queuedLocally);
}

int main(int, char**) {
  UNITY_BEGIN();
  RUN_TEST(test_native_send_result_is_queued_locally);
  return UNITY_END();
}
