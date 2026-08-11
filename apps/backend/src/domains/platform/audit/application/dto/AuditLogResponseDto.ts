export interface AuditLogResponseDto {

    id: string;

    organizationId: string;

    userId?: string;

    /** Enriched server-side (GetAuditLogsUseCase) - an audit log's
     * whole purpose is answering "who did this," and previously
     * showed only a raw userId. Bounded to the current page's real
     * results, not every log in the table. */
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

    createdAt?: Date;

}
