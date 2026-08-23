import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { QR_PREFIX, parseQrStructure } from "@/lib/qrToken";

// =========================================================================
// Server-side QR signing. The secret never reaches the browser, so a citizen
// cannot mint a QR for someone else's account and an operator's scanner can
// actually trust what it decodes.
//
// Set QR_SIGNING_SECRET in .env.local (NOT prefixed with NEXT_PUBLIC_).
// =========================================================================

const TTL_SECONDS = Number.parseInt(process.env.QR_TTL_SECONDS ?? "86400", 10);

function secret(): string {
  const value = process.env.QR_SIGNING_SECRET;
  if (!value || value.length < 16) {
    throw new Error(
      "QR_SIGNING_SECRET is missing or too short. Add a random 32+ char value to .env.local."
    );
  }
  return value;
}

function sign(citizenId: string, expiresAt: number): string {
  return createHmac("sha256", secret())
    .update(`${citizenId}.${expiresAt}`)
    .digest("hex");
}

/** Issues a fresh, signed payload for the given Supabase user id. */
export function issueCitizenQr(citizenId: string): { payload: string; expiresAt: number } {
  const expiresAt = Math.floor(Date.now() / 1000) + TTL_SECONDS;
  const token = sign(citizenId, expiresAt);
  return {
    payload: `${QR_PREFIX}${citizenId}?e=${expiresAt}&t=${token}`,
    expiresAt,
  };
}

export type QrVerification =
  | { ok: true; citizenId: string }
  | { ok: false; reason: "malformed" | "expired" | "bad_signature" };

/** Verifies a scanned string. Returns the citizen id only on a real match. */
export function verifyCitizenQr(raw: string): QrVerification {
  const parsed = parseQrStructure(raw);
  if (!parsed) return { ok: false, reason: "malformed" };

  const expected = sign(parsed.citizenId, parsed.expiresAt);
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(parsed.token, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, reason: "bad_signature" };
  }

  // Signature checked before expiry so a tampered timestamp can't be used to
  // probe which ids exist.
  if (parsed.expiresAt < Math.floor(Date.now() / 1000)) {
    return { ok: false, reason: "expired" };
  }

  return { ok: true, citizenId: parsed.citizenId };
}
