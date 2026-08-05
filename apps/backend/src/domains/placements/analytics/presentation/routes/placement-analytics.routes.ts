import { Router } from "express";

import { PlacementAnalyticsController } from "../controllers/PlacementAnalyticsController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

const router = Router();

const controller = new PlacementAnalyticsController();

/*
 Get Placement Analytics

 Mounted at its own base path (see app.ts) rather than nested
 under /placements, to avoid colliding with the existing
 GET /placements/:id route in placement-drive.routes.ts.
*/

router.get(

    "/",

    authenticate,

    authorizePermission(

        UserRole.ORG_ADMIN,

        UserRole.PLACEMENT_ADMIN

    ),

    asyncHandler(

        controller.get.bind(controller)

    )

);

export default router;
