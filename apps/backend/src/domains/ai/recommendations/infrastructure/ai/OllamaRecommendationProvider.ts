import { IRecommendationProvider } from "../../application/ports/IRecommendationProvider.js";
import { RecommendationCandidate } from "../../application/ports/RecommendationCandidate.js";
import { RecommendationItem } from "../../application/ports/RecommendationItem.js";

import { OllamaClient } from "../../../../../shared/infrastructure/ai/OllamaClient.js";

import { ReasonsSchema, FALLBACK_REASON, buildRecommendationPrompt } from "./recommendationPrompts.js";

/*
 Real Ollama-backed recommendation reasons. The CANDIDATES themselves
 are already real (GetRecommendationsUseCase); only the "reason" per
 item is AI-generated, batched into one call, sharing prompt/schema
 with GeminiRecommendationProvider via recommendationPrompts.ts.
*/

export class OllamaRecommendationProvider implements IRecommendationProvider {
    async annotate(
        candidates: RecommendationCandidate[]
    ): Promise<RecommendationItem[]> {
        if (candidates.length === 0) {
            return [];
        }

        const prompt = buildRecommendationPrompt(candidates);

        let reasonById = new Map<string, string>();
        try {
            const { reasons } = await OllamaClient.generateJson(prompt, ReasonsSchema);
            reasonById = new Map(reasons.map(r => [r.id, r.reason]));
        } catch {
            // Already logged by OllamaClient; fall back to an honest
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
