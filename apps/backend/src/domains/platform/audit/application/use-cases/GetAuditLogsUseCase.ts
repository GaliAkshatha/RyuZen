import { IAuditLogRepository } from "../../infrastructure/repositories/IAuditLogRepository.js";

import { GetAuditLogsQueryDto } from "../dto/GetAuditLogsQueryDto.js";
import { AuditLogResponseDto } from "../dto/AuditLogResponseDto.js";

export interface GetAuditLogsResult {

    logs: AuditLogResponseDto[];

    total: number;

    page: number;

    limit: number;

}

export class GetAuditLogsUseCase {

    constructor(

        private readonly repository: IAuditLogRepository

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

        return {

            logs: result.logs.map(

                log => ({

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

                })

            ),

            total: result.total,

            page: result.page,

            limit: result.limit

        };

    }

}
