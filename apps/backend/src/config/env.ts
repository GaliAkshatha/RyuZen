import dotenv from "dotenv";

dotenv.config();

export const env = {

    NODE_ENV:
        process.env.NODE_ENV ??
        "development",

    PORT:
        Number(
            process.env.PORT ?? 5000
        ),

    MONGODB_URI:
        process.env.MONGODB_URI ??
        "mongodb://127.0.0.1:27017/ryuzen",

    JWT_SECRET:
        process.env.JWT_SECRET ??
        "change-this-secret",

    JWT_EXPIRES_IN:
        process.env.JWT_EXPIRES_IN ??
        "7d",

    REFRESH_TOKEN_EXPIRES_IN:
        process.env.REFRESH_TOKEN_EXPIRES_IN ??
        "30d",

    // Reserved for a future real IAIProvider implementation
    // (see domains/ai/chat/infrastructure/ai/StubAIProvider.ts).
    // Not read by the current stub provider.
    AI_PROVIDER_API_KEY:
        process.env.AI_PROVIDER_API_KEY ??
        "",

    RATE_LIMIT_WINDOW_MS:
        Number(
            process.env.RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000
        ),

    RATE_LIMIT_MAX:
        Number(
            process.env.RATE_LIMIT_MAX ?? 300
        ),

    AUTH_RATE_LIMIT_MAX:
        Number(
            process.env.AUTH_RATE_LIMIT_MAX ?? 10
        ),

};