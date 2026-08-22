import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { auditLogService } from "@/domains/audit-logs/auditLogService";
import type { AuditLogPage, AuditLogQueryParams } from "@/domains/audit-logs/auditLog.types";

export function useAuditLogs(params: AuditLogQueryParams) {
  return useApiQuery<AuditLogPage>({
    queryKey: ["audit-logs", params] as const,
    queryFn: () => auditLogService.list(params),
  });
}
