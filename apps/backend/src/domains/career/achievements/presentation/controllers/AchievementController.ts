import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { achievementContainer } from "../../application/container/AchievementContainer.js";

export class AchievementController {

    async create(

        req: Request,

        res: Response

    ) {

        const achievement =

            await achievementContainer

                .createAchievement

                .execute(

                    req.body,

                    req.user!.organizationId,

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            achievement,

            "Achievement submitted successfully.",

            201

        );

    }

    async list(

        req: Request,

        res: Response

    ) {

        const { status } = req.query;

        const achievements =

            await achievementContainer

                .getAchievements

                .execute(

                    req.user!.organizationId,

                    {

                        status:
                            typeof status === "string"
                                ? status
                                : undefined

                    }

                );

        return ApiResponse.success(

            res,

            achievements,

            "Achievements fetched successfully."

        );

    }

    async me(

        req: Request,

        res: Response

    ) {

        const achievements =

            await achievementContainer

                .getMyAchievements

                .execute(

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            achievements,

            "Your achievements fetched successfully."

        );

    }

    async listForStudent(

        req: Request,

        res: Response

    ) {

        const { studentId } = req.params;

        if (!studentId || Array.isArray(studentId)) {

            throw new ApiError(

                "Invalid student id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const achievements =

            await achievementContainer

                .getAchievementsByStudent

                .execute(

                    studentId,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            achievements,

            "Student achievements fetched successfully."

        );

    }

    async getById(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid achievement id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const achievement =

            await achievementContainer

                .getAchievement

                .execute(

                    id,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            achievement,

            "Achievement fetched successfully."

        );

    }

    async update(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid achievement id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const achievement =

            await achievementContainer

                .updateAchievement

                .execute(

                    id,

                    req.user!.userId,

                    req.body

                );

        return ApiResponse.success(

            res,

            achievement,

            "Achievement updated successfully."

        );

    }

    async remove(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid achievement id.",

                HttpStatus.BAD_REQUEST

            );

        }

        await achievementContainer

            .deleteAchievement

            .execute(

                id,

                req.user!.userId

            );

        return ApiResponse.success(

            res,

            null,

            "Achievement deleted successfully."

        );

    }

    async verify(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid achievement id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const achievement =

            await achievementContainer

                .verifyAchievement

                .execute(

                    id,

                    req.user!.organizationId,

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            achievement,

            "Achievement verified successfully."

        );

    }

    async reject(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid achievement id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const achievement =

            await achievementContainer

                .rejectAchievement

                .execute(

                    id,

                    req.user!.organizationId,

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            achievement,

            "Achievement rejected successfully."

        );

    }

}
