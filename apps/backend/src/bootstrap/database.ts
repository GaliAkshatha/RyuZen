import mongoose from "mongoose";
import { env } from "../config/index.js";

export async function bootstrapDatabase(): Promise<void> {
    try {
        await mongoose.connect(env.MONGODB_URI);

        console.log("MongoDB Connected");
    } catch (error) {
        console.error(" MongoDB Connection Failed");

        console.error(error);

        process.exit(1);
    }
}