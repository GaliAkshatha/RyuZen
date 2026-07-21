import { Request, Response } from "express";

import { ApiResponse } from "../../../../shared/core/http/ApiResponse.js";

import { organizationContainer } from "../../application/container/OrganizationContainer.js";

export class OrganizationSettingsController {

    async get(

        req: Request,

        res: Response

    ) {

        const settings =

            await organizationContainer

                .getOrganizationSettings

                .execute(

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            settings,

            "Organization settings fetched successfully."

        );

    }

    async update(

        req: Request,

        res: Response

    ) {

        const settings =

            await organizationContainer

                .updateOrganizationSettings

                .execute(

                    req.user!.organizationId,

                    req.body

                );

        return ApiResponse.success(

            res,

            settings,

            "Organization settings updated successfully."

        );

    }

}
