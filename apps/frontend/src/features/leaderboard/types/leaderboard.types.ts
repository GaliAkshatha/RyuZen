/**
 * Mirrors LeaderboardEntryResponseDto exactly. `totalPoints` and `rank`
 * are derived/computed fields (rank presumably assigned by the
 * repository query, sorted by totalPoints). `activityPoints` and
 * `eventPoints` are NOT independently adjustable — confirmed against
 * AdjustLeaderboardPointsDto (only clubPoints/placementPoints are
 * settable), implying activity/event points are auto-derived from
 * approved submissions (AC2) and attended events (C3) respectively.
 */
export interface LeaderboardEntryResponseDto {
  id: string;
  organizationId: string;
  studentId: string;
  studentName?: string;
  studentUsn?: string;
  activityPoints: number;
  clubPoints: number;
  eventPoints: number;
  placementPoints: number;
  totalPoints: number;
  rank: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Mirrors AdjustLeaderboardPointsDto exactly — only clubPoints and
 * placementPoints can be manually adjusted, confirmed this milestone.
 * activityPoints/eventPoints have no adjust endpoint at all.
 */
export interface AdjustLeaderboardPointsPayload {
  clubPoints?: number;
  placementPoints?: number;
}
