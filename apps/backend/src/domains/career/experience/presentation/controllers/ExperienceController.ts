import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { experienceContainer } from "../../application/container/ExperienceContainer.js";

export class ExperienceController {

    async create(

        req: Request,

        res: Response

    ) {

        const experience =

            await experienceContainer

                .createExperience

                .execute(

                    req.body,

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            experience,

            "Experience created successfully.",

            201

        );

    }

    async list(

        req: Request,

        res: Response

    ) {

        const experiences =

            await experienceContainer

                .getExperiencesByUser

                .execute(

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            experiences,

            "Experience entries fetched successfully."

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

        const experiences =

            await experienceContainer

                .getExperiencesByUser

                .execute(

                    userId

                );

        return ApiResponse.success(

            res,

            experiences,

            "Experience entries fetched successfully."

        );

    }

    async getById(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid experience id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const experience =

            await experienceContainer

                .getExperience

                .execute(

                    id

                );

        return ApiResponse.success(

            res,

            experience,

            "Experience fetched successfully."

        );

    }

    async update(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid experience id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const experience =

            await experienceContainer

                .updateExperience

                .execute(

                    id,

                    req.user!.userId,

                    req.body

                );

        return ApiResponse.success(

            res,

            experience,

            "Experience updated successfully."

        );

    }

    async remove(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid experience id.",

                HttpStatus.BAD_REQUEST

            );

        }

        await experienceContainer

            .deleteExperience

            .execute(

                id,

                req.user!.userId

            );

        return ApiResponse.success(

            res,

            null,

            "Experience deleted successfully."

        );

    }

}
