"""
services/edge-gateway/app/main.py
FastAPI edge gateway — LAN API for ESP32, camera, local ML, cloud sync.

Owner: ADITYA SILSWAL
This is a scaffold stub. Full implementation by Aditya.
"""

from fastapi import FastAPI

app = FastAPI(
    title="Smart Waste Edge Gateway",
    version="1.0.0",
    description="Local LAN gateway for ESP32 sensor ingestion, ML orchestration, and cloud sync.",
)


@app.get("/healthz")
async def healthz():
    """Edge, queue, camera, model, WAN and sync health. No secrets."""
    return {
        "status": "ok",
        "edge": "healthy",
        "queue": "healthy",
        "camera": "not_configured",
        "model": "not_loaded",
        "wan": "unknown",
    }


# TODO: ADITYA SILSWAL implements:
# GET  /v1/device/active-session
# POST /v1/disposal-events
# POST /v1/heartbeats
# POST /v1/telemetry
# GET  /v1/messages/{messageId}
