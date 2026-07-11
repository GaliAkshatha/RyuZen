import { Request, Response } from "express";

import { ApiResponse } from "../../../../shared/core/http/index.js";

import { ApiError } from "../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../shared/core/http/HttpStatus.js";

import { identityContainer } from "../../application/container/IdentityContainer.js";

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

}
