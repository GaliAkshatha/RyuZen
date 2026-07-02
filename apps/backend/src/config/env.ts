import dotenv from "dotenv";

dotenv.config();

export const env = {
    NODE_ENV: process.env.NODE_ENV ?? "development",
    PORT: Number(process.env.PORT ?? 5000),
    MONGODB_URI:
        process.env.MONGODB_URI ??
        "mongodb://127.0.0.1:27017/ryuzen",
};