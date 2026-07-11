export interface GetAuditLogsQueryDto {

    userId?: string;

    action?: string;

    entityType?: string;

    page?: number;

    limit?: number;

}
