import { Router } from "express";

import { ChatController } from "../controllers/ChatController.js";

import { asyncHandler } from "../../../../../shared/core/middleware/asyncHandler.js";
import {
    authenticate,
    authorizePermission
} from "../../../../../shared/core/middleware/index.js";

import { validate } from "../../../../../shared/core/validation/index.js";

import { UserRole } from "../../../../identity/domain/constants/UserRole.js";

import { CreateChatSchema } from "../validators/CreateChatSchema.js";
import { SendMessageSchema } from "../validators/SendMessageSchema.js";

const router = Router();

const controller = new ChatController();

/*
 Per the Role & Permission Matrix, Chat is available to every
 role except SUPER_ADMIN.
*/

const chatRoles = [

    UserRole.ORG_ADMIN,

    UserRole.FACULTY,

    UserRole.STUDENT,

    UserRole.ALUMNI

];

/*
 Create Chat
*/

router.post(

    "/",

    authenticate,

    authorizePermission(

        ...chatRoles

    ),

    validate(

        CreateChatSchema

    ),

    asyncHandler(

        controller.create.bind(controller)

    )

);

/*
 List My Chats
*/

router.get(

    "/",

    authenticate,

    authorizePermission(

        ...chatRoles

    ),

    asyncHandler(

        controller.list.bind(controller)

    )

);

/*
 Get Chat
*/

router.get(

    "/:id",

    authenticate,

    authorizePermission(

        ...chatRoles

    ),

    asyncHandler(

        controller.getById.bind(controller)

    )

);

/*
 Send Message
*/

router.post(

    "/:id/messages",

    authenticate,

    authorizePermission(

        ...chatRoles

    ),

    validate(

        SendMessageSchema

    ),

    asyncHandler(

        controller.sendMessage.bind(controller)

    )

);

/*
 List Chat Messages
*/

router.get(

    "/:id/messages",

    authenticate,

    authorizePermission(

        ...chatRoles

    ),

    asyncHandler(

        controller.listMessages.bind(controller)

    )

);

export default router;
