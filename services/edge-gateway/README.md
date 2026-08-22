# SGV Edge Gateway

FastAPI service that accepts signed ESP32 LAN messages, commits them to SQLite WAL before `202 QUEUED_LOCALLY`, records local ML evidence or `ML_UNAVAILABLE`, and syncs immutable outbox messages to the cloud boundary.

Run locally:

```bash
npm run dev:edge
```

The gateway does not store raw QR values, raw frames, final balances, or Supabase service-role secrets.
