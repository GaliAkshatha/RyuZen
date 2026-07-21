const STORAGE_KEY = "ryuzen-auth-tokens";

export interface StoredTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Token persistence strategy.
 *
 * The backend never sets auth cookies (confirmed against the real
 * backend source — no `res.cookie` call anywhere in the identity
 * domain); both tokens come back as plain JSON fields on login/refresh.
 * With no httpOnly-cookie option available from the backend, localStorage
 * is the only viable persistence mechanism for surviving a page reload.
 * This carries the usual XSS-readable-storage tradeoff, which is a
 * backend API design constraint (no cookie option to opt into), not an
 * oversight in this file. Mitigated in practice by the backend's own
 * short-lived access tokens (`JWT_EXPIRES_IN`) plus the refresh flow.
 *
 * This module owns *persistence* only. apiClient.ts's in-memory
 * `setAccessToken`/`getAccessToken` (F3) is the separate "what token do
 * outgoing requests use right now" store — AuthContext is responsible
 * for keeping both in sync.
 */

export function readStoredTokens(): StoredTokens | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredTokens>;

    if (typeof parsed.accessToken === "string" && typeof parsed.refreshToken === "string") {
      return { accessToken: parsed.accessToken, refreshToken: parsed.refreshToken };
    }

    return null;
  } catch {
    return null;
  }
}

export function persistTokens(tokens: StoredTokens): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
}

export function clearStoredTokens(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}
