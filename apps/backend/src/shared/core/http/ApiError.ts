import { HttpStatus } from "./HttpStatus.js";

export class ApiError extends Error {
    public readonly statusCode: number;

    constructor(
        message: string,
        statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR
    ) {
        super(message);

        this.name = this.constructor.name;

        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}