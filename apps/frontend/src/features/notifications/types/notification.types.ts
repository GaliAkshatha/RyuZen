import { NotificationAudience, NotificationType } from "@/types/enums";

/**
 * Mirrors NotificationResponseDto exactly. A genuinely elegant model
 * confirmed this milestone: notifications are broadcast — ONE record
 * shared by everyone matching `targetAudience` (findForAudience(org,
 * role), not a per-recipient copy) — but `isRead` is computed
 * per-viewer at response-mapping time from a `readBy: string[]` array
 * on the entity (`isReadBy(userId)`). Send is ORG_ADMIN + FACULTY,
 * with SUPER_ADMIN explicitly excluded (same recurring pattern as
 * Placements). List and Mark Read are both open to all authenticated
 * users, implicitly self-scoped.
 */
export interface NotificationResponseDto {
  id: string;
  organizationId: string;
  senderId: string;
  title: string;
  message: string;
  type?: NotificationType;
  targetAudience: NotificationAudience;
  isRead: boolean;
  createdAt?: string;
}

/** Mirrors SendNotificationDto */
export interface SendNotificationPayload {
  title: string;
  message: string;
  type?: NotificationType;
  targetAudience?: NotificationAudience;
}
