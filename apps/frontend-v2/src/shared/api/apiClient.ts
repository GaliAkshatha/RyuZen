import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { tokenStorage } from "@/domains/auth/tokenStorage";
import type { ApiSuccessResponse, ApiErrorResponse, AppApiError } from "@/shared/types/api.types";
import type { AuthResponse, RefreshTokenRequest } from "@/domains/auth/auth.types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach the real bearer token on every request.
apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Deduplicated refresh: if multiple requests 401 at once (e.g. a page
 * firing several queries in parallel), only one real /auth/refresh
 * call is made - every other 401'd request awaits the same in-flight
 * promise rather than each triggering its own refresh, which would
 * race and could invalidate each other's new tokens.
 */
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await axios.post<ApiSuccessResponse<AuthResponse>>(
      `${API_BASE_URL}/auth/refresh`,
      { refreshToken } satisfies RefreshTokenRequest,
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
    tokenStorage.setTokens(accessToken, newRefreshToken);
    return accessToken;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

/** Called by AuthProvider once mounted, so the client can trigger a real logout/redirect on unrecoverable auth failure without importing AuthContext here (would create a circular dependency). */
let onAuthFailure: (() => void) | null = null;
export function registerAuthFailureHandler(handler: () => void): void {
  onAuthFailure = handler;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retried?: boolean };

    const isAuthEndpoint = originalRequest?.url?.includes("/auth/login") || originalRequest?.url?.includes("/auth/refresh");

    if (error.response?.status === 401 && originalRequest && !originalRequest._retried && !isAuthEndpoint) {
      originalRequest._retried = true;
      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch {
        tokenStorage.clear();
        onAuthFailure?.();
        return Promise.reject(normalizeError(error));
      }
    }

    return Promise.reject(normalizeError(error));
  },
);

function normalizeError(error: AxiosError<ApiErrorResponse>): AppApiError {
  return {
    message: error.response?.data?.message ?? error.message ?? "Something went wrong.",
    statusCode: error.response?.status ?? 0,
    errors: error.response?.data?.errors,
  };
}
