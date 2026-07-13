import { Router } from "express";

import { EventController } from "../controllers/EventController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import { CreateEventSchema } from "../validators/CreateEventSchema.js";
import { UpdateEventSchema } from "../validators/UpdateEventSchema.js";
import { MarkAttendanceSchema } from "../validators/MarkAttendanceSchema.js";
import { SubmitEventFeedbackSchema } from "../validators/SubmitEventFeedbackSchema.js";

const router = Router();

const controller = new EventController();

/*
 Create Event
*/

router.post(

    "/",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN,

        UserRole.FACULTY

    ),

    validate(

        CreateEventSchema

    ),

    asyncHandler(

        controller.create.bind(controller)

    )

);

/*
 List Events
*/

router.get(

    "/",

    authenticate,

    asyncHandler(

        controller.list.bind(controller)

    )

);

/*
 Get Event
*/

router.get(

    "/:id",

    authenticate,

    asyncHandler(

        controller.getById.bind(controller)

    )

);

/*
 Update Event
*/

router.patch(

    "/:id",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN,

        UserRole.FACULTY

    ),

    validate(

        UpdateEventSchema

    ),

    asyncHandler(

        controller.update.bind(controller)

    )

);

/*
 Delete Event
*/

router.delete(

    "/:id",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN,

        UserRole.FACULTY

    ),

    asyncHandler(

        controller.remove.bind(controller)

    )

);

/*
 Publish Event
*/

router.patch(

    "/:id/publish",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN,

        UserRole.FACULTY

    ),

    asyncHandler(

        controller.publish.bind(controller)

    )

);

/*
 Register For Event
*/

router.post(

    "/:id/register",

    authenticate,

    authorizePermission(

        UserRole.STUDENT

    ),

    asyncHandler(

        controller.register.bind(controller)

    )

);

/*
 List Event Registrations
*/

router.get(

    "/:id/registrations",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN,

        UserRole.FACULTY

    ),

    asyncHandler(

        controller.listRegistrations.bind(controller)

    )

);

/*
 Mark Attendance
*/

router.patch(

    "/:id/attendance",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN,

        UserRole.FACULTY

    ),

    validate(

        MarkAttendanceSchema

    ),

    asyncHandler(

        controller.markAttendance.bind(controller)

    )

);

/*
 Submit Event Feedback
*/

router.post(

    "/:id/feedback",

    authenticate,

    authorizePermission(

        UserRole.STUDENT

    ),

    validate(

        SubmitEventFeedbackSchema

    ),

    asyncHandler(

        controller.submitFeedback.bind(controller)

    )

);

/*
 Issue Certificates
*/

router.post(

    "/:id/certificates",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN,

        UserRole.FACULTY

    ),

    asyncHandler(

        controller.issueCertificates.bind(controller)

    )

);

export default router;
