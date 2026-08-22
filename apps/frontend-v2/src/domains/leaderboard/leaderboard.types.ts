/** Matches the real backend LeaderboardEntryResponseDto exactly - departmentId/batch are real server-side enrichments closing a previously-confirmed gap (no way to filter by branch/year existed at all before). */
export interface LeaderboardEntry {
  id: string;
  organizationId: string;
  studentId: string;
  studentName?: string;
  studentUsn?: string;
  departmentId?: string;
  batch?: string;
  activityPoints: number;
  clubPoints: number;
  eventPoints: number;
  placementPoints: number;
  totalPoints: number;
  rank: number;
  createdAt?: string;
  updatedAt?: string;
}
