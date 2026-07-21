/**
 * Backend enum mirror.
 *
 * Every enum below is copied exactly (name and every value) from the
 * backend's domain/constants files, grepped directly from the backend
 * source during this milestone rather than reconstructed from memory —
 * see the file path noted above each enum. Do not add, remove, or
 * rename a value here without the backend changing first.
 */

// domains/identity/domain/constants/UserRole.ts
export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ORG_ADMIN = "ORG_ADMIN",
  FACULTY = "FACULTY",
  STUDENT = "STUDENT",
  ALUMNI = "ALUMNI",
}

// domains/identity/domain/constants/UserStatus.ts
export enum UserStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  DEACTIVATED = "DEACTIVATED",
}

// domains/organizations/domain/constants/OrganizationStatus.ts
export enum OrganizationStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
}

// domains/organizations/domain/constants/OrganizationType.ts
export enum OrganizationType {
  UNIVERSITY = "UNIVERSITY",
  COLLEGE = "COLLEGE",
  SCHOOL = "SCHOOL",
  TRAINING_INSTITUTE = "TRAINING_INSTITUTE",
  COMPANY = "COMPANY",
}

// domains/organizations/domain/constants/RegistrationMethod.ts
export enum RegistrationMethod {
  EMAIL_DOMAIN = "EMAIL_DOMAIN",
  INVITATION = "INVITATION",
  STUDENT_ID = "STUDENT_ID",
  OPEN = "OPEN",
}

// domains/organizations/domain/constants/SubscriptionPlan.ts
export enum SubscriptionPlan {
  FREE = "FREE",
  STARTER = "STARTER",
  PROFESSIONAL = "PROFESSIONAL",
  ENTERPRISE = "ENTERPRISE",
}

// domains/platform/permissions/domain/constants/Permission.ts
export enum Permission {
  // Organization
  MANAGE_ORGANIZATION = "MANAGE_ORGANIZATION",
  MANAGE_USERS = "MANAGE_USERS",
  MANAGE_DEPARTMENTS = "MANAGE_DEPARTMENTS",
  MANAGE_CLUBS = "MANAGE_CLUBS",

  // Academic
  CREATE_ACTIVITY = "CREATE_ACTIVITY",
  UPDATE_ACTIVITY = "UPDATE_ACTIVITY",
  DELETE_ACTIVITY = "DELETE_ACTIVITY",

  REVIEW_SUBMISSION = "REVIEW_SUBMISSION",

  VIEW_LEADERBOARD = "VIEW_LEADERBOARD",

  // Community
  CREATE_EVENT = "CREATE_EVENT",
  MANAGE_EVENTS = "MANAGE_EVENTS",
  SEND_NOTIFICATION = "SEND_NOTIFICATION",

  // Career
  MANAGE_PLACEMENTS = "MANAGE_PLACEMENTS",
  MANAGE_PROJECTS = "MANAGE_PROJECTS",

  // Alumni
  VERIFY_ALUMNI = "VERIFY_ALUMNI",

  // Analytics
  VIEW_ANALYTICS = "VIEW_ANALYTICS",

  // Platform
  MANAGE_PLATFORM = "MANAGE_PLATFORM",
}

// domains/academic/departments has no enum file (status-free entity)

// domains/academic/faculty/domain/constants/FacultyStatus.ts
export enum FacultyStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

// domains/academic/students/domain/constants/StudentStatus.ts
export enum StudentStatus {
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
}

// domains/academic/alumni/domain/constants/AlumniStatus.ts
export enum AlumniStatus {
  INVITED = "INVITED",
  ACTIVE = "ACTIVE",
}

// domains/academic/mentorship/domain/constants/MentorshipStatus.ts
export enum MentorshipStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

// domains/academic/activities/domain/constants/ActivityStatus.ts
export enum ActivityStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  CLOSED = "CLOSED",
  ARCHIVED = "ARCHIVED",
}

// domains/academic/activities/domain/constants/ActivityType.ts
export enum ActivityType {
  ASSIGNMENT = "ASSIGNMENT",
  WORKSHOP = "WORKSHOP",
  EVENT = "EVENT",
  HACKATHON = "HACKATHON",
  QUIZ = "QUIZ",
  FORM = "FORM",
  SURVEY = "SURVEY",
}

