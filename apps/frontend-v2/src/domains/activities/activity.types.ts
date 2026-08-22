/** Matches the real backend ActivityResponseDto exactly - confirmed directly against ActivityResponseMapper.ts, including the departmentIds/batches fields added this session's security fix. */
export const ActivityStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  CLOSED: "CLOSED",
  ARCHIVED: "ARCHIVED",
} as const;
export type ActivityStatus = (typeof ActivityStatus)[keyof typeof ActivityStatus];

export const ActivityType = {
  ASSIGNMENT: "ASSIGNMENT",
  WORKSHOP: "WORKSHOP",
  EVENT: "EVENT",
  HACKATHON: "HACKATHON",
  QUIZ: "QUIZ",
  FORM: "FORM",
  SURVEY: "SURVEY",
} as const;
export type ActivityType = (typeof ActivityType)[keyof typeof ActivityType];

export const ActivityVisibility = {
  PUBLIC: "PUBLIC",
  DEPARTMENT: "DEPARTMENT",
  SEMESTER: "SEMESTER",
  YEAR: "YEAR",
  PRIVATE: "PRIVATE",
} as const;
export type ActivityVisibility = (typeof ActivityVisibility)[keyof typeof ActivityVisibility];

export interface Attachment {
  name: string;
  url: string;
  mimeType: string;
}

export interface Activity {
  id: string;
  organizationId: string;
  createdBy: string;
  title: string;
  description: string;
  type: ActivityType;
  status: ActivityStatus;
  visibility: ActivityVisibility;
  departmentIds?: string[];
  batches?: string[];
  points: number;
  penaltyPoints: number;
  startDate: string;
  endDate: string;
  attachments: Attachment[];
  createdAt?: string;
  updatedAt?: string;
}

/** Matches CreateActivitySchema exactly. */
export interface CreateActivityRequest {
  title: string;
  description: string;
  type: ActivityType;
  visibility: ActivityVisibility;
  departmentIds?: string[];
  batches?: string[];
  points: number;
  penaltyPoints: number;
  startDate: string;
  endDate: string;
  attachments: Attachment[];
}

/** Matches UpdateActivitySchema exactly - all optional. */
export interface UpdateActivityRequest {
  title?: string;
  description?: string;
  type?: ActivityType;
  visibility?: ActivityVisibility;
  departmentIds?: string[];
  batches?: string[];
  points?: number;
  penaltyPoints?: number;
  startDate?: string;
  endDate?: string;
  attachments?: Attachment[];
}
