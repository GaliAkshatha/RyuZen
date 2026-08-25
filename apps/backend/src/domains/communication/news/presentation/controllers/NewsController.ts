import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { newsContainer } from "../../application/container/NewsContainer.js";

export class NewsController {

    async create(

        req: Request,

        res: Response

    ) {

        const news =

            await newsContainer

                .createNews

                .execute(

                    req.body,

                    req.user!.organizationId,

                    req.user!.userId,

                    req.user!.role

                );

        return ApiResponse.success(

            res,

            news,

            "News posted successfully.",

            201

        );

    }

    async list(

        req: Request,

        res: Response

    ) {

        const news =

            await newsContainer

                .getOrgNews

                .execute(

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            news,

            "News fetched successfully."

        );

    }

    async remove(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid news id.",

                HttpStatus.BAD_REQUEST

            );

        }

        await newsContainer

            .deleteNews

            .execute(

                id,

                req.user!.organizationId,

                req.user!.userId,

                req.user!.role

            );

        return ApiResponse.success(

            res,

            null,

            "News post removed."

        );

    }

}
