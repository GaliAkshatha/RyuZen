import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";

import { activityModule, ActivityModule } from "../../application/module/ActivityModule.js";

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

}