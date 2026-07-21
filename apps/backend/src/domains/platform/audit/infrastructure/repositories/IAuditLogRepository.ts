import { AuditLog } from "../../domain/entities/AuditLog.js";

export interface AuditLogFilters {

    userId?: string;

    action?: string;

    entityType?: string;

    page?: number;

    limit?: number;

}

export interface AuditLogListResult {

    logs: AuditLog[];

    total: number;

    page: number;

    limit: number;

}

export interface IAuditLogRepository {

    create(
        log: AuditLog
    ): Promise<AuditLog>;

    findById(
        id: string
    ): Promise<AuditLog | null>;

    findByOrganization(
        organizationId: string,
        filters: AuditLogFilters
    ): Promise<AuditLogListResult>;

}
