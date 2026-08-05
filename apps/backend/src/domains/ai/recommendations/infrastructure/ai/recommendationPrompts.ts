import { z } from "zod";

import { RecommendationCandidate } from "../../application/ports/RecommendationCandidate.js";

/** Shared between OllamaRecommendationProvider and GeminiRecommendationProvider. */
export const ReasonsSchema = z.object({
    reasons: z.array(
        z.object({
            id: z.string(),
            reason: z.string().min(1).max(200)
        })
    )
});

export const FALLBACK_REASON = "You haven't engaged with this yet — it might be worth a look.";

export function buildRecommendationPrompt(candidates: RecommendationCandidate[]): string {
    const list = candidates
        .map(c => `- id: "${c.id}", type: ${c.type}, title: "${c.title}"`)
        .join("\n");

    return `You are recommending campus activities, events, and clubs to a student on a campus platform, based on things they have NOT yet engaged with.

Candidates:
${list}

For each candidate, write a short, specific, encouraging reason (max 1 sentence) why this student might want to check it out. Vary your phrasing across items — do not repeat the same sentence structure for every one.

Respond with ONLY a JSON object matching this exact shape, no other text:
{
  "reasons": [
    { "id": "(the exact id from above)", "reason": "(your 1-sentence reason)" }
  ]
}

Include exactly one entry per candidate id listed above, in any order.`;
}
