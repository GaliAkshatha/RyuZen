/** Matches the real backend CareerScoreResponseDto exactly - confirmed directly, no fields invented. */
export interface CareerScore {
  careerScore: number;
  leaderboardScore: number;
  resumeScore: number;
  profileCompletenessScore: number;
  achievementsScore: number;
  label: string;
  narrative: string;
  recommendations: string[];
  roadmap: string[];
}
