import { EventStatus } from "@/types/enums";

/**
 * Mirrors EventResponseDto exactly. Note EventStatus has no CLOSED
 * value (unlike ActivityStatus) — DRAFT/PUBLISHED/CANCELLED/COMPLETED.
 * `clubId` optionally links the event to a club (C1), but is entirely
 * optional — events don't require a club.
 */
export interface EventResponseDto {
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

/**
 * Mirrors EventRegistrationResponseDto exactly. `attendance`,
 * `feedback`, `certificateIssued` are populated by C3's MarkAttendance,
 * SubmitFeedback, and IssueCertificates actions respectively.
 */
export interface EventRegistrationResponseDto {
  id: string;
  eventId: string;
  studentId: string;
  attendance: boolean;
  feedback?: string;
  certificateIssued: boolean;
  registeredAt: string;
}

/** Mirrors CreateEventDto */
export interface CreateEventPayload {
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

/** Mirrors UpdateEventDto — every field optional */
export interface UpdateEventPayload {
  title?: string;
  description?: string;
  venue?: string;
  startDate?: string;
  endDate?: string;
  registrationDeadline?: string;
  capacity?: number;
  points?: number;
  certificateEnabled?: boolean;
}

/** Mirrors MarkAttendanceDto — marks ONE student's attendance at a time, not bulk */
export interface MarkAttendancePayload {
  studentId: string;
  attended: boolean;
}

/** Mirrors SubmitEventFeedbackDto */
export interface SubmitEventFeedbackPayload {
  feedback: string;
}
