import sys
from app.persistence.db import connect, queue_counts
from app.settings import get_settings


def main() -> int:
    settings = get_settings()
    connection = connect(settings.database_path)
    command = sys.argv[1] if len(sys.argv) > 1 else "status"
    if command == "queue":
        print(queue_counts(connection))
        return 0
    print({"serviceVersion": settings.service_version, "database": str(settings.database_path), "queue": queue_counts(connection)})
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
