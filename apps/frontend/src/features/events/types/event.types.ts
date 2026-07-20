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
 * `feedback`, `certificateIssued` are all C3 (Event Attendance) concerns
 * — MarkAttendance, SubmitFeedback, and IssueCertificates use cases are
 * deliberately out of scope for this milestone (see event.service.ts).
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
