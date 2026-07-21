export interface CreateAuditLogDto {

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

}
