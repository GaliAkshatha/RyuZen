import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { certificationContainer } from "../../application/container/CertificationContainer.js";
import { createFileStorageService } from "../../../../../shared/infrastructure/storage/FileStorageFactory.js";

export class CertificationController {

    async create(

        req: Request,

        res: Response

    ) {

        const certification =

            await certificationContainer

                .createCertification

                .execute(

                    req.body,

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            certification,

            "Certification created successfully.",

            201

        );

    }

    async list(

        req: Request,

        res: Response

    ) {

        const certifications =

            await certificationContainer

                .getCertificationsByUser

                .execute(

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            certifications,

            "Certifications fetched successfully."

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

        const certifications =

            await certificationContainer

                .getCertificationsByUser

                .execute(

                    userId

                );

        return ApiResponse.success(

            res,

            certifications,

            "Certifications fetched successfully."

        );

    }

    async getById(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid certification id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const certification =

            await certificationContainer

                .getCertification

                .execute(

                    id

                );

        return ApiResponse.success(

            res,

            certification,

            "Certification fetched successfully."

        );

    }

    async update(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid certification id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const certification =

            await certificationContainer

                .updateCertification

                .execute(

                    id,

                    req.user!.userId,

                    req.body

                );

        return ApiResponse.success(

            res,

            certification,

            "Certification updated successfully."

        );

    }

    async remove(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid certification id.",

                HttpStatus.BAD_REQUEST

            );

        }

        await certificationContainer

            .deleteCertification

            .execute(

                id,

                req.user!.userId

            );

        return ApiResponse.success(

            res,

            null,

            "Certification deleted successfully."

        );

    }

    async verify(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid certification id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const certification =

            await certificationContainer

                .verifyCertification

                .execute(

                    id,

                    req.user!.organizationId,

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            certification,

            "Certification verified successfully."

        );

    }

    async uploadFile(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid certification id.",

                HttpStatus.BAD_REQUEST

            );

        }

        if (!req.file) {

            throw new ApiError(

                "No file was uploaded.",

                HttpStatus.BAD_REQUEST

            );

        }

        const fileUrl =

            await createFileStorageService()

                .upload(

                    req.file.buffer,

                    req.file.originalname,

                    req.file.mimetype

                );

        const certification =

            await certificationContainer

                .uploadCertificationFile

                .execute(

                    id,

                    req.user!.userId,

                    fileUrl

                );

        return ApiResponse.success(

            res,

            certification,

            "File uploaded successfully."

        );

    }

}
