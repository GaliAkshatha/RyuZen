import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type : String,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ["admin","user"],
            defalut: "user",
        },

        academicPoints: {
            type: Number,
            default: 0,
        },
        gamePoints:{
            type: Number,
            default: 0,
        }
    },
    {
            timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;