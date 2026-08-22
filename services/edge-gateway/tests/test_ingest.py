import json
import time
from pathlib import Path

import pytest

from app.auth.hmac import DeviceHeaders, body_hash, sign, verify_signature
from app.contracts.messages import DeviceMessage
from app.persistence.db import IdempotencyConflict, connect, insert_event, queue_counts


def fixture_body() -> bytes:
    path = Path(__file__).parents[3] / "packages/contracts/fixtures/disposal-event.valid.json"
    return path.read_bytes()


def test_hmac_vector_accepts_exact_body():
    body = fixture_body()
    timestamp = str(int(time.time()))
    nonce = "0191b9dc-a9d5-73e1-809d-3e8fa0ff3654"
    signature = sign("dev-secret", "POST", "/v1/disposal-events", "ESP32-001", timestamp, nonce, body)
    headers = DeviceHeaders("ESP32-001", timestamp, nonce, signature)
    assert verify_signature("dev-secret", "POST", "/v1/disposal-events", headers, body)
    assert not verify_signature("dev-secret", "POST", "/v1/disposal-events", headers, body + b" ")


def test_ingest_commits_before_202_and_replays(tmp_path):
    connection = connect(tmp_path / "edge.sqlite3")
    body = fixture_body()
    message = DeviceMessage.model_validate_json(body)

    receipt, replayed = insert_event(connection, message=message, raw_body=body, payload_hash=body_hash(body))
    assert receipt["status"] == "QUEUED_LOCALLY"
    assert replayed is False
    assert queue_counts(connection)["PENDING"] == 1

    replay_receipt, replayed_again = insert_event(connection, message=message, raw_body=body, payload_hash=body_hash(body))
    assert replay_receipt == receipt
    assert replayed_again is True
    assert queue_counts(connection)["PENDING"] == 1


def test_same_message_changed_body_conflicts(tmp_path):
    connection = connect(tmp_path / "edge.sqlite3")
    body = fixture_body()
    message = DeviceMessage.model_validate_json(body)
    insert_event(connection, message=message, raw_body=body, payload_hash=body_hash(body))

    changed = json.loads(body)
    changed["payload"]["selectedCompartment"] = "WET"
    changed_body = json.dumps(changed, separators=(",", ":")).encode()
    changed_message = DeviceMessage.model_validate_json(changed_body)
    with pytest.raises(IdempotencyConflict):
        insert_event(connection, message=changed_message, raw_body=changed_body, payload_hash=body_hash(changed_body))
