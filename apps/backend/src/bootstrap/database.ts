import mongoose from "mongoose";
import { env } from "../config/index.js";
import { connectDatabase } from "../shared/infrastructure/database/index.js";

export async function bootstrapDatabase(): Promise<void> {
    try {

        await connectDatabase();

        console.log("MongoDB Connected");
        
    } catch (error) {
        console.error(" MongoDB Connection Failed");

        console.error(error);

        process.exit(1);
    }
}