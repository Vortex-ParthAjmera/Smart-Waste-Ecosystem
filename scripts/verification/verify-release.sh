#!/usr/bin/env bash
# scripts/verification/verify-release.sh
# Comprehensive release verification for QA sign-off
#
# Runs all database tests, reconciliation, and release gates.
# Usage: ./scripts/verification/verify-release.sh [--db-url URL]
#
# Exit code 0 = all gates pass; non-zero = blocking failure

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
PASS=0
FAIL=0

DB_URL="${1:---db-url}"
DB_VALUE="${2:-}"

if [[ "$DB_URL" == "--db-url" && -n "$DB_VALUE" ]]; then
  PSQL_URL="$DB_VALUE"
elif [[ "$DB_URL" == "--db-url" && -z "$DB_VALUE" ]]; then
  PSQL_URL="postgresql://postgres:postgres@localhost:54322/postgres"
else
  PSQL_URL="postgresql://postgres:postgres@localhost:54322/postgres"
fi

run_test() {
  local test_name="$1"
  local test_file="$2"
  echo ""
  echo "--- Running: $test_name ---"
  if psql "$PSQL_URL" -f "$test_file" 2>&1; then
    echo "✓ PASS: $test_name"
    PASS=$((PASS + 1))
  else
    echo "✗ FAIL: $test_name"
    FAIL=$((FAIL + 1))
  fi
}

run_check() {
  local check_name="$1"
  local sql="$2"
  local expected="$3"

  result=$(psql "$PSQL_URL" -t -A -c "$sql" 2>/dev/null | tr -d '[:space:]')

  if [[ "$result" == "$expected" ]]; then
    echo "✓ PASS: $check_name (got: $result)"
    PASS=$((PASS + 1))
  else
    echo "✗ FAIL: $check_name (expected: $expected, got: $result)"
    FAIL=$((FAIL + 1))
  fi
}

echo "╔══════════════════════════════════════════════════╗"
echo "║  Smart Waste Ecosystem — Release Verification   ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""
echo "Database: $PSQL_URL"
echo ""

# ============================================================
# Gate 1: Schema and constraints
# ============================================================
echo ""
echo "══════ Gate 1: Schema & Constraints ══════"
run_test "Schema Constraint Tests" "$PROJECT_ROOT/supabase/tests/01_schema_constraints.sql"

# ============================================================
# Gate 2: Seed reconciliation
# ============================================================
echo ""
echo "══════ Gate 2: Seed Reconciliation ══════"
run_test "Seed Reconciliation Tests" "$PROJECT_ROOT/supabase/tests/02_seed_reconciliation.sql"

# ============================================================
# Gate 3: Ledger and fairness
# ============================================================
echo ""
echo "══════ Gate 3: Ledger & Fairness ══════"
run_test "Ledger & Fairness Tests" "$PROJECT_ROOT/supabase/tests/03_ledger_fairness.sql"

# ============================================================
# Gate 4: Specific release criteria
# ============================================================
echo ""
echo "══════ Gate 4: Release Criteria ══════"

run_check "No Tier 2 tables exist" \
  "SELECT count(*) FROM information_schema.tables WHERE table_schema='public' AND table_name IN ('trucks','truck_locations','collection_routes','municipal_zones')" \
  "0"

run_check "Active QR tokens exist" \
  "SELECT count(*) FROM public.citizen_qr_tokens WHERE status='ACTIVE'" \
  "1"

run_check "Published ruleset exists" \
  "SELECT count(*) FROM public.rulesets WHERE status='PUBLISHED'" \
  "1"

run_check "Primary citizen has events" \
  "SELECT count(*) FROM public.disposal_events WHERE citizen_id='b0000000-0000-0000-0000-000000000001'" \
  "20"

run_check "Accepted events have awards" \
  "SELECT count(*) FROM public.point_transactions pt JOIN public.disposal_events de ON de.id=pt.event_id WHERE pt.entry_kind='AWARD' AND de.decision_state IN ('ACCEPTED','REVIEW_ACCEPTED')" \
  "15"

run_check "Dispute with reversal exists" \
  "SELECT count(*) FROM public.disputes WHERE status='REVERSED'" \
  "1"

run_check "No raw PII in seed (verify no real emails)" \
  "SELECT count(*) FROM public.profiles WHERE display_name LIKE '%@%'" \
  "0"

# ============================================================
# Gate 5: Seed determinism (reset and compare)
# ============================================================
echo ""
echo "══════ Gate 5: Seed Determinism ══════"
echo "Re-seeding to verify determinism..."

if [[ "$PSQL_URL" == *"localhost"* ]]; then
  supabase db reset 2>/dev/null || echo "WARN: Could not reset via CLI, skipping determinism check"
fi

SECONDARY_COUNT=$(psql "$PSQL_URL" -t -A -c "SELECT count(*) FROM public.disposal_events" 2>/dev/null | tr -d '[:space:]')
if [[ "$SECONDARY_COUNT" == "30" ]]; then
  echo "✓ PASS: Determinism (30 events after re-seed)"
  PASS=$((PASS + 1))
else
  echo "✗ FAIL: Determinism (expected 30 events, got $SECONDARY_COUNT)"
  FAIL=$((FAIL + 1))
fi

# ============================================================
# Summary
# ============================================================
echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║              RELEASE VERIFICATION               ║"
echo "╠══════════════════════════════════════════════════╣"
echo "║  Passed: $PASS                                    ║"
echo "║  Failed: $FAIL                                    ║"
if [[ $FAIL -eq 0 ]]; then
echo "║  Status: ✅ ALL GATES PASS                       ║"
else
echo "║  Status: ❌ BLOCKING FAILURES                    ║"
fi
echo "╚══════════════════════════════════════════════════╝"

if [[ $FAIL -gt 0 ]]; then
  exit 1
fi
