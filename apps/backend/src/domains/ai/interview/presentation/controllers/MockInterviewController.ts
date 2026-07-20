import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { mockInterviewContainer } from "../../application/container/MockInterviewContainer.js";

export class MockInterviewController {

    async start(

        req: Request,

        res: Response

    ) {

        const session =

            await mockInterviewContainer

                .startMockInterview

                .execute(

                    req.user!.userId,

                    req.body

                );

        return ApiResponse.success(

            res,

            session,

            "Mock interview started successfully.",

            201

        );

    }

    async answer(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid interview session id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const session =

            await mockInterviewContainer

                .answerMockInterview

                .execute(

                    id,

                    req.user!.userId,

                    req.body

                );

        return ApiResponse.success(

            res,

            session,

            "Answer submitted successfully."

        );

    }

    async list(

        req: Request,

        res: Response

    ) {

        const sessions =

            await mockInterviewContainer

                .getMyMockInterviews

                .execute(

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            sessions,

            "Mock interview sessions fetched successfully."

        );

    }

    async getById(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid interview session id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const session =

            await mockInterviewContainer

                .getMockInterview

                .execute(

                    id,

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            session,

            "Mock interview session fetched successfully."

        );

    }

}
