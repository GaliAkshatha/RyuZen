import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { leaderboardContainer } from "../../application/container/LeaderboardContainer.js";

export class LeaderboardController {

    async list(

        req: Request,

        res: Response

    ) {

        const entries =

            await leaderboardContainer

                .getLeaderboard

                .execute(

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            entries,

            "Leaderboard fetched successfully."

        );

    }

    async me(

        req: Request,

        res: Response

    ) {

        const entry =

            await leaderboardContainer

                .getMyLeaderboardEntry

                .execute(

                    req.user!.organizationId,

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            entry,

            "Your leaderboard entry fetched successfully."

        );

    }

    async getByStudentId(

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

        const entry =

            await leaderboardContainer

                .getLeaderboardEntry

                .execute(

                    req.user!.organizationId,

                    studentId

                );

        return ApiResponse.success(

            res,

            entry,

            "Leaderboard entry fetched successfully."

        );

    }

    async recalculate(

        req: Request,

        res: Response

    ) {

        const entries =

            await leaderboardContainer

                .recalculateLeaderboard

                .execute(

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            entries,

            "Leaderboard recalculated successfully."

        );

    }

    async adjust(

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

        const entry =

            await leaderboardContainer

                .adjustLeaderboardPoints

                .execute(

                    req.user!.organizationId,

                    studentId,

                    req.body

                );

        return ApiResponse.success(

            res,

            entry,

            "Leaderboard points adjusted successfully."

        );

    }

}
