import mongoose from "mongoose";
import { USER_ROLE, USER_STATUS } from "../constants/userConstants";

const userSchema = new mongoose.Schema(

{

// ---------- Identity ----------

    organization:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"Organization",

        required:true,

        index:true,

    },

    name:{

        type:String,

        required:true,

        trim:true,

    },

    email:{

        type:String,

        required:true,

        unique:true,

        lowercase:true,

        trim:true,

    },

    role:{

        type:String,

        enum: Object.values(USER_ROLE),

        default:"STUDENT",

    },

    profilePicture:{

        type:String,

        default:"",

    },

// ---------- Authentication ----------

    auth: {

        password:{

            type:String,

            required:true,

            select:false,

        },

        emailVerified:{

            type:Boolean,

            default:false,

        },

        lastLogin:Date,

        failedLoginAttempts:{

            type:Number,

            default:0,

        },

        lockUntil:Date,

        refreshToken:{

            type:String,

            default:null,

        },

    },

// ---------- Academic ----------

    academic: {

        usn:String,

        department:String,

        semester:Number,

        section:String,

        academicYear:String,

        totalPoints: {

            type: Number,

            default: 0,

        },

        rank: {

            type: Number,

            default: 0,

        }
    },

// ---------- Social ----------

    social: {

        bio:{

            type:String,

            default:"",

        },

        skills:[String],

        interests:[String],

    },

// ---------- Game -----------

    game: {

        xp: {
            
            type: Number,

            default: 0,
        },

        level: {

            type: Number,

            default: 1,
        },

        rank: {
            type: String,

            default: "Beginner",
        },

        streak: {

            type: Number,

            default: 0,
        },

        achievements: [
            {
                type: mongoose.Schema.Types.ObjectId,

                ref: "Achievement",
            }
        ]
    },

// ---------- Status ----------

    status:{

        type:String,

        enum: Object.values(USER_STATUS),

        default:"PENDING",

    }

},

{

timestamps:true

}

);

export default mongoose.model(

"User",

userSchema

);