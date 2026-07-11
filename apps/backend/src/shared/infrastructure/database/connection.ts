import mongoose from "mongoose";
import { env } from "../../../config/index.js";
import { Logger } from "../logger/index.js";

export async function connectDatabase(): Promise<void> {
    try {
        await mongoose.connect(env.MONGODB_URI);

        Logger.info("MongoDB connected successfully.");
    } catch (error) {
        Logger.error("Failed to connect to MongoDB.");

        console.error(error);

        process.exit(1);
    }
}