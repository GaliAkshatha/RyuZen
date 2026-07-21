/**
 * Mirrors ResumeReviewResponseDto exactly. Single POST endpoint, open
 * to every authenticated role with no restriction — reviews the
 * caller's OWN career data (Resume, Skills, Portfolio Projects,
 * Experience, Education, Certifications), no body needed.
 *
 * IMPORTANT nuance confirmed this milestone, different from AI1's
 * fully-placeholder reply: `StubResumeReviewProvider`'s own doc
 * comment states the numeric `score` is a REAL, deterministic
 * completeness heuristic — weighted counts of skills/projects/
 * experience/education/certifications, the exact same logic
 * `GenerateResumeUseCase` (CE6) uses — not fake. Only the qualitative
 * `strengths`/`improvements`/`summary` text is clearly-labelled
 * placeholder boilerplate, not genuine AI-generated insight. If the
 * caller already has a CE6 Resume record, this endpoint also updates
 * its `atsScore` field server-side with the same `score` value.
 */
export interface ResumeReviewResponseDto {
  score: number;
  strengths: string[];
  improvements: string[];
  summary: string;
}
