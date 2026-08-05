import { Request, Response } from "express";

import { ApiResponse } from "../../../../shared/core/http/ApiResponse.js";
import { ApiError } from "../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../shared/core/http/HttpStatus.js";

import { identityContainer } from "../../application/container/IdentityContainer.js";

export class InvitationController {

    async invite(

        req: Request,

        res: Response

    ) {

        const invitation =

            await identityContainer

                .inviteUser

                .execute(

                    req.user!.organizationId,

                    req.user!.userId,

                    req.user!.role,

                    req.body

                );

        return ApiResponse.success(

            res,

            invitation,

            "Invitation sent successfully.",

            201

        );

    }

    async list(

        req: Request,

        res: Response

    ) {

        const invitations =

            await identityContainer

                .getOrganizationInvitations

                .execute(

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            invitations,

            "Invitations fetched successfully."

        );

    }

    async resend(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid invitation id.",

                HttpStatus.BAD_REQUEST

            );

        }

        const invitation =

            await identityContainer

                .resendInvitation

                .execute(

                    id,

                    req.user!.organizationId

                );

        return ApiResponse.success(

            res,

            invitation,

            "Invitation resent successfully."

        );

    }

    async revoke(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid invitation id.",

                HttpStatus.BAD_REQUEST

            );

        }

        await identityContainer

            .revokeInvitation

            .execute(

                id,

                req.user!.organizationId

            );

        return ApiResponse.success(

            res,

            {},

            "Invitation revoked successfully."

        );

    }

}
