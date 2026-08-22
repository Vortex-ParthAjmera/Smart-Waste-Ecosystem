def map_label(label: str, supported_classes: dict[str, str]) -> str:
    return supported_classes.get(label, "UNKNOWN")
