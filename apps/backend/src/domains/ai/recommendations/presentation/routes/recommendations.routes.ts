import { Router } from "express";

import { RecommendationsController } from "../controllers/RecommendationsController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import { authenticate } from "../../../../../shared/core/middleware/index.js";

const router = Router();

const controller = new RecommendationsController();

/*
 Get My Recommendations

 Suggests published Activities, published Events, and active
 Clubs the caller has not yet engaged with (not submitted,
 registered, or joined respectively).
*/

router.get(

    "/",

    authenticate,

    asyncHandler(

        controller.get.bind(controller)

    )

);

export default router;
