import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { codingProfileContainer } from "../../application/container/CodingProfileContainer.js";

export class CodingProfileController {

    async link(req: Request, res: Response) {

        const profile = await codingProfileContainer.linkProfile.execute(

            req.user!.organizationId,
            req.user!.userId,
            req.body

        );

        return ApiResponse.success(res, profile, "Coding profile linked successfully.", 201);

    }

    async sync(req: Request, res: Response) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError("Invalid coding profile id.", HttpStatus.BAD_REQUEST);

        }

        const profile = await codingProfileContainer.syncProfile.execute(id);

        return ApiResponse.success(res, profile, "Coding profile synced successfully.");

    }

    async getMyProfiles(req: Request, res: Response) {

        const profiles = await codingProfileContainer.getMyProfiles.execute(req.user!.userId);

        return ApiResponse.success(res, profiles, "Coding profiles fetched successfully.");

    }

}
