import express from "express";

import{
    createActivity,
    getActivities,
    getActivityById,
    downloadResponsesCSV,
    closeActivity,
    updateActivity,
}from "../controllers/activityController.js";

import {

  submitActivity,
  getActivityResponses,

  approveSubmission,
  rejectSubmission,
  markAttendance,

} from "../controllers/activitySubmissionController.js";

const router = express.Router();

router.post("/",createActivity);

router.get("/",getActivities);

router.get("/:id", getActivityById);

router.post("/:id/submit", submitActivity);

router.get("/:id/responses",getActivityResponses);

router.get("/:id/export-csv",downloadResponsesCSV);

router.patch("/:id/close",closeActivity);

router.put("/:id",updateActivity);

router.patch("/responses/:id/approve",approveSubmission);

router.patch("/responses/:id/reject",rejectSubmission);

router.patch("/responses/:id/attend",markAttendance);

export default router;