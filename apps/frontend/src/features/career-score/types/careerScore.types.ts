/**
 * Mirrors CareerScoreResponseDto exactly. Single GET endpoint, open to
 * every authenticated role with no restriction. Genuinely aggregates
 * FOUR real sub-scores, confirmed this milestone by reading
 * GetCareerScoreUseCase directly:
 *
 * - `leaderboardScore` = min(100, totalPoints) from the C4 Leaderboard
 *   entry — 0 for non-students (no Student record resolves).
 * - `resumeScore` = the caller's CE6 Resume.atsScore (the same value
 *   AI2's Resume Review writes) — 0 if no Resume exists.
 * - `profileCompletenessScore` = min(100, skills*5 + projects*10 +
 *   experience*15 + education*10 + certifications*5) — the exact same
 *   weighted formula AI2 uses, recomputed independently here rather
 *   than reused.
 * - `achievementsScore` = min(100, verifiedAchievementCount * 20) —
 *   only VERIFIED (CE5) achievements count; 0 for non-students.
 * - `careerScore` = round(average of the four scores above).
 *
 * Same real-score/templated-narrative split as AI2: `label` is a real
 * deterministic threshold mapping on `careerScore` (>=80 "Excellent",
 * >=60 "Strong Profile", >=35 "Building Momentum", else "Getting
 * Started"), but `narrative` is placeholder text, not AI-generated.
 */
export interface CareerScoreResponseDto {
  careerScore: number;
  leaderboardScore: number;
  resumeScore: number;
  profileCompletenessScore: number;
  achievementsScore: number;
  label: string;
  narrative: string;
}
