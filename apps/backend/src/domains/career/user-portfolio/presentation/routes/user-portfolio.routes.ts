import { Router } from "express";

import { UserPortfolioController } from "../controllers/UserPortfolioController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import { authenticate } from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { UpdateUserPortfolioSchema } from "../validators/UpdateUserPortfolioSchema.js";

const router = Router();

const controller = new UserPortfolioController();

/*
 My Portfolio

 Declared before "/:userId" to avoid "me" being
 captured as a userId route parameter.
*/

router.get(

    "/me",

    authenticate,

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
