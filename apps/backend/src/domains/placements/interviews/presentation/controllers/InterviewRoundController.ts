import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { interviewRoundContainer } from "../../application/container/InterviewRoundContainer.js";

export class InterviewRoundController {

    async schedule(

        req: Request,

        res: Response

    ) {

        const round =

            await interviewRoundContainer

                .scheduleInterviewRound

                .execute(

                    req.user!.organizationId,

                    req.body,

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            round,

            "Interview round scheduled successfully.",

            201

        );

    }

    async recordEvaluation(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid interview round id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const round =

            await interviewRoundContainer

                .recordInterviewEvaluation

                .execute(

                    id,

                    req.user!.organizationId,

                    req.body,

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            round,

            "Interview evaluation recorded successfully."

        );

    }

    async getForApplication(

        req: Request,

        res: Response

    ) {

        const { applicationId } = req.params;

        if (!applicationId || Array.isArray(applicationId)) {

            throw new ApiError(

                "Invalid application id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const rounds =

            await interviewRoundContainer

                .getInterviewRoundsForApplication

                .execute(

                    applicationId,

                    req.user!.organizationId,

                    req.user!.userId,

                    req.user!.role

                );

        return ApiResponse.success(

            res,

            rounds,

            "Interview rounds fetched successfully."

        );

    }

}
