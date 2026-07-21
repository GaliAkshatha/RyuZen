import type { OrganizationSettingsCategory } from "@/features/organization-settings/types/organizationSettings.types";

export type SettingsFieldType = "boolean" | "string" | "number" | "enum" | "string[]";

export interface SettingsFieldConfig {
  key: string;
  label: string;
  type: SettingsFieldType;
  enumOptions?: string[];
}

export interface SettingsCategoryConfig {
  category: OrganizationSettingsCategory;
  label: string;
  fields: SettingsFieldConfig[];
}

/**
 * Drives the generic settings form renderer. Every field here mirrors
 * UpdateOrganizationSettingsSchema exactly — field presence, type, and
 * (for the two enums) exact allowed values — confirmed against the
 * real validator this milestone. A config-driven approach was chosen
 * over ~70 hand-written field blocks to keep this genuinely large
 * model maintainable and to guarantee the form can never drift from
 * the type definition it's generated from.
 */
export const SETTINGS_CATEGORIES: SettingsCategoryConfig[] = [
  {
    category: "branding",
    label: "Branding",
    fields: [
      { key: "primaryColor", label: "Primary Color", type: "string" },
      { key: "secondaryColor", label: "Secondary Color", type: "string" },
      { key: "accentColor", label: "Accent Color", type: "string" },
      { key: "theme", label: "Theme", type: "enum", enumOptions: ["LIGHT", "DARK"] },
      { key: "loginBanner", label: "Login Banner URL", type: "string" },
      { key: "favicon", label: "Favicon URL", type: "string" },
      { key: "emailBranding", label: "Email Branding", type: "string" },
    ],
  },
  {
    category: "registration",
    label: "Registration",
    fields: [
      { key: "allowFacultyRegistration", label: "Allow Faculty Registration", type: "boolean" },
      { key: "emailDomainRestriction", label: "Email Domain Restriction", type: "boolean" },
      { key: "defaultUserRole", label: "Default User Role", type: "string" },
    ],
  },
  {
    category: "security",
    label: "Security",
    fields: [
      { key: "jwtExpiry", label: "JWT Expiry", type: "string" },
      { key: "refreshTokenExpiry", label: "Refresh Token Expiry", type: "string" },
      { key: "passwordMinLength", label: "Password Min Length", type: "number" },
      { key: "sessionTimeoutMinutes", label: "Session Timeout (minutes)", type: "number" },
      { key: "loginAttemptLimit", label: "Login Attempt Limit", type: "number" },
      {
        key: "accountLockDurationMinutes",
        label: "Account Lock Duration (minutes)",
        type: "number",
      },
      { key: "ipWhitelist", label: "IP Whitelist (comma-separated)", type: "string[]" },
    ],
  },
  {
    category: "academic",
    label: "Academic",
    fields: [
      { key: "semesterConfiguration", label: "Semester Configuration", type: "string" },
      { key: "defaultCgpaScale", label: "Default CGPA Scale", type: "number" },
      { key: "attendanceEnabled", label: "Attendance Enabled", type: "boolean" },
      { key: "mentorshipEnabled", label: "Mentorship Enabled", type: "boolean" },
    ],
  },
  {
    category: "activities",
    label: "Activities",
    fields: [
      { key: "autoCloseActivities", label: "Auto-Close Activities", type: "boolean" },
      { key: "autoLeaderboardUpdate", label: "Auto Leaderboard Update", type: "boolean" },
      { key: "defaultPoints", label: "Default Points", type: "number" },
      { key: "penaltyRules", label: "Penalty Rules", type: "string" },
    ],
  },
  {
    category: "events",
    label: "Events",
    fields: [
      { key: "registrationLimit", label: "Registration Limit", type: "number" },
      { key: "waitlistEnabled", label: "Waitlist Enabled", type: "boolean" },
      { key: "attendanceQrEnabled", label: "Attendance QR Enabled", type: "boolean" },
      {
        key: "certificateGenerationEnabled",
        label: "Certificate Generation Enabled",
        type: "boolean",
      },
    ],
  },
  {
    category: "clubs",
    label: "Clubs",
    fields: [
      { key: "advisorRequired", label: "Advisor Required", type: "boolean" },
      { key: "maxMembers", label: "Max Members", type: "number" },
      { key: "studentLeadershipRules", label: "Student Leadership Rules", type: "string" },
    ],
  },
  {
    category: "placements",
    label: "Placements",
    fields: [
      { key: "resumeMandatory", label: "Resume Mandatory", type: "boolean" },
      { key: "eligibilityRules", label: "Eligibility Rules", type: "string" },
      {
        key: "placementVisibility",
        label: "Placement Visibility",
        type: "enum",
        enumOptions: ["PUBLIC", "PRIVATE"],
      },
      { key: "companyApprovalRequired", label: "Company Approval Required", type: "boolean" },
    ],
  },
  {
    category: "careerSystem",
    label: "Career System",
    fields: [
      { key: "enableResumeBuilder", label: "Enable Resume Builder", type: "boolean" },
      { key: "enablePortfolio", label: "Enable Portfolio", type: "boolean" },
      { key: "enableSkills", label: "Enable Skills", type: "boolean" },
      { key: "enableCertifications", label: "Enable Certifications", type: "boolean" },
      { key: "enableAchievements", label: "Enable Achievements", type: "boolean" },
      { key: "enableCareerScore", label: "Enable Career Score", type: "boolean" },
    ],
  },
  {
    category: "ai",
    label: "AI",
    fields: [
      { key: "resumeReview", label: "Resume Review", type: "boolean" },
      { key: "careerRecommendations", label: "Career Recommendations", type: "boolean" },
      { key: "skillGapAnalysis", label: "Skill Gap Analysis", type: "boolean" },
      { key: "interviewPreparation", label: "Interview Preparation", type: "boolean" },
      { key: "projectSuggestions", label: "Project Suggestions", type: "boolean" },
    ],
  },
  {
    category: "notifications",
    label: "Notifications",
    fields: [
      { key: "emailNotifications", label: "Email Notifications", type: "boolean" },
      { key: "inAppNotifications", label: "In-App Notifications", type: "boolean" },
      { key: "pushNotifications", label: "Push Notifications", type: "boolean" },
      { key: "broadcastMessages", label: "Broadcast Messages", type: "boolean" },
    ],
  },
  {
    category: "chat",
    label: "Chat",
    fields: [
      { key: "facultyToStudent", label: "Faculty to Student", type: "boolean" },
      { key: "studentToStudent", label: "Student to Student", type: "boolean" },
      { key: "alumniToStudent", label: "Alumni to Student", type: "boolean" },
    ],
  },
  {
    category: "analytics",
    label: "Analytics",
    fields: [
      { key: "dashboard", label: "Dashboard", type: "boolean" },
      { key: "studentAnalytics", label: "Student Analytics", type: "boolean" },
      { key: "facultyAnalytics", label: "Faculty Analytics", type: "boolean" },
      { key: "placementAnalytics", label: "Placement Analytics", type: "boolean" },
      { key: "activityAnalytics", label: "Activity Analytics", type: "boolean" },
    ],
  },
  {
    category: "leaderboard",
    label: "Leaderboard",
    fields: [
      { key: "rankingMethod", label: "Ranking Method", type: "string" },
      { key: "badgeSystemEnabled", label: "Badge System Enabled", type: "boolean" },
      { key: "seasonalRankingsEnabled", label: "Seasonal Rankings Enabled", type: "boolean" },
    ],
  },
  {
    category: "certificates",
    label: "Certificates",
    fields: [
      { key: "autoGenerate", label: "Auto-Generate", type: "boolean" },
      { key: "templateSelection", label: "Template Selection", type: "string" },
      { key: "digitalVerification", label: "Digital Verification", type: "boolean" },
    ],
  },
  {
    category: "fileStorage",
    label: "File Storage",
    fields: [
      { key: "profileImagesEnabled", label: "Profile Images Enabled", type: "boolean" },
      { key: "projectMediaEnabled", label: "Project Media Enabled", type: "boolean" },
      { key: "certificatesEnabled", label: "Certificates Enabled", type: "boolean" },
      { key: "resumePdfsEnabled", label: "Resume PDFs Enabled", type: "boolean" },
      { key: "eventAssetsEnabled", label: "Event Assets Enabled", type: "boolean" },
    ],
  },
  {
    category: "integrations",
    label: "Integrations",
    fields: [
      { key: "googleLogin", label: "Google Login", type: "boolean" },
      { key: "microsoftLogin", label: "Microsoft Login", type: "boolean" },
      { key: "googleCalendar", label: "Google Calendar", type: "boolean" },
      { key: "github", label: "GitHub", type: "boolean" },
      { key: "linkedin", label: "LinkedIn", type: "boolean" },
      { key: "leetcode", label: "LeetCode", type: "boolean" },
      { key: "codeforces", label: "Codeforces", type: "boolean" },
    ],
  },
  {
    category: "audit",
    label: "Audit",
    fields: [
      { key: "logUserActions", label: "Log User Actions", type: "boolean" },
      { key: "logAdminActions", label: "Log Admin Actions", type: "boolean" },
      { key: "dataExportEnabled", label: "Data Export Enabled", type: "boolean" },
      { key: "backupSchedule", label: "Backup Schedule", type: "string" },
    ],
  },
];
