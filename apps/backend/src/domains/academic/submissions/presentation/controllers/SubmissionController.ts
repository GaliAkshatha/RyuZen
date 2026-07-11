import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";

import { submissionContainer } from "../../application/container/SubmissionContainer.js";

export class SubmissionController {

    async submit(

        req: Request,

        res: Response

    ): Promise<Response> {

        const result =

            await submissionContainer

                .submitActivity

                .execute(

                    req.body,

                    req.user!.organizationId,

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            result,

            "Submission created successfully.",

            201

        );

    }

    async review(

        req: Request,

        res: Response

    ): Promise<Response> {

        const result =

            await submissionContainer

                .reviewSubmission

                .execute(

                    req.params.submissionId as string,

                    req.user!.userId,

                    req.body

                );

        return ApiResponse.success(

            res,

            result,

            "Submission reviewed successfully."

        );

    }

}