/**
 * Mirrors PlacementAnalyticsResponseDto exactly. Single read-only
 * endpoint, ORG_ADMIN-only, mounted at its own base path
 * (/api/v1/placement-analytics, not nested under /placements) — the
 * backend's own route-file comment explains this is deliberate, to
 * avoid colliding with GET /placements/:id in placement-drive.routes.ts.
 * Confirmed this milestone; matches navRegistry's pre-existing
 * "route-verified: ORG_ADMIN only, SUPER_ADMIN explicitly excluded" note.
 */
export interface PlacementAnalyticsResponseDto {
  totalCompanies: number;
  activeCompanies: number;
  totalDrives: number;
  draftDrives: number;
  publishedDrives: number;
  closedDrives: number;
  totalApplications: number;
  appliedCount: number;
  shortlistedCount: number;
  rejectedCount: number;
  selectedCount: number;
  placementRate: number;
}
