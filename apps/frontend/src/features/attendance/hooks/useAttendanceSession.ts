import { useApiQuery } from "@/hooks/useApiQuery";

import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";
import type { AttendanceSessionResponseDto } from "@/features/attendance/types/attendance.types";

function getSession(sessionId: string): Promise<AttendanceSessionResponseDto> {
  return apiClient
    .get<AttendanceSessionResponseDto>(`${API_ENDPOINTS.attendance}/sessions/${sessionId}`)
    .then((response) => response.data);
}

export function useAttendanceSession(sessionId: string) {
  return useApiQuery({
    queryKey: ["attendance", "session", sessionId],
    queryFn: () => getSession(sessionId),
  });
}
