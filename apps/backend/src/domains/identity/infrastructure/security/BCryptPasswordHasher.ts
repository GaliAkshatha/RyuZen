import bcrypt from "bcryptjs";

import { IPasswordHasher } from "../../application/ports/IPasswordHasher.js";

export class BCryptPasswordHasher
implements IPasswordHasher {

    private readonly SALT_ROUNDS = 12;

    async hash(password: string): Promise<string> {

        return bcrypt.hash(
            password,
            this.SALT_ROUNDS
        );

    }

    async compare(

        password: string,

        hash: string

    ): Promise<boolean> {

        return bcrypt.compare(

            password,

            hash

        );

    }

}