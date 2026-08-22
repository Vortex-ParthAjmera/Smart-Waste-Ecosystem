from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from pydantic import ValidationError
from app.auth.hmac import DeviceHeaders, body_hash, verify_signature
from app.contracts.messages import DeviceMessage
from app.persistence.db import IdempotencyConflict, connect, insert_event, queue_counts
from app.settings import Settings, get_settings

router = APIRouter()


def settings_dep() -> Settings:
    return get_settings()


@router.get("/healthz")
def health(settings: Settings = Depends(settings_dep)):
    connection = connect(settings.database_path)
    counts = queue_counts(connection)
    return {
        "data": {
            "serviceVersion": settings.service_version,
            "contractVersion": settings.contract_version,
            "sqlite": "OK",
            "camera": "UNKNOWN",
            "model": "DEGRADED",
            "queue": counts,
            "safeMessage": "Model weights must be provisioned before LOCAL_LIVE claims."
        }
    }


@router.post("/v1/disposal-events", status_code=status.HTTP_202_ACCEPTED)
async def disposal_events(
    request: Request,
    x_sgv_device_id: str = Header(alias="X-SGV-Device-Id"),
    x_sgv_timestamp: str = Header(alias="X-SGV-Timestamp"),
    x_sgv_nonce: str = Header(alias="X-SGV-Nonce"),
    x_sgv_signature: str = Header(alias="X-SGV-Signature"),
    settings: Settings = Depends(settings_dep),
):
    raw_body = await request.body()
    headers = DeviceHeaders(x_sgv_device_id, x_sgv_timestamp, x_sgv_nonce, x_sgv_signature)
    if not verify_signature(settings.device_secret, "POST", "/v1/disposal-events", headers, raw_body):
        raise HTTPException(status_code=401, detail={"code": "INVALID_DEVICE_SIGNATURE", "retryable": False})

    try:
        message = DeviceMessage.model_validate_json(raw_body)
    except ValidationError as exc:
        raise HTTPException(status_code=422, detail={"code": "VALIDATION_ERROR", "details": exc.errors(), "retryable": False}) from exc

    if message.deviceCode != settings.device_code:
        raise HTTPException(status_code=403, detail={"code": "DEVICE_NOT_ALLOWED", "retryable": False})

    connection = connect(settings.database_path)
    try:
        receipt, replayed = insert_event(connection, message=message, raw_body=raw_body, payload_hash=body_hash(raw_body))
    except IdempotencyConflict as exc:
        raise HTTPException(status_code=409, detail={"code": "IDEMPOTENCY_CONFLICT", "retryable": False}) from exc

    receipt["replayed"] = replayed
    return {"data": receipt, "meta": {"requestId": f"edge-{message.messageId}"}}


@router.get("/v1/device/active-session")
def active_session():
    raise HTTPException(status_code=404, detail={"code": "ACTIVE_SESSION_NOT_FOUND", "retryable": True})


@router.post("/v1/heartbeats", status_code=status.HTTP_202_ACCEPTED)
def heartbeats():
    return {"data": {"status": "QUEUED_LOCALLY"}, "meta": {"requestId": "edge-heartbeat-demo"}}


@router.post("/v1/telemetry", status_code=status.HTTP_202_ACCEPTED)
def telemetry():
    return {"data": {"status": "QUEUED_LOCALLY"}, "meta": {"requestId": "edge-telemetry-demo"}}


@router.get("/v1/messages/{message_id}")
def message_status(message_id: str, settings: Settings = Depends(settings_dep)):
    connection = connect(settings.database_path)
    row = connection.execute(
        "SELECT local_events.message_id, local_events.event_id, outbox_messages.transport_state FROM local_events JOIN outbox_messages USING (message_id) WHERE local_events.message_id = ?",
        (message_id,),
    ).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail={"code": "MESSAGE_NOT_FOUND", "retryable": True})
    return {"data": dict(row), "meta": {"requestId": f"edge-{message_id}"}}
