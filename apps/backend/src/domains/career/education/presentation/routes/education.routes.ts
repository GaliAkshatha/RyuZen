import { Router } from "express";

import { EducationController } from "../controllers/EducationController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import { authenticate } from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import {
    CreateEducationSchema,
    UpdateEducationSchema
} from "../validators/EducationSchema.js";

const router = Router();

const controller = new EducationController();

/*
 Create Education
*/

router.post(

    "/",

    authenticate,

    validate(

        CreateEducationSchema

    ),

    asyncHandler(

        controller.create.bind(controller)

    )

);

/*
 List My Education Entries
*/

router.get(

    "/",

    authenticate,

    asyncHandler(

        controller.list.bind(controller)

    )

);

/*
 List Education Entries For A User
*/

router.get(

    "/users/:userId",

    authenticate,

    asyncHandler(

        controller.listForUser.bind(controller)

    )

);

/*
 Get Education
*/

router.get(

    "/:id",

    authenticate,

    asyncHandler(

        controller.getById.bind(controller)

    )

);

/*
 Update Education
*/

router.patch(

    "/:id",

    authenticate,

    validate(

        UpdateEducationSchema

    ),

    asyncHandler(

        controller.update.bind(controller)

    )

);

/*
 Delete Education
*/

router.delete(

    "/:id",

    authenticate,

    asyncHandler(

        controller.remove.bind(controller)

    )

);

export default router;
