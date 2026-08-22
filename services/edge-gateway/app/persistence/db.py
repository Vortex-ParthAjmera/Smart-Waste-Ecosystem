import json
import sqlite3
from pathlib import Path
from typing import Any


SCHEMA = """
PRAGMA journal_mode=WAL;
PRAGMA synchronous=FULL;
PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS local_events (
  message_id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL UNIQUE,
  device_code TEXT NOT NULL,
  payload_hash TEXT NOT NULL,
  raw_body TEXT NOT NULL,
  ml_state TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS local_ml_results (
  observation_id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES local_events(event_id),
  evidence_source TEXT NOT NULL,
  status TEXT NOT NULL,
  category TEXT NOT NULL,
  score REAL,
  safe_error TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS outbox_messages (
  message_id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES local_events(event_id),
  cloud_body TEXT NOT NULL,
  payload_hash TEXT NOT NULL,
  transport_state TEXT NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  safe_error TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS device_replay_keys (
  device_code TEXT NOT NULL,
  boot_id TEXT NOT NULL,
  sequence INTEGER NOT NULL,
  message_id TEXT NOT NULL,
  payload_hash TEXT NOT NULL,
  PRIMARY KEY (device_code, boot_id, sequence)
);
"""


def connect(database_path: Path) -> sqlite3.Connection:
    database_path.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(database_path)
    connection.row_factory = sqlite3.Row
    connection.executescript(SCHEMA)
    return connection


class IdempotencyConflict(RuntimeError):
    pass


def insert_event(connection: sqlite3.Connection, *, message: Any, raw_body: bytes, payload_hash: str) -> tuple[dict[str, Any], bool]:
    existing = connection.execute("SELECT message_id, event_id, payload_hash FROM local_events WHERE message_id = ?", (message.messageId,)).fetchone()
    if existing:
        if existing["payload_hash"] != payload_hash:
            raise IdempotencyConflict("same messageId with different body")
        return {"messageId": existing["message_id"], "eventId": existing["event_id"], "status": "QUEUED_LOCALLY"}, True

    replay = connection.execute(
        "SELECT payload_hash FROM device_replay_keys WHERE device_code = ? AND boot_id = ? AND sequence = ?",
        (message.deviceCode, message.bootId, message.sequence),
    ).fetchone()
    if replay and replay["payload_hash"] != payload_hash:
        raise IdempotencyConflict("same device boot/sequence with different body")

    cloud_body = {
        "schemaVersion": "1.1",
        "messageId": message.messageId,
        "eventId": message.payload.eventId,
        "deviceCode": message.deviceCode,
        "originalMessage": message.model_dump(mode="json"),
        "edgeProcessing": {
            "mlDetection": {
                "status": "ML_UNAVAILABLE",
                "evidenceSource": "RECORDED_ML",
                "category": "UNKNOWN",
                "score": None,
                "safeError": "MODEL_NOT_PROVISIONED"
            }
        }
    }

    with connection:
        connection.execute(
            "INSERT INTO local_events(message_id, event_id, device_code, payload_hash, raw_body, ml_state) VALUES (?, ?, ?, ?, ?, ?)",
            (message.messageId, message.payload.eventId, message.deviceCode, payload_hash, raw_body.decode("utf-8"), "ML_UNAVAILABLE"),
        )
        connection.execute(
            "INSERT INTO local_ml_results(observation_id, event_id, evidence_source, status, category, score, safe_error) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (f"obs-{message.payload.eventId}", message.payload.eventId, "RECORDED_ML", "ML_UNAVAILABLE", "UNKNOWN", None, "MODEL_NOT_PROVISIONED"),
        )
        connection.execute(
            "INSERT INTO outbox_messages(message_id, event_id, cloud_body, payload_hash, transport_state) VALUES (?, ?, ?, ?, ?)",
            (message.messageId, message.payload.eventId, json.dumps(cloud_body, separators=(",", ":")), payload_hash, "PENDING"),
        )
        connection.execute(
            "INSERT OR IGNORE INTO device_replay_keys(device_code, boot_id, sequence, message_id, payload_hash) VALUES (?, ?, ?, ?, ?)",
            (message.deviceCode, message.bootId, message.sequence, message.messageId, payload_hash),
        )
    return {"messageId": message.messageId, "eventId": message.payload.eventId, "status": "QUEUED_LOCALLY"}, False


def queue_counts(connection: sqlite3.Connection) -> dict[str, int]:
    rows = connection.execute("SELECT transport_state, COUNT(*) AS count FROM outbox_messages GROUP BY transport_state").fetchall()
    counts = {"PENDING": 0, "IN_FLIGHT": 0, "ACKED": 0, "AUTH_BLOCKED": 0, "DEAD_LETTER": 0}
    for row in rows:
        counts[row["transport_state"]] = row["count"]
    return counts
