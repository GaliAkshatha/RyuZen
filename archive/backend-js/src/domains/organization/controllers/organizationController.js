import organizationService

from "../services/organizationService.js";

import asyncHandler

from "../../../shared/middleware/asyncHandler.js";

import ApiResponse

from "../../../shared/utils/apiResponse.js";

export const createOrganization =

asyncHandler(

    async(req,res)=>{

        const organization =

            await organizationService

            .createOrganization(

                req.body

            );

        return ApiResponse.success(

            res,

            "Organization created successfully.",

            organization,

            201

        );

    }

);

export const getOrganizations =

asyncHandler(

    async(req,res)=>{

        const organizations =

            await organizationService

            .getOrganizations();

        return ApiResponse.success(

            res,

            "Organizations fetched successfully.",

            organizations

        );

    }

);

export const getOrganization =

asyncHandler(

    async(req,res)=>{

        const organization =

            await organizationService

            .getOrganizationById(

                req.params.id

            );

        return ApiResponse.success(

            res,

            "Organization fetched successfully.",

            organization

        );

    }

);