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

}