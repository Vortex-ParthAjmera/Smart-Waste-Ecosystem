from functools import lru_cache
from pathlib import Path
from pydantic import BaseModel, Field
import os


class Settings(BaseModel):
    service_version: str = "edge-gateway-0.1.0"
    contract_version: str = "1.1"
    device_code: str = "ESP32-001"
    device_secret: str = Field(default="dev-device-secret")
    database_path: Path = Field(default=Path("services/edge-gateway/data/edge.sqlite3"))
    cloud_base_url: str = "http://localhost:3000"
    gateway_id: str = "SGV-GW-001"
    gateway_secret: str = "dev-gateway-secret"
    ml_deadline_seconds: int = 2


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings(
        device_secret=os.getenv("DEVICE_HMAC_SECRET", "dev-device-secret"),
        database_path=Path(os.getenv("EDGE_SQLITE_PATH", "services/edge-gateway/data/edge.sqlite3")),
        cloud_base_url=os.getenv("EDGE_CLOUD_BASE_URL", "http://localhost:3000"),
        gateway_id=os.getenv("EDGE_GATEWAY_ID", "SGV-GW-001"),
        gateway_secret=os.getenv("EDGE_GATEWAY_SECRET", "dev-gateway-secret"),
    )
