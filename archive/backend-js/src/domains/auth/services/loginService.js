import userService from "../../users/services/userService.js";

import passwordService from "./passwordService.js";

import tokenService from "./tokenService.js";

import {

    UnauthorizedError,

    ForbiddenError,

} from "../../../shared/errors/index.js";

import {

    USER_STATUS,

} from "../../users/constants/userConstants.js";

class LoginService {

    async login(

        credentials

    ) {

        const user =

            await this.getUser(

                credentials.email

            );

        this.ensureAccountIsActive(

            user

        );

        await passwordService.verifyPassword(

            credentials.password,

            user.auth.password

        );

        await this.updateLastLogin(

            user

        );

        const tokens =

            await tokenService.generateTokens(

                user

            );

        return this.buildLoginResponse(

            user,

            tokens

        );

    }

    async getUser(

        email

    ) {

        const user =

            await userService.getUserByEmail(

                email,

                {

                    includePassword: true,

                    populateOrganization: true,

                }

            );

        if (

            !user

        ) {

            throw new UnauthorizedError(

                "Invalid email or password."

            );

        }

        return user;

    }

    ensureAccountIsActive(

        user

    ) {

        if (

            user.status !==

            USER_STATUS.ACTIVE

        ) {

            throw new ForbiddenError(

                "Your account is not active."

            );

        }

    }

    async updateLastLogin(

        user

    ) {

        user.auth.lastLogin =

            new Date();

        await user.save();

    }

    buildLoginResponse(

        user,

        tokens

    ) {

        return {

            accessToken:

                tokens.accessToken,

            user: {

                id:

                    user._id,

                name:

                    user.name,

                email:

                    user.email,

                role:

                    user.role,

                organization:

                    user.organization,

            },

        };

    }

}

export default new LoginService();