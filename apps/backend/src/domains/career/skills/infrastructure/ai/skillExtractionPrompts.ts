import { z } from "zod";

import { SkillExtractionInput } from "../../application/ports/SkillExtractionInput.js";

/** Shared between OllamaSkillExtractionProvider and GeminiSkillExtractionProvider. */
export const SuggestionsSchema = z.object({
    skills: z.array(
        z.object({
            name: z.string().min(1).max(60),
            confidence: z.number().min(0).max(100),
            evidence: z.string().min(1).max(200)
        })
    ).max(15)
});

export function hasAnyEvidence(input: SkillExtractionInput): boolean {
    return (
        input.projects.length > 0 ||
        input.certifications.length > 0 ||
        input.experience.length > 0 ||
        input.completedActivityTitles.length > 0
    );
}

export function buildSkillExtractionPrompt(input: SkillExtractionInput): string {
    const projectLines = input.projects.length
        ? input.projects
            .map(
                p =>
                    `- Project "${p.title}"${p.description ? `: ${p.description}` : ""}${p.techStack.length ? ` (tech stack: ${p.techStack.join(", ")})` : ""}`
            )
            .join("\n")
        : "(none)";

    const certLines = input.certifications.length
        ? input.certifications
            .map(
                c =>
                    `- Certification "${c.title}" from ${c.issuer}${c.skills.length ? ` (tagged skills: ${c.skills.join(", ")})` : ""}`
            )
            .join("\n")
        : "(none)";

    const experienceLines = input.experience.length
        ? input.experience
            .map(
                e =>
                    `- ${e.role} at ${e.company}${e.description ? `: ${e.description}` : ""}`
            )
            .join("\n")
        : "(none)";

    const activityLines = input.completedActivityTitles.length
        ? input.completedActivityTitles.map(t => `- ${t}`).join("\n")
        : "(none)";

    const existing = input.existingSkillNames.length
        ? input.existingSkillNames.join(", ")
        : "(none)";

    return `You are analyzing a student's real campus profile to suggest skills for their career profile on a placement platform.

Projects:
${projectLines}

Certifications:
${certLines}

Work experience:
${experienceLines}

Completed activities:
${activityLines}

Skills the student ALREADY has (do not suggest any of these again): ${existing}

Based ONLY on the real evidence above, suggest specific skills this student has genuinely demonstrated. For each one, cite exactly which piece of evidence above supports it. Do not suggest generic skills ("teamwork", "communication") unless there is specific evidence for them. Do not suggest more than 15 skills. If there is not enough evidence for a skill, do not include it.

Respond with ONLY a JSON object matching this exact shape, no other text:
{
  "skills": [
    { "name": "specific skill name", "confidence": 0-100, "evidence": "which project/certification/experience/activity above supports this" }
  ]
}`;
}
