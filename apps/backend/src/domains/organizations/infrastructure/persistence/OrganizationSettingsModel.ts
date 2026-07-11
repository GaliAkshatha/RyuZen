import mongoose, { Schema, Document } from "mongoose";

export interface OrganizationSettingsDocument extends Document {

    organizationId: mongoose.Types.ObjectId;

    branding: {
        primaryColor: string;
        secondaryColor: string;
        accentColor: string;
        theme: string;
        loginBanner: string;
        favicon: string;
        emailBranding: string;
    };

    registration: {
        allowFacultyRegistration: boolean;
        emailDomainRestriction: boolean;
        defaultUserRole: string;
    };

    security: {
        jwtExpiry: string;
        refreshTokenExpiry: string;
        passwordMinLength: number;
        sessionTimeoutMinutes: number;
        loginAttemptLimit: number;
        accountLockDurationMinutes: number;
        ipWhitelist: string[];
    };

    academic: {
        semesterConfiguration: string;
        defaultCgpaScale: number;
        attendanceEnabled: boolean;
        mentorshipEnabled: boolean;
    };

    activities: {
        autoCloseActivities: boolean;
        autoLeaderboardUpdate: boolean;
        defaultPoints: number;
        penaltyRules: string;
    };

    events: {
        registrationLimit: number;
        waitlistEnabled: boolean;
        attendanceQrEnabled: boolean;
        certificateGenerationEnabled: boolean;
    };

    clubs: {
        advisorRequired: boolean;
        maxMembers: number;
        studentLeadershipRules: string;
    };

    placements: {
        resumeMandatory: boolean;
        eligibilityRules: string;
        placementVisibility: string;
        companyApprovalRequired: boolean;
    };

    careerSystem: {
        enableResumeBuilder: boolean;
        enablePortfolio: boolean;
        enableSkills: boolean;
        enableCertifications: boolean;
        enableAchievements: boolean;
        enableCareerScore: boolean;
    };

    ai: {
        resumeReview: boolean;
        careerRecommendations: boolean;
        skillGapAnalysis: boolean;
        interviewPreparation: boolean;
        projectSuggestions: boolean;
    };

    notifications: {
        emailNotifications: boolean;
        inAppNotifications: boolean;
        pushNotifications: boolean;
        broadcastMessages: boolean;
    };

    chat: {
        facultyToStudent: boolean;
        studentToStudent: boolean;
        alumniToStudent: boolean;
    };

    analytics: {
        dashboard: boolean;
        studentAnalytics: boolean;
        facultyAnalytics: boolean;
        placementAnalytics: boolean;
        activityAnalytics: boolean;
    };

    leaderboard: {
        rankingMethod: string;
        badgeSystemEnabled: boolean;
        seasonalRankingsEnabled: boolean;
    };

    certificates: {
        autoGenerate: boolean;
        templateSelection: string;
        digitalVerification: boolean;
    };

    fileStorage: {
        profileImagesEnabled: boolean;
        projectMediaEnabled: boolean;
        certificatesEnabled: boolean;
        resumePdfsEnabled: boolean;
        eventAssetsEnabled: boolean;
    };

    integrations: {
        googleLogin: boolean;
        microsoftLogin: boolean;
        googleCalendar: boolean;
        github: boolean;
        linkedin: boolean;
        leetcode: boolean;
        codeforces: boolean;
    };

    audit: {
        logUserActions: boolean;
        logAdminActions: boolean;
        dataExportEnabled: boolean;
        backupSchedule: string;
    };

    createdAt: Date;

    updatedAt: Date;

}

const BrandingSchema = new Schema(

    {

        primaryColor: { type: String, default: "#4F46E5" },

        secondaryColor: { type: String, default: "#0EA5E9" },

        accentColor: { type: String, default: "#F59E0B" },

        theme: { type: String, enum: ["LIGHT", "DARK"], default: "LIGHT" },

        loginBanner: { type: String, default: "" },

        favicon: { type: String, default: "" },

        emailBranding: { type: String, default: "" },

    },

    { _id: false }

);

const RegistrationSchema = new Schema(

    {

        allowFacultyRegistration: { type: Boolean, default: true },

        emailDomainRestriction: { type: Boolean, default: true },

        defaultUserRole: { type: String, default: "STUDENT" },

    },

    { _id: false }

);

const SecuritySchema = new Schema(

    {

        jwtExpiry: { type: String, default: "7d" },

        refreshTokenExpiry: { type: String, default: "30d" },

        passwordMinLength: { type: Number, default: 8 },

        sessionTimeoutMinutes: { type: Number, default: 60 },

        loginAttemptLimit: { type: Number, default: 5 },

        accountLockDurationMinutes: { type: Number, default: 30 },

        ipWhitelist: [{ type: String }],

    },

    { _id: false }

);

const AcademicSchema = new Schema(

    {

        semesterConfiguration: { type: String, default: "ODD_EVEN" },

        defaultCgpaScale: { type: Number, default: 10 },

        attendanceEnabled: { type: Boolean, default: false },

        mentorshipEnabled: { type: Boolean, default: false },

    },

    { _id: false }

);

const ActivitiesSchema = new Schema(

    {

        autoCloseActivities: { type: Boolean, default: false },

        autoLeaderboardUpdate: { type: Boolean, default: true },

        defaultPoints: { type: Number, default: 10 },

        penaltyRules: { type: String, default: "" },

    },

    { _id: false }

);

const EventsSchema = new Schema(

    {

        registrationLimit: { type: Number, default: 0 },

        waitlistEnabled: { type: Boolean, default: true },

        attendanceQrEnabled: { type: Boolean, default: false },

        certificateGenerationEnabled: { type: Boolean, default: false },

    },

    { _id: false }

);

