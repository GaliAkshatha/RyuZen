import { z } from "zod";

import { CareerScoreInput } from "../../application/ports/CareerScoreInput.js";

/**
 * Shared between OllamaCareerScoreProvider and GeminiCareerScoreProvider.
 * The label formula is deterministic on purpose and must never differ
 * by provider; the prompt/schema are shared so both providers ask the
 * model the same question the same way.
 */
export const InsightSchema = z.object({
    narrative: z.string().min(1).max(600),
    recommendations: z.array(z.string()).min(2).max(5),
    roadmap: z.array(z.string()).min(2).max(4)
});

export function computeCareerScoreLabel(score: number): string {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Strong Profile";
    if (score >= 35) return "Building Momentum";
    return "Getting Started";
}

export function buildCareerScorePrompt(input: CareerScoreInput, label: string): string {
    return `You are a career advisor evaluating a student's overall career readiness on a campus placement platform.

A deterministic system has already computed these real scores (0-100 each):
- Overall Career Score: ${input.careerScore} (label: "${label}")
- Leaderboard participation score: ${input.leaderboardScore}
- Resume completeness score: ${input.resumeScore}
- Profile completeness score: ${input.profileCompletenessScore}
- Verified achievements score: ${input.achievementsScore}

Do not invent different scores — use these exact numbers as the basis for your response.

Respond with ONLY a JSON object matching this exact shape, no other text:
{
  "narrative": "a 2-4 sentence summary of this student's overall career readiness, referencing which of the scores above are their real strength or weakness",
  "recommendations": ["2-5 specific, actionable next steps tied to whichever score above is weakest"],
  "roadmap": ["2-4 sequential milestones, ordered by what to tackle first, to meaningfully raise the overall score"]
}`;
}
