import mongoose, { Schema, Document } from "mongoose";

import { OrganizationStatus } from "../../domain/constants/OrganizationStatus.js";
import { RegistrationMethod } from "../../domain/constants/RegistrationMethod.js";
import { OrganizationType } from "../../domain/constants/OrganizationType.js";
import { SubscriptionPlan } from "../../domain/constants/SubscriptionPlan.js";

export interface OrganizationDocument extends Document {

    name: string;

    code: string;

    logo: string;

    website: string;

    emailDomains: string[];

    registrationMethod: RegistrationMethod;

    organizationType: OrganizationType;

    subscriptionPlan: SubscriptionPlan;

    status: OrganizationStatus;

    settings: {

        allowStudentRegistration: boolean;

        requireEmailVerification: boolean;

        requireAdminApproval: boolean;

        enableAI: boolean;

        enableActivities: boolean;

        enableLeaderboard: boolean;

        enableChat: boolean;

        enableNotifications: boolean;

        enableCareer: boolean;

        enableGames: boolean;

        enableAlumni: boolean;

    };

}

const SettingsSchema = new Schema(

    {

        allowStudentRegistration: {

            type: Boolean,

            default: true,

        },

        requireEmailVerification: {

            type: Boolean,

            default: true,

        },

        requireAdminApproval: {

            type: Boolean,

            default: true,

        },

        enableAI: {

            type: Boolean,

            default: true,

        },

        enableActivities: {

            type: Boolean,

            default: true,

        },

        enableLeaderboard: {

            type: Boolean,

            default: true,

        },

        enableChat: {

            type: Boolean,

            default: true,

        },

        enableNotifications: {

            type: Boolean,

            default: true,

        },

        enableCareer: {

            type: Boolean,

            default: true,

        },

        enableGames: {

            type: Boolean,

            default: true,

        },

        enableAlumni: {

            type: Boolean,

            default: true,

        },

    },

    {

        _id: false,

    }

);

const OrganizationSchema = new Schema<OrganizationDocument>(

    {

        name: {

            type: String,

            required: true,

            trim: true,

        },

        code: {

            type: String,

            required: true,

            unique: true,

            uppercase: true,

            trim: true,

            index: true,

        },

        logo: {

            type: String,

            default: "",

        },

        website: {

            type: String,

            default: "",

        },

        emailDomains: [

            {

                type: String,

                lowercase: true,

                trim: true,

            }

        ],

        registrationMethod: {

            type: String,

            enum: Object.values(RegistrationMethod),

            default: RegistrationMethod.EMAIL_DOMAIN,

        },

        organizationType: {

            type: String,

            enum: Object.values(OrganizationType),

            default: OrganizationType.COLLEGE,

            index: true,

        },

        subscriptionPlan: {

            type: String,

            enum: Object.values(SubscriptionPlan),

            default: SubscriptionPlan.FREE,

        },

        status: {

            type: String,

            enum: Object.values(OrganizationStatus),

            default: OrganizationStatus.ACTIVE,

            index: true,

        },

        settings: {

            type: SettingsSchema,

            default: () => ({}),

        },

    },

    {

        timestamps: true,

        versionKey: false,

    }

);

OrganizationSchema.index({

    code: 1,

    status: 1,

});

OrganizationSchema.index({

    organizationType: 1,

    status: 1,

});

export const OrganizationModel = mongoose.model<OrganizationDocument>(

    "Organization",

    OrganizationSchema

);