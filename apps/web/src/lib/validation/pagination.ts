// Cursor-based pagination helpers.
// Cursors are opaque base64-encoded tokens; clients never decode them.

const CURSOR_SECRET = process.env.SGV_CURSOR_SECRET ?? 'sgv-cursor-dev-key';

export function encodeCursor(value: string): string {
  return Buffer.from(`${CURSOR_SECRET}:${value}`).toString('base64url');
}

export function decodeCursor(cursor: string): string | null {
  try {
    const decoded = Buffer.from(cursor, 'base64url').toString('utf-8');
    if (!decoded.startsWith(`${CURSOR_SECRET}:`)) return null;
    return decoded.slice(CURSOR_SECRET.length + 1);
  } catch {
    return null;
  }
}

export function parsePaginationParams(searchParams: URLSearchParams) {
  const limitRaw = searchParams.get('limit');
  const limit = limitRaw ? Math.min(100, Math.max(1, parseInt(limitRaw, 10) || 20)) : 20;
  const cursor = searchParams.get('cursor') ?? undefined;
  return { limit, cursor };
}
