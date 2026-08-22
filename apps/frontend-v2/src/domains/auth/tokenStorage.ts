/**
 * Token storage strategy - a deliberate tradeoff, not a default:
 *
 * - Access token: held in memory only (a module-level variable, not
 *   localStorage). It's short-lived and only needed while the tab is
 *   open, so keeping it out of persistent storage limits XSS exposure
 *   window to "the current page session," not "forever until
 *   manually cleared."
 * - Refresh token: persisted to localStorage. Without this, closing
 *   the tab would force a fresh login every time, which is a real
 *   usability cost for a platform students/faculty use daily. This
 *   does carry real XSS exposure risk - accepted here as a stated
 *   tradeoff, not an oversight. If this needs to change (e.g. to an
 *   httpOnly cookie), that requires a backend change to set one,
 *   which is out of scope for this frontend rebuild per the standing
 *   "do not modify the backend" constraint.
 */

const REFRESH_TOKEN_KEY = "ryuzen.refreshToken";

let inMemoryAccessToken: string | null = null;

export const tokenStorage = {
  getAccessToken(): string | null {
    return inMemoryAccessToken;
  },

  setAccessToken(token: string | null): void {
    inMemoryAccessToken = token;
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken(token: string | null): void {
    if (token) {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },

  setTokens(accessToken: string, refreshToken: string): void {
    tokenStorage.setAccessToken(accessToken);
    tokenStorage.setRefreshToken(refreshToken);
  },

  clear(): void {
    tokenStorage.setAccessToken(null);
    tokenStorage.setRefreshToken(null);
  },
};
