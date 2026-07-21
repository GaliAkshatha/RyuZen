import { AuditLog } from "../../domain/entities/AuditLog.js";
import { IAuditLog } from "../../domain/interfaces/IAuditLog.js";

import { AuditLogDocument } from "../persistence/AuditLogModel.js";

export class AuditLogMapper {

    static toDomain(
        document: AuditLogDocument
    ): AuditLog {

        return new AuditLog({

            id: document.id,

            organizationId: document.organizationId.toString(),

            userId: document.userId?.toString(),

            action: document.action,

            entityType: document.entityType,

            entityId: document.entityId,

            method: document.method,

            path: document.path,

            statusCode: document.statusCode,

            ipAddress: document.ipAddress,

            userAgent: document.userAgent,

            metadata: document.metadata,

            createdAt: document.createdAt

        });

    }

    static toPersistence(
        log: AuditLog
    ): Partial<IAuditLog> {

        return {

            ...log.toObject()

        };

    }

}
