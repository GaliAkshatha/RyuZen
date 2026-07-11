import {
    IAuditLogRepository,
    AuditLogFilters,
    AuditLogListResult,
} from "./IAuditLogRepository.js";

import { AuditLogModel } from "../persistence/AuditLogModel.js";
import { AuditLogMapper } from "../mappers/AuditLogMapper.js";

import { AuditLog } from "../../domain/entities/AuditLog.js";

export class AuditLogRepository
    implements IAuditLogRepository {

    async create(

        log: AuditLog

    ): Promise<AuditLog> {

        const document =

            await AuditLogModel.create(

                AuditLogMapper.toPersistence(

                    log

                )

            );

        return AuditLogMapper.toDomain(

            document

        );

    }

    async findById(

        id: string

    ): Promise<AuditLog | null> {

        const document =

            await AuditLogModel.findById(

                id

            );

        if (!document) {

            return null;

        }

        return AuditLogMapper.toDomain(

            document

        );

    }

    async findByOrganization(

        organizationId: string,

        filters: AuditLogFilters

    ): Promise<AuditLogListResult> {

        const page =

            filters.page && filters.page > 0

                ? filters.page

                : 1;

        const limit =

            filters.limit && filters.limit > 0

                ? filters.limit

                : 20;

        const query: Record<string, unknown> = {

            organizationId,

        };

        if (filters.userId) {

            query.userId = filters.userId;

        }

        if (filters.action) {

            query.action = filters.action;

        }

        if (filters.entityType) {

            query.entityType = filters.entityType;

        }

        const [documents, total] =

            await Promise.all([

                AuditLogModel.find(query)

                    .sort({

                        createdAt: -1

                    })

                    .skip(

                        (page - 1) * limit

                    )

                    .limit(

                        limit

                    ),

                AuditLogModel.countDocuments(

                    query

                ),

            ]);

        return {

            logs: documents.map(

                document =>

                    AuditLogMapper.toDomain(
                        document
                    )

            ),

            total,

            page,

            limit,

        };

    }

}