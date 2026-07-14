import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { badgeContainer } from "../../application/container/BadgeContainer.js";

export class BadgeController {

    async create(

        req: Request,

        res: Response

    ) {

        const badge =

            await badgeContainer

                .createBadge

                .execute(

                    req.body

                );

        return ApiResponse.success(

            res,

            badge,

            "Badge created successfully.",

            201

        );

    }

    async list(

        req: Request,

        res: Response

    ) {

        const badges =

            await badgeContainer

                .getBadges

                .execute();

        return ApiResponse.success(

            res,

            badges,

            "Badges fetched successfully."

        );

    }

    async getById(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid badge id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const badge =

            await badgeContainer

                .getBadge

                .execute(

                    id

                );

        return ApiResponse.success(

            res,

            badge,

            "Badge fetched successfully."

        );

    }

    async update(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid badge id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const badge =

            await badgeContainer

                .updateBadge

                .execute(

                    id,

                    req.body

                );

        return ApiResponse.success(

            res,

            badge,

            "Badge updated successfully."

        );

    }

    async remove(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid badge id.",

                HttpStatus.BAD_REQUEST

            );

        }

        await badgeContainer

            .deleteBadge

            .execute(

                id

            );

        return ApiResponse.success(

            res,

            null,

            "Badge deleted successfully."

        );

    }

    async award(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid badge id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const studentBadge =

            await badgeContainer

                .awardBadge

                .execute(

                    id,

                    req.user!.organizationId,

                    req.user!.userId,

                    req.body

                );

        return ApiResponse.success(

            res,

            studentBadge,

            "Badge awarded successfully.",

            201

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

        const studentBadges =

            await badgeContainer

                .getStudentBadges

                .execute(

                    studentId,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            studentBadges,

            "Student badges fetched successfully."

        );

    }

}
