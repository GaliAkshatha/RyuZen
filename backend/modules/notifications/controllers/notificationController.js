import asyncHandler from "../../../shared/middleware/asyncHandler.js";

import ApiResponse from "../../../shared/utils/apiResponse.js";

import notificationService from "../services/notificationService.js";

/**
 * Get logged-in user's notifications
 */
export const getNotifications = asyncHandler(

    async (

        req,

        res

    ) => {

        const result =

            await notificationService.getNotifications(

                req.user.id

            );

        return ApiResponse.success(

            res,

            result.message,

            result.notifications

        );

    }

);