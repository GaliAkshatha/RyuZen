import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { activityModule, ActivityModule } from "../../application/module/ActivityModule.js";

import { ActivityStatus } from "../../domain/constants/ActivityStatus.js";
import { ActivityType } from "../../domain/constants/ActivityType.js";
import { ActivityVisibility } from "../../domain/constants/ActivityVisibility.js";

export class ActivityController {

    async create(

        req: Request,

        res: Response

    ) {

        const activity =

            await activityModule

                .createActivity

                .execute(

                    req.body,
                    req.user!

                );

        return ApiResponse.success(

            res,

            activity,

            "Activity created successfully.",

            201

        );

    }

    async list(

        req: Request,

        res: Response

    ) {

        const { status, type, visibility, createdBy } = req.query;

        const activities =

            await activityModule

                .listActivities

                .execute({

                    organizationId:
                        req.user!.organizationId,

                    status:
                        typeof status === "string"
                            ? (status as ActivityStatus)
                            : undefined,

                    type:
                        typeof type === "string"
                            ? (type as ActivityType)
                            : undefined,

                    visibility:
                        typeof visibility === "string"
                            ? (visibility as ActivityVisibility)
                            : undefined,

                    createdBy:
                        typeof createdBy === "string"
                            ? createdBy
                            : undefined

                });

        return ApiResponse.success(

            res,

            activities,

            "Activities fetched successfully."

        );

    }

    async getById(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid activity id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const activity =

            await activityModule

                .getActivities

                .execute(

                    id

                );

        return ApiResponse.success(

            res,

            activity,

            "Activity fetched successfully."

        );

    }

    async update(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid activity id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const activity =

            await activityModule

                .updateActivity

                .execute(

                    id,

                    req.body

                );

        return ApiResponse.success(

            res,

            activity,

            "Activity updated successfully."

        );

    }

    async publish(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid activity id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const activity =

            await activityModule

                .publishActivity

                .execute(

                    id

                );

        return ApiResponse.success(

            res,

            activity,

            "Activity published successfully."

        );

    }

    async close(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid activity id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const activity =

            await activityModule

                .closeActivity

                .execute(

                    id

                );

        return ApiResponse.success(

            res,

            activity,

            "Activity closed successfully."

        );

    }

    async remove(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid activity id.",

                HttpStatus.BAD_REQUEST

            );

        }

        await activityModule

            .deleteActivity

            .execute(

                id

            );

        return ApiResponse.success(

            res,

            null,

            "Activity deleted successfully."

        );

    }

}