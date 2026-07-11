import { Request, Response } from "express";

import { ApiResponse } from "../../../../shared/core/http/index.js";

import { identityContainer } from "../../application/container/IdentityContainer.js";

export class AuthController {

    async register(

        req: Request,

        res: Response

    ) {

        const user =

            await identityContainer

                .registerUser

                .execute(req.body);

        return ApiResponse.success(

            res,

            user,

            "User registered successfully.",

            201

        );

    }

    async login(

        req: Request,

        res: Response

    ) {

        const result =

            await identityContainer

                .loginUser

                .execute(req.body);

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

        return ApiResponse.success(

            res,

            req.user,

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

}
