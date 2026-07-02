import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

import { ApiResponse } from "../http/ApiResponse.js";
import { HttpStatus } from "../http/HttpStatus.js";

export const validate =
    (schema: ZodSchema) =>
    (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const result = schema.safeParse(req.body);

        if (!result.success) {

            return ApiResponse.error(
                res,
                "Validation failed",
                HttpStatus.BAD_REQUEST,
                result.error.flatten()
            );

        }

        req.body = result.data;

        next();

    };