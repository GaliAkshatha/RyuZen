import { AuditLog } from "../../domain/entities/AuditLog.js";

import { IAuditLogRepository } from "../../infrastructure/repositories/IAuditLogRepository.js";

import { CreateAuditLogDto } from "../dto/CreateAuditLogDto.js";

export class CreateAuditLogUseCase {

    constructor(

        private readonly repository: IAuditLogRepository

    ) {}

    async execute(

        dto: CreateAuditLogDto

    ): Promise<void> {

        const log =

            AuditLog.create({

                organizationId: dto.organizationId,

                userId: dto.userId,

                action: dto.action,

                entityType: dto.entityType,

                entityId: dto.entityId,

                method: dto.method,

                path: dto.path,

                statusCode: dto.statusCode,

                ipAddress: dto.ipAddress,

                userAgent: dto.userAgent,

                metadata: dto.metadata

            });

        await this.repository.create(

            log

        );

    }

}
