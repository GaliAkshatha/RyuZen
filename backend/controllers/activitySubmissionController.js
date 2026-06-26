import Activity from "../models/Activity.js";
import ActivitySubmission from "../models/ActivitySubmission.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

export const submitActivity = async (
  req,
  res
) => {

  try {

    const {
      userId,
      answers,
    } = req.body;

    const activity =
      await Activity.findById(
        req.params.id
      );

    if (
      activity.status ===
      "closed"
    ) {

      return res.status(400).json({
        message:
          "Activity is closed",
      });

    }

    const existingSubmission =
      await ActivitySubmission.findOne({

        activity:
          req.params.id,

        user:
          userId,

      });

    if (existingSubmission) {

      return res.status(400).json({

        message:
          "You have already submitted this activity",

      });

    }

    const submission =
      await ActivitySubmission.create({

        activity:
          req.params.id,

        user:
          userId,

        answers,
      });

    res.status(201).json({

      message:
        "Submission Successful",

      submission,

    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }

};

export const getActivityResponses =
async (req, res) => {

  try {

    const responses =
      await ActivitySubmission
        .find({
          activity:
            req.params.id,
        })
        .populate(
          "user",
          "name email role"
        );

    res.json({
      responses,
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }

};

export const approveSubmission =
async (req, res) => {

  try {

    const submission =
      await ActivitySubmission.findById(
        req.params.id
      );

    if (!submission) {

      return res.status(404).json({
        message:
          "Submission not found",
      });

    }

    if (
      submission.status ===
      "approved"
    ) {

      return res.status(400).json({
        message:
          "Already approved",
      });

    }

    const activity =
      await Activity.findById(
        submission.activity
      );

    const user =
      await User.findById(
        submission.user
      );

    user.points +=
      activity.points;

    await user.save();

    await Notification.create({
        user: user._id,

        title: "Activity Approved",

        message:
            `${activity.title} approved. +${activity.points} points awarded.`,
    });

    submission.status =
      "approved";

    await submission.save();

    res.json({
      message:
        "Submission approved",
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }

};

export const rejectSubmission =
async (req, res) => {

  try {

    const submission =
      await ActivitySubmission.findById(
        req.params.id
      );

    if (!submission) {

      return res.status(404).json({
        message:
          "Submission not found",
      });

    }

    submission.status =
      "rejected";

    await submission.save();

    await Notification.create({

        user: submission.user,

        title: "Activity Rejected",

        message:
            "Your submission was not approved.",
    });

    res.json({
      message:
        "Submission rejected",
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }

};

export const markAttendance =
async (req, res) => {

  try {

    const submission =
      await ActivitySubmission.findById(
        req.params.id
      );

    if (!submission) {

      return res.status(404).json({
        message:
          "Submission not found",
      });

    }

    const activity =
      await Activity.findById(
        submission.activity
      );

    const user =
      await User.findById(
        submission.user
      );

    user.points +=
      activity.points;

    await user.save();

    await Notification.create({

        user: user._id,

        title: "Workshop Attendance Confirmed",

        message:
            `${activity.title} attended. +${activity.points} points awarded.`,
    });

    submission.status =
      "attended";

    await submission.save();



    res.json({
      message:
        "Attendance marked",
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });

  }

};

export const getUserSubmissions =
async (req,res) => {

  try {

    const submissions =
      await ActivitySubmission.find({

        user:
          req.params.userId,

      })

      .populate(
        "activity",
        "title points type"
      )

      .sort({
        createdAt: -1,
      });

    res.json({
      submissions,
    });

  } catch(error) {

    res.status(500).json({
      message:
        error.message,
    });

  }

};