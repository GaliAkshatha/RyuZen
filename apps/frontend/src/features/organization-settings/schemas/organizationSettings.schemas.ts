import { z } from "zod";

/** Mirrors UpdateOrganizationSettingsSchema exactly, including every numeric bound. */
export const updateOrganizationSettingsSchema = z.object({
  branding: z
    .object({
      primaryColor: z.string().trim().optional(),
      secondaryColor: z.string().trim().optional(),
      accentColor: z.string().trim().optional(),
      theme: z.enum(["LIGHT", "DARK"]).optional(),
      loginBanner: z.string().trim().optional(),
      favicon: z.string().trim().optional(),
      emailBranding: z.string().trim().optional(),
    })
    .optional(),
  registration: z
    .object({
      allowFacultyRegistration: z.boolean().optional(),
      emailDomainRestriction: z.boolean().optional(),
      defaultUserRole: z.string().trim().optional(),
    })
    .optional(),
  security: z
    .object({
      jwtExpiry: z.string().trim().optional(),
      refreshTokenExpiry: z.string().trim().optional(),
      passwordMinLength: z.number().min(6).max(128).optional(),
      sessionTimeoutMinutes: z.number().min(1).optional(),
      loginAttemptLimit: z.number().min(1).optional(),
      accountLockDurationMinutes: z.number().min(1).optional(),
      ipWhitelist: z.array(z.string()).optional(),
    })
    .optional(),
  academic: z
    .object({
      semesterConfiguration: z.string().trim().optional(),
      defaultCgpaScale: z.number().min(1).optional(),
      attendanceEnabled: z.boolean().optional(),
      mentorshipEnabled: z.boolean().optional(),
    })
    .optional(),
  activities: z
    .object({
      autoCloseActivities: z.boolean().optional(),
      autoLeaderboardUpdate: z.boolean().optional(),
      defaultPoints: z.number().min(0).optional(),
      penaltyRules: z.string().trim().optional(),
    })
    .optional(),
  events: z
    .object({
      registrationLimit: z.number().min(0).optional(),
      waitlistEnabled: z.boolean().optional(),
      attendanceQrEnabled: z.boolean().optional(),
      certificateGenerationEnabled: z.boolean().optional(),
    })
    .optional(),
  clubs: z
    .object({
      advisorRequired: z.boolean().optional(),
      maxMembers: z.number().min(0).optional(),
      studentLeadershipRules: z.string().trim().optional(),
    })
    .optional(),
  placements: z
    .object({
      resumeMandatory: z.boolean().optional(),
      eligibilityRules: z.string().trim().optional(),
      placementVisibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
      companyApprovalRequired: z.boolean().optional(),
    })
    .optional(),
  careerSystem: z
    .object({
      enableResumeBuilder: z.boolean().optional(),
      enablePortfolio: z.boolean().optional(),
      enableSkills: z.boolean().optional(),
      enableCertifications: z.boolean().optional(),
      enableAchievements: z.boolean().optional(),
      enableCareerScore: z.boolean().optional(),
    })
    .optional(),
  ai: z
    .object({
      resumeReview: z.boolean().optional(),
      careerRecommendations: z.boolean().optional(),
      skillGapAnalysis: z.boolean().optional(),
      interviewPreparation: z.boolean().optional(),
      projectSuggestions: z.boolean().optional(),
    })
    .optional(),
  notifications: z
    .object({
      emailNotifications: z.boolean().optional(),
      inAppNotifications: z.boolean().optional(),
      pushNotifications: z.boolean().optional(),
      broadcastMessages: z.boolean().optional(),
    })
    .optional(),
  chat: z
    .object({
      facultyToStudent: z.boolean().optional(),
      studentToStudent: z.boolean().optional(),
      alumniToStudent: z.boolean().optional(),
    })
    .optional(),
  analytics: z
    .object({
      dashboard: z.boolean().optional(),
      studentAnalytics: z.boolean().optional(),
      facultyAnalytics: z.boolean().optional(),
      placementAnalytics: z.boolean().optional(),
      activityAnalytics: z.boolean().optional(),
    })
    .optional(),
  leaderboard: z
    .object({
      rankingMethod: z.string().trim().optional(),
      badgeSystemEnabled: z.boolean().optional(),
      seasonalRankingsEnabled: z.boolean().optional(),
    })
    .optional(),
  certificates: z
    .object({
      autoGenerate: z.boolean().optional(),
      templateSelection: z.string().trim().optional(),
      digitalVerification: z.boolean().optional(),
    })
    .optional(),
  fileStorage: z
    .object({
      profileImagesEnabled: z.boolean().optional(),
      projectMediaEnabled: z.boolean().optional(),
      certificatesEnabled: z.boolean().optional(),
      resumePdfsEnabled: z.boolean().optional(),
      eventAssetsEnabled: z.boolean().optional(),
    })
    .optional(),
  integrations: z
    .object({
      googleLogin: z.boolean().optional(),
      microsoftLogin: z.boolean().optional(),
      googleCalendar: z.boolean().optional(),
      github: z.boolean().optional(),
      linkedin: z.boolean().optional(),
      leetcode: z.boolean().optional(),
      codeforces: z.boolean().optional(),
    })
    .optional(),
  audit: z
    .object({
      logUserActions: z.boolean().optional(),
      logAdminActions: z.boolean().optional(),
      dataExportEnabled: z.boolean().optional(),
      backupSchedule: z.string().trim().optional(),
    })
    .optional(),
});

export type UpdateOrganizationSettingsFormValues = z.infer<typeof updateOrganizationSettingsSchema>;
