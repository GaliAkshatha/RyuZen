import type { PlacementAnalyticsResponseDto } from "@/features/placement-analytics/types/placementAnalytics.types";

/**
 * Mirrors DashboardResponseDto exactly. Single GET endpoint,
 * SUPER_ADMIN + ORG_ADMIN. Confirmed this milestone by reading
 * GetDashboardUseCase directly: `placements` is the exact same
 * PlacementAnalyticsResponseDto from PL4, genuinely reused (not
 * recomputed) — confirming what PL4's own widget comment predicted
 * ("the exact same use case AD5's Admin Dashboard will also reuse").
 *
 * Scoped by `organizationId` — same as AD4's Audit Logs, even
 * SUPER_ADMIN only ever sees their OWN organization's counts here,
 * never a cross-tenant platform-wide aggregate. The backend's own
 * route comment also states: FACULTY/STUDENT have "Limited" access
 * per the Role & Permission Matrix, but a reduced role-scoped view for
 * them was explicitly not built in this milestone — so this stays
 * SUPER_ADMIN/ORG_ADMIN only on the frontend too.
 */
export interface DashboardResponseDto {
  users: {
    total: number;
    students: number;
    faculty: number;
    alumni: number;
    orgAdmins: number;
  };
  departments: number;
  activities: {
    total: number;
    published: number;
    pendingReviews: number;
  };
  clubs: number;
  events: {
    total: number;
    published: number;
  };
  placements: PlacementAnalyticsResponseDto;
}
