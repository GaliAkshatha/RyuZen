import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";

import { registerUnauthorizedHandler, setAccessToken } from "@/services/apiClient";

import { authService } from "@/features/auth/services/auth.service";
import type { LoginCredentials, ProfileResponseDto } from "@/features/auth/types/auth.types";
import { CURRENT_USER_QUERY_KEY, useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import {
  clearStoredTokens,
  persistTokens,
  readStoredTokens,
} from "@/features/auth/utils/tokenStorage";

interface AuthContextValue {
  user: ProfileResponseDto | null;
  isAuthenticated: boolean;
  /** True only during the initial app-load hydration check. */
  isInitializing: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // Whether we believe a session might exist — gates the hydration
  // query so it never fires before we've checked localStorage.
  const [hasStoredSession, setHasStoredSession] = useState(() => readStoredTokens() !== null);

  const {
    data: user,
    isLoading: isProfileLoading,
    isFetched: isProfileFetched,
  } = useCurrentUser(hasStoredSession);

  // Single-flight refresh: if multiple requests 401 at nearly the same
  // moment, every one of them calls this function, but only the first
  // call creates the refresh promise (the synchronous check-and-set
  // below happens before any `await`, so later calls in the same tick
  // always see it already set). Every caller awaits the SAME promise —
  // no double-refresh, and none of the original requests are dropped,
  // since apiClient retries each of them once this resolves.
  const refreshPromiseRef = useRef<Promise<boolean> | null>(null);

  const performRefresh = useCallback(async (): Promise<boolean> => {
    const stored = readStoredTokens();

    if (!stored) {
      return false;
    }

    if (!refreshPromiseRef.current) {
      refreshPromiseRef.current = authService
        .refresh({ refreshToken: stored.refreshToken })
        .then((result) => {
          persistTokens({ accessToken: result.accessToken, refreshToken: result.refreshToken });
          setAccessToken(result.accessToken);
          queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });

          return true;
        })
        .catch(() => {
          clearStoredTokens();
          setAccessToken(null);
          setHasStoredSession(false);
          queryClient.removeQueries({ queryKey: CURRENT_USER_QUERY_KEY });

          return false;
        })
        .finally(() => {
          refreshPromiseRef.current = null;
        });
    }

    return refreshPromiseRef.current;
  }, [queryClient]);

  // Register the 401 hook point built in F3. Re-registered whenever
  // performRefresh's identity changes (it never does, in practice,
  // since its only dependency is the stable queryClient instance).
  useEffect(() => {
    registerUnauthorizedHandler(performRefresh);

    return () => registerUnauthorizedHandler(null);
  }, [performRefresh]);

  // On mount, if a token is stored, make it available to apiClient
  // immediately (optimistic) so the hydration query's first request
  // carries it. If the stored access token has already expired, the
  // hydration query will 401 and performRefresh takes over.
  useEffect(() => {
    const stored = readStoredTokens();

    if (stored) {
      setAccessToken(stored.accessToken);
    }
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<void> => {
      const result = await authService.login(credentials);

      persistTokens({ accessToken: result.accessToken, refreshToken: result.refreshToken });
      setAccessToken(result.accessToken);
      setHasStoredSession(true);

      await queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
    },
    [queryClient],
  );

  const logout = useCallback((): void => {
    clearStoredTokens();
    setAccessToken(null);
    setHasStoredSession(false);
    queryClient.removeQueries({ queryKey: CURRENT_USER_QUERY_KEY });
  }, [queryClient]);

  const isInitializing = hasStoredSession && !isProfileFetched && isProfileLoading;

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user ?? null,
      isAuthenticated: Boolean(user),
      isInitializing,
      login,
      logout,
    }),
    [user, isInitializing, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- context + consumer hook co-location is the standard pattern for every context file in this project (see ThemeContext.tsx)
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
