import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { userPortfolioContainer } from "../../application/container/UserPortfolioContainer.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

export class UserPortfolioController {

    async me(

        req: Request,

        res: Response

    ) {

        const portfolio =

            await userPortfolioContainer

                .getUserPortfolio

                .execute(

                    req.user!.userId,

                    req.user!.userId,

                    true

                );

        return ApiResponse.success(

            res,

            portfolio,

            "Portfolio fetched successfully."

        );

    }

    async getByUserId(

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

        const viewerIsAdmin =

            req.user!.role === UserRole.SUPER_ADMIN ||
            req.user!.role === UserRole.ORG_ADMIN;

        const portfolio =

            await userPortfolioContainer

                .getUserPortfolio

                .execute(

                    userId,

                    req.user!.userId,

                    viewerIsAdmin

                );

        return ApiResponse.success(

            res,

            portfolio,

            "Portfolio fetched successfully."

        );

    }

    async update(

        req: Request,

        res: Response

    ) {

        const portfolio =

            await userPortfolioContainer

                .updateUserPortfolio

                .execute(

                    req.user!.userId,

                    req.body

                );

        return ApiResponse.success(

            res,

            portfolio,

            "Portfolio updated successfully."

        );

    }

}
