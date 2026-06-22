import mongoose from "mongoose";

const activitySubmissionSchema =
new mongoose.Schema({

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
      "registered",
      "submitted",
      "attended",
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
});

activitySubmissionSchema.index(
  {
    activity: 1,
    user: 1,
  },
  {
    unique: true,
  }
);

const ActivitySubmission =
  mongoose.model(
    "ActivitySubmission",
    activitySubmissionSchema
  );

export default ActivitySubmission;