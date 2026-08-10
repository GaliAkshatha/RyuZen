import { Router } from "express";

import { FacultyController } from "../controllers/FacultyController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import { CreateFacultySchema } from "../validators/CreateFacultySchema.js";
import { UpdateFacultySchema } from "../validators/UpdateFacultySchema.js";
import { AssignFacultyDepartmentSchema } from "../validators/AssignFacultyDepartmentSchema.js";

const router = Router();

const controller = new FacultyController();

/*
 Create Faculty
*/

router.post(

    "/",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    validate(

        CreateFacultySchema

    ),

    asyncHandler(

        controller.create.bind(controller)

    )

);

/*
 List Faculty
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
 Get My Faculty Profile - declared before "/:id" to avoid "me" being
 captured as an id route parameter. Open to any authenticated user;
 FACULTY is the real intended caller (resolving their own facultyId
 for self-scoped views like "my mentees"), but there's no harm in a
 non-faculty caller getting a 404 for having no faculty profile.
*/

router.get(

    "/me",

    authenticate,

    asyncHandler(

        controller.getMe.bind(controller)

    )

);

/*
 Get Faculty
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
 Update Faculty
*/

router.patch(

    "/:id",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    validate(

        UpdateFacultySchema

    ),

    asyncHandler(

        controller.update.bind(controller)

    )

);

/*
 Assign Department
*/

router.patch(

    "/:id/department",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    validate(

        AssignFacultyDepartmentSchema

    ),

    asyncHandler(

        controller.assignDepartment.bind(controller)

    )

);

/*
 Deactivate Faculty
*/

router.patch(

    "/:id/deactivate",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    asyncHandler(

        controller.deactivate.bind(controller)

    )

);

export default router;
