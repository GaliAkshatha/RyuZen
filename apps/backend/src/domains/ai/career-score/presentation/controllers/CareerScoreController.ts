import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";

import { careerScoreContainer } from "../../application/container/CareerScoreContainer.js";

export class CareerScoreController {

    async get(

        req: Request,

        res: Response

    ) {

        const result =

            await careerScoreContainer

                .getCareerScore

                .execute(

                    req.user!.organizationId,

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            result,

            "Career score fetched successfully."

        );

    }

}
