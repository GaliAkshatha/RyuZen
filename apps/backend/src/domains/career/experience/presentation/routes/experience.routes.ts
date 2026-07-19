import { Router } from "express";

import { ExperienceController } from "../controllers/ExperienceController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import { authenticate } from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import {
    CreateExperienceSchema,
    UpdateExperienceSchema
} from "../validators/ExperienceSchema.js";

const router = Router();

const controller = new ExperienceController();

/*
 Create Experience
*/

router.post(

    "/",

    authenticate,

    validate(

        CreateExperienceSchema

    ),

    asyncHandler(

        controller.create.bind(controller)

    )

);

/*
 List My Experience Entries
*/

router.get(

    "/",

    authenticate,

    asyncHandler(

        controller.list.bind(controller)

    )

);

/*
 List Experience Entries For A User
*/

router.get(

    "/users/:userId",

    authenticate,

    asyncHandler(

        controller.listForUser.bind(controller)

    )

);

/*
 Get Experience
*/

router.get(

    "/:id",

    authenticate,

    asyncHandler(

        controller.getById.bind(controller)

    )

);

/*
 Update Experience
*/

router.patch(

    "/:id",

    authenticate,

    validate(

        UpdateExperienceSchema

    ),

    asyncHandler(

        controller.update.bind(controller)

    )

);

/*
 Delete Experience
*/

router.delete(

    "/:id",

    authenticate,

    asyncHandler(

        controller.remove.bind(controller)

    )

);

export default router;
