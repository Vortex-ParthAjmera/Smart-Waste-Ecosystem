from pathlib import Path
from pydantic import BaseModel
import hashlib
import json


class ModelManifest(BaseModel):
    manifestVersion: str
    modelFamily: str
    frameworkVersion: str
    weightsSha256: str
    classMapVersion: str
    supportedClasses: dict[str, str]
    datasetProvenance: str
    licenseDecision: str


def load_manifest(path: Path) -> ModelManifest:
    return ModelManifest.model_validate(json.loads(path.read_text(encoding="utf-8")))


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()
