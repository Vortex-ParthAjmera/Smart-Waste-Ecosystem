import { z } from "zod";

export const CompartmentSchema = z.enum(["WET", "DRY"]);
export const EventSourceSchema = z.enum(["HARDWARE", "RECORDED_HARDWARE", "SIMULATED", "SEEDED"]);
export const EvidenceSourceSchema = z.enum(["LOCAL_LIVE", "RECORDED_ML", "SIMULATED", "SEEDED"]);
export const ReviewOutcomeSchema = z.enum(["REVIEW_ACCEPTED", "REVIEW_NO_ACTION", "VERIFIED_VIOLATION"]);

export interface ApiResponse<T> {
  data: T;
  meta: { requestId: string };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
    retryable?: boolean;
  };
  meta: { requestId: string };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    requestId: string;
    cursor?: string;
    limit: number;
    hasMore: boolean;
  };
}
