import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { studentContainer } from "../../application/container/StudentContainer.js";

export class StudentController {

    async create(

        req: Request,

        res: Response

    ) {

        const student =

            await studentContainer

                .createStudent

                .execute(

                    req.body,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            student,

            "Student created successfully.",

            201

        );

    }

    async list(

        req: Request,

        res: Response

    ) {

        const { departmentId, batch, semester } = req.query;

        const students =

            await studentContainer

                .getStudents

                .execute(

                    req.user!.organizationId,

                    {

                        departmentId:
                            typeof departmentId === "string"
                                ? departmentId
                                : undefined,

                        batch:
                            typeof batch === "string"
                                ? batch
                                : undefined,

                        semester:
                            typeof semester === "string"
                                ? Number(semester)
                                : undefined

                    }

                );

        return ApiResponse.success(

            res,

            students,

            "Students fetched successfully."

        );

    }

    async getById(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid student id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const student =

            await studentContainer

                .getStudent

                .execute(

                    id,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            student,

            "Student fetched successfully."

        );

    }

    async update(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid student id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const student =

            await studentContainer

                .updateStudent

                .execute(

                    id,

                    req.user!.organizationId,

                    req.body

                );

        return ApiResponse.success(

            res,

            student,

            "Student updated successfully."

        );

    }

    async assignMentor(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid student id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const student =

            await studentContainer

                .assignMentor

                .execute(

                    id,

                    req.user!.organizationId,

                    req.user!.userId,

                    req.body

                );

        return ApiResponse.success(

            res,

            student,

            "Mentor assigned successfully."

        );

    }

    async promoteSemester(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid student id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const student =

            await studentContainer

                .promoteSemester

                .execute(

                    id,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            student,

            "Student promoted to the next semester successfully."

        );

    }

    async archive(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid student id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const student =

            await studentContainer

                .archiveStudent

                .execute(

                    id,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            student,

            "Student archived successfully."

        );

    }

    async bulkImport(

        req: Request,

        res: Response

    ) {

        if (!req.file) {

            throw new ApiError(

                "No file was uploaded. Attach a CSV file as 'file'.",

                HttpStatus.BAD_REQUEST

            );

        }

        const report =

            await studentContainer

                .bulkImportStudents

                .execute(

                    req.user!.organizationId,

                    req.user!.userId,

                    req.user!.role,

                    req.file.buffer

                );

        return ApiResponse.success(

            res,

            report,

            `Import complete: ${report.successfulImports.length} of ${report.totalRows} rows imported successfully.`

        );

    }

}
