import mongoose from "mongoose";

const activitySubmissionSchema =
new mongoose.Schema(
  {
    activity: {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: "Activity",
      required: true,
    },

    user: {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    answers: {
      type: Object,
      default: {},
    },

    status: {
      type: String,
      enum: [
        "submitted",
        "approved",
        "rejected",
      ],
      default: "submitted",
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const ActivitySubmission =
mongoose.model(
  "ActivitySubmission",
  activitySubmissionSchema
);

export default ActivitySubmission;