import express from "express";

import {
    getUsers,
    createConversation,
    getUserConversations,
} from "../controllers/conversationController.js";

const router = express.Router();

router.get("/users", getUsers);

router.post("/", createConversation);

router.get("/:userId", getUserConversations);

export default router;