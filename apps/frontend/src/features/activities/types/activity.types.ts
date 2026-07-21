import { ActivityStatus, ActivityType, ActivityVisibility } from "@/types/enums";

export interface ActivityAttachment {
  name: string;
  url: string;
  mimeType: string;
}

/**
 * Mirrors ActivityResponseDto exactly. GET (list/detail) requires only
 * authentication — no role restriction — so every role can browse.
 * Create/Update/Publish/Close/Delete are gated to SUPER_ADMIN + FACULTY
 * ONLY, confirmed this milestone: ORG_ADMIN is explicitly excluded from
 * activity management (unlike most other admin resources in this app).
 * See canManageActivities() below.
 */
export interface ActivityResponseDto {
  id: string;
  organizationId: string;
  createdBy: string;
  title: string;
  description: string;
  type: ActivityType;
  status: ActivityStatus;
  visibility: ActivityVisibility;
  points: number;
  penaltyPoints: number;
  startDate: string;
  endDate: string;
  attachments: ActivityAttachment[];
  createdAt?: string;
  updatedAt?: string;
}

/** Mirrors CreateActivityDto — "attachments" is required (an empty array satisfies it) */
export interface CreateActivityPayload {
  title: string;
  description: string;
  type: ActivityType;
  visibility: ActivityVisibility;
  points: number;
  penaltyPoints: number;
  startDate: string;
  endDate: string;
  attachments: ActivityAttachment[];
}

/** Mirrors UpdateActivityDto — every field optional */
export interface UpdateActivityPayload {
  title?: string;
  description?: string;
  type?: ActivityType;
  visibility?: ActivityVisibility;
  points?: number;
  penaltyPoints?: number;
  startDate?: string;
  endDate?: string;
  attachments?: ActivityAttachment[];
}

/** Mirrors ActivityFilter (query params, all optional) */
export interface ActivityListFilters {
  status?: ActivityStatus;
  type?: ActivityType;
  visibility?: ActivityVisibility;
  createdBy?: string;
}
