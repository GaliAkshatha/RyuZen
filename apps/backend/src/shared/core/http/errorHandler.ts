import { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";

import { ApiError } from "./ApiError.js";
import { ApiResponse } from "./ApiResponse.js";
import { HttpStatus } from "./HttpStatus.js";

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): Response => {

    console.error(error);

    if (error instanceof ApiError) {

        return ApiResponse.error(
            res,
            error.message,
            error.statusCode
        );

    }

    if (error instanceof MulterError) {

        return ApiResponse.error(
            res,
            error.message,
            HttpStatus.BAD_REQUEST
        );

    }

    return ApiResponse.error(
        res,
        "Internal Server Error",
        HttpStatus.INTERNAL_SERVER_ERROR
    );

};