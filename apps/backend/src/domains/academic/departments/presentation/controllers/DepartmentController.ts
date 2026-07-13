import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { departmentContainer } from "../../application/container/DepartmentContainer.js";

export class DepartmentController {

    async create(

        req: Request,

        res: Response

    ) {

        const department =

            await departmentContainer

                .createDepartment

                .execute(

                    req.body,
                    req.user!

                );

        return ApiResponse.success(

            res,

            department,

            "Department created successfully.",

            201

        );

    }

    async list(

        req: Request,

        res: Response

    ) {

        const departments =

            await departmentContainer

                .getDepartments

                .execute(

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            departments,

            "Departments fetched successfully."

        );

    }

    async getById(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid department id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const department =

            await departmentContainer

                .getDepartment

                .execute(

                    id,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            department,

            "Department fetched successfully."

        );

    }

    async update(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid department id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const department =

            await departmentContainer

                .updateDepartment

                .execute(

                    id,

                    req.user!.organizationId,

                    req.body

                );

        return ApiResponse.success(

            res,

            department,

            "Department updated successfully."

        );

    }

    async remove(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid department id.",

                HttpStatus.BAD_REQUEST

            );

        }

        await departmentContainer

            .deleteDepartment

            .execute(

                id,

                req.user!.organizationId

            );

        return ApiResponse.success(

            res,

            null,

            "Department deleted successfully."

        );

    }

    async assignHeadOfDepartment(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid department id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const department =

            await departmentContainer

                .assignHeadOfDepartment

                .execute(

                    id,

                    req.user!.organizationId,

                    req.body

                );

        return ApiResponse.success(

            res,

            department,

            "Head of department assigned successfully."

        );

    }

}