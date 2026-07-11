import jwt, { SignOptions } from "jsonwebtoken";

import { env } from "../../config/index.js";

import { UserRole } from "../../domains/identity/domain/constants/UserRole.js";

export interface JwtPayload {

    userId: string;

    organizationId: string;

    role: UserRole;

}

export class JwtService {

    static generateToken(payload: JwtPayload): string {

        const options: SignOptions = {

            expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"]

        };

        return jwt.sign(
            payload,
            env.JWT_SECRET,
                options
        );

    }

    static verifyToken(token: string): JwtPayload {

        return jwt.verify(
            token,
            env.JWT_SECRET
        ) as JwtPayload;

    }

}