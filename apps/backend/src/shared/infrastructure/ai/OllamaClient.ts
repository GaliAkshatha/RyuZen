import { z } from "zod";

import { env } from "../../../config/env.js";
import { Logger } from "../logger/logger.js";
import { cacheService } from "../cache/InMemoryCacheService.js";
import { AIProviderError } from "./AIProviderError.js";

/*
 Shared, reusable Ollama client. This is the ONLY place in the
 codebase that talks to Ollama directly — every AI feature's real
 provider implementation (OllamaResumeReviewProvider,
 OllamaAIProvider, etc.) calls into this, never `fetch` directly, so
 retry/validation/logging/caching behavior lives in one place and
 stays consistent across every AI feature, matching the "no business
 logic should directly communicate with Ollama" requirement.

 Uses Node's built-in `fetch` (Node 18+) rather than adding a new HTTP
 client dependency — nothing else in this backend needed one, and
 Ollama's API is a plain REST/JSON interface.

 Model name is ALWAYS read from env.OLLAMA_MODEL — never hardcoded
 here or in any provider implementation.
*/

const DEFAULT_TIMEOUT_MS = 120_000;

interface GenerateOptions {
    temperature?: number;
}

interface GenerateJsonOptions extends GenerateOptions {
    /** Retries on malformed/invalid JSON output before giving up. */
    maxRetries?: number;
    /**
     * When provided, a successful result is cached under this exact
     * key (typically a hash of the real input, not just a feature
     * name) so a quick retry/refresh on unchanged input doesn't cost
     * another slow local-LLM call. Omitted entirely for
     * highly-personalized, rarely-repeated calls (e.g. a live chat
     * reply) where caching wouldn't apply.
     */
    cacheKey?: string;
    cacheTtlSeconds?: number;
}

interface OllamaGenerateResponse {
    response: string;
}

export interface OllamaChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

interface OllamaChatResponse {
    message: { role: string; content: string };
}

export class OllamaClient {
    static async generateText(
        prompt: string,
        options: GenerateOptions = {}
    ): Promise<string> {
        const raw = await this.callOllama(prompt, {
            temperature: options.temperature
        });
        return raw.trim();
    }

    /**
     * Multi-turn conversation via Ollama's native /api/chat endpoint —
     * used only by AI Chat (see OllamaAIProvider.ts), which is the one
     * AI feature that's genuinely a back-and-forth conversation rather
     * than a single structured request. Every other AI feature uses
     * generateText/generateJson against /api/generate instead.
     */
    static async generateChat(
        messages: OllamaChatMessage[],
        options: GenerateOptions = {}
    ): Promise<string> {
        const controller = new AbortController();
        const timeout = setTimeout(
            () => controller.abort(),
            DEFAULT_TIMEOUT_MS
        );

        try {
            const response = await fetch(
                `${env.OLLAMA_BASE_URL}/api/chat`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        model: env.OLLAMA_MODEL,
                        messages,
                        stream: false,
                        options: {
                            temperature: options.temperature ?? 0.7
                        }
                    }),
                    signal: controller.signal
                }
            );

            if (!response.ok) {
                throw new AIProviderError(
                    `Ollama chat request failed with status ${response.status}.`
                );
            }

            const data = (await response.json()) as OllamaChatResponse;
            return data.message.content.trim();
        } catch (error) {
            if (error instanceof AIProviderError) {
                throw error;
            }

            const message =
                error instanceof Error ? error.message : String(error);

            Logger.error(
                `OllamaClient: chat request to ${env.OLLAMA_BASE_URL} failed - ${message}`
            );

            throw new AIProviderError(
                "Unable to reach the Ollama server. Confirm it is running and OLLAMA_BASE_URL is correct."
            );
        } finally {
            clearTimeout(timeout);
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
                const raw = await this.callOllama(prompt, {
                    format: "json",
                    temperature: options.temperature
                });

                const parsed: unknown = JSON.parse(raw);
                const result = schema.parse(parsed);

                if (options.cacheKey) {
                    await cacheService.set(
                        options.cacheKey,
                        result,
                        options.cacheTtlSeconds ?? 300
                    );
                }

                return result;
            } catch (error) {
                lastError = error;
                Logger.warn(
                    `OllamaClient.generateJson: attempt ${attempt + 1}/${maxRetries + 1} produced invalid output - ${
                        error instanceof Error ? error.message : String(error)
                    }`
                );
            }
        }

        Logger.error(
            `OllamaClient.generateJson: all ${maxRetries + 1} attempts failed - ${
                lastError instanceof Error ? lastError.message : String(lastError)
            }`
        );

        throw new AIProviderError(
            "The AI model did not return valid structured output after multiple attempts."
        );
    }

    private static async callOllama(
        prompt: string,
        options: { format?: "json"; temperature?: number }
    ): Promise<string> {
        const controller = new AbortController();
        const timeout = setTimeout(
            () => controller.abort(),
            DEFAULT_TIMEOUT_MS
        );

        try {
            const response = await fetch(
                `${env.OLLAMA_BASE_URL}/api/generate`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        model: env.OLLAMA_MODEL,
                        prompt,
                        stream: false,
                        ...(options.format ? { format: options.format } : {}),
                        options: {
                            temperature: options.temperature ?? 0.7
                        }
                    }),
                    signal: controller.signal
                }
            );

            if (!response.ok) {
                throw new AIProviderError(
                    `Ollama request failed with status ${response.status}.`
                );
            }

            const data = (await response.json()) as OllamaGenerateResponse;
            return data.response;
        } catch (error) {
            if (error instanceof AIProviderError) {
                throw error;
            }

            const message =
                error instanceof Error ? error.message : String(error);

            Logger.error(
                `OllamaClient: request to ${env.OLLAMA_BASE_URL} failed - ${message}`
            );

            throw new AIProviderError(
                "Unable to reach the Ollama server. Confirm it is running and OLLAMA_BASE_URL is correct."
            );
        } finally {
            clearTimeout(timeout);
        }
    }
}
