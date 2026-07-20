import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { companyContainer } from "../../application/container/CompanyContainer.js";

export class CompanyController {

    async create(

        req: Request,

        res: Response

    ) {

        const company =

            await companyContainer

                .createCompany

                .execute(

                    req.body,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            company,

            "Company created successfully.",

            201

        );

    }

    async list(

        req: Request,

        res: Response

    ) {

        const companies =

            await companyContainer

                .getCompanies

                .execute(

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            companies,

            "Companies fetched successfully."

        );

    }

    async getById(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid company id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const company =

            await companyContainer

                .getCompany

                .execute(

                    id,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            company,

            "Company fetched successfully."

        );

    }

    async update(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid company id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const company =

            await companyContainer

                .updateCompany

                .execute(

                    id,

                    req.user!.organizationId,

                    req.body

                );

        return ApiResponse.success(

            res,

            company,

            "Company updated successfully."

        );

    }

    async updateStatus(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid company id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const company =

            await companyContainer

                .updateCompanyStatus

                .execute(

                    id,

                    req.user!.organizationId,

                    req.body

                );

        return ApiResponse.success(

            res,

            company,

            "Company status updated successfully."

        );

    }

    async remove(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid company id.",

                HttpStatus.BAD_REQUEST

            );

        }

        await companyContainer

            .deleteCompany

            .execute(

                id,

                req.user!.organizationId

            );

        return ApiResponse.success(

            res,

            null,

            "Company deleted successfully."

        );

    }

}
