import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { alumniContainer } from "../../application/container/AlumniContainer.js";

export class AlumniController {

    async create(

        req: Request,

        res: Response

    ) {

        const alumni =

            await alumniContainer

                .createAlumni

                .execute(

                    req.body,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            alumni,

            "Alumni created successfully.",

            201

        );

    }

    async invite(

        req: Request,

        res: Response

    ) {

        const invite =

            await alumniContainer

                .inviteAlumni

                .execute(

                    req.body,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            invite,

            "Alumni invited successfully.",

            201

        );

    }

    async list(

        req: Request,

        res: Response

    ) {

        const { status, isVerified, graduationYear } = req.query;

        const alumniList =

            await alumniContainer

                .getAlumniList

                .execute(

                    req.user!.organizationId,

                    {

                        status:
                            typeof status === "string"
                                ? status
                                : undefined,

                        isVerified:
                            typeof isVerified === "string"
                                ? isVerified === "true"
                                : undefined,

                        graduationYear:
                            typeof graduationYear === "string"
                                ? Number(graduationYear)
                                : undefined

                    }

                );

        return ApiResponse.success(

            res,

            alumniList,

            "Alumni fetched successfully."

        );

    }

    async getById(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid alumni id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const alumni =

            await alumniContainer

                .getAlumni

                .execute(

                    id,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            alumni,

            "Alumni fetched successfully."

        );

    }

    async update(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid alumni id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const alumni =

            await alumniContainer

                .updateAlumni

                .execute(

                    id,

                    req.user!.organizationId,

                    req.body

                );

        return ApiResponse.success(

            res,

            alumni,

            "Alumni updated successfully."

        );

    }

    async verify(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid alumni id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const alumni =

            await alumniContainer

                .verifyAlumni

                .execute(

                    id,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            alumni,

            "Alumni verified successfully."

        );

    }

}
