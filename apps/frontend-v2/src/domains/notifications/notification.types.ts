/** Matches the real backend NotificationResponseDto exactly. */
export const NotificationType = {
  ANNOUNCEMENT: "ANNOUNCEMENT",
  ALERT: "ALERT",
  INFO: "INFO",
  REMINDER: "REMINDER",
} as const;
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

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
