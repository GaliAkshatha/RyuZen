import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";

import { dashboardContainer } from "../../application/container/DashboardContainer.js";

export class DashboardController {

    async get(

        req: Request,

        res: Response

    ) {

        const dashboard =

            await dashboardContainer

                .getDashboard

                .execute(

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            dashboard,

            "Dashboard fetched successfully."

        );

    }

}
