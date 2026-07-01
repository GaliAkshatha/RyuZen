import asyncHandler from "../../../shared/middleware/asyncHandler.js";

import ApiResponse from "../../../shared/utils/apiResponse.js";

import activityService from "../services/activityService.js";

/**
 * Create Activity
 */
export const createActivity = asyncHandler(

    async (

        req,

        res

    ) => {

        const result =

            await activityService.createActivity(

                req.body,

                req.user

            );

        return ApiResponse.success(

            res,

            result.message,

            result.activity,

            201

        );

    }

);

/**
 * Update Activity
 */
export const updateActivity = asyncHandler(

    async (

        req,

        res

    ) => {

        const result =

            await activityService.updateActivity(

                req.params.id,

                req.body,

                req.user

            );

        return ApiResponse.success(

            res,

            result.message,

            result.activity

        );

    }

);

/**
 * Publish Activity
 */
export const publishActivity = asyncHandler(

    async (

        req,

        res

    ) => {

        const result =

            await activityService.publishActivity(

                req.params.id,

                req.user

            );

        return ApiResponse.success(

            res,

            result.message,

            result.activity

        );

    }

);

/**
 * Close Activity
 */
export const closeActivity = asyncHandler(

    async (

        req,

        res

    ) => {

        const result =

            await activityService.closeActivity(

                req.params.id,

                req.user

            );

        return ApiResponse.success(

            res,

            result.message,

            result.activity

        );

    }

);

/**
 * Delete Activity
 */
export const deleteActivity = asyncHandler(

    async (

        req,

        res

    ) => {

        const result =

            await activityService.deleteActivity(

                req.params.id,

                req.user

            );

        return ApiResponse.success(

            res,

            result.message

        );

    }

);