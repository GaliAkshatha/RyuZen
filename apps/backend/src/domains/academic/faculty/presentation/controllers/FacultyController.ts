import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { facultyContainer } from "../../application/container/FacultyContainer.js";

export class FacultyController {

    async create(

        req: Request,

        res: Response

    ) {

        const faculty =

            await facultyContainer

                .createFaculty

                .execute(

                    req.body,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            faculty,

            "Faculty created successfully.",

            201

        );

    }

    async list(

        req: Request,

        res: Response

    ) {

        const { departmentId } = req.query;

        const faculties =

            await facultyContainer

                .getFaculties

                .execute(

                    req.user!.organizationId,

                    {

                        departmentId:
                            typeof departmentId === "string"
                                ? departmentId
                                : undefined

                    }

                );

        return ApiResponse.success(

            res,

            faculties,

            "Faculty members fetched successfully."

        );

    }

    async getById(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid faculty id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const faculty =

            await facultyContainer

                .getFaculty

                .execute(

                    id,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            faculty,

            "Faculty fetched successfully."

        );

    }

    async getMe(

        req: Request,

        res: Response

    ) {

        const faculty =

            await facultyContainer

                .getMyFacultyProfile

                .execute(

                    req.user!.userId,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            faculty,

            "Faculty profile fetched successfully."

        );

    }

    async update(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid faculty id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const faculty =

            await facultyContainer

                .updateFaculty

                .execute(

                    id,

                    req.user!.organizationId,

                    req.body

                );

        return ApiResponse.success(

            res,

            faculty,

            "Faculty updated successfully."

        );

    }

    async assignDepartment(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid faculty id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const faculty =

            await facultyContainer

                .assignFacultyDepartment

                .execute(

                    id,

                    req.user!.organizationId,

                    req.body

                );

        return ApiResponse.success(

            res,

            faculty,

            "Department assigned successfully."

        );

    }

    async deactivate(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid faculty id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const faculty =

            await facultyContainer

                .deactivateFaculty

                .execute(

                    id,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            faculty,

            "Faculty deactivated successfully."

        );

    }

}
