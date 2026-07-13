import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { submissionContainer } from "../../application/container/SubmissionContainer.js";

import { SubmissionStatus } from "../../domain/constants/SubmissionStatus.js";

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

    async list(

        req: Request,

        res: Response

    ): Promise<Response> {

        const { activityId, submittedBy, status } = req.query;

        const result =

            await submissionContainer

                .listSubmissions

                .execute({

                    organizationId:
                        req.user!.organizationId,

                    activityId:
                        typeof activityId === "string"
                            ? activityId
                            : undefined,

                    submittedBy:
                        typeof submittedBy === "string"
                            ? submittedBy
                            : undefined,

                    status:
                        typeof status === "string"
                            ? (status as SubmissionStatus)
                            : undefined

                });

        return ApiResponse.success(

            res,

            result,

            "Submissions fetched successfully."

        );

    }

    async getById(

        req: Request,

        res: Response

    ): Promise<Response> {

        const { submissionId } = req.params;

        if (!submissionId || Array.isArray(submissionId)) {

            throw new ApiError(

                "Invalid submission id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const result =

            await submissionContainer

                .getSubmission

                .execute(

                    submissionId,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            result,

            "Submission fetched successfully."

        );

    }

    async resubmit(

        req: Request,

        res: Response

    ): Promise<Response> {

        const { submissionId } = req.params;

        if (!submissionId || Array.isArray(submissionId)) {

            throw new ApiError(

                "Invalid submission id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const result =

            await submissionContainer

                .resubmitSubmission

                .execute(

                    submissionId,

                    req.user!.organizationId,

                    req.user!.userId,

                    req.body

                );

        return ApiResponse.success(

            res,

            result,

            "Submission resubmitted successfully."

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

    async approve(

        req: Request,

        res: Response

    ): Promise<Response> {

        const { submissionId } = req.params;

        if (!submissionId || Array.isArray(submissionId)) {

            throw new ApiError(

                "Invalid submission id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const result =

            await submissionContainer

                .reviewSubmission

                .execute(

                    submissionId,

                    req.user!.userId,

                    {

                        status:
                            SubmissionStatus.APPROVED,

                        feedback:
                            req.body.feedback,

                        pointsAwarded:
                            req.body.pointsAwarded

                    }

                );

        return ApiResponse.success(

            res,

            result,

            "Submission approved successfully."

        );

    }

    async reject(

        req: Request,

        res: Response

    ): Promise<Response> {

        const { submissionId } = req.params;

        if (!submissionId || Array.isArray(submissionId)) {

            throw new ApiError(

                "Invalid submission id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const result =

            await submissionContainer

                .reviewSubmission

                .execute(

                    submissionId,

                    req.user!.userId,

                    {

                        status:
                            SubmissionStatus.REJECTED,

                        feedback:
                            req.body.feedback,

                        pointsAwarded:
                            0

                    }

                );

        return ApiResponse.success(

            res,

            result,

            "Submission rejected successfully."

        );

    }

}