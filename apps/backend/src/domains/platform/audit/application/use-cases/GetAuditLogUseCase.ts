import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { IAuditLogRepository } from "../../infrastructure/repositories/IAuditLogRepository.js";

import { AuditLogResponseDto } from "../dto/AuditLogResponseDto.js";

export class GetAuditLogUseCase {

    constructor(

        private readonly repository: IAuditLogRepository

    ) {}

    async execute(

        id: string,

        organizationId: string

    ): Promise<AuditLogResponseDto> {

        const log =

            await this.repository.findById(
                id
            );

        if (

            !log ||
            log.organizationId !== organizationId

        ) {

            throw new ApiError(

                "Audit log not found.",

                HttpStatus.NOT_FOUND

            );

        }

        return {

            id: log.id!,

            organizationId: log.organizationId,

            userId: log.userId,

            action: log.action,

            entityType: log.entityType,

            entityId: log.entityId,

            method: log.method,

            path: log.path,

            statusCode: log.statusCode,

            ipAddress: log.ipAddress,

            userAgent: log.userAgent,

            metadata: log.metadata,

            createdAt: log.createdAt

        };

    }

}
