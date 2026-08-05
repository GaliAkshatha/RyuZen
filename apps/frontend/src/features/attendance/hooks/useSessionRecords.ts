import { useApiQuery } from "@/hooks/useApiQuery";

import { attendanceService } from "@/features/attendance/services/attendance.service";

export function useSessionRecords(sessionId: string) {
  return useApiQuery({
    queryKey: ["attendance", "session-records", sessionId],
    queryFn: () => attendanceService.getSessionRecords(sessionId),
    refetchInterval: 10000,
  });
}
