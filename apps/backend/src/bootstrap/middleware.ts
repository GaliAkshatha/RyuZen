import { Express } from "express";

import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { requestLogger } from "../shared/infrastructure/logger/index.js";
import { requestId } from "../shared/core/middleware/requestId.js";

export function bootstrapMiddleware(app: Express): void {
    app.use(helmet());

    app.use(cors());

    app.use(compression());

    app.use(morgan("dev"));

    app.use(cookieParser());

    app.use(express.json());

    app.use(requestLogger);

    app.use(requestId);

    app.use(
        express.urlencoded({
            extended: true,
        })
    );
}