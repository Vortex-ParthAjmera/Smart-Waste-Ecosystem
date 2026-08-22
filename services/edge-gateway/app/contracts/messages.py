from typing import Any, Literal
from pydantic import BaseModel, ConfigDict, Field


class Trigger(BaseModel):
    model_config = ConfigDict(extra="forbid")

    componentCode: Literal["ir-wet-1", "ir-dry-1"]
    triggered: bool
    quality: Literal["GOOD", "DEGRADED", "MISSING", "FAILED", "UNKNOWN"]
    capturedAt: str


class Location(BaseModel):
    model_config = ConfigDict(extra="forbid")

    fixQuality: Literal["FIX_3D", "FIX_2D", "NO_FIX", "UNKNOWN"]
    latitude: float | None = Field(default=None, ge=-90, le=90)
    longitude: float | None = Field(default=None, ge=-180, le=180)


class DisposalPayload(BaseModel):
    model_config = ConfigDict(extra="forbid")

    eventId: str
    sessionId: str
    eventSource: Literal["HARDWARE", "RECORDED_HARDWARE", "SIMULATED", "SEEDED"]
    selectedCompartment: Literal["WET", "DRY"]
    trigger: Trigger
    measurements: list[dict[str, Any]] = Field(default_factory=list, max_length=8)
    location: Location


class DeviceMessage(BaseModel):
    model_config = ConfigDict(extra="forbid")

    schemaVersion: Literal["1.1"]
    messageId: str
    messageType: Literal["DISPOSAL_EVENT_V1", "HEARTBEAT_V1", "TELEMETRY_V1"]
    deviceCode: str
    bootId: str
    sequence: int = Field(ge=0)
    occurredAt: str
    timeQuality: Literal["GPS", "DEVICE_SYNCED", "EDGE_ASSIGNED", "UNKNOWN"]
    firmwareVersion: str
    payload: DisposalPayload
    extensions: dict[str, Any] = Field(default_factory=dict)


class LocalReceipt(BaseModel):
    messageId: str
    eventId: str
    status: Literal["QUEUED_LOCALLY"]
    replayed: bool = False
