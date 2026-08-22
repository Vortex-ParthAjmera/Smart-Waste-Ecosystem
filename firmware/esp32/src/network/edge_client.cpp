#include "../../include/network/edge_client.h"
#include "../../include/config/app_config.h"

#ifdef ARDUINO
#include <ArduinoJson.h>
#include <HTTPClient.h>
#endif

static const char* compartmentToString(SgvCompartment compartment) {
  return compartment == SgvCompartment::Dry ? "DRY" : "WET";
}

SgvSendResult sendDisposalEvent(const SgvSession& session, const SgvTriggerSample& trigger, unsigned long sequence) {
#ifdef ARDUINO
  JsonDocument doc;
  doc["schemaVersion"] = "1.1";
  doc["messageId"] = session.eventId;
  doc["messageType"] = "DISPOSAL_EVENT_V1";
  doc["deviceCode"] = SGV_DEVICE_CODE;
  doc["bootId"] = "boot-id-provisioned-at-runtime";
  doc["sequence"] = sequence;
  doc["occurredAt"] = "2026-08-22T14:28:11.123Z";
  doc["timeQuality"] = "DEVICE_SYNCED";
  doc["firmwareVersion"] = SGV_FIRMWARE_VERSION;
  doc["payload"]["eventId"] = session.eventId;
  doc["payload"]["sessionId"] = session.sessionId;
  doc["payload"]["eventSource"] = "HARDWARE";
  doc["payload"]["selectedCompartment"] = compartmentToString(session.selectedCompartment);
  doc["payload"]["trigger"]["componentCode"] = trigger.triggeredCompartment == SgvCompartment::Dry ? "ir-dry-1" : "ir-wet-1";
  doc["payload"]["trigger"]["triggered"] = trigger.triggered;
  doc["payload"]["trigger"]["quality"] = "GOOD";
  doc["payload"]["trigger"]["capturedAt"] = "2026-08-22T14:28:11.123Z";
  doc["payload"]["measurements"].to<JsonArray>();
  doc["payload"]["location"]["fixQuality"] = "NO_FIX";
  doc["extensions"].to<JsonObject>();

  String body;
  serializeJson(doc, body);
  HTTPClient http;
  http.begin(String("http://") + SGV_EDGE_HOST + ":" + SGV_EDGE_PORT + "/v1/disposal-events");
  int status = http.POST(body);
  http.end();
  return {status, status == 202};
#else
  (void)session;
  (void)trigger;
  (void)sequence;
  return {202, true};
#endif
}
