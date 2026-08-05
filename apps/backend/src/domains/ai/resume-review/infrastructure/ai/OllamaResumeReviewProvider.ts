import { createHash } from "node:crypto";

import { IResumeReviewProvider } from "../../application/ports/IResumeReviewProvider.js";
import { ResumeReviewInput } from "../../application/ports/ResumeReviewInput.js";
import { ResumeReviewResult } from "../../application/ports/ResumeReviewResult.js";

import { OllamaClient } from "../../../../../shared/infrastructure/ai/OllamaClient.js";

import { ReviewSchema, computeResumeScore, buildResumeReviewPrompt } from "./resumeReviewPrompts.js";

/*
 Real Ollama-backed resume review, replacing StubResumeReviewProvider.

 The completeness SCORE is deliberately kept exactly as it was in the
 stub (same formula, same weights, shared with GeminiResumeReviewProvider
 via resumeReviewPrompts.ts) — it's a real, deterministic heuristic, not
 something that needed an LLM. Only the qualitative strengths/
 improvements/summary text is genuinely AI-generated.

 No business logic outside this file talks to Ollama directly; every
 call funnels through the shared OllamaClient (retry, structured
 validation, caching, logging all live there, not duplicated here).
*/

export class OllamaResumeReviewProvider implements IResumeReviewProvider {
    async review(input: ResumeReviewInput): Promise<ResumeReviewResult> {
        const score = computeResumeScore(input);
        const prompt = buildResumeReviewPrompt(input, score);

        const cacheKey =
            "resume-review:ollama:" +
            createHash("sha256")
                .update(JSON.stringify(input))
                .digest("hex");

        const { strengths, improvements, summary } =
            await OllamaClient.generateJson(prompt, ReviewSchema, {
                cacheKey,
                cacheTtlSeconds: 300
            });

        return { score, strengths, improvements, summary };
    }
}
