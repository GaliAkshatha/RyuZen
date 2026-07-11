import { NextFunction, Request, Response } from "express";

import { ApiError } from "../http/ApiError.js";
import { HttpStatus } from "../http/HttpStatus.js";

import { UserRole } from "../../../domains/identity/domain/constants/UserRole.js";

export function authorizePermission(...roles: UserRole[]) {

    return (

        req: Request,

        _: Response,

        next: NextFunction

    ): void => {

        if (!req.user) {

            throw new ApiError(

                "Authentication required.",

                HttpStatus.UNAUTHORIZED

            );

        }

        if (!roles.includes(req.user.role)) {

            throw new ApiError(

                "Access denied.",

                HttpStatus.FORBIDDEN

            );

        }

        next();

    };

}