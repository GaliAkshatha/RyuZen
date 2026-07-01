import asyncHandler from "../../../shared/middleware/asyncHandler.js";

import ApiResponse from "../../../shared/utils/apiResponse.js";

import activityService from "../services/activityService.js";

/**
 * Student submits activity
 */
export const submitActivity = asyncHandler(

    async (

        req,

        res

    ) => {

        const result =

            await activityService.submitActivity(

                req.params.id,

                req.body,

                req.user

            );

        return ApiResponse.success(

            res,

            result.message,

            result.submission,

            201

        );

    }

);

/**
 * Faculty approves submission
 */
export const approveSubmission = asyncHandler(

    async (

        req,

        res

    ) => {

        const {

            feedback,

            score,

        } = req.body;

        const result =

            await activityService.approveSubmission(

                req.params.id,

                feedback,

                score,

                req.user

            );

        return ApiResponse.success(

            res,

            result.message,

            result.submission

        );

    }

);

/**
 * Faculty rejects submission
 */
export const rejectSubmission = asyncHandler(

    async (

        req,

        res

    ) => {

        const {

            feedback,

        } = req.body;

        const result =

            await activityService.rejectSubmission(

                req.params.id,

                feedback,

                req.user

            );

        return ApiResponse.success(

            res,

            result.message,

            result.submission

        );

    }

);

/**
 * Mark workshop attendance
 */
export const markAttendance = asyncHandler(

    async (

        req,

        res

    ) => {

        const result =

            await activityService.markAttendance(

                req.params.id,

                req.user

            );

        return ApiResponse.success(

            res,

            result.message,

            result.submission

        );

    }

);