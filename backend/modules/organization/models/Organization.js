import mongoose from "mongoose";
import { ORGANIZATION_STATUS, REGISTRATION_STRATEGY } from "../constants/organizationConstants";

const organizationSchema = new mongoose.Schema(

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

        registrationStrategy: {

            type: String,

            enum: 
            
            Object.values(
                REGISTRATION_STRATEGY
            ),

            default: "EMAIL_DOMAIN",

        },

        departments: [

            {

                name: String,

                code: String,

            }

        ],

        semesters: {

            type: Number,

            default: 8,

        },

        settings: {

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

            enableNetwork: {

                type: Boolean,

                default: true,

            },

            enableStories: {

                type: Boolean,

                default: true,

            },

            enableAI: {

                type: Boolean,

                default: true,

            },

            enableGame: {

                type: Boolean,

                default: true,

            }

        },

        status: {

            type: String,

            enum: 
            
            Object.values(
                ORGANIZATION_STATUS
            ),

            default: "ACTIVE",

        }

    },

    {

        timestamps: true,

    }

);

export default mongoose.model(

    "Organization",

    organizationSchema

);