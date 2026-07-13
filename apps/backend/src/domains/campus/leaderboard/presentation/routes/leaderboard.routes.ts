import { Router } from "express";

import { LeaderboardController } from "../controllers/LeaderboardController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import { AdjustLeaderboardPointsSchema } from "../validators/AdjustLeaderboardPointsSchema.js";

const router = Router();

const controller = new LeaderboardController();

/*
 List Leaderboard
*/

router.get(

    "/",

    authenticate,

    asyncHandler(

        controller.list.bind(controller)

    )

);

/*
 My Leaderboard Entry

 Declared before "/:studentId" to avoid "me" being
 captured as a studentId route parameter.
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
 Recalculate Leaderboard
*/

router.post(

    "/recalculate",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    asyncHandler(

        controller.recalculate.bind(controller)

    )

);

/*
 Get Leaderboard Entry
*/

router.get(

    "/:studentId",

    authenticate,

    asyncHandler(

        controller.getByStudentId.bind(controller)

    )

);

/*
 Adjust Leaderboard Points
*/

router.patch(

    "/:studentId/adjust",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    validate(

        AdjustLeaderboardPointsSchema

    ),

    asyncHandler(

        controller.adjust.bind(controller)

    )

);

export default router;
