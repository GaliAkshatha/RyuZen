import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    enum: [
      "text",
      "textarea",
      "number",
      "email",
      "dropdown",
      "checkbox",
      "date",
    ],
    required: true,
  },

  required: {
    type: Boolean,
    default: false,
  },

  options: [String],
});

const activitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      enum: [
        "form",
        "workshop",
        "assignment",
      ],
      required: true,
    },

    points: {
      type: Number,
      default: 0,
    },

    penaltyPoints: {
      type: Number,
      default: 0,
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: [
        "active",
        "closed",
      ],
      default: "active",
    },

    // =========================
    // COMMON DYNAMIC FIELDS
    // =========================

    formFields: [fieldSchema],

    // =========================
    // WORKSHOP FIELDS
    // =========================

    venue: {
      type: String,
      default: "",
    },

    startTime: {
      type: String,
      default: "",
    },

    endTime: {
      type: String,
      default: "",
    },

    registrationDeadline: {
      type: Date,
    },

    attendanceMethod: {
      type: String,
      enum: [
        "qr",
        "manual",
        "future",
      ],
      default: "manual",
    },

    requirements: [
      {
        type: String,
      },
    ],

    maxParticipants: {
      type: Number,
      default: 0,
    },

    // =========================
    // ASSIGNMENT FIELDS
    // =========================

    instructions: {
      type: String,
      default: "",
    },

    submissionType: {
      type: String,
      enum: [
        "pdf",
        "zip",
        "link",
      ],
      default: "pdf",
    },

    submissionDeadline: {
      type: Date,
    },

    // =========================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Activity = mongoose.model(
  "Activity",
  activitySchema
);

export default Activity;