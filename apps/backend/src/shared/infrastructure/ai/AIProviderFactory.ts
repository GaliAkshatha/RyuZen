import { env } from "../../../config/env.js";

import { IAIProvider } from "../../../domains/ai/chat/application/ports/IAIProvider.js";
import { OllamaAIProvider } from "../../../domains/ai/chat/infrastructure/ai/OllamaAIProvider.js";
import { GeminiAIProvider } from "../../../domains/ai/chat/infrastructure/ai/GeminiAIProvider.js";

import { IResumeReviewProvider } from "../../../domains/ai/resume-review/application/ports/IResumeReviewProvider.js";
import { OllamaResumeReviewProvider } from "../../../domains/ai/resume-review/infrastructure/ai/OllamaResumeReviewProvider.js";
import { GeminiResumeReviewProvider } from "../../../domains/ai/resume-review/infrastructure/ai/GeminiResumeReviewProvider.js";

import { ICareerScoreProvider } from "../../../domains/ai/career-score/application/ports/ICareerScoreProvider.js";
import { OllamaCareerScoreProvider } from "../../../domains/ai/career-score/infrastructure/ai/OllamaCareerScoreProvider.js";
import { GeminiCareerScoreProvider } from "../../../domains/ai/career-score/infrastructure/ai/GeminiCareerScoreProvider.js";

import { IMockInterviewProvider } from "../../../domains/ai/interview/application/ports/IMockInterviewProvider.js";
import { OllamaMockInterviewProvider } from "../../../domains/ai/interview/infrastructure/ai/OllamaMockInterviewProvider.js";
import { GeminiMockInterviewProvider } from "../../../domains/ai/interview/infrastructure/ai/GeminiMockInterviewProvider.js";

import { IRecommendationProvider } from "../../../domains/ai/recommendations/application/ports/IRecommendationProvider.js";
import { OllamaRecommendationProvider } from "../../../domains/ai/recommendations/infrastructure/ai/OllamaRecommendationProvider.js";
import { GeminiRecommendationProvider } from "../../../domains/ai/recommendations/infrastructure/ai/GeminiRecommendationProvider.js";

import { ISkillExtractionProvider } from "../../../domains/career/skills/application/ports/ISkillExtractionProvider.js";
import { OllamaSkillExtractionProvider } from "../../../domains/career/skills/infrastructure/ai/OllamaSkillExtractionProvider.js";
import { GeminiSkillExtractionProvider } from "../../../domains/career/skills/infrastructure/ai/GeminiSkillExtractionProvider.js";

/**
 * The single place in the codebase where AI_PROVIDER is read to make
 * a real decision — every domain's DI container calls exactly one of
 * these functions instead of ever importing env.AI_PROVIDER or
 * checking it directly, and instead of hardcoding `new
 * Ollama*Provider()`/`new Gemini*Provider()` the way each container
 * used to. Adding a new provider (OpenAI, Claude, etc. — see the
 * final report's recommendations) means adding one branch inside each
 * of these 6 functions, never touching a use case or the containers
 * that call them.
 *
 * One factory function per domain (not one generic function) because
 * each domain has its own port interface and its own pair of
 * Ollama/Gemini classes — a single generic factory would need an
 * awkward type parameter or a constructor map that adds complexity
 * without removing any, since each domain still needs exactly one
 * call site regardless.
 */
export function resolveAiProvider(): "gemini" | "ollama" {
    return env.AI_PROVIDER === "ollama" ? "ollama" : "gemini";
}

export function createAiChatProvider(): IAIProvider {
    return resolveAiProvider() === "ollama"
        ? new OllamaAIProvider()
        : new GeminiAIProvider();
}

export function createResumeReviewProvider(): IResumeReviewProvider {
    return resolveAiProvider() === "ollama"
        ? new OllamaResumeReviewProvider()
        : new GeminiResumeReviewProvider();
}

export function createCareerScoreProvider(): ICareerScoreProvider {
    return resolveAiProvider() === "ollama"
        ? new OllamaCareerScoreProvider()
        : new GeminiCareerScoreProvider();
}

export function createMockInterviewProvider(): IMockInterviewProvider {
    return resolveAiProvider() === "ollama"
        ? new OllamaMockInterviewProvider()
        : new GeminiMockInterviewProvider();
}

export function createRecommendationProvider(): IRecommendationProvider {
    return resolveAiProvider() === "ollama"
        ? new OllamaRecommendationProvider()
        : new GeminiRecommendationProvider();
}

export function createSkillExtractionProvider(): ISkillExtractionProvider {
    return resolveAiProvider() === "ollama"
        ? new OllamaSkillExtractionProvider()
        : new GeminiSkillExtractionProvider();
}
