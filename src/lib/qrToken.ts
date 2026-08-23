// =========================================================================
// QR payload FORMAT ONLY. No secrets live in this file, so it is safe to
// import from client components.
//
// Payload shape:
//   smartwaste://citizen/<uuid>?e=<expiryEpochSeconds>&t=<hmacHex>
//
// <uuid> is the citizen's Supabase auth.users id - the real account, not a
// mock fixture id. That single change is what stops every scan resolving to
// the same hardcoded demo citizen.
//
// Signing and verification happen server-side in qrToken.server.ts, because
// a signature a browser can compute is a signature an attacker can compute.
// =========================================================================

export const QR_PREFIX = "smartwaste://citizen/";

export interface ParsedQr {
  citizenId: string;
  expiresAt: number; // epoch seconds
  token: string; // hex hmac
}

/** Structural parse only - does NOT prove the code is authentic. */
export function parseQrStructure(raw: string): ParsedQr | null {
  if (!raw || !raw.startsWith(QR_PREFIX)) return null;

  const rest = raw.slice(QR_PREFIX.length);
  const [citizenId, query = ""] = rest.split("?");
  if (!citizenId) return null;

  const params = new URLSearchParams(query);
  const token = params.get("t");
  const expiresRaw = params.get("e");
  if (!token || !expiresRaw) return null;

  const expiresAt = Number.parseInt(expiresRaw, 10);
  if (!Number.isFinite(expiresAt)) return null;

  return { citizenId, expiresAt, token };
}

/** Cheap client-side pre-check so the scanner can reject obviously foreign
 *  QR codes (a product barcode, a Wi-Fi code, a URL) without a round trip. */
export function looksLikeSwachhSaathiQr(raw: string): boolean {
  return parseQrStructure(raw) !== null;
}
