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

    // AI_PROVIDER selects which real provider every AI feature's
    // factory instantiates (see shared/infrastructure/ai/AIProviderFactory.ts).
    // No business logic or use case ever reads this directly or
    // hardcodes a provider - only the 5 factory functions do, exactly
    // once each. Defaults to "gemini" (cloud-first), with "ollama"
    // fully supported as the local/offline alternative.
    AI_PROVIDER:
        (process.env.AI_PROVIDER as "gemini" | "ollama" | undefined) ??
        "gemini",

    GEMINI_API_KEY:
        process.env.GEMINI_API_KEY ??
        "",

    GEMINI_MODEL:
        process.env.GEMINI_MODEL ??
        "gemini-1.5-flash",

    OLLAMA_BASE_URL:
        process.env.OLLAMA_BASE_URL ??
        "http://localhost:11434",

    OLLAMA_MODEL:
        process.env.OLLAMA_MODEL ??
        "qwen3:8b",

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

    CACHE_DEFAULT_TTL_SECONDS:
        Number(
            process.env.CACHE_DEFAULT_TTL_SECONDS ?? 60
        ),

    // SMTP config for real email delivery (invitations, email
    // verification, password reset links). Every field defaults to
    // empty/sensible so the app still starts without them configured
    // - EmailService logs a clear warning and skips sending rather
    // than crashing a request over missing mail config (see
    // shared/infrastructure/email/NodemailerEmailService.ts).
    SMTP_HOST:
        process.env.SMTP_HOST ??
        "",

    SMTP_PORT:
        Number(
            process.env.SMTP_PORT ?? 587
        ),

    SMTP_SECURE:
        process.env.SMTP_SECURE === "true",

    SMTP_USER:
        process.env.SMTP_USER ??
        "",

    SMTP_PASSWORD:
        process.env.SMTP_PASSWORD ??
        "",

    EMAIL_FROM:
        process.env.EMAIL_FROM ??
        "RyuZen <no-reply@ryuzen.ai>",

    FRONTEND_URL:
        process.env.FRONTEND_URL ??
        "http://localhost:5173",

    // Account lockout: after this many consecutive failed login
    // attempts, the account is locked for ACCOUNT_LOCK_DURATION_MS
    // (auto-unlocks once that time passes - see LoginUserUseCase).
    // An ORG_ADMIN can also unlock manually before it expires (see
    // AdminUnlockUserUseCase).
    ACCOUNT_LOCK_THRESHOLD:
        Number(
            process.env.ACCOUNT_LOCK_THRESHOLD ?? 5
        ),

    ACCOUNT_LOCK_DURATION_MS:
        Number(
            process.env.ACCOUNT_LOCK_DURATION_MS ?? 15 * 60 * 1000
        ),

};