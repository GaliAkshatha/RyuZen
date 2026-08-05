import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";

import { recruiterContainer } from "../../application/container/RecruiterContainer.js";

export class RecruiterController {

    async create(

        req: Request,

        res: Response

    ) {

        const recruiter =

            await recruiterContainer

                .createRecruiter

                .execute(

                    req.body,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            recruiter,

            "Recruiter profile created successfully.",

            201

        );

    }

    async getMyApplicants(

        req: Request,

        res: Response

    ) {

        const applicants =

            await recruiterContainer

                .getApplicantsForRecruiter

                .execute(

                    req.user!.userId,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            applicants,

            "Applicants fetched successfully."

        );

    }

    async search(

        req: Request,

        res: Response

    ) {

        const skillsParam = req.query.skills;

        const skillNames =
            typeof skillsParam === "string"
                ? skillsParam.split(",").map(s => s.trim()).filter(Boolean)
                : undefined;

        const minCgpaParam = req.query.minCgpa;

        const minCgpa =
            typeof minCgpaParam === "string" && minCgpaParam.length > 0
                ? Number(minCgpaParam)
                : undefined;

        const applicants =

            await recruiterContainer

                .searchApplicants

                .execute(

                    req.user!.userId,

                    req.user!.organizationId,

                    { skillNames, minCgpa }

                );

        return ApiResponse.success(

            res,

            applicants,

            "Search results fetched successfully."

        );

    }

}
