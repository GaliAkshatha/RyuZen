import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { mockInterviewContainer } from "../../application/container/MockInterviewContainer.js";
import { recruiterCandidateAccessService } from "../../../../../shared/container/RecruiterCandidateAccessContainer.js";
import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

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

    async abandon(

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

                .abandonMockInterview

                .execute(

                    id,

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            session,

            "Interview ended."

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

    /**
     * Real RECRUITER-only access to a specific candidate's mock
     * interview sessions - same real check as Career Score and
     * Resume's candidate routes, via the same shared
     * RecruiterCandidateAccessService. Reuses getMyMockInterviews
     * unchanged (it already takes an arbitrary userId, confirmed
     * directly - it was never truly "my interviews only", just a
     * controller that only ever passed the caller's own id).
     */
    async listForCandidate(

        req: Request,

        res: Response

    ) {

        if (req.user!.role !== UserRole.RECRUITER) {

            throw new ApiError(

                "Access denied.",

                HttpStatus.FORBIDDEN

            );

        }

        const hasAccess =

            await recruiterCandidateAccessService
                .canRecruiterViewCandidate(

                    req.user!.userId,

                    req.user!.organizationId,

                    req.params.userId

                );

        if (!hasAccess) {

            throw new ApiError(

                "This candidate has not applied to any of your drives.",

                HttpStatus.FORBIDDEN

            );

        }

        const sessions =

            await mockInterviewContainer

                .getMyMockInterviews

                .execute(

                    req.params.userId

                );

        return ApiResponse.success(

            res,

            sessions,

            "Mock interview sessions fetched successfully."

        );

    }

}
