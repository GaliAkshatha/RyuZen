import { useApiQuery } from "@/hooks/useApiQuery";

import { attendanceService } from "@/features/attendance/services/attendance.service";

/**
 * Real, live polling at the session's own rotation cadence (passed in
 * as refetchIntervalMs by the caller, who already knows the real
 * qrRotationSeconds from the session response) - the token displayed
 * is always the actual current server-issued one, never generated or
 * guessed client-side.
 */
export function useQrToken(sessionId: string, refetchIntervalMs: number) {
  return useApiQuery({
    queryKey: ["attendance", "qr-token", sessionId],
    queryFn: () => attendanceService.getQrToken(sessionId),
    refetchInterval: refetchIntervalMs,
  });
}
