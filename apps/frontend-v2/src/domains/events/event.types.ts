export const EventStatus = { DRAFT: "DRAFT", PUBLISHED: "PUBLISHED", CANCELLED: "CANCELLED", COMPLETED: "COMPLETED" } as const;
export type EventStatus = (typeof EventStatus)[keyof typeof EventStatus];

/** Matches the real backend EventResponseDto exactly. */
export interface CampusEvent {
  id: string;
  organizationId: string;
  clubId?: string;
  createdBy: string;
  title: string;
  description: string;
  venue?: string;
  startDate: string;
  endDate: string;
  registrationDeadline?: string;
  capacity?: number;
  points: number;
  certificateEnabled: boolean;
  status: EventStatus;
  createdAt?: string;
  updatedAt?: string;
}

/** Matches the real backend EventRegistrationResponseDto exactly. */
export interface EventRegistration {
  id: string;
  eventId: string;
  studentId: string;
  attendance: boolean;
  feedback?: string;
  certificateIssued: boolean;
  registeredAt: string;
}

/** Matches CreateEventSchema exactly. */
export interface CreateEventRequest {
  clubId?: string;
  title: string;
  description: string;
  venue?: string;
  startDate: string;
  endDate: string;
  registrationDeadline?: string;
  capacity?: number;
  points?: number;
  certificateEnabled?: boolean;
}

/** Matches UpdateEventSchema exactly - same fields as create, all optional. */
export type UpdateEventRequest = Partial<CreateEventRequest>;

/** Matches MarkAttendanceSchema exactly. */
export interface MarkAttendanceRequest {
  studentId: string;
  attended: boolean;
}

/** Matches SubmitEventFeedbackSchema exactly. */
export interface SubmitEventFeedbackRequest {
  feedback: string;
}
