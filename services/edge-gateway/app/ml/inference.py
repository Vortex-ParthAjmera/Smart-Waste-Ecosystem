def confidence_band(score: float | None) -> str | None:
    if score is None or score < 0 or score > 1:
        return None
    if score < 0.6:
        return "LOW"
    if score < 0.85:
        return "MEDIUM"
    return "HIGH"
