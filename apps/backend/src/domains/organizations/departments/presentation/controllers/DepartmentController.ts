import { Request, Response } from "express";

import {

    ApiResponse,
    ApiError,
    HttpStatus

} from "../../../../../shared/core/http/index.js";

import {

    departmentContainer

} from "../../application/container/DepartmentContainer.js";

export class DepartmentController {

    async create(

        req: Request,

        res: Response

    ) {

        if (!req.user) {

            throw new ApiError(

                "Authentication required.",

                HttpStatus.UNAUTHORIZED

            );

        }

        const created =

            await departmentContainer

                .createDepartment

                .execute({

                    organizationId:

                        req.user.organizationId,

                    name:

                        req.body.name,

                    code:

                        req.body.code,

                    description:

                        req.body.description

                });

        return ApiResponse.success(

            res,

            created,

            "Department created successfully.",

            HttpStatus.CREATED

        );

    }

    async getAll(

        req: Request,

        res: Response

    ) {

        if (!req.user) {

            throw new ApiError(

                "Authentication required.",

                HttpStatus.UNAUTHORIZED

            );

        }

        const departments =

            await departmentContainer

                .getDepartments

                .execute(

                    req.user.organizationId

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

                .execute(id);

        return ApiResponse.success(

            res,

            department,

            "Department fetched successfully."

        );

    }

}