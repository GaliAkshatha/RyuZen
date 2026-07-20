import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";

import { resumeReviewContainer } from "../../application/container/ResumeReviewContainer.js";

export class ResumeReviewController {

    async review(

        req: Request,

        res: Response

    ) {

        const result =

            await resumeReviewContainer

                .reviewResume

                .execute(

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            result,

            "Resume reviewed successfully."

        );

    }

}
