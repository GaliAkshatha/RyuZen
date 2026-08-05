import { Badge, type BadgeProps } from "@/shared/ui/Badge";

/**
 * Maps every distinct status VALUE seen across all 18 status-bearing
 * backend enums (UserStatus, OrganizationStatus, FacultyStatus,
 * StudentStatus, AlumniStatus, MentorshipStatus, ActivityStatus,
 * SubmissionStatus, ReviewStatus, ClubStatus, ClubMemberStatus,
 * EventStatus, CompanyStatus, PlacementDriveStatus,
 * JobApplicationStatus, AchievementStatus, PortfolioVisibility,
 * ResumeVisibility, InterviewSessionStatus — cross-checked against
 * src/types/enums.ts) to one Badge variant, by the word's own meaning
 * rather than one lookup table per enum. This scales automatically to
 * any future status value that reuses a known word, and falls back to
 * a neutral "secondary" badge for anything unrecognized rather than
 * crashing.
 */
const STATUS_VARIANT_MAP: Record<string, BadgeProps["variant"]> = {
  // success — positive / terminal-good
  ACTIVE: "success",
  OPEN: "success",
  APPROVED: "success",
  PUBLISHED: "success",
  COMPLETED: "success",
  PASSED: "success",
  SELECTED: "success",
  VERIFIED: "success",
  PUBLIC: "success",
  ACCEPTED: "success",

  // warning — in progress / awaiting action
  PENDING: "warning",
  UNDER_REVIEW: "warning",
  DRAFT: "warning",
  RESUBMITTED: "warning",
  SHORTLISTED: "warning",
  INVITED: "warning",
  IN_PROGRESS: "warning",
  SCHEDULED: "warning",
  APPLIED: "warning",
  EMAIL_VERIFIED: "warning",

  // destructive — negative / terminal-bad
  SUSPENDED: "destructive",
  DEACTIVATED: "destructive",
  REJECTED: "destructive",
  CANCELLED: "destructive",
  FAILED: "destructive",
  CLOSED: "destructive",
  EXPIRED: "destructive",
  REVOKED: "destructive",

  // secondary — neutral / muted
  INACTIVE: "secondary",
  ARCHIVED: "secondary",
  NOT_REVIEWED: "secondary",
  PRIVATE: "secondary",
};

function humanize(status: string): string {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export interface StatusBadgeProps {
  status: string;
  /** Overrides the auto-humanized label (e.g. "Under Review" for UNDER_REVIEW). */
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const variant = STATUS_VARIANT_MAP[status] ?? "secondary";

  return (
    <Badge variant={variant} className={className}>
      {label ?? humanize(status)}
    </Badge>
  );
}
