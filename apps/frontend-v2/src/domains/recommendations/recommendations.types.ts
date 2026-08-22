/** Matches the real backend Recommendations DTOs exactly. */
export const RecommendationType = { ACTIVITY: "ACTIVITY", EVENT: "EVENT", CLUB: "CLUB" } as const;
export type RecommendationType = (typeof RecommendationType)[keyof typeof RecommendationType];

export interface RecommendationItem {
  type: RecommendationType;
  id: string;
  title: string;
  reason: string;
}
