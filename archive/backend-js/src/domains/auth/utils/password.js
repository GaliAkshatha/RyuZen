import bcrypt from "bcrypt";
import env from "../../../shared/config/env";

const SALT_ROUNDS = 12;

/**
 * Hash a plain-text password.
 *
 * @param {string} password
 * @returns {Promise<string>}
 */
export async function hashPassword(password) {

    return bcrypt.hash(

        password,

        env.BCRYPT_SALT_ROUNDS

    );

}

/**
 * Compare a plain-text password with a hash.
 *
 * @param {string} password
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 */
export async function comparePassword(

    password,

    hashedPassword

) {

    return bcrypt.compare(

        password,

        hashedPassword

    );

}