import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { portfolioProjectContainer } from "../../application/container/PortfolioProjectContainer.js";

export class PortfolioProjectController {

    async create(

        req: Request,

        res: Response

    ) {

        const project =

            await portfolioProjectContainer

                .createPortfolioProject

                .execute(

                    req.body,

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            project,

            "Portfolio project created successfully.",

            201

        );

    }

    async list(

        req: Request,

        res: Response

    ) {

        const projects =

            await portfolioProjectContainer

                .getPortfolioProjectsByUser

                .execute(

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            projects,

            "Portfolio projects fetched successfully."

        );

    }

    async listForUser(

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

        const projects =

            await portfolioProjectContainer

                .getPortfolioProjectsByUser

                .execute(

                    userId

                );

        return ApiResponse.success(

            res,

            projects,

            "Portfolio projects fetched successfully."

        );

    }

    async getById(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid portfolio project id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const project =

            await portfolioProjectContainer

                .getPortfolioProject

                .execute(

                    id

                );

        return ApiResponse.success(

            res,

            project,

            "Portfolio project fetched successfully."

        );

    }

    async update(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid portfolio project id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const project =

            await portfolioProjectContainer

                .updatePortfolioProject

                .execute(

                    id,

                    req.user!.userId,

                    req.body

                );

        return ApiResponse.success(

            res,

            project,

            "Portfolio project updated successfully."

        );

    }

    async remove(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid portfolio project id.",

                HttpStatus.BAD_REQUEST

            );

        }

        await portfolioProjectContainer

            .deletePortfolioProject

            .execute(

                id,

                req.user!.userId

            );

        return ApiResponse.success(

            res,

            null,

            "Portfolio project deleted successfully."

        );

    }

}
