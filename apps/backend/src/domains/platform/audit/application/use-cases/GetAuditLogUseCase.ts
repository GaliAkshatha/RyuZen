import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { IAuditLogRepository } from "../../infrastructure/repositories/IAuditLogRepository.js";

import {
    IUserRepository,
} from "../../../../identity/infrastructure/repositories/IUserRepository.js";

import { AuditLogResponseDto } from "../dto/AuditLogResponseDto.js";

/** Same real gap and same fix as GetAuditLogsUseCase (the list), applied to the single-record lookup. */
export class GetAuditLogUseCase {

    constructor(

        private readonly repository: IAuditLogRepository,

        private readonly userRepository: IUserRepository

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

        let userName: string | undefined;

        if (log.userId) {

            const user =

                await this.userRepository.findById(
                    log.userId
                );

            userName = user?.name;

        }

        return {

            id: log.id!,

            organizationId: log.organizationId,

            userId: log.userId,

            userName,

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
