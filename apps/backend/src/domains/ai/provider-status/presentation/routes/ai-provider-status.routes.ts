import { Router } from "express";

import { AiProviderStatusController } from "../controllers/AiProviderStatusController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import { authenticate } from "../../../../../shared/core/middleware/index.js";

const router = Router();

const controller = new AiProviderStatusController();

/*
 GET /ai/provider - which AI provider (Gemini or Ollama) is currently
 configured. Every authenticated role can see this; it's shown on
 every AI page's info banner, not a sensitive value.
*/

router.get(

    "/",

    authenticate,

    asyncHandler(

        controller.get.bind(controller)

    )

);

export default router;
