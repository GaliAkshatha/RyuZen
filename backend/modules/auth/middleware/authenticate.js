import asyncHandler from "../../../shared/middleware/asyncHandler.js";

import {

    UnauthorizedError,

} from "../../../shared/errors/index.js";

import {

    verifyAccessToken,

} from "../utils/jwt.js";

import userService from "../../users/services/userService.js";

const authenticate = asyncHandler(

    async (

        req,

        res,

        next

    ) => {

        const authorization =

            req.get("Authorization");

        if (!authorization) {

            throw new UnauthorizedError(

                "Authentication required."

            );

        }

        const [

            type,

            token,

        ] = authorization.split(" ");

        if (

            type !== "Bearer" ||

            !token

        ) {

            throw new UnauthorizedError(

                "Invalid authentication token."

            );

        }

        const payload =

            verifyAccessToken(

                token

            );

        const user =

            await userService.getUserById(

                payload.id

            );

        if (!user) {

            throw new UnauthorizedError(

                "User not found."

            );

        }

        req.user = {

            userId: user._id,

            organization: user.organization,

            role: user.role,

            name: user.name,

            email: user.email,

        };

        next();

    }

);

export default authenticate;