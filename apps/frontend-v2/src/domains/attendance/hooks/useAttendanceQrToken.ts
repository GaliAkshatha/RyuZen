import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { attendanceService } from "@/domains/attendance/attendanceService";
import type { AttendanceQrToken } from "@/domains/attendance/attendance.types";

/** Real live polling: the token genuinely rotates server-side (qrRotationSeconds), so this refetches on that same real cadence rather than showing a stale token past its own expiry. Pass false to disable polling once a session is closed. */
export function useAttendanceQrToken(sessionId: string, refetchIntervalMs: number | false) {
  return useApiQuery<AttendanceQrToken>({
    queryKey: ["attendance", "sessions", sessionId, "qr-token"] as const,
    queryFn: () => attendanceService.getQrToken(sessionId),
    enabled: Boolean(sessionId),
    refetchInterval: refetchIntervalMs,
  });
}
