/** Matches the real backend PlacementAnalyticsResponseDto exactly. */
export interface PlacementAnalytics {
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
  /** Already a rounded 0-100 integer (confirmed: selectedCount / totalApplications * 100, computed server-side) - not a raw ratio needing conversion, and specifically "selected as a % of applications," not "% of students placed overall." */
  placementRate: number;
}
