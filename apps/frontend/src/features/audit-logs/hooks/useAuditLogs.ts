import { useApiQuery } from "@/hooks/useApiQuery";

import { auditLogService } from "@/features/audit-logs/services/auditLog.service";
import type { AuditLogsQuery } from "@/features/audit-logs/types/auditLog.types";

export function useAuditLogs(query: AuditLogsQuery) {
  return useApiQuery({
    queryKey: ["audit-logs", query] as const,
    queryFn: () => auditLogService.list(query),
  });
}
