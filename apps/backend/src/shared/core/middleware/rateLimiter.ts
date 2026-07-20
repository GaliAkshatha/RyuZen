import rateLimit from "express-rate-limit";

import { ApiResponse } from "../http/ApiResponse.js";
import { HttpStatus } from "../http/HttpStatus.js";

import { env } from "../../../config/env.js";

/*
 Applied globally (see bootstrap/middleware.ts) to every request,
 keyed by IP address, as general denial-of-service protection.
*/
export const globalRateLimiter = rateLimit({

    windowMs:
        env.RATE_LIMIT_WINDOW_MS,

    max:
        env.RATE_LIMIT_MAX,

    standardHeaders:
        true,

    legacyHeaders:
        false,

    handler: (

        req,

        res

    ) => {

        ApiResponse.error(

            res,

            "Too many requests. Please try again later.",

            HttpStatus.TOO_MANY_REQUESTS

        );

    }

});

/*
 A stricter limiter for authentication endpoints (login, register,
 forgot-password, reset-password) to reduce the impact of
 credential-stuffing and brute-force attempts.
*/
export const authRateLimiter = rateLimit({

    windowMs:
        env.RATE_LIMIT_WINDOW_MS,

    max:
        env.AUTH_RATE_LIMIT_MAX,

    standardHeaders:
        true,

    legacyHeaders:
        false,

    handler: (

        req,

        res

    ) => {

        ApiResponse.error(

            res,

            "Too many authentication attempts. Please try again later.",

            HttpStatus.TOO_MANY_REQUESTS

        );

    }

});
