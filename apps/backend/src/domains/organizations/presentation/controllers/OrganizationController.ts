import { Request, Response } from "express";

import {

    ApiResponse, ApiError, HttpStatus

} from "../../../../shared/core/http/index.js";

import {

    organizationContainer,

} from "../../application/container/OrganizationContainer.js";

export class OrganizationController {

    async create(

        req: Request,

        res: Response

    ) {

        const organization =

            await organizationContainer

            .createOrganization

            .execute(

                req.body

            );

        return ApiResponse.success(

            res,

            organization,

            "Organization created successfully."

        );

    }

    async createOrgAdmin(

        req: Request,

        res: Response

    ) {

        const { organizationId } = req.params;

        if (!organizationId || Array.isArray(organizationId)) {

            throw new ApiError(

                "Invalid organization id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const admin =

            await organizationContainer

                .createOrgAdmin

                .execute({

                    organizationId,

                    ...req.body

                });

        return ApiResponse.success(

            res,

            admin,

            "Organization admin created successfully.",

            201

        );

    }

    async getAll(

        req: Request,

        res: Response

    ) {

        const organizations =

            await organizationContainer

            .getOrganizations

            .execute();

        return ApiResponse.success(

            res,

            organizations,

            "Organizations fetched successfully."

        );

    }

    async getById(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)){
            throw new ApiError(
                "Invalid organization id.",
                HttpStatus.BAD_REQUEST
            )
        }

        const organization =

            await organizationContainer

            .getOrganization

            .execute( id );

        return ApiResponse.success(

            res,

            organization,

            "Organization fetched successfully."

        );

    }

}