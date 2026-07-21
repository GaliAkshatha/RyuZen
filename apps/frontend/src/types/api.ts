/**
 * API response envelope types.
 *
 * Mirrored exactly from the backend (see, in the backend source,
 * shared/core/http/ApiResponse.ts, HttpStatus.ts, and
 * shared/core/validation/validate.ts). Every backend response — success
 * or error — uses one of these two shapes. Nothing here is invented;
 * every field matches the backend's actual `res.json({...})` calls.
 */

/** The exact shape of ApiResponse.success()'s res.json() payload. */
export interface ApiSuccessEnvelope<T> {
  success: true;
  message: string;
  data: T;
  timestamp: string;
}

/**
 * The exact shape of ApiResponse.error()'s res.json() payload.
 *
 * `errors` is `null` for a plain ApiError (e.g. "Organization not
 * found."), or a Zod `.flatten()` result for a 400 validation failure
 * (see validate.ts): `{ formErrors: string[]; fieldErrors: Record<string, string[]> }`.
 */
export interface ZodFlattenedErrors {
  formErrors: string[];
  fieldErrors: Record<string, string[]>;
}

export interface ApiErrorEnvelope {
  success: false;
  message: string;
  errors: ZodFlattenedErrors | null;
  timestamp: string;
}

export type ApiEnvelope<T> = ApiSuccessEnvelope<T> | ApiErrorEnvelope;

/**
 * The exact backend HttpStatus values this frontend needs to branch on.
 * Mirrored from shared/core/http/HttpStatus.ts.
 */
export const HttpStatusCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatusCode = (typeof HttpStatusCode)[keyof typeof HttpStatusCode];

/**
 * Normalized frontend error type. Every rejected promise from the API
 * client (see services/apiClient.ts) rejects with an instance of this
 * class, never a raw AxiosError — callers get one consistent shape
 * regardless of whether the failure was a network error, a validation
 * error, or a thrown ApiError on the backend.
 */
export class AppApiError extends Error {
  public readonly status: number | null;
  public readonly errors: ZodFlattenedErrors | null;
  public readonly isNetworkError: boolean;

  constructor(params: {
    message: string;
    status: number | null;
    errors?: ZodFlattenedErrors | null;
    isNetworkError?: boolean;
  }) {
    super(params.message);

    this.name = "AppApiError";
    this.status = params.status;
    this.errors = params.errors ?? null;
    this.isNetworkError = params.isNetworkError ?? false;

    Object.setPrototypeOf(this, AppApiError.prototype);
  }

  get isUnauthorized(): boolean {
    return this.status === HttpStatusCode.UNAUTHORIZED;
  }

  get isForbidden(): boolean {
    return this.status === HttpStatusCode.FORBIDDEN;
  }

  get isNotFound(): boolean {
    return this.status === HttpStatusCode.NOT_FOUND;
  }

  get isValidationError(): boolean {
    return this.status === HttpStatusCode.BAD_REQUEST && this.errors !== null;
  }

  get isRateLimited(): boolean {
    return this.status === HttpStatusCode.TOO_MANY_REQUESTS;
  }

  /** True for any 5xx backend response. Used by the global query/mutation error toast (H2) — a network failure or 5xx is unexpected enough to warrant a toast even when the failing component isn't in view, unlike a routine 404/validation error already handled inline. */
  get isServerError(): boolean {
    return this.status !== null && this.status >= 500;
  }
}
