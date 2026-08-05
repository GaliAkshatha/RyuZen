import { useApiQuery } from "@/hooks/useApiQuery";

import { attendanceService } from "@/features/attendance/services/attendance.service";

export function useMyAttendanceRecords() {
  return useApiQuery({
    queryKey: ["attendance", "my-records"],
    queryFn: () => attendanceService.getMyRecords(),
  });
}
