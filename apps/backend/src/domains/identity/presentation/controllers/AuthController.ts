import { Request, Response } from "express";

import { ApiResponse } from "../../../../shared/core/http/index.js";
import { ApiError } from "../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../shared/core/http/HttpStatus.js";

import { identityContainer } from "../../application/container/IdentityContainer.js";

export class AuthController {

    async login(

        req: Request,

        res: Response

    ) {

        const result =

            await identityContainer

                .loginUser

                .execute(

                    req.body,

                    req.ip ?? "Unknown",

                    req.headers["user-agent"] ?? "Unknown"

                );

        return ApiResponse.success(

            res,

            result,

            "Login successful."

        );

    }

    async profile(

        req: Request,

        res: Response

    ) {

        const profile =

            await identityContainer

                .getProfile

                .execute(

                    req.user!.userId

                );

        return ApiResponse.success(

            res,

            profile,

            "Profile fetched successfully."

        );

    }

    async updateProfile(

        req: Request,

        res: Response

    ) {

        const profile =

            await identityContainer

                .updateProfile

                .execute(

                    req.user!.userId,

                    req.body

                );

        return ApiResponse.success(

            res,

            profile,

            "Profile updated successfully."

        );

    }

    async changePassword(

        req: Request,

        res: Response

    ) {

        await identityContainer

            .changePassword

            .execute(

                req.user!.userId,

                req.body

            );

        return ApiResponse.success(

            res,

            null,

            "Password changed successfully."

        );

    }

    async forgotPassword(

        req: Request,

        res: Response

    ) {

        const result =

            await identityContainer

                .forgotPassword

                .execute(

                    req.body

                );

        return ApiResponse.success(

            res,

            result,

            "If the account exists, password reset instructions have been generated."

        );

    }

    async resetPassword(

        req: Request,

        res: Response

    ) {

        await identityContainer

            .resetPassword

            .execute(

                req.body

            );

        return ApiResponse.success(

            res,

            null,

            "Password reset successfully."

        );

    }

    async refresh(

        req: Request,

        res: Response

    ) {

        const result =

            await identityContainer

                .refreshToken

                .execute(

                    req.body

                );

        return ApiResponse.success(

            res,

            result,

            "Token refreshed successfully."

        );

    }

    async verifyInvitation(

        req: Request,

        res: Response

    ) {

        const result =

            await identityContainer

                .verifyInvitation

                .execute(

                    req.body

                );

        return ApiResponse.success(

            res,

            result,

            "Invitation verified successfully."

        );

    }

    async acceptInvitation(

        req: Request,

        res: Response

    ) {

        await identityContainer

            .acceptInvitation

            .execute(

                req.body

            );

        return ApiResponse.success(

            res,

            {},

            "Account activated successfully. You can now sign in."

        );

    }

    async logout(

        req: Request,

        res: Response

    ) {

        if (req.user!.sessionId) {

            await identityContainer

                .logout

                .execute(

                    req.user!.sessionId

                );

        }

        return ApiResponse.success(

            res,

            {},

            "Logged out successfully."

        );

    }

    async logoutAllDevices(

        req: Request,

        res: Response

    ) {

        await identityContainer

            .logoutAllDevices

            .execute(

                req.user!.userId

            );

        return ApiResponse.success(

            res,

            {},

            "Logged out of all devices successfully."

        );

    }

    async getSessions(

        req: Request,

        res: Response

    ) {

        const sessions =

            await identityContainer

                .getMySessions

                .execute(

                    req.user!.userId,

                    req.user!.sessionId ?? ""

                );

        return ApiResponse.success(

            res,

            sessions,

            "Sessions fetched successfully."

        );

    }

    async revokeSession(

        req: Request,

        res: Response

    ) {

        const { id } = req.params;

        if (!id || Array.isArray(id)) {

            throw new ApiError(

                "Invalid session id.",

                HttpStatus.BAD_REQUEST

            );

        }

        await identityContainer

            .revokeSession

            .execute(

                id,

                req.user!.userId

            );

        return ApiResponse.success(

            res,

            {},

            "Session revoked successfully."

        );

    }

}