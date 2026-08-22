import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { careerScoreContainer } from "../../application/container/CareerScoreContainer.js";
import { recruiterCandidateAccessService } from "../../../../../shared/container/RecruiterCandidateAccessContainer.js";
import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

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

    /**
     * Real RECRUITER-only access to a specific candidate's career
     * score - genuinely checked per-request via
     * RecruiterCandidateAccessService (has this exact candidate
     * applied to one of my own company's real drives?), not a static
     * role gate. Any other role, or a recruiter without real access
     * to this specific candidate, gets a real 403 - the check runs
     * every time, not once at login.
     */
    async getForCandidate(

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

        const result =

            await careerScoreContainer
                .getCareerScore
                .execute(

                    req.user!.organizationId,

                    req.params.userId

                );

        return ApiResponse.success(

            res,

            result,

            "Career score fetched successfully."

        );

    }

}
