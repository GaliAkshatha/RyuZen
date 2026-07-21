import { apiClient } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/services/endpoints";

import type {
  AuditLogResponseDto,
  AuditLogsQuery,
  AuditLogsResult,
} from "@/features/audit-logs/types/auditLog.types";

export const auditLogService = {
  list(query: AuditLogsQuery = {}): Promise<AuditLogsResult> {
    return apiClient
      .get<AuditLogsResult>(API_ENDPOINTS.auditLogs, { params: query })
      .then((response) => response.data);
  },

  getById(id: string): Promise<AuditLogResponseDto> {
    return apiClient
      .get<AuditLogResponseDto>(`${API_ENDPOINTS.auditLogs}/${id}`)
      .then((response) => response.data);
  },
};
