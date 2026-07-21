/**
 * Mirrors AuditLogResponseDto exactly. Read-only: List and Get, both
 * SUPER_ADMIN + ORG_ADMIN. There is no client-facing Create endpoint
 * — audit log entries are written internally by the system, not by
 * user action.
 *
 * IMPORTANT finding confirmed this milestone: scoping is always by
 * `req.user!.organizationId` — even SUPER_ADMIN only ever sees their
 * OWN organization's logs here, not a cross-tenant platform-wide view.
 * This is genuinely different from AD2's Organizations, where
 * SUPER_ADMIN manages every tenant. Single-record Get uses the same
 * 404-obscuring ownership convention as human/AI Chat and Mock
 * Interview: a log from a different organization returns 404, not 403.
 */
export interface AuditLogResponseDto {
  id: string;
  organizationId: string;
  userId?: string;
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

/** Mirrors GetAuditLogsQueryDto */
export interface AuditLogsQuery {
  userId?: string;
  action?: string;
  entityType?: string;
  page?: number;
  limit?: number;
}

/** Mirrors GetAuditLogsResult exactly */
export interface AuditLogsResult {
  logs: AuditLogResponseDto[];
  total: number;
  page: number;
  limit: number;
}
