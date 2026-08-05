import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { jobApplicationContainer } from "../../application/container/JobApplicationContainer.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

export class JobApplicationController {

    async apply(

        req: Request,

        res: Response

    ) {

        const { placementId } = req.params;

        if (!placementId || Array.isArray(placementId)) {

            throw new ApiError(

                "Invalid placement id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const application =

            await jobApplicationContainer

                .applyToPlacement

                .execute(

                    placementId,

                    req.user!.userId,

                    req.body

                );

        return ApiResponse.success(

            res,

            application,

            "Application submitted successfully.",

            201

        );

    }

    async me(

        req: Request,

        res: Response

    ) {

        const applications =

            await jobApplicationContainer

                .getMyJobApplications

                .execute(

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            applications,

            "Your applications fetched successfully."

        );

    }

    async listForPlacement(

        req: Request,

        res: Response

    ) {

        const { placementId } = req.params;

        if (!placementId || Array.isArray(placementId)) {

            throw new ApiError(

                "Invalid placement id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const applications =

            await jobApplicationContainer

                .getJobApplicationsForPlacement

                .execute(

                    placementId,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            applications,

            "Applications fetched successfully."

        );

    }

    async getById(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid application id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const viewerIsAdmin =

            req.user!.role === UserRole.SUPER_ADMIN ||
            req.user!.role === UserRole.ORG_ADMIN ||
            req.user!.role === UserRole.PLACEMENT_ADMIN;

        const application =

            await jobApplicationContainer

                .getJobApplication

                .execute(

                    id,

                    req.user!.organizationId,

                    req.user!.userId,

                    viewerIsAdmin

                );

        return ApiResponse.success(

            res,

            application,

            "Application fetched successfully."

        );

    }

    async updateStatus(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid application id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const application =

            await jobApplicationContainer

                .updateJobApplicationStatus

                .execute(

                    id,

                    req.user!.organizationId,

                    req.body,

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            application,

            "Application status updated successfully."

        );

    }

}
