import { Router } from "express";

import { SubmissionController } from "../controllers/SubmissionController.js";

import { authenticate } from "../../../../../shared/core/middleware/authenticate.js";
import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import { validate } from "../../../../../shared/core/validation/validate.js";

import { CreateSubmissionSchema } from "../validators/CreateSubmissionSchema.js";
import { ReviewSubmissionSchema } from "../validators/ReviewSubmissionSchema.js";

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

router.patch(

    "/:submissionId/review",

    authenticate,

    validate(ReviewSubmissionSchema),

    asyncHandler(

        controller.review.bind(controller)

    )

);

export default router;