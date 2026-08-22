import hashlib
import hmac
import time
from dataclasses import dataclass


@dataclass(frozen=True)
class DeviceHeaders:
    device_id: str
    timestamp: str
    nonce: str
    signature: str


def body_hash(raw_body: bytes) -> str:
    return hashlib.sha256(raw_body).hexdigest()


def canonical_bytes(method: str, path: str, device_id: str, timestamp: str, nonce: str, raw_body: bytes) -> bytes:
    payload = "\n".join([method.upper(), path, device_id, timestamp, nonce, body_hash(raw_body)])
    return payload.encode("utf-8")


def sign(secret: str, method: str, path: str, device_id: str, timestamp: str, nonce: str, raw_body: bytes) -> str:
    return hmac.new(secret.encode("utf-8"), canonical_bytes(method, path, device_id, timestamp, nonce, raw_body), hashlib.sha256).hexdigest()


def verify_signature(secret: str, method: str, path: str, headers: DeviceHeaders, raw_body: bytes, max_skew_seconds: int = 300) -> bool:
    try:
        timestamp = int(headers.timestamp)
    except ValueError:
        return False
    if abs(int(time.time()) - timestamp) > max_skew_seconds:
        return False
    expected = sign(secret, method, path, headers.device_id, headers.timestamp, headers.nonce, raw_body)
    return hmac.compare_digest(expected, headers.signature.lower())
