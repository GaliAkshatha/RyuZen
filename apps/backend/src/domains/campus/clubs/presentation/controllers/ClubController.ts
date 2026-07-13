import { Request, Response } from "express";

import { ApiResponse } from "../../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../../shared/core/http/HttpStatus.js";

import { clubContainer } from "../../application/container/ClubContainer.js";

export class ClubController {

    async create(

        req: Request,

        res: Response

    ) {

        const club =

            await clubContainer

                .createClub

                .execute(

                    req.body,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            club,

            "Club created successfully.",

            201

        );

    }

    async list(

        req: Request,

        res: Response

    ) {

        const clubs =

            await clubContainer

                .getClubs

                .execute(

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            clubs,

            "Clubs fetched successfully."

        );

    }

    async getById(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid club id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const club =

            await clubContainer

                .getClub

                .execute(

                    id,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            club,

            "Club fetched successfully."

        );

    }

    async update(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid club id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const club =

            await clubContainer

                .updateClub

                .execute(

                    id,

                    req.user!.organizationId,

                    req.body

                );

        return ApiResponse.success(

            res,

            club,

            "Club updated successfully."

        );

    }

    async remove(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid club id.",

                HttpStatus.BAD_REQUEST

            );

        }

        await clubContainer

            .deleteClub

            .execute(

                id,

                req.user!.organizationId

            );

        return ApiResponse.success(

            res,

            null,

            "Club deleted successfully."

        );

    }

    async assignAdvisor(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid club id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const club =

            await clubContainer

                .assignAdvisor

                .execute(

                    id,

                    req.user!.organizationId,

                    req.body

                );

        return ApiResponse.success(

            res,

            club,

            "Advisor assigned successfully."

        );

    }

    async listMembers(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid club id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const members =

            await clubContainer

                .getClubMembers

                .execute(

                    id,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            members,

            "Club members fetched successfully."

        );

    }

    async addMember(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid club id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const member =

            await clubContainer

                .addClubMember

                .execute(

                    id,

                    req.user!.organizationId,

                    req.body

                );

        return ApiResponse.success(

            res,

            member,

            "Member added successfully.",

            201

        );

    }

    async removeMember(

        req: Request,

        res: Response

    ) {

        const { id, memberId } = req.params;

        if (

            !id || Array.isArray(id) ||
            !memberId || Array.isArray(memberId)

        ) {

            throw new ApiError(

                "Invalid club or member id.",

                HttpStatus.BAD_REQUEST

            );

        }

        await clubContainer

            .removeClubMember

            .execute(

                id,

                req.user!.organizationId,

                memberId

            );

        return ApiResponse.success(

            res,

            null,

            "Member removed successfully."

        );

    }

}
