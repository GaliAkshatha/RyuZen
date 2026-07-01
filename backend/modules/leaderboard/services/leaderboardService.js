import asyncHandler from "../../../shared/middleware/asyncHandler.js";

import ApiResponse from "../../../shared/utils/apiResponse.js";

import leaderboardService from "../services/leaderboardService.js";

export const getAcademicLeaderboard =

asyncHandler(

    async (

        req,

        res

    ) => {

        const result =

            await leaderboardService

            .getAcademicLeaderboard(

                req.user.organization

            );

        return ApiResponse.success(

            res,

            result.message,

            result.leaderboard

        );

    }

);