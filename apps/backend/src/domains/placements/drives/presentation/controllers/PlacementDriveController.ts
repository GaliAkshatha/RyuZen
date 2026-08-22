import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { placementDriveContainer } from "../../application/container/PlacementDriveContainer.js";

export class PlacementDriveController {

    async create(

        req: Request,

        res: Response

    ) {

        const drive =

            await placementDriveContainer

                .createPlacementDrive

                .execute(

                    req.body,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            drive,

            "Placement drive created successfully.",

            201

        );

    }

    async list(

        req: Request,

        res: Response

    ) {

        const { companyId, status } = req.query;

        const drives =

            await placementDriveContainer

                .getPlacementDrives

                .execute(

                    req.user!.organizationId,

                    {

                        companyId:
                            typeof companyId === "string"
                                ? companyId
                                : undefined,

                        status:
                            typeof status === "string"
                                ? status
                                : undefined

                    }

                );

        return ApiResponse.success(

            res,

            drives,

            "Placement drives fetched successfully."

        );

    }

    async getById(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid placement drive id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const drive =

            await placementDriveContainer

                .getPlacementDrive

                .execute(

                    id,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            drive,

            "Placement drive fetched successfully."

        );

    }

    async update(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid placement drive id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const drive =

            await placementDriveContainer

                .updatePlacementDrive

                .execute(

                    id,

                    req.user!.organizationId,

                    req.body

                );

        return ApiResponse.success(

            res,

            drive,

            "Placement drive updated successfully."

        );

    }

    async remove(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid placement drive id.",

                HttpStatus.BAD_REQUEST

            );

        }

        await placementDriveContainer

            .deletePlacementDrive

            .execute(

                id,

                req.user!.organizationId

            );

        return ApiResponse.success(

            res,

            null,

            "Placement drive deleted successfully."

        );

    }

    async publish(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid placement drive id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const drive =

            await placementDriveContainer

                .publishPlacementDrive

                .execute(

                    id,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            drive,

            "Placement drive published successfully."

        );

    }

    async close(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid placement drive id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const drive =

            await placementDriveContainer

                .closePlacementDrive

                .execute(

                    id,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            drive,

            "Placement drive closed successfully."

        );

    }

    async getEligibleStudents(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid placement drive id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const students =

            await placementDriveContainer

                .getEligibleStudents

                .execute(

                    id,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            students,

            "Eligible students fetched successfully."

        );

    }

    async checkMyEligibility(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid placement drive id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const result =

            await placementDriveContainer

                .checkMyEligibility

                .execute(

                    id,

                    req.user!.organizationId,

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            result,

            "Eligibility checked successfully."

        );

    }

}
