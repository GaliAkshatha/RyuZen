import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { educationContainer } from "../../application/container/EducationContainer.js";

export class EducationController {

    async create(

        req: Request,

        res: Response

    ) {

        const education =

            await educationContainer

                .createEducation

                .execute(

                    req.body,

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            education,

            "Education created successfully.",

            201

        );

    }

    async list(

        req: Request,

        res: Response

    ) {

        const educationEntries =

            await educationContainer

                .getEducationByUser

                .execute(

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            educationEntries,

            "Education entries fetched successfully."

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

        const educationEntries =

            await educationContainer

                .getEducationByUser

                .execute(

                    userId

                );

        return ApiResponse.success(

            res,

            educationEntries,

            "Education entries fetched successfully."

        );

    }

    async getById(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid education id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const education =

            await educationContainer

                .getEducation

                .execute(

                    id

                );

        return ApiResponse.success(

            res,

            education,

            "Education fetched successfully."

        );

    }

    async update(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid education id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const education =

            await educationContainer

                .updateEducation

                .execute(

                    id,

                    req.user!.userId,

                    req.body

                );

        return ApiResponse.success(

            res,

            education,

            "Education updated successfully."

        );

    }

    async remove(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid education id.",

                HttpStatus.BAD_REQUEST

            );

        }

        await educationContainer

            .deleteEducation

            .execute(

                id,

                req.user!.userId

            );

        return ApiResponse.success(

            res,

            null,

            "Education deleted successfully."

        );

    }

}
