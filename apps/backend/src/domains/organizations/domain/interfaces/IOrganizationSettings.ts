export interface IOrganizationSettings {

    id?: string;

    organizationId: string;

    branding: {

        primaryColor: string;

        secondaryColor: string;

        accentColor: string;

        theme: "LIGHT" | "DARK";

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

        placementVisibility: "PUBLIC" | "PRIVATE";

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

    createdAt?: Date;

    updatedAt?: Date;

}