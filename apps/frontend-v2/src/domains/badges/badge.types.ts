/** Matches the real backend BadgeResponseDto exactly - a global catalog entry, SUPER_ADMIN-managed. */
export interface Badge {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  criteria?: string;
  points: number;
  createdAt?: string;
  updatedAt?: string;
}

/** Matches the real backend StudentBadgeResponseDto exactly - a real award record, always enriched with the badge's own details inline. */
export interface StudentBadge {
  id: string;
  studentId: string;
  badgeId: string;
  awardedBy: string;
  awardedAt: string;
  badge?: {
    name: string;
    description?: string;
    icon?: string;
    points: number;
  };
}

/** Matches CreateBadgeSchema exactly. */
export interface CreateBadgeRequest {
  name: string;
  description?: string;
  icon?: string;
  criteria?: string;
  points?: number;
}

/** Matches UpdateBadgeSchema exactly - same fields as create, all optional. */
export type UpdateBadgeRequest = Partial<CreateBadgeRequest>;

/** Matches AwardBadgeSchema exactly. */
export interface AwardBadgeRequest {
  studentId: string;
}
