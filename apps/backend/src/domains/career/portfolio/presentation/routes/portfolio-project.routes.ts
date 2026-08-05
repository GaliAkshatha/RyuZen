import { Router } from "express";

import { PortfolioProjectController } from "../controllers/PortfolioProjectController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import {
    CreatePortfolioProjectSchema,
    UpdatePortfolioProjectSchema
} from "../validators/PortfolioProjectSchema.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

const router = Router();

const controller = new PortfolioProjectController();

/*
 Create Portfolio Project - restricted to STUDENT, the real intended
 audience. Previously open to any authenticated role (no role check
 at all), meaning a Faculty/Admin account could create portfolio
 project entries for itself - a real, now-closed gap.
*/

router.post(

    "/",

    authenticate,

    authorizePermission(

        UserRole.STUDENT

    ),

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

    authorizePermission(

        UserRole.STUDENT

    ),

    asyncHandler(

        controller.list.bind(controller)

    )

);

/*
 List Portfolio Projects For A User - deliberately open to any
 authenticated role, since viewing another user's real portfolio
 (e.g. a recruiter or faculty member browsing) is a legitimate read.
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

    authorizePermission(

        UserRole.STUDENT

    ),

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

    authorizePermission(

        UserRole.STUDENT

    ),

    asyncHandler(

        controller.remove.bind(controller)

    )

);

export default router;
