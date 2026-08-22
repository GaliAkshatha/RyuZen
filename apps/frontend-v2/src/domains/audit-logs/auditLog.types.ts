/** Matches the real backend AuditLogResponseDto exactly - userName is server-enriched (confirmed), an audit log's whole purpose is "who did this", previously only a raw userId. */
export interface AuditLog {
  id: string;
  organizationId: string;
  userId?: string;
  userName?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  method: string;
  path: string;
  statusCode: number;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  createdAt?: string;
}

/** Matches the real GetAuditLogsResult exactly - genuine server-side pagination, not a full-list-then-slice approximation. */
export interface AuditLogPage {
  logs: AuditLog[];
  total: number;
  page: number;
  limit: number;
}

export interface AuditLogQueryParams {
  userId?: string;
  action?: string;
  entityType?: string;
  page?: number;
  limit?: number;
}
