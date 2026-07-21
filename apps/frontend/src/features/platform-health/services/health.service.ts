import { API_BASE_URL } from "@/services/endpoints";

export interface HealthCheckResult {
  reachable: boolean;
  message?: string;
}

/**
 * GET /health is unauthenticated and mounted OUTSIDE /api/v1
 * (bootstrapRoutes.ts, not the versioned API router) — it returns
 * only `{ success: true, message: "RyuZen Backend Running 🚀" }`,
 * confirmed this milestone. No uptime, no DB connectivity detail, no
 * real metrics. Uses a plain fetch rather than `apiClient` since the
 * configured axios instance's baseURL already includes `/api/v1` and
 * would incorrectly prefix this request, and its auth interceptors
 * are irrelevant to an unauthenticated endpoint.
 */
export const healthService = {
  async check(): Promise<HealthCheckResult> {
    const root = API_BASE_URL.replace(/\/api\/v1\/?$/, "");
    try {
      const response = await fetch(`${root}/health`);
      if (!response.ok) {
        return { reachable: false };
      }
      const data = (await response.json()) as { message?: string };
      return { reachable: true, message: data.message };
    } catch {
      return { reachable: false };
    }
  },
};
