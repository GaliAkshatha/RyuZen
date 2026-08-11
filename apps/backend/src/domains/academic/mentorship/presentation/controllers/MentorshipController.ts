import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { mentorshipContainer } from "../../application/container/MentorshipContainer.js";

export class MentorshipController {

    async list(

        req: Request,

        res: Response

    ) {

        const { studentId, facultyId, status } = req.query;

        const mentorships =

            await mentorshipContainer

                .getMentorships

                .execute(

                    req.user!.organizationId,

                    {

                        studentId:
                            typeof studentId === "string"
                                ? studentId
                                : undefined,

                        facultyId:
                            typeof facultyId === "string"
                                ? facultyId
                                : undefined,

                        status:
                            typeof status === "string"
                                ? status
                                : undefined

                    },

                    req.user!.userId,

                    req.user!.role

                );

        return ApiResponse.success(

            res,

            mentorships,

            "Mentorships fetched successfully."

        );

    }

    async getById(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid mentorship id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const mentorship =

            await mentorshipContainer

                .getMentorship

                .execute(

                    id,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            mentorship,

            "Mentorship fetched successfully."

        );

    }

    async update(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid mentorship id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const mentorship =

            await mentorshipContainer

                .updateMentorship

                .execute(

                    id,

                    req.user!.organizationId,

                    req.body

                );

        return ApiResponse.success(

            res,

            mentorship,

            "Mentorship updated successfully."

        );

    }

    async complete(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid mentorship id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const mentorship =

            await mentorshipContainer

                .completeMentorship

                .execute(

                    id,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            mentorship,

            "Mentorship marked as completed."

        );

    }

    async cancel(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid mentorship id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const mentorship =

            await mentorshipContainer

                .cancelMentorship

                .execute(

                    id,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            mentorship,

            "Mentorship cancelled successfully."

        );

    }

}
