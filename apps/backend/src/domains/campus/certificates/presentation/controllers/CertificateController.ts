import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { certificateContainer } from "../../application/container/CertificateContainer.js";

export class CertificateController {

    async issue(

        req: Request,

        res: Response

    ) {

        const certificate =

            await certificateContainer

                .issueCertificate

                .execute(

                    req.user!.organizationId,

                    req.body,

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            certificate,

            "Certificate issued successfully.",

            201

        );

    }

    async me(

        req: Request,

        res: Response

    ) {

        const certificates =

            await certificateContainer

                .getMyCertificates

                .execute(

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            certificates,

            "Your certificates fetched successfully."

        );

    }

    async listForStudent(

        req: Request,

        res: Response

    ) {

        const { studentId } = req.params;

        if (!studentId || Array.isArray(studentId)) {

            throw new ApiError(

                "Invalid student id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const certificates =

            await certificateContainer

                .getStudentCertificates

                .execute(

                    studentId,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            certificates,

            "Student certificates fetched successfully."

        );

    }

    async getById(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid certificate id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const certificate =

            await certificateContainer

                .getCertificate

                .execute(

                    id,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            certificate,

            "Certificate fetched successfully."

        );

    }

}
