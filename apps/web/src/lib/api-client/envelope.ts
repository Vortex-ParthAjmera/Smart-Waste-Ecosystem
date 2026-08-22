import { NextResponse } from "next/server";
import type { ApiList, ApiSuccess } from "@sgv/contracts";

function requestId() {
  return `req-${crypto.randomUUID()}`;
}

export function ok<T>(data: T, init?: ResponseInit) {
  const body: ApiSuccess<T> = { data, meta: { requestId: requestId() } };
  return NextResponse.json(body, init);
}

export function list<T>(data: T[], init?: ResponseInit) {
  const body: ApiList<T> = {
    data,
    page: { nextCursor: null, hasMore: false },
    meta: { requestId: requestId() }
  };
  return NextResponse.json(body, init);
}

export function apiError(code: string, message: string, status = 400, retryable = false) {
  return NextResponse.json(
    {
      error: { code, message, retryable },
      meta: { requestId: requestId() }
    },
    { status }
  );
}
