import { Router } from "express";

import { PlacementDriveController } from "../controllers/PlacementDriveController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import {
    CreatePlacementDriveSchema,
    UpdatePlacementDriveSchema
} from "../validators/PlacementDriveSchema.js";

const router = Router();

const controller = new PlacementDriveController();

/*
 Create Placement Drive

 Per the Role & Permission Matrix, placement drive creation is
 ORG_ADMIN only (SUPER_ADMIN is explicitly excluded).
*/

router.post(

    "/",

    authenticate,

    authorizePermission(

        UserRole.ORG_ADMIN,

        UserRole.PLACEMENT_ADMIN

    ),

    validate(

        CreatePlacementDriveSchema

    ),

    asyncHandler(

        controller.create.bind(controller)

    )

);

/*
 List Placement Drives
*/

router.get(

    "/",

    authenticate,

    asyncHandler(

        controller.list.bind(controller)

    )

);

/*
 Get Placement Drive
*/

router.get(

    "/:id",

    authenticate,

    asyncHandler(

        controller.getById.bind(controller)

    )

);

/*
 Update Placement Drive
*/

router.patch(

    "/:id",

    authenticate,

    authorizePermission(

        UserRole.ORG_ADMIN,

        UserRole.PLACEMENT_ADMIN

    ),

    validate(

        UpdatePlacementDriveSchema

    ),

    asyncHandler(

        controller.update.bind(controller)

    )

);

/*
 Publish Placement Drive
*/

router.patch(

    "/:id/publish",

    authenticate,

    authorizePermission(

        UserRole.ORG_ADMIN,

        UserRole.PLACEMENT_ADMIN

    ),

    asyncHandler(

        controller.publish.bind(controller)

    )

);

/*
 Close Placement Drive
*/

router.patch(

    "/:id/close",

    authenticate,

    authorizePermission(

        UserRole.ORG_ADMIN,

        UserRole.PLACEMENT_ADMIN

    ),

    asyncHandler(

        controller.close.bind(controller)

    )

);

/*
 Get Eligible Students - the real gate for Company -> Drive ->
 Eligibility Criteria -> Eligible Students -> Student Applies. Same
 roles that manage drives; students see this scoped to themselves via
 the application flow, not this admin-facing full list.
*/

router.get(

    "/:id/eligible-students",

    authenticate,

    authorizePermission(

        UserRole.ORG_ADMIN,

        UserRole.PLACEMENT_ADMIN

    ),

    asyncHandler(

        controller.getEligibleStudents.bind(controller)

    )

);

/*
 Check My Eligibility - closes the previously-flagged "no
 student-facing eligibility signal" gap. Reuses the exact real
 isStudentEligibleForDrive() check, not a second copy of the rule.
*/

router.get(

    "/:id/my-eligibility",

    authenticate,

    authorizePermission(

        UserRole.STUDENT

    ),

    asyncHandler(

        controller.checkMyEligibility.bind(controller)

    )

);

/*
 Delete Placement Drive
*/

router.delete(

    "/:id",

    authenticate,

    authorizePermission(

        UserRole.ORG_ADMIN,

        UserRole.PLACEMENT_ADMIN

    ),

    asyncHandler(

        controller.remove.bind(controller)

    )

);

export default router;
