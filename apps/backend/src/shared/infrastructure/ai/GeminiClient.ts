import { z } from "zod";
import { GoogleGenerativeAI, GoogleGenerativeAIFetchError } from "@google/generative-ai";

import { env } from "../../../config/env.js";
import { Logger } from "../logger/logger.js";
import { cacheService } from "../cache/InMemoryCacheService.js";
import { AIProviderError } from "./AIProviderError.js";

/*
 Shared, reusable Gemini client - the ONLY place in the codebase that
 talks to the Gemini SDK directly, mirroring OllamaClient.ts's exact
 public shape (generateText/generateJson/generateChat) so every
 domain's Gemini*Provider reads identically to its Ollama*Provider
 counterpart. Every AI feature's real provider implementation calls
 into this, never the SDK directly.

 Model name is ALWAYS read from env.GEMINI_MODEL, API key from
 env.GEMINI_API_KEY - never hardcoded here or in any provider
 implementation.
*/

interface GenerateOptions {
    temperature?: number;
}

interface GenerateJsonOptions extends GenerateOptions {
    /** Retries on malformed/invalid JSON output before giving up. */
    maxRetries?: number;
    /** Same caching contract as OllamaClient.generateJson - see there for the full rationale. */
    cacheKey?: string;
    cacheTtlSeconds?: number;
}

export interface GeminiChatMessage {
    role: "user" | "assistant";
    content: string;
}

let client: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
    if (!env.GEMINI_API_KEY) {
        throw new AIProviderError(
            "Gemini API key missing. Set GEMINI_API_KEY, or set AI_PROVIDER=ollama to use a local model instead."
        );
    }

    client ??= new GoogleGenerativeAI(env.GEMINI_API_KEY);
    return client;
}

function toAIProviderError(error: unknown, fallbackMessage: string): AIProviderError {
    if (error instanceof AIProviderError) {
        return error;
    }

    if (error instanceof GoogleGenerativeAIFetchError) {
        if (error.status === 401 || error.status === 403) {
            return new AIProviderError("Gemini API key is invalid or unauthorized.");
        }
        if (error.status === 429) {
            return new AIProviderError("Gemini quota exceeded. Try again later, or set AI_PROVIDER=ollama.");
        }
        if (error.status === 404) {
            return new AIProviderError(`Gemini model "${env.GEMINI_MODEL}" not found.`);
        }
        return new AIProviderError("Gemini is currently unavailable.");
    }

    const message = error instanceof Error ? error.message : String(error);
    Logger.error(`GeminiClient: ${fallbackMessage} - ${message}`);
    return new AIProviderError(fallbackMessage);
}

export class GeminiClient {
    static async generateText(
        prompt: string,
        options: GenerateOptions = {}
    ): Promise<string> {
        try {
            const model = getClient().getGenerativeModel({
                model: env.GEMINI_MODEL,
                generationConfig: { temperature: options.temperature ?? 0.7 }
            });

            const result = await model.generateContent(prompt);
            return result.response.text().trim();
        } catch (error) {
            throw toAIProviderError(
                error,
                "Unable to reach Gemini. Confirm GEMINI_API_KEY is set and valid."
            );
        }
    }

    /**
     * Multi-turn conversation via the SDK's chat session - used only
     * by AI Chat, mirroring OllamaClient.generateChat's role in that
     * one domain.
     */
    static async generateChat(
        messages: GeminiChatMessage[],
        systemPrompt: string,
        options: GenerateOptions = {}
    ): Promise<string> {
        try {
            const model = getClient().getGenerativeModel({
                model: env.GEMINI_MODEL,
                systemInstruction: systemPrompt,
                generationConfig: { temperature: options.temperature ?? 0.7 }
            });

            const history = messages.slice(0, -1).map(message => ({
                role: message.role === "user" ? "user" : "model",
                parts: [{ text: message.content }]
            }));

            const lastMessage = messages[messages.length - 1];

            if (!lastMessage) {
                throw new AIProviderError("At least one message is required.");
            }

            const chat = model.startChat({ history });
            const result = await chat.sendMessage(lastMessage.content);
            return result.response.text().trim();
        } catch (error) {
            throw toAIProviderError(
                error,
                "Unable to reach Gemini. Confirm GEMINI_API_KEY is set and valid."
            );
        }
    }

    static async generateJson<T>(
        prompt: string,
        schema: z.ZodType<T>,
        options: GenerateJsonOptions = {}
    ): Promise<T> {
        if (options.cacheKey) {
            const cached = await cacheService.get<T>(options.cacheKey);
            if (cached !== null) {
                return cached;
            }
        }

        const maxRetries = options.maxRetries ?? 2;
        let lastError: unknown;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                const model = getClient().getGenerativeModel({
                    model: env.GEMINI_MODEL,
                    generationConfig: {
                        temperature: options.temperature ?? 0.7,
                        responseMimeType: "application/json"
                    }
                });

                const result = await model.generateContent(prompt);
                const raw = result.response.text();

                const parsed: unknown = JSON.parse(raw);
                const parsedResult = schema.parse(parsed);

                if (options.cacheKey) {
                    await cacheService.set(
                        options.cacheKey,
                        parsedResult,
                        options.cacheTtlSeconds ?? 300
                    );
                }

                return parsedResult;
            } catch (error) {
                if (error instanceof AIProviderError) {
                    throw error;
                }

                if (error instanceof GoogleGenerativeAIFetchError) {
                    throw toAIProviderError(error, "Gemini is currently unavailable.");
                }

                lastError = error;
                Logger.warn(
                    `GeminiClient.generateJson: attempt ${attempt + 1}/${maxRetries + 1} produced invalid output - ${
                        error instanceof Error ? error.message : String(error)
                    }`
                );
            }
        }

        Logger.error(
            `GeminiClient.generateJson: all ${maxRetries + 1} attempts failed - ${
                lastError instanceof Error ? lastError.message : String(lastError)
            }`
        );

        throw new AIProviderError(
            "The AI model did not return valid structured output after multiple attempts."
        );
    }
}
