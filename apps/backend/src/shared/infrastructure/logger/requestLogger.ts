import { Request, Response, NextFunction } from "express";

import { Logger } from "./logger.js";

export function requestLogger(
    req: Request,
    res: Response,
    next: NextFunction
): void {

    Logger.info(
        `[${req.requestId}] ${req.method} ${req.originalUrl}`
    );

    next();

}