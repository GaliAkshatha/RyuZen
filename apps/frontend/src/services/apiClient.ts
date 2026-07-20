import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { API_BASE_URL } from "@/services/endpoints";
import { AppApiError, type ApiErrorEnvelope, type ApiSuccessEnvelope } from "@/types/api";

/**
 * Access token storage.
 *
 * apiClient must not import AuthContext directly (AuthContext is a React
 * module built in F4; apiClient is plain TS with no React dependency).
 * F4 calls `setAccessToken`/`clearAccessToken` on login/logout/refresh;
 * every request interceptor reads whatever is currently set.
 */
let currentAccessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  currentAccessToken = token;
}

export function getAccessToken(): string | null {
  return currentAccessToken;
}

/**
 * 401 hook point for F4.
 *
 * F3's scope is the API client's plumbing only — the actual "refresh the
 * token, then retry the original request" logic belongs to F4 (Auth
 * Context & Token Lifecycle), which owns the refresh endpoint call and
 * the concurrency handling for simultaneous 401s. Registering the
 * handler here means F4 never has to modify this file again.
 */
type UnauthorizedHandler = () => Promise<boolean>;

let unauthorizedHandler: UnauthorizedHandler | null = null;

export function registerUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  unauthorizedHandler = handler;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (currentAccessToken) {
    config.headers.set("Authorization", `Bearer ${currentAccessToken}`);
  }

  return config;
});

/**
 * Response interceptor.
 *
 * Success: unwraps the backend's `{success, message, data, timestamp}`
 * envelope down to just `data`, so every call through `apiClient` — and
 * every service built on top of it in later milestones — resolves
 * directly to the typed payload, never the envelope. This is the "unwrap
 * the envelope once, centrally" rule from the approved roadmap.
 *
 * Error: normalizes every failure (backend ApiError, Zod validation 400,
 * rate-limit 429, or a raw network failure) into one AppApiError shape,
 * and retries once via the registered 401 handler if present.
 */
apiClient.interceptors.response.use(
  (response) => {
    const envelope = response.data as ApiSuccessEnvelope<unknown>;

    return { ...response, data: envelope.data };
  },
  async (error: AxiosError<ApiErrorEnvelope>) => {
    const originalRequest = error.config as
      (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;

    if (!error.response) {
      return Promise.reject(
        new AppApiError({
          message: "Unable to reach the server. Check your connection and try again.",
          status: null,
          isNetworkError: true,
        }),
      );
    }

    const { status, data } = error.response;

    if (status === 401 && unauthorizedHandler && originalRequest && !originalRequest._retried) {
      originalRequest._retried = true;

      const recovered = await unauthorizedHandler();

      if (recovered) {
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(
      new AppApiError({
        message: data?.message ?? "Something went wrong.",
        status,
        errors: data?.errors ?? null,
      }),
    );
  },
);
