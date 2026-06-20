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

const activitySchema = new mongoose.Schema({

    title: {
        type: String,
        requried: true,
    },

    description: {
        type: String,
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

    formFields: [fieldSchema],

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
},{
    timestamps: true,
});

const Activity = mongoose.model(
    "Activity",
    activitySchema
);

export default Activity;