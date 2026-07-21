import { RecommendationType } from "@/types/enums";

/**
 * Mirrors RecommendationsResponseDto exactly. Single GET endpoint,
 * open to every authenticated role with no restriction.
 *
 * A genuinely different nuance from AI2/AI3/AI4, confirmed this
 * milestone: there is no numeric score at all here. The CANDIDATES
 * themselves (which Activities/Events/Clubs to suggest) are 100% real
 * — GetRecommendationsUseCase filters genuinely published Activities/
 * Events and ACTIVE Clubs against the caller's own real submissions/
 * registrations/memberships, up to 5 per category (MAX_PER_CATEGORY).
 * Only the per-item `reason` string is templated placeholder text
 * (StubRecommendationProvider's own doc comment confirms this
 * explicitly). Events and Clubs recommendations require the caller to
 * resolve to a Student record — non-students only ever get Activity
 * recommendations, silently getting zero Events/Clubs suggestions
 * (not an error, just an empty category).
 */
export interface RecommendationsResponseDto {
  recommendations: RecommendationItem[];
}

/** Mirrors RecommendationItem exactly. `id` links directly to the real Activity/Event/Club record. */
export interface RecommendationItem {
  type: RecommendationType;
  id: string;
  title: string;
  reason: string;
}
