import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { auditContainer } from "../../application/container/AuditContainer.js";

export class AuditLogController {

    async list(

        req: Request,

        res: Response

    ) {

        const {

            userId,

            action,

            entityType,

            page,

            limit

        } = req.query;

        const result =

            await auditContainer

                .getAuditLogs

                .execute(

                    req.user!.organizationId,

                    {

                        userId:
                            typeof userId === "string"
                                ? userId
                                : undefined,

                        action:
                            typeof action === "string"
                                ? action
                                : undefined,

                        entityType:
                            typeof entityType === "string"
                                ? entityType
                                : undefined,

                        page:
                            typeof page === "string"
                                ? Number(page)
                                : undefined,

                        limit:
                            typeof limit === "string"
                                ? Number(limit)
                                : undefined

                    }

                );

        return ApiResponse.success(

            res,

            result,

            "Audit logs fetched successfully."

        );

    }

    async getById(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid audit log id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const log =

            await auditContainer

                .getAuditLog

                .execute(

                    id,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            log,

            "Audit log fetched successfully."

        );

    }

}