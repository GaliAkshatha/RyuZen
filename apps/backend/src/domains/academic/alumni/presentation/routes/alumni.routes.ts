import { Router } from "express";

import { AlumniController } from "../controllers/AlumniController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import { CreateAlumniSchema } from "../validators/CreateAlumniSchema.js";
import { InviteAlumniSchema } from "../validators/InviteAlumniSchema.js";
import { UpdateAlumniSchema } from "../validators/UpdateAlumniSchema.js";
import { ConvertStudentToAlumniSchema } from "../validators/ConvertStudentToAlumniSchema.js";

const router = Router();

const controller = new AlumniController();

/*
 Create Alumni
*/

router.post(

    "/",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    validate(

        CreateAlumniSchema

    ),

    asyncHandler(

        controller.create.bind(controller)

    )

);

/*
 Invite Alumni
*/

router.post(

    "/invite",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    validate(

        InviteAlumniSchema

    ),

    asyncHandler(

        controller.invite.bind(controller)

    )

);

/*
 Get My Alumni Record - ALUMNI only, self-view. Placed before the
 "/:id" route below so Express doesn't match "me" as an :id param.
 Deliberately the one alumni-callable exception to the
 SUPER_ADMIN/ORG_ADMIN-only pattern every other route here follows -
 GetMyAlumniRecordUseCase looks up strictly by the caller's own real
 userId, never accepts an id, so an alumnus can only ever see their
 own record.
*/

router.get(

    "/me",

    authenticate,

    authorizePermission(

        UserRole.ALUMNI

    ),

    asyncHandler(

        controller.getMe.bind(controller)

    )

);

/*
 List Alumni
*/

router.get(

    "/",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    asyncHandler(

        controller.list.bind(controller)

    )

);

/*
 Get Alumni
*/

router.get(

    "/:id",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    asyncHandler(

        controller.getById.bind(controller)

    )

);

/*
 Update Alumni
*/

router.patch(

    "/:id",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    validate(

        UpdateAlumniSchema

    ),

    asyncHandler(

        controller.update.bind(controller)

    )

);

/*
 Verify Alumni
*/

router.patch(

    "/:id/verify",

    authenticate,

    authorizePermission(

        UserRole.ORG_ADMIN

    ),

    asyncHandler(

        controller.verify.bind(controller)

    )

);

/*
 Convert Student To Alumni - "Student -> Placement -> Employee ->
 Alumni". Real, admin-initiated (no honest automatic graduation
 trigger exists anywhere in the system).
*/

router.post(

    "/convert/:studentId",

    authenticate,

    authorizePermission(

        UserRole.ORG_ADMIN

    ),

    validate(ConvertStudentToAlumniSchema),

    asyncHandler(

        controller.convertFromStudent.bind(controller)

    )

);

export default router;
