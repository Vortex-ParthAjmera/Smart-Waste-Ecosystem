class CaptureUnavailable(RuntimeError):
    pass


def capture_frame_hash() -> str:
    raise CaptureUnavailable("camera adapter is not provisioned in demo fixture mode")
