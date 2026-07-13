import { Router } from "express";

import { StudentController } from "../controllers/StudentController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import { CreateStudentSchema } from "../validators/CreateStudentSchema.js";
import { UpdateStudentSchema } from "../validators/UpdateStudentSchema.js";
import { AssignMentorSchema } from "../validators/AssignMentorSchema.js";

const router = Router();

const controller = new StudentController();

/*
 Create Student
*/

router.post(

    "/",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    validate(

        CreateStudentSchema

    ),

    asyncHandler(

        controller.create.bind(controller)

    )

);

/*
 List Students
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
 Get Student
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
 Update Student
*/

router.patch(

    "/:id",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    validate(

        UpdateStudentSchema

    ),

    asyncHandler(

        controller.update.bind(controller)

    )

);

/*
 Assign Mentor
*/

router.patch(

    "/:id/mentor",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    validate(

        AssignMentorSchema

    ),

    asyncHandler(

        controller.assignMentor.bind(controller)

    )

);

/*
 Promote Semester
*/

router.patch(

    "/:id/promote",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    asyncHandler(

        controller.promoteSemester.bind(controller)

    )

);

/*
 Archive Student
*/

router.patch(

    "/:id/archive",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN

    ),

    asyncHandler(

        controller.archive.bind(controller)

    )

);

export default router;
