import express from "express";

import {

    getUsers,

    createConversation,

    sendMessage,

    getMessages,

} from "../controllers/chatController.js";

const router = express.Router();

router.get(
    "/users",
    getUsers
);

router.post(
    "/conversation",
    createConversation
);

router.post(
    "/message",
    sendMessage
);

router.get(
    "/conversation/:id",
    getMessages
);

export default router;