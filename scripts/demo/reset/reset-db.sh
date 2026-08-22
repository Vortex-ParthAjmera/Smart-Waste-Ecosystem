#!/usr/bin/env bash
# scripts/demo/reset/reset-db.sh
# Reset database to clean state (no data, schema only)
#
# Usage:
#   ./scripts/demo/reset/reset-db.sh [--db-url URL]
#
# WARNING: This destroys all data. Only use for local dev/demo.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

echo "=== Smart Waste Ecosystem — Database Reset ==="
echo "Project root: $PROJECT_ROOT"
echo ""

# Safety check for production URLs
DB_URL="${1:---db-url}"
DB_VALUE="${2:-}"

if [[ "$DB_URL" == "--db-url" && -n "$DB_VALUE" ]]; then
  if echo "$DB_VALUE" | grep -qiE '(production|prod|vercel|supabase\.co)'; then
    echo "ERROR: Refusing to reset a production-like database!"
    echo "URL detected: $DB_VALUE"
    echo "Use only local/demo databases."
    exit 1
  fi
  DB_FLAG="--db-url $DB_VALUE"
elif [[ "$DB_URL" == "--db-url" && -z "$DB_VALUE" ]]; then
  echo "ERROR: --db-url requires a PostgreSQL URL"
  exit 1
else
  DB_FLAG=""
fi

echo "WARNING: This will destroy all data in the database."
echo "Press Ctrl+C within 3 seconds to abort..."
sleep 3

echo ""
echo "Resetting database..."
if [[ -n "$DB_FLAG" ]]; then
  supabase db reset $DB_FLAG
else
  supabase db reset
fi

echo ""
echo "✓ Database reset complete"
echo ""
echo "To seed data, run: ./scripts/demo/seed/run-seed.sh"
