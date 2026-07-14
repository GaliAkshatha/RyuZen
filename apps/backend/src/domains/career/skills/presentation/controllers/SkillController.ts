import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { skillContainer } from "../../application/container/SkillContainer.js";

export class SkillController {

    async create(

        req: Request,

        res: Response

    ) {

        const skill =

            await skillContainer

                .createSkill

                .execute(

                    req.body,

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            skill,

            "Skill created successfully.",

            201

        );

    }

    async list(

        req: Request,

        res: Response

    ) {

        const skills =

            await skillContainer

                .getSkillsByUser

                .execute(

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            skills,

            "Skills fetched successfully."

        );

    }

    async listForUser(

        req: Request,

        res: Response

    ) {

        const { userId } = req.params;

        if (!userId || Array.isArray(userId)) {

            throw new ApiError(

                "Invalid user id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const skills =

            await skillContainer

                .getSkillsByUser

                .execute(

                    userId

                );

        return ApiResponse.success(

            res,

            skills,

            "Skills fetched successfully."

        );

    }

    async getById(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid skill id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const skill =

            await skillContainer

                .getSkill

                .execute(

                    id

                );

        return ApiResponse.success(

            res,

            skill,

            "Skill fetched successfully."

        );

    }

    async update(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid skill id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const skill =

            await skillContainer

                .updateSkill

                .execute(

                    id,

                    req.user!.userId,

                    req.body

                );

        return ApiResponse.success(

            res,

            skill,

            "Skill updated successfully."

        );

    }

    async remove(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid skill id.",

                HttpStatus.BAD_REQUEST

            );

        }

        await skillContainer

            .deleteSkill

            .execute(

                id,

                req.user!.userId

            );

        return ApiResponse.success(

            res,

            null,

            "Skill deleted successfully."

        );

    }

    async verify(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid skill id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const skill =

            await skillContainer

                .verifySkill

                .execute(

                    id,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            skill,

            "Skill verified successfully."

        );

    }

}
