#!/usr/bin/env bash
# scripts/demo/seed/run-seed.sh
# Deterministic seed procedure for the Smart Waste Ecosystem
#
# Usage:
#   ./scripts/demo/seed/run-seed.sh [--db-url URL]
#
# Prerequisites:
#   - supabase CLI installed
#   - Local Supabase running (supabase start) or remote URL provided
#
# This script:
#   1. Resets the database to a clean state
#   2. Applies all migrations in order
#   3. Loads deterministic seed data
#   4. Runs verification to confirm reconciliation

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

DB_URL="${1:---db-url}"
DB_VALUE="${2:-}"

if [[ "$DB_URL" == "--db-url" && -n "$DB_VALUE" ]]; then
  DB_FLAG="--db-url $DB_VALUE"
elif [[ "$DB_URL" == "--db-url" && -z "$DB_VALUE" ]]; then
  echo "ERROR: --db-url requires a PostgreSQL URL"
  echo "Usage: $0 --db-url postgresql://user:pass@host:port/dbname"
  exit 1
else
  DB_FLAG=""
fi

echo "=== Smart Waste Ecosystem — Deterministic Seed ==="
echo "Project root: $PROJECT_ROOT"
echo ""

# Step 1: Reset database
echo "[1/4] Resetting database..."
if [[ -n "$DB_FLAG" ]]; then
  supabase db reset $DB_FLAG
else
  supabase db reset
fi

# Step 2: Verify migrations applied
echo ""
echo "[2/4] Verifying table count..."
TABLE_COUNT=$(supabase db sql --db-url "${DB_VALUE:-postgresql://postgres:postgres@localhost:54322/postgres}" 2>/dev/null <<SQL | tail -1
  SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';
SQL
)

EXPECTED_TABLES=23
if [[ "$TABLE_COUNT" -ne "$EXPECTED_TABLES" ]]; then
  echo "ERROR: Expected $EXPECTED_TABLES tables, found $TABLE_COUNT"
  exit 1
fi
echo "  ✓ $TABLE_COUNT tables found"

# Step 3: Verify seed counts
echo ""
echo "[3/4] Verifying seed data..."
PSQL_URL="${DB_VALUE:-postgresql://postgres:postgres@localhost:54322/postgres}"

RESULTS=$(psql "$PSQL_URL" -t -A -c "
  SELECT jsonb_build_object(
    'citizens', (SELECT count(*) FROM public.citizens),
    'events', (SELECT count(*) FROM public.disposal_events),
    'transactions', (SELECT count(*) FROM public.point_transactions),
    'review_cases', (SELECT count(*) FROM public.review_cases),
    'badges', (SELECT count(*) FROM public.badges),
    'heartbeats', (SELECT count(*) FROM public.device_heartbeats),
    'primary_balance', public.get_citizen_balance('b0000000-0000-0000-0000-000000000001')
  );
")

echo "  Citizens:         $(echo "$RESULTS" | jq -r '.citizens')"
echo "  Events:           $(echo "$RESULTS" | jq -r '.events')"
echo "  Transactions:     $(echo "$RESULTS" | jq -r '.transactions')"
echo "  Review cases:     $(echo "$RESULTS" | jq -r '.review_cases')"
echo "  Badges:           $(echo "$RESULTS" | jq -r '.badges')"
echo "  Heartbeats:       $(echo "$RESULTS" | jq -r '.heartbeats')"
echo "  Primary balance:  $(echo "$RESULTS" | jq -r '.primary_balance')"

# Step 4: Run reconciliation
echo ""
echo "[4/4] Running seed reconciliation..."
RECON=$(psql "$PSQL_URL" -t -A -c "SELECT public.verify_seed_reconciliation();")

echo "  Total events:       $(echo "$RECON" | jq -r '.total_events')"
echo "  Total citizens:     $(echo "$RECON" | jq -r '.total_citizens')"
echo "  Accepted events:    $(echo "$RECON" | jq -r '.accepted_events')"
echo "  Flagged events:     $(echo "$RECON" | jq -r '.flagged_events')"
echo "  No auto violations: $(echo "$RECON" | jq -r '.no_auto_violations')"
echo "  Flagged no points:  $(echo "$RECON" | jq -r '.flagged_no_points')"

# Verify all citizens have consistent balances
BALANCE_OK=$(echo "$RECON" | jq '[.citizens_with_balances[].consistent] | all')
if [[ "$BALANCE_OK" != "true" ]]; then
  echo ""
  echo "ERROR: Some citizen balances are inconsistent!"
  exit 1
fi

echo ""
echo "✓ Seed reconciliation PASSED"
echo ""
echo "=== Seed complete ==="
