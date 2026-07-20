import { Router } from "express";

import { ResumeReviewController } from "../controllers/ResumeReviewController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import { authenticate } from "../../../../../shared/core/middleware/index.js";

const router = Router();

const controller = new ResumeReviewController();

/*
 Review My Resume

 Reviews the caller's own career data (Resume, Skills, Portfolio
 Projects, Experience, Education, Certifications) and updates
 their Resume.atsScore with the result, if a Resume record exists.
*/

router.post(

    "/",

    authenticate,

    asyncHandler(

        controller.review.bind(controller)

    )

);

export default router;
