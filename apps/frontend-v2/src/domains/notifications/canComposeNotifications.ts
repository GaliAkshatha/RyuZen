import { NotificationAudience } from "@/domains/notifications/notification.types";

/**
 * Real, role-aware allow-list - confirmed directly against
 * ALLOWED_AUDIENCES_BY_ROLE in the real backend SendNotificationUseCase,
 * not guessed at independently. Kept in its own file (not alongside
 * ComposeNotificationForm) so this constant/function pair doesn't
 * trigger a fast-refresh warning for mixing a non-component export
 * into a component file - matching the existing pattern already used
 * for useAuth/useTheme elsewhere in this codebase.
 */
export const ALLOWED_AUDIENCES: Record<string, NotificationAudience[]> = {
  SUPER_ADMIN: [
    NotificationAudience.ALL,
    NotificationAudience.ORG_ADMIN,
    NotificationAudience.FACULTY,
    NotificationAudience.STUDENT,
    NotificationAudience.ALUMNI,
  ],
  ORG_ADMIN: [NotificationAudience.ALL, NotificationAudience.FACULTY, NotificationAudience.STUDENT, NotificationAudience.ALUMNI],
  FACULTY: [NotificationAudience.STUDENT],
};

export function canComposeNotifications(role?: string): boolean {
  return Boolean(role && ALLOWED_AUDIENCES[role]?.length);
}
