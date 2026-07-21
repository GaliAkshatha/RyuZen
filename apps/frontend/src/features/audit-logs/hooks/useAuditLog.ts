import { useApiQuery } from "@/hooks/useApiQuery";

import { auditLogService } from "@/features/audit-logs/services/auditLog.service";

export function useAuditLog(id: string) {
  return useApiQuery({
    queryKey: ["audit-logs", "detail", id] as const,
    queryFn: () => auditLogService.getById(id),
    enabled: Boolean(id),
  });
}
