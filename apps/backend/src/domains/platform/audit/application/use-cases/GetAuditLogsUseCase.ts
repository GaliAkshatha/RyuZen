import { IAuditLogRepository } from "../../infrastructure/repositories/IAuditLogRepository.js";

import {
    IUserRepository,
} from "../../../../identity/infrastructure/repositories/IUserRepository.js";

import { GetAuditLogsQueryDto } from "../dto/GetAuditLogsQueryDto.js";
import { AuditLogResponseDto } from "../dto/AuditLogResponseDto.js";

export interface GetAuditLogsResult {

    logs: AuditLogResponseDto[];

    total: number;

    page: number;

    limit: number;

}

/**
 * Real gap found while auditing Org Admin: an audit log's entire
 * purpose is answering "who did this," and this previously returned
 * only a raw userId with no way to resolve it in the UI without a
 * separate manual lookup. Enrichment is bounded to the current page's
 * real results (GetAuditLogsQueryDto already paginates), not an
 * unbounded scan of the whole audit table.
 */
export class GetAuditLogsUseCase {

    constructor(

        private readonly repository: IAuditLogRepository,

        private readonly userRepository: IUserRepository

    ) {}

    async execute(

        organizationId: string,

        query: GetAuditLogsQueryDto

    ): Promise<GetAuditLogsResult> {

        const result =

            await this.repository.findByOrganization(

                organizationId,

                {

                    userId: query.userId,

                    action: query.action,

                    entityType: query.entityType,

                    page: query.page,

                    limit: query.limit

                }

            );

        const logs: AuditLogResponseDto[] = [];

        for (const log of result.logs) {

            let userName: string | undefined;

            if (log.userId) {

                const user =

                    await this.userRepository.findById(
                        log.userId
                    );

                userName = user?.name;

            }

            logs.push({

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

            });

        }

        return {

            logs,

            total: result.total,

            page: result.page,

            limit: result.limit

        };

    }

}
