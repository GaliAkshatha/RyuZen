import { IRecommendationProvider } from "../../application/ports/IRecommendationProvider.js";
import { RecommendationCandidate } from "../../application/ports/RecommendationCandidate.js";
import { RecommendationItem } from "../../application/ports/RecommendationItem.js";

import { GeminiClient } from "../../../../../shared/infrastructure/ai/GeminiClient.js";

import { ReasonsSchema, FALLBACK_REASON, buildRecommendationPrompt } from "./recommendationPrompts.js";

/*
 Real Gemini-backed recommendation reasons - the cloud counterpart to
 OllamaRecommendationProvider, sharing prompt/schema/fallback via
 recommendationPrompts.ts, including the same graceful-fallback
 behavior when the AI call fails.
*/

export class GeminiRecommendationProvider implements IRecommendationProvider {
    async annotate(
        candidates: RecommendationCandidate[]
    ): Promise<RecommendationItem[]> {
        if (candidates.length === 0) {
            return [];
        }

        const prompt = buildRecommendationPrompt(candidates);

        let reasonById = new Map<string, string>();
        try {
            const { reasons } = await GeminiClient.generateJson(prompt, ReasonsSchema);
            reasonById = new Map(reasons.map(r => [r.id, r.reason]));
        } catch {
            // Already logged by GeminiClient; fall back to an honest
            // reason for every candidate rather than failing the
            // whole recommendations list over AI text.
        }

        return candidates.map(candidate => ({
            type: candidate.type,
            id: candidate.id,
            title: candidate.title,
            reason: reasonById.get(candidate.id) ?? FALLBACK_REASON
        }));
    }
}
