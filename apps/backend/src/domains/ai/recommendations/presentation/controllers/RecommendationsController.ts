import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";

import { recommendationsContainer } from "../../application/container/RecommendationsContainer.js";

export class RecommendationsController {

    async get(

        req: Request,

        res: Response

    ) {

        const result =

            await recommendationsContainer

                .getRecommendations

                .execute(

                    req.user!.organizationId,

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            result,

            "Recommendations fetched successfully."

        );

    }

}
