/** Matches the real backend UserStatus enum exactly - INVITED/EMAIL_VERIFIED are lifecycle states, not settable directly. */
export const UserAccountStatus = {
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  ARCHIVED: "ARCHIVED",
} as const;
export type UserAccountStatus = (typeof UserAccountStatus)[keyof typeof UserAccountStatus];

/** Matches the real backend Permission enum exactly. */
export const Permission = {
  MANAGE_ORGANIZATION: "MANAGE_ORGANIZATION",
  MANAGE_USERS: "MANAGE_USERS",
  MANAGE_DEPARTMENTS: "MANAGE_DEPARTMENTS",
  MANAGE_CLUBS: "MANAGE_CLUBS",
  CREATE_ACTIVITY: "CREATE_ACTIVITY",
  UPDATE_ACTIVITY: "UPDATE_ACTIVITY",
  DELETE_ACTIVITY: "DELETE_ACTIVITY",
  REVIEW_SUBMISSION: "REVIEW_SUBMISSION",
  VIEW_LEADERBOARD: "VIEW_LEADERBOARD",
  CREATE_EVENT: "CREATE_EVENT",
  MANAGE_EVENTS: "MANAGE_EVENTS",
  SEND_NOTIFICATION: "SEND_NOTIFICATION",
  MANAGE_PLACEMENTS: "MANAGE_PLACEMENTS",
  MANAGE_PROJECTS: "MANAGE_PROJECTS",
  VERIFY_ALUMNI: "VERIFY_ALUMNI",
  VIEW_ANALYTICS: "VIEW_ANALYTICS",
  MANAGE_PLATFORM: "MANAGE_PLATFORM",
} as const;
export type Permission = (typeof Permission)[keyof typeof Permission];

export interface UpdateUserStatusRequest {
  status: UserAccountStatus;
}

export interface PermissionRequest {
  permission: Permission;
}
