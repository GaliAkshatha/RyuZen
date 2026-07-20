import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";

import { placementAnalyticsContainer } from "../../application/container/PlacementAnalyticsContainer.js";

export class PlacementAnalyticsController {

    async get(

        req: Request,

        res: Response

    ) {

        const analytics =

            await placementAnalyticsContainer

                .getPlacementAnalytics

                .execute(

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            analytics,

            "Placement analytics fetched successfully."

        );

    }

}
