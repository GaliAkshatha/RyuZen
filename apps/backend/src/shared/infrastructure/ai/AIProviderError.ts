import { ApiError } from "../../core/http/ApiError.js";
import { HttpStatus } from "../../core/http/HttpStatus.js";

/**
 * Thrown by both GeminiClient and OllamaClient (replacing the earlier
 * Ollama-only OllamaError, which extended plain Error - meaning the
 * global errorHandler couldn't recognize it as an ApiError and always
 * flattened it to a generic "Internal Server Error", losing the
 * meaningful message). Extending ApiError means the real, useful
 * message ("Gemini API key missing.", "Unable to reach the Ollama
 * server...") reaches the client with a 503, while the stack trace
 * still never does - errorHandler.ts only ever forwards `.message`
 * for ApiError instances, confirmed by reading it directly.
 *
 * Deliberately provider-agnostic: nothing outside
 * shared/infrastructure/ai/ needs to know or care whether a failure
 * came from Gemini or Ollama.
 */
export class AIProviderError extends ApiError {
    constructor(message: string) {
        super(message, HttpStatus.SERVICE_UNAVAILABLE);
    }
}
