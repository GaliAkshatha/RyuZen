import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  AdjustLeaderboardPointsPayload,
  LeaderboardEntryResponseDto,
} from "@/features/leaderboard/types/leaderboard.types";

export const leaderboardService = {
  list(): Promise<LeaderboardEntryResponseDto[]> {
    return apiClient
      .get<LeaderboardEntryResponseDto[]>(API_ENDPOINTS.leaderboard)
      .then((response) => response.data);
  },

  /** STUDENT-only — confirmed this milestone. Declared before /:studentId on the backend to avoid "me" being captured as a param. */
  getMyEntry(): Promise<LeaderboardEntryResponseDto> {
    return apiClient
      .get<LeaderboardEntryResponseDto>(`${API_ENDPOINTS.leaderboard}/me`)
      .then((response) => response.data);
  },

  getByStudentId(studentId: string): Promise<LeaderboardEntryResponseDto> {
    return apiClient
      .get<LeaderboardEntryResponseDto>(`${API_ENDPOINTS.leaderboard}/${studentId}`)
      .then((response) => response.data);
  },

  adjustPoints(
    studentId: string,
    payload: AdjustLeaderboardPointsPayload,
  ): Promise<LeaderboardEntryResponseDto> {
    return apiClient
      .patch<LeaderboardEntryResponseDto>(
        `${API_ENDPOINTS.leaderboard}/${studentId}/adjust`,
        payload,
      )
      .then((response) => response.data);
  },

  recalculate(): Promise<LeaderboardEntryResponseDto[]> {
    return apiClient
      .post<LeaderboardEntryResponseDto[]>(`${API_ENDPOINTS.leaderboard}/recalculate`, {})
      .then((response) => response.data);
  },
};
