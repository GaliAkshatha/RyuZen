import express from "express";

import{
    createActivity,
    getActivities,
    getActivityById,
    submitActivity,
}from "../controllers/activityController.js";

const router = express.Router();

router.post("/",createActivity);

router.get("/",getActivities);

router.get("/:id", getActivityById);

router.post("/:id/submit", submitActivity)

export default router;