// domains/academic/activities/domain/constants/ActivityVisibility.ts
export enum ActivityVisibility {
  PUBLIC = "PUBLIC",
  DEPARTMENT = "DEPARTMENT",
  SEMESTER = "SEMESTER",
  YEAR = "YEAR",
  PRIVATE = "PRIVATE",
}

// domains/academic/submissions/domain/constants/SubmissionStatus.ts
export enum SubmissionStatus {
  PENDING = "PENDING",
  UNDER_REVIEW = "UNDER_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  RESUBMITTED = "RESUBMITTED",
}

// domains/academic/submissions/domain/constants/ReviewStatus.ts
export enum ReviewStatus {
  NOT_REVIEWED = "NOT_REVIEWED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

// domains/campus/clubs/domain/constants/ClubStatus.ts
export enum ClubStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

// domains/campus/clubs/domain/constants/ClubMemberRole.ts
export enum ClubMemberRole {
  MEMBER = "MEMBER",
  PRESIDENT = "PRESIDENT",
  VICE_PRESIDENT = "VICE_PRESIDENT",
}

// domains/campus/clubs/domain/constants/ClubMemberStatus.ts
export enum ClubMemberStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

// domains/campus/events/domain/constants/EventStatus.ts
export enum EventStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

// domains/placements/companies/domain/constants/CompanyStatus.ts
export enum CompanyStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

// domains/placements/drives/domain/constants/PlacementDriveStatus.ts
export enum PlacementDriveStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  CLOSED = "CLOSED",
}

// domains/placements/applications/domain/constants/JobApplicationStatus.ts
export enum JobApplicationStatus {
  APPLIED = "APPLIED",
  SHORTLISTED = "SHORTLISTED",
  REJECTED = "REJECTED",
  SELECTED = "SELECTED",
}

// domains/career/skills/domain/constants/SkillLevel.ts
export enum SkillLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
  EXPERT = "EXPERT",
}

// domains/career/experience/domain/constants/EmploymentType.ts
export enum EmploymentType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  INTERNSHIP = "INTERNSHIP",
  CONTRACT = "CONTRACT",
  FREELANCE = "FREELANCE",
}

// domains/career/achievements/domain/constants/AchievementStatus.ts
export enum AchievementStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}

// domains/career/achievements/domain/constants/AchievementLevel.ts
export enum AchievementLevel {
  COLLEGE = "COLLEGE",
  STATE = "STATE",
  NATIONAL = "NATIONAL",
  INTERNATIONAL = "INTERNATIONAL",
}

// domains/career/user-portfolio/domain/constants/PortfolioVisibility.ts
export enum PortfolioVisibility {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

// domains/career/resume/domain/constants/ResumeVisibility.ts
export enum ResumeVisibility {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

// domains/communication/notifications/domain/constants/NotificationType.ts
export enum NotificationType {
  ANNOUNCEMENT = "ANNOUNCEMENT",
  ALERT = "ALERT",
  INFO = "INFO",
  REMINDER = "REMINDER",
}

// domains/communication/notifications/domain/constants/NotificationAudience.ts
export enum NotificationAudience {
  ALL = "ALL",
  ORG_ADMIN = "ORG_ADMIN",
  FACULTY = "FACULTY",
  STUDENT = "STUDENT",
  ALUMNI = "ALUMNI",
}

// domains/communication/chat/domain/constants/ChatType.ts
export enum ChatType {
  DIRECT = "DIRECT",
  GROUP = "GROUP",
}

// domains/ai/chat/domain/constants/AIChatRole.ts
export enum AIChatRole {
  USER = "USER",
  ASSISTANT = "ASSISTANT",
}

// domains/ai/interview/domain/constants/InterviewSessionStatus.ts
export enum InterviewSessionStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

// domains/ai/recommendations/domain/constants/RecommendationType.ts
export enum RecommendationType {
  ACTIVITY = "ACTIVITY",
  EVENT = "EVENT",
  CLUB = "CLUB",
}
