import { Router } from "express";

import { UserPortfolioController } from "../controllers/UserPortfolioController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { UpdateUserPortfolioSchema } from "../validators/UpdateUserPortfolioSchema.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

const router = Router();

const controller = new UserPortfolioController();

/*
 My Portfolio - restricted to STUDENT, the real intended audience.
 Previously open to any authenticated role.

 Declared before "/:userId" to avoid "me" being
 captured as a userId route parameter.
*/

router.get(

    "/me",

    authenticate,

    authorizePermission(

        UserRole.STUDENT

    ),

    asyncHandler(

        controller.me.bind(controller)

    )

);

/*
 Update My Portfolio Settings
*/

router.patch(

    "/me",

    authenticate,

    authorizePermission(

        UserRole.STUDENT

    ),

    validate(

        UpdateUserPortfolioSchema

    ),

    asyncHandler(

        controller.update.bind(controller)

    )

);

/*
 Get Portfolio By User Id
*/

router.get(

    "/:userId",

    authenticate,

    asyncHandler(

        controller.getByUserId.bind(controller)

    )

);

export default router;
