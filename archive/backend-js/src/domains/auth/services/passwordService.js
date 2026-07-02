import {

    hashPassword,

    comparePassword,

} from "../utils/password.js";

import {

    UnauthorizedError,

} from "../../../shared/errors/index.js";

class PasswordService {

    /**
     * Hash a plain text password.
     *
     * @param {string} password
     * @returns {Promise<string>}
     */
    async hash(

        password

    ) {

        return await hashPassword(

            password

        );

    }

    /**
     * Verify a password.
     *
     * @param {string} password
     * @param {string} hashedPassword
     * @returns {Promise<void>}
     */
    async verify(

        password,

        hashedPassword

    ) {

        const valid =

            await verifyPassword(

                password,

                hashedPassword

            );

        if (

            !valid

        ) {

            throw new UnauthorizedError(

                "Invalid email or password."

            );

        }

    }

}

export default new PasswordService();