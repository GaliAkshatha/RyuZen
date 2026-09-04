import { Express } from "express";

import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { requestLogger } from "../shared/infrastructure/logger/index.js";
import { requestId } from "../shared/core/middleware/requestId.js";
import { globalRateLimiter } from "../shared/core/middleware/rateLimiter.js";
import { env } from "../config/env.js";

export function bootstrapMiddleware(app: Express): void {
    app.use(helmet());

    // Restricted to the real configured frontend origin rather than a
    // wildcard - matters once frontend (Vercel) and backend (Render)
    // genuinely live on different domains. FRONTEND_URL already
    // existed as a real config var (previously only used for email
    // links); reused here rather than inventing a second variable for
    // the same real value. Comma-separated so both a local dev origin
    // and the real deployed frontend can be allowed at once if
    // needed - e.g. FRONTEND_URL="http://localhost:5173,https://ryuzen.vercel.app".
    const allowedOrigins = env.FRONTEND_URL.split(",").map((origin) => origin.trim());

    app.use(
        cors({
            origin: allowedOrigins,
        })
    );

    app.use(compression());

    app.use(morgan("dev"));

    app.use(cookieParser());

    app.use(express.json());

    app.use(requestLogger);

    app.use(requestId);

    app.use(globalRateLimiter);

    app.use(
        express.urlencoded({
            extended: true,
        })
    );
}