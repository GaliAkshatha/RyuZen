import { NextFunction, Request, Response } from "express";

import { ApiError } from "../http/ApiError.js";
import { HttpStatus } from "../http/HttpStatus.js";

export function notFound(

    req: Request,

    _: Response,

    next: NextFunction

): void {

    next(

        new ApiError(

            `Route ${req.originalUrl} not found.`,

            HttpStatus.NOT_FOUND

        )

    );

}