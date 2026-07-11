import jwt, { SignOptions} from "jsonwebtoken";

import { User } from "../../domain/entities/User.js";

import { ITokenProvider, RefreshTokenPayload } from "../../application/ports/ITokenProvider.js";

import { env } from "../../../../config/env.js";

import { ApiError } from "../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../shared/core/http/HttpStatus.js";

export class JwtTokenProvider
implements ITokenProvider {

    async generateAccessToken(
        user: User
    ): Promise<string> {

        const options: SignOptions = {
        
                    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
        
                };

        return jwt.sign(

            {

                userId: user.id,

                organizationId: user.organizationId,

                role: user.role

            },

            env.JWT_SECRET,

            options

        );

    }

    async generateRefreshToken(
        user: User
    ): Promise<string> {

        const options: SignOptions = {

            expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as SignOptions["expiresIn"]

        };

        return jwt.sign(

            {

                userId: user.id,

                type: "refresh"

            },

            env.JWT_SECRET,

            options

        );

    }

    async verifyRefreshToken(
        token: string
    ): Promise<RefreshTokenPayload> {

        let payload: string | jwt.JwtPayload;

        try {

            payload = jwt.verify(
                token,
                env.JWT_SECRET
            );

        } catch {

            throw new ApiError(

                "Invalid or expired refresh token.",

                HttpStatus.UNAUTHORIZED

            );

        }

        if (

            typeof payload === "string" ||
            payload.type !== "refresh" ||
            typeof payload.userId !== "string"

        ) {

            throw new ApiError(

                "Invalid refresh token.",

                HttpStatus.UNAUTHORIZED

            );

        }

        return {

            userId: payload.userId

        };

    }

}