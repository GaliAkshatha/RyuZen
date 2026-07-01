import {

    generateAccessToken,

    verifyAccessToken,

} from "../utils/jwt.js";

class TokenService {

    /**
     * Generate authentication tokens.
     *
     * @param {Object} user
     * @returns {Promise<Object>}
     */
    async generateTokens(user) {

        const payload = {

            id: user._id,

            organization: user.organization,

            role: user.role,

        };

        const accessToken =

            generateAccessToken(

                payload

            );

        return {

            accessToken,

        };

    }

    /**
     * Verify an access token.
     *
     * @param {string} token
     * @returns {Object}
     */
    verifyToken(token) {

        return verifyAccessToken(

            token

        );

    }

}

export default new TokenService();