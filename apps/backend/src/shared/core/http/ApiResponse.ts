import { Response } from "express";

import { HttpStatus } from "./HttpStatus.js";

export class ApiResponse {
    static success<T>(
        res: Response,
        data: T,
        message = "Request successful",
        statusCode: number = HttpStatus.OK
    ): Response {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            timestamp: new Date().toISOString(),
        });
    }

    static error(
        res: Response,
        message = "Something went wrong",
        statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
        errors: unknown = null
    ): Response {
        return res.status(statusCode).json({
            success: false,
            message,
            errors,
            timestamp: new Date().toISOString(),
        });
    }
}