const ClubsSchema = new Schema(

    {

        advisorRequired: { type: Boolean, default: true },

        maxMembers: { type: Number, default: 0 },

        studentLeadershipRules: { type: String, default: "" },

    },

    { _id: false }

);

const PlacementsSchema = new Schema(

    {

        resumeMandatory: { type: Boolean, default: true },

        eligibilityRules: { type: String, default: "" },

        placementVisibility: { type: String, enum: ["PUBLIC", "PRIVATE"], default: "PRIVATE" },

        companyApprovalRequired: { type: Boolean, default: true },

    },

    { _id: false }

);

const CareerSystemSchema = new Schema(

    {

        enableResumeBuilder: { type: Boolean, default: true },

        enablePortfolio: { type: Boolean, default: true },

        enableSkills: { type: Boolean, default: true },

        enableCertifications: { type: Boolean, default: true },

        enableAchievements: { type: Boolean, default: true },

        enableCareerScore: { type: Boolean, default: true },

    },

    { _id: false }

);

const AiSchema = new Schema(

    {

        resumeReview: { type: Boolean, default: true },

        careerRecommendations: { type: Boolean, default: true },

        skillGapAnalysis: { type: Boolean, default: true },

        interviewPreparation: { type: Boolean, default: true },

        projectSuggestions: { type: Boolean, default: true },

    },

    { _id: false }

);

const NotificationsSchema = new Schema(

    {

        emailNotifications: { type: Boolean, default: true },

        inAppNotifications: { type: Boolean, default: true },

        pushNotifications: { type: Boolean, default: false },

        broadcastMessages: { type: Boolean, default: true },

    },

    { _id: false }

);

const ChatSchema = new Schema(

    {

        facultyToStudent: { type: Boolean, default: true },

        studentToStudent: { type: Boolean, default: true },

        alumniToStudent: { type: Boolean, default: true },

    },

    { _id: false }

);

const AnalyticsSchema = new Schema(

    {

        dashboard: { type: Boolean, default: true },

        studentAnalytics: { type: Boolean, default: true },

        facultyAnalytics: { type: Boolean, default: true },

        placementAnalytics: { type: Boolean, default: true },

        activityAnalytics: { type: Boolean, default: true },

    },

    { _id: false }

);

const LeaderboardSchema = new Schema(

    {

        rankingMethod: { type: String, default: "POINTS" },

        badgeSystemEnabled: { type: Boolean, default: true },

        seasonalRankingsEnabled: { type: Boolean, default: false },

    },

    { _id: false }

);

const CertificatesSchema = new Schema(

    {

        autoGenerate: { type: Boolean, default: false },

        templateSelection: { type: String, default: "DEFAULT" },

        digitalVerification: { type: Boolean, default: false },

    },

    { _id: false }

);

const FileStorageSchema = new Schema(

    {

        profileImagesEnabled: { type: Boolean, default: true },

        projectMediaEnabled: { type: Boolean, default: true },

        certificatesEnabled: { type: Boolean, default: true },

        resumePdfsEnabled: { type: Boolean, default: true },

        eventAssetsEnabled: { type: Boolean, default: true },

    },

    { _id: false }

);

const IntegrationsSchema = new Schema(

    {

        googleLogin: { type: Boolean, default: false },

        microsoftLogin: { type: Boolean, default: false },

        googleCalendar: { type: Boolean, default: false },

        github: { type: Boolean, default: false },

        linkedin: { type: Boolean, default: false },

        leetcode: { type: Boolean, default: false },

        codeforces: { type: Boolean, default: false },

    },

    { _id: false }

);

const AuditSchema = new Schema(

    {

        logUserActions: { type: Boolean, default: true },

        logAdminActions: { type: Boolean, default: true },

        dataExportEnabled: { type: Boolean, default: false },

        backupSchedule: { type: String, default: "DAILY" },

    },

    { _id: false }

);

const OrganizationSettingsSchema = new Schema<OrganizationSettingsDocument>(

    {

        organizationId: {

            type: Schema.Types.ObjectId,

            ref: "Organization",

            required: true,

            unique: true,

            index: true,

        },

        branding: { type: BrandingSchema, default: () => ({}) },

        registration: { type: RegistrationSchema, default: () => ({}) },

        security: { type: SecuritySchema, default: () => ({}) },

        academic: { type: AcademicSchema, default: () => ({}) },

        activities: { type: ActivitiesSchema, default: () => ({}) },

        events: { type: EventsSchema, default: () => ({}) },

        clubs: { type: ClubsSchema, default: () => ({}) },

        placements: { type: PlacementsSchema, default: () => ({}) },

        careerSystem: { type: CareerSystemSchema, default: () => ({}) },

        ai: { type: AiSchema, default: () => ({}) },

        notifications: { type: NotificationsSchema, default: () => ({}) },

        chat: { type: ChatSchema, default: () => ({}) },

        analytics: { type: AnalyticsSchema, default: () => ({}) },

        leaderboard: { type: LeaderboardSchema, default: () => ({}) },

        certificates: { type: CertificatesSchema, default: () => ({}) },

        fileStorage: { type: FileStorageSchema, default: () => ({}) },

        integrations: { type: IntegrationsSchema, default: () => ({}) },

        audit: { type: AuditSchema, default: () => ({}) },

    },

    {

        timestamps: true,

        versionKey: false,

    }

);

export const OrganizationSettingsModel = mongoose.model<OrganizationSettingsDocument>(

    "OrganizationSettings",

    OrganizationSettingsSchema

);