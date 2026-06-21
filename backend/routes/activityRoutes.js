import express from "express";

import{
    createActivity,
    getActivities,
    getActivityById,
    submitActivity,
    getActivityResponses,
    downloadResponsesCSV,
    closeActivity,
    updateActivity,
}from "../controllers/activityController.js";

const router = express.Router();

router.post("/",createActivity);

router.get("/",getActivities);

router.get("/:id", getActivityById);

router.post("/:id/submit", submitActivity);

router.get("/:id/responses",getActivityResponses);

router.get("/:id/export-csv",downloadResponsesCSV);

router.patch("/:id/close",closeActivity);

router.put("/:id",updateActivity);

export default router;