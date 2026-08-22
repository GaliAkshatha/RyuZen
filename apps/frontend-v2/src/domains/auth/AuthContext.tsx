import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { tokenStorage } from "@/domains/auth/tokenStorage";
import { authService } from "@/domains/auth/authService";
import { registerAuthFailureHandler } from "@/shared/api/apiClient";
import type { LoginRequest, ProfileResponse } from "@/domains/auth/auth.types";

interface AuthContextValue {
  user: ProfileResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginRequest) => Promise<ProfileResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * On mount: if a refresh token is already persisted (returning user),
 * attempt to resolve a real session by fetching the profile - the
 * apiClient's own 401 interceptor will transparently exchange the
 * refresh token for a fresh access token if the in-memory access
 * token isn't set yet (e.g. after a page reload, since it's
 * deliberately not persisted). If that fails, the user is genuinely
 * logged out, not silently assumed to be.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    registerAuthFailureHandler(() => {
      tokenStorage.clear();
      setUser(null);
    });
  }, []);

  useEffect(() => {
    async function resolveSession() {
      const hasRefreshToken = Boolean(tokenStorage.getRefreshToken());
      if (!hasRefreshToken) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await authService.getProfile();
        setUser(profile);
      } catch {
        tokenStorage.clear();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    void resolveSession();
  }, []);

  async function login(payload: LoginRequest) {
    const result = await authService.login(payload);
    tokenStorage.setTokens(result.accessToken, result.refreshToken);
    const profile = await authService.getProfile();
    setUser(profile);
    return profile;
  }

  function logout() {
    void authService.logout().catch(() => {
      // Best-effort - the session is being cleared locally regardless,
      // since the whole point of logging out is to stop using these
      // tokens even if the server call itself fails.
    });
    tokenStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: Boolean(user), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
