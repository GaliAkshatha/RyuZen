/** Matches the real backend ResumeReviewResponseDto exactly. */
export interface ResumeReview {
  score: number;
  strengths: string[];
  improvements: string[];
  summary: string;
}
