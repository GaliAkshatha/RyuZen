import { Request, Response } from "express";

import {
    ApiResponse,
    ApiError,
    HttpStatus
} from "../../../../../shared/core/http/index.js";

import { facultyContainer } from "../../application/container/FacultyContainer.js";

export class FacultyController {

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

        const faculty =

            await facultyContainer

                .createFaculty

                .execute({

                    organizationId: req.user.organizationId,

                    departmentId: req.body.departmentId,

                    name: req.body.name,

                    email: req.body.email,

                    password: req.body.password,

                    employeeId: req.body.employeeId,

                    designation: req.body.designation,

                    joiningDate: new Date(req.body.joiningDate)

                });

        return ApiResponse.success(

            res,

            faculty,

            "Faculty created successfully.",

            HttpStatus.CREATED

        );

    }

}