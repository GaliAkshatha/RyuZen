import { Router } from "express";

import { SubmissionController } from "../controllers/SubmissionController.js";

import { authenticate } from "../../../../../shared/core/middleware/authenticate.js";
import { authorizePermission } from "../../../../../shared/core/middleware/authorizePermission.js";
import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import { validate } from "../../../../../shared/core/validation/validate.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import { CreateSubmissionSchema } from "../validators/CreateSubmissionSchema.js";
import { ReviewSubmissionSchema } from "../validators/ReviewSubmissionSchema.js";
import { ResubmitSubmissionSchema } from "../validators/ResubmitSubmissionSchema.js";
import { ApproveSubmissionSchema } from "../validators/ApproveSubmissionSchema.js";
import { RejectSubmissionSchema } from "../validators/RejectSubmissionSchema.js";

const router = Router();

const controller = new SubmissionController();

router.post(

    "/",

    authenticate,

    validate(CreateSubmissionSchema),

    asyncHandler(

        controller.submit.bind(controller)

    )

);

/*
 List Submissions
*/

router.get(

    "/",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.ORG_ADMIN,

        UserRole.FACULTY,

        UserRole.STUDENT

    ),

    asyncHandler(

        controller.list.bind(controller)

    )

);

/*
 Get Submission
*/

router.get(

    "/:submissionId",

    authenticate,

    asyncHandler(

        controller.getById.bind(controller)

    )

);

/*
 Resubmit Submission
*/

router.patch(

    "/:submissionId",

    authenticate,

    validate(ResubmitSubmissionSchema),

    asyncHandler(

        controller.resubmit.bind(controller)

    )

);

router.patch(

    "/:submissionId/review",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.FACULTY

    ),

    validate(ReviewSubmissionSchema),

    asyncHandler(

        controller.review.bind(controller)

    )

);

/*
 Approve Submission
*/

router.patch(

    "/:submissionId/approve",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.FACULTY

    ),

    validate(ApproveSubmissionSchema),

    asyncHandler(

        controller.approve.bind(controller)

    )

);

/*
 Reject Submission
*/

router.patch(

    "/:submissionId/reject",

    authenticate,

    authorizePermission(

        UserRole.SUPER_ADMIN,

        UserRole.FACULTY

    ),

    validate(RejectSubmissionSchema),

    asyncHandler(

        controller.reject.bind(controller)

    )

);

export default router;