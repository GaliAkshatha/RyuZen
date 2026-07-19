import { Router } from "express";

import { PortfolioProjectController } from "../controllers/PortfolioProjectController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import { authenticate } from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import {
    CreatePortfolioProjectSchema,
    UpdatePortfolioProjectSchema
} from "../validators/PortfolioProjectSchema.js";

const router = Router();

const controller = new PortfolioProjectController();

/*
 Create Portfolio Project
*/

router.post(

    "/",

    authenticate,

    validate(

        CreatePortfolioProjectSchema

    ),

    asyncHandler(

        controller.create.bind(controller)

    )

);

/*
 List My Portfolio Projects
*/

router.get(

    "/",

    authenticate,

    asyncHandler(

        controller.list.bind(controller)

    )

);

/*
 List Portfolio Projects For A User
*/

router.get(

    "/users/:userId",

    authenticate,

    asyncHandler(

        controller.listForUser.bind(controller)

    )

);

/*
 Get Portfolio Project
*/

router.get(

    "/:id",

    authenticate,

    asyncHandler(

        controller.getById.bind(controller)

    )

);

/*
 Update Portfolio Project
*/

router.patch(

    "/:id",

    authenticate,

    validate(

        UpdatePortfolioProjectSchema

    ),

    asyncHandler(

        controller.update.bind(controller)

    )

);

/*
 Delete Portfolio Project
*/

router.delete(

    "/:id",

    authenticate,

    asyncHandler(

        controller.remove.bind(controller)

    )

);

export default router;
