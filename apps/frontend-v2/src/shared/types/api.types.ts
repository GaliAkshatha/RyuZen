/**
 * Matches the real backend response envelope exactly - confirmed
 * directly against ApiResponse.ts (shared/core/http) rather than
 * assumed from documentation.
 */
export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors: unknown;
  timestamp: string;
}

/** Normalized shape the API client surfaces to callers on failure. */
export interface AppApiError {
  message: string;
  statusCode: number;
  errors?: unknown;
}
