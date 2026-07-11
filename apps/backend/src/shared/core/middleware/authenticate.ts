import { NextFunction, Request, Response } from "express";

import { JwtService } from "../../security/index.js";

import { ApiError } from "../http/ApiError.js";
import { HttpStatus } from "../http/HttpStatus.js";

import { AuthenticatedUser } from "../../types/AuthenticatedUser.js";

import { UserModel } from "../../../domains/identity/infrastructure/persistence/UserModel.js";

declare global {

    namespace Express {

        interface Request {

            user?: AuthenticatedUser;

        }

    }

}

export async function authenticate(

    req: Request,

    _: Response,

    next: NextFunction

): Promise<void> {

    try {

        const authorization = req.header("Authorization");

        if (!authorization) {

            throw new ApiError(

                "Authentication required.",

                HttpStatus.UNAUTHORIZED

            );

        }

        const [, token] = authorization.split(" ");

        if (!token) {

            throw new ApiError(

                "Invalid token.",

                HttpStatus.UNAUTHORIZED

            );

        }

        const payload = JwtService.verifyToken(token);

        const user = await UserModel.findById(payload.userId);

        if (!user) {

            throw new ApiError(

                "User not found.",

                HttpStatus.UNAUTHORIZED

            );

        }

        req.user = {

            userId: user.id,

            organizationId: user.organizationId.toString(),

            role: user.role,

            permissions: user.permissions

        };

        next();

    }

    catch (error) {

        next(error);

    }

}