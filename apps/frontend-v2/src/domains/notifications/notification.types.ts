/** Matches the real backend NotificationResponseDto exactly. */
export const NotificationType = {
  ANNOUNCEMENT: "ANNOUNCEMENT",
  ALERT: "ALERT",
  INFO: "INFO",
  REMINDER: "REMINDER",
} as const;
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

/** Matches the real backend NotificationAudience exactly - TARGETED is deliberately excluded here, since it's only ever used internally for system-generated single-recipient notifications, never a real choice a sender picks. */
export const NotificationAudience = {
  ALL: "ALL",
  ORG_ADMIN: "ORG_ADMIN",
  FACULTY: "FACULTY",
  STUDENT: "STUDENT",
  ALUMNI: "ALUMNI",
} as const;
export type NotificationAudience = (typeof NotificationAudience)[keyof typeof NotificationAudience];

export interface Notification {
  id: string;
  organizationId: string;
  senderId: string;
  title: string;
  message: string;
  type?: NotificationType;
  targetAudience: string;
  isRead: boolean;
  createdAt?: string;
}

/**
 * Matches the real backend SendNotificationSchema exactly.
 * departmentIds is real, optional narrowing - only meaningful when
 * targetAudience is STUDENT or FACULTY (confirmed: the backend
 * rejects it on any other audience with a real 400).
 */
export interface SendNotificationRequest {
  title: string;
  message: string;
  type?: NotificationType;
  targetAudience?: NotificationAudience;
  departmentIds?: string[];
}
