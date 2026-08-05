import { z } from "zod";

import { ResumeReviewInput } from "../../application/ports/ResumeReviewInput.js";

/**
 * Shared between OllamaResumeReviewProvider and GeminiResumeReviewProvider
 * so the deterministic score formula and the prompt/schema stay
 * identical regardless of which provider is configured - a difference
 * here would mean a resume's score changes depending on AI_PROVIDER,
 * which must never happen (the score is deterministic on purpose, see
 * the providers' own doc comments).
 */
export const ReviewSchema = z.object({
    strengths: z.array(z.string()).max(6),
    improvements: z.array(z.string()).max(6),
    summary: z.string().min(1).max(600)
});

export function computeResumeScore(input: ResumeReviewInput): number {
    return Math.min(
        100,
        input.skills.length * 5 +
        input.projectTitles.length * 10 +
        input.experienceRoles.length * 15 +
        input.educationDegrees.length * 10 +
        input.certificationTitles.length * 5
    );
}

export function buildResumeReviewPrompt(input: ResumeReviewInput, score: number): string {
    return `You are an experienced career advisor reviewing a student's resume for a campus placement platform.

Resume contents:
- Skills: ${input.skills.length > 0 ? input.skills.join(", ") : "(none listed)"}
- Projects: ${input.projectTitles.length > 0 ? input.projectTitles.join(", ") : "(none listed)"}
- Work experience: ${input.experienceRoles.length > 0 ? input.experienceRoles.join(", ") : "(none listed)"}
- Education: ${input.educationDegrees.length > 0 ? input.educationDegrees.join(", ") : "(none listed)"}
- Certifications: ${input.certificationTitles.length > 0 ? input.certificationTitles.join(", ") : "(none listed)"}

A separate, deterministic system has already computed a completeness score of ${score}/100 for this resume based on how many entries exist in each category above. Do not invent a different score — focus only on qualitative feedback.

Respond with ONLY a JSON object matching this exact shape, no other text:
{
  "strengths": ["specific, genuine strengths based on what's actually listed above, at most 6"],
  "improvements": ["specific, actionable improvements based on what's missing or weak above, at most 6"],
  "summary": "a 2-4 sentence overall summary of this resume's readiness for placements"
}

Be specific to the actual content listed above — do not give generic advice that could apply to any resume.`;
}
