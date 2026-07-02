import jwt from "jsonwebtoken";

import env from "../../../shared/config/env.js";

/**
 * Generates an access token.
 *
 * @param {Object} payload
 * @returns {string}
 */
export function generateAccessToken(

    payload

) {

    return jwt.sign(

        payload,

        env.JWT_SECRET,

        {

            expiresIn:

                env.JWT_EXPIRES_IN,

        }

    );

}

/**
 * Verifies an access token.
 *
 * @param {string} token
 * @returns {Object}
 */
export function verifyAccessToken(

    token

) {

    return jwt.verify(

        token,

        env.JWT_SECRET

    );

}