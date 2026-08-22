import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { resumeContainer } from "../../application/container/ResumeContainer.js";
import { recruiterCandidateAccessService } from "../../../../../shared/container/RecruiterCandidateAccessContainer.js";
import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

export class ResumeController {

    async createTemplate(

        req: Request,

        res: Response

    ) {

        const template =

            await resumeContainer

                .createResumeTemplate

                .execute(

                    req.body

                );

        return ApiResponse.success(

            res,

            template,

            "Resume template created successfully.",

            201

        );

    }

    async listTemplates(

        req: Request,

        res: Response

    ) {

        const templates =

            await resumeContainer

                .getResumeTemplates

                .execute();

        return ApiResponse.success(

            res,

            templates,

            "Resume templates fetched successfully."

        );

    }

    async getTemplateById(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid resume template id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const template =

            await resumeContainer

                .getResumeTemplate

                .execute(

                    id

                );

        return ApiResponse.success(

            res,

            template,

            "Resume template fetched successfully."

        );

    }

    async updateTemplate(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid resume template id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const template =

            await resumeContainer

                .updateResumeTemplate

                .execute(

                    id,

                    req.body

                );

        return ApiResponse.success(

            res,

            template,

            "Resume template updated successfully."

        );

    }

    async removeTemplate(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid resume template id.",

                HttpStatus.BAD_REQUEST

            );

        }

        await resumeContainer

            .deleteResumeTemplate

            .execute(

                id

            );

        return ApiResponse.success(

            res,

            null,

            "Resume template deleted successfully."

        );

    }

    async getMyResume(

        req: Request,

        res: Response

    ) {

        const resume =

            await resumeContainer

                .getMyResume

                .execute(

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            resume,

            "Resume fetched successfully."

        );

    }

    /**
     * Real RECRUITER-only access to a specific candidate's resume -
     * same real check as CareerScoreController.getForCandidate (has
     * this exact candidate applied to one of my own company's real
     * drives?), via the same shared RecruiterCandidateAccessService.
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

        const resume =

            await resumeContainer

                .getMyResume

                .execute(

                    req.params.userId

                );

        return ApiResponse.success(

            res,

            resume,

            "Resume fetched successfully."

        );

    }

    async generate(

        req: Request,

        res: Response

    ) {

        const resume =

            await resumeContainer

                .generateResume

                .execute(

                    req.user!.userId,

                    req.body

                );

        return ApiResponse.success(

            res,

            resume,

            "Resume generated successfully."

        );

    }

    async download(

        req: Request,

        res: Response

    ) {

        const resume =

            await resumeContainer

                .downloadResume

                .execute(

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            resume,

            "Resume ready for download."

        );

    }

    async updateVisibility(

        req: Request,

        res: Response

    ) {

        const resume =

            await resumeContainer

                .updateResumeVisibility

                .execute(

                    req.user!.userId,

                    req.body

                );

        return ApiResponse.success(

            res,

            resume,

            "Resume visibility updated successfully."

        );

    }

}
