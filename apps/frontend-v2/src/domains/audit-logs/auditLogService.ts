import { apiClient } from "@/shared/api/apiClient";
import type { ApiSuccessResponse } from "@/shared/types/api.types";
import type { AuditLog, AuditLogPage, AuditLogQueryParams } from "@/domains/audit-logs/auditLog.types";

/** Confirmed SUPER_ADMIN/ORG_ADMIN only. */
export const auditLogService = {
  async list(params: AuditLogQueryParams): Promise<AuditLogPage> {
    const res = await apiClient.get<ApiSuccessResponse<AuditLogPage>>("/audit-logs", { params });
    return res.data.data;
  },
  async getById(id: string): Promise<AuditLog> {
    const res = await apiClient.get<ApiSuccessResponse<AuditLog>>(`/audit-logs/${id}`);
    return res.data.data;
  },
};
