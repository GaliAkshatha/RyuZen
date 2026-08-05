import mongoose, { Document, Schema } from "mongoose";

import { UserRole } from "../../domain/constants/UserRole.js";
import { UserStatus } from "../../domain/constants/UserStatus.js";
import { Permission } from "../../../platform/permissions/domain/constants/Permission.js";

export interface UserDocument extends Document {

    organizationId: mongoose.Types.ObjectId;

    name: string;

    email: string;

    role: UserRole;

    permissions: Permission[];

    status: UserStatus;

    profile: {

        image: string;

        phone: string;

        bio: string;

    };

    auth: {

        passwordHash: string;

        emailVerified: boolean;

        lastLogin?: Date;

        failedAttempts: number;

        lockedUntil?: Date;

    };

    passwordReset?: {

        tokenHash?: string;

        expiresAt?: Date;

    };

    joinedAt?: Date;

    graduationYear?: number;

    studentId?: string;

    employeeId?: string;

    createdAt: Date;

    updatedAt: Date;

}

const ProfileSchema = new Schema(

    {

        image: {

            type: String,

            default: "",

        },

        phone: {

            type: String,

            default: "",

        },

        bio: {

            type: String,

            default: "",

        }

    },

    {

        _id: false,

    }

);

const AuthSchema = new Schema(

    {

        passwordHash: {

            type: String,

            required: true,

            select: false,

        },

        emailVerified: {

            type: Boolean,

            default: false,

        },

        lastLogin: Date,

        failedAttempts: {

            type: Number,

            default: 0,

        },

        lockedUntil: Date

    },

    {

        _id: false,

    }

);

const PasswordResetSchema = new Schema(

    {

        tokenHash: {

            type: String,

        },

        expiresAt: {

            type: Date,

        }

    },

    {

        _id: false,

    }

);

const UserSchema = new Schema<UserDocument>(

    {

        organizationId: {

            type: Schema.Types.ObjectId,

            ref: "Organization",

            required: true,

            index: true,

        },

        name: {

            type: String,

            required: true,

            trim: true,

        },

        email: {

            type: String,

            required: true,

            lowercase: true,

            unique: true,

            trim: true,

            index: true,

        },

        role: {

            type: String,

            enum: Object.values(UserRole),

            default: UserRole.STUDENT,

            index: true,

        },

        permissions: {

            type: [String],

                enum: Object.values(Permission),

        default: []

    },

        status: {

            type: String,

            enum: Object.values(UserStatus),

            default: UserStatus.INVITED,

            index: true,

        },

        profile: {

            type: ProfileSchema,

            default: () => ({}),

        },

        auth: {

            type: AuthSchema,

            required: true,

        },

        passwordReset: {

            type: PasswordResetSchema,

        },

        joinedAt: {

            type: Date,

            default: Date.now,

        },

        graduationYear: Number,

        studentId: String,

        employeeId: String

    },

    {

        timestamps: true,

        versionKey: false,

    }

);

UserSchema.index({

    organizationId: 1,

    email: 1

});

UserSchema.index({

    organizationId: 1,

    role: 1

});

UserSchema.index({

    organizationId: 1,

    status: 1

});

export const UserModel = mongoose.model<UserDocument>(

    "User",

    UserSchema

);