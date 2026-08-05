import { Request, Response } from "express";

import { ApiResponse } from "../../../../shared/core/http/index.js";

import { ApiError } from "../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../shared/core/http/HttpStatus.js";

import { identityContainer } from "../../application/container/IdentityContainer.js";

import { auditContainer } from "../../../platform/audit/application/container/AuditContainer.js";

export class UserController {

    async grantPermission(

        req: Request,

        res: Response

    ) {

        const { userId } = req.params;

        if (!userId || Array.isArray(userId)) {

            throw new ApiError(

                "Invalid user id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const user =

            await identityContainer

                .grantPermission

                .execute(

                    userId,

                    req.body

                );

        return ApiResponse.success(

            res,

            user,

            "Permission granted successfully."

        );

    }

    async revokePermission(

        req: Request,

        res: Response

    ) {

        const { userId } = req.params;

        if (!userId || Array.isArray(userId)) {

            throw new ApiError(

                "Invalid user id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const user =

            await identityContainer

                .revokePermission

                .execute(

                    userId,

                    req.body

                );

        return ApiResponse.success(

            res,

            user,

            "Permission revoked successfully."

        );

    }

    async unlockUser(

        req: Request,

        res: Response

    ) {

        const { userId } = req.params;

        if (!userId || Array.isArray(userId)) {

            throw new ApiError(

                "Invalid user id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const user =

            await identityContainer

                .adminUnlockUser

                .execute(

                    userId,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            user,

            "Account unlocked successfully."

        );

    }

    async updateStatus(

        req: Request,

        res: Response

    ) {

        const { userId } = req.params;

        if (!userId || Array.isArray(userId)) {

            throw new ApiError(

                "Invalid user id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const user =

            await identityContainer

                .updateUserStatus

                .execute(

                    userId,

                    req.user!.organizationId,

                    req.body

                );

        const actionByStatus: Record<string, string> = {

            ACTIVE: "ACCOUNT_ACTIVATED",

            SUSPENDED: "ACCOUNT_SUSPENDED",

            ARCHIVED: "ACCOUNT_ARCHIVED"

        };

        await auditContainer.createAuditLog.execute({

            organizationId: req.user!.organizationId,

            userId: req.user!.userId,

            action: actionByStatus[req.body.status] ?? "ACCOUNT_STATUS_CHANGED",

            entityType: "User",

            entityId: userId,

            method: req.method,

            path: req.originalUrl,

            statusCode: HttpStatus.OK,

            ipAddress: req.ip,

            userAgent: req.get("user-agent")

        }).catch(() => {
            // Audit logging must never break the request lifecycle.
        });

        return ApiResponse.success(

            res,

            user,

            "User status updated successfully."

        );

    }

}
