import { OrganizationStatus } from "../constants/OrganizationStatus.js";
import { RegistrationMethod } from "../constants/RegistrationMethod.js";
import { OrganizationType } from "../constants/OrganizationType.js";
import { SubscriptionPlan } from "../constants/SubscriptionPlan.js";

export interface IOrganization {

    id?: string;

    name: string;

    code: string;

    logo?: string;

    website?: string;

    emailDomains: string[];

    registrationMethod: RegistrationMethod;

    organizationType: OrganizationType;

    subscriptionPlan: SubscriptionPlan;

    status: OrganizationStatus;

    settings: {

        allowStudentRegistration: boolean;

        requireEmailVerification: boolean;

        requireAdminApproval: boolean;

        enableAI: boolean;

        enableActivities: boolean;

        enableLeaderboard: boolean;

        enableChat: boolean;

        enableNotifications: boolean;

        enableCareer: boolean;

        enableGames: boolean;

        enableAlumni: boolean;

    };

}