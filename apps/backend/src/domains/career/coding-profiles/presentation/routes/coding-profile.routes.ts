import { Router } from "express";

import { CodingProfileController } from "../controllers/CodingProfileController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { LinkCodingProfileSchema } from "../validators/LinkCodingProfileSchema.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

const router = Router();

const controller = new CodingProfileController();

router.post(

    "/",
    authenticate,
    authorizePermission(UserRole.STUDENT),
    validate(LinkCodingProfileSchema),
    asyncHandler(controller.link.bind(controller))

);

router.get(

    "/me",
    authenticate,
    authorizePermission(UserRole.STUDENT),
    asyncHandler(controller.getMyProfiles.bind(controller))

);

/*
 Manual, on-demand sync - a student can refresh their own real stats
 right now rather than waiting for the real scheduled job (see
 codingProfileSyncJob.ts).
*/

router.post(

    "/:id/sync",
    authenticate,
    authorizePermission(UserRole.STUDENT),
    asyncHandler(controller.sync.bind(controller))

);

export default router;
