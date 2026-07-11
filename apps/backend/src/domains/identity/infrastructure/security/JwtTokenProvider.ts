import jwt, { SignOptions} from "jsonwebtoken";

import { User } from "../../domain/entities/User.js";

import { ITokenProvider } from "../../application/ports/ITokenProvider.js";

import { env } from "../../../../config/env.js";

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

}