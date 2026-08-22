import { UserRepository } from "../../infrastructure/repositories/UserRepository.js";

import { OrganizationRepository } from "../../../organizations/infrastructure/repositories/OrganizationRepository.js";

import {
    OrganizationSettingsRepository,
} from "../../../organizations/infrastructure/repositories/OrganizationSettingsRepository.js";

import { InvitationRepository } from "../../infrastructure/repositories/InvitationRepository.js";

import { SessionRepository } from "../../infrastructure/repositories/SessionRepository.js";

import { BCryptPasswordHasher } from "../../infrastructure/security/BCryptPasswordHasher.js";

import { JwtTokenProvider } from "../../infrastructure/security/JwtTokenProvider.js";

import { LoginUserUseCase } from "../use-cases/LoginUserUseCase.js";

import { GetProfileUseCase } from "../use-cases/GetProfileUseCase.js";

import { UpdateProfileUseCase } from "../use-cases/UpdateProfileUseCase.js";

import { ChangePasswordUseCase } from "../use-cases/ChangePasswordUseCase.js";

import { ForgotPasswordUseCase } from "../use-cases/ForgotPasswordUseCase.js";

import { ResetPasswordUseCase } from "../use-cases/ResetPasswordUseCase.js";

import { RefreshTokenUseCase } from "../use-cases/RefreshTokenUseCase.js";

import { GrantPermissionUseCase } from "../use-cases/GrantPermissionUseCase.js";

import { RevokePermissionUseCase } from "../use-cases/RevokePermissionUseCase.js";

import { InviteUserUseCase } from "../use-cases/InviteUserUseCase.js";

import { VerifyInvitationUseCase } from "../use-cases/VerifyInvitationUseCase.js";

import { AcceptInvitationUseCase } from "../use-cases/AcceptInvitationUseCase.js";

import { ResendInvitationUseCase } from "../use-cases/ResendInvitationUseCase.js";

import { RevokeInvitationUseCase } from "../use-cases/RevokeInvitationUseCase.js";

import { GetOrganizationInvitationsUseCase } from "../use-cases/GetOrganizationInvitationsUseCase.js";

import { AdminUnlockUserUseCase } from "../use-cases/AdminUnlockUserUseCase.js";

import { UpdateUserStatusUseCase } from "../use-cases/UpdateUserStatusUseCase.js";

import { GetMySessionsUseCase } from "../use-cases/GetMySessionsUseCase.js";

import { RevokeSessionUseCase } from "../use-cases/RevokeSessionUseCase.js";

import { LogoutUseCase } from "../use-cases/LogoutUseCase.js";

import { LogoutAllDevicesUseCase } from "../use-cases/LogoutAllDevicesUseCase.js";

import { NodemailerEmailService } from "../../../../shared/infrastructure/email/NodemailerEmailService.js";

import { auditContainer } from "../../../platform/audit/application/container/AuditContainer.js";

const userRepository =

    new UserRepository();

const organizationRepository =

    new OrganizationRepository();

const organizationSettingsRepository =

    new OrganizationSettingsRepository();

const invitationRepository =

    new InvitationRepository();

const sessionRepository =

    new SessionRepository();

const passwordHasher =

    new BCryptPasswordHasher();

const tokenProvider =

    new JwtTokenProvider();

const emailService =

    new NodemailerEmailService();

export const identityContainer = {

    loginUser:

        new LoginUserUseCase(

            userRepository,

            sessionRepository,

            passwordHasher,

            tokenProvider,

            auditContainer.createAuditLog,

            organizationSettingsRepository

        ),

    getProfile:

        new GetProfileUseCase(

            userRepository

        ),

    updateProfile:

        new UpdateProfileUseCase(

            userRepository

        ),

    changePassword:

        new ChangePasswordUseCase(

            userRepository,

            passwordHasher,

            organizationSettingsRepository,

            emailService

        ),

    forgotPassword:

        new ForgotPasswordUseCase(

            userRepository,

            emailService

        ),

    resetPassword:

        new ResetPasswordUseCase(

            userRepository,

            passwordHasher,

            auditContainer.createAuditLog,

            organizationSettingsRepository

        ),

    refreshToken:

        new RefreshTokenUseCase(

            userRepository,

            sessionRepository,

            tokenProvider

        ),

    grantPermission:

        new GrantPermissionUseCase(

            userRepository

        ),

    revokePermission:

        new RevokePermissionUseCase(

            userRepository

        ),

    inviteUser:

        new InviteUserUseCase(

            userRepository,

            invitationRepository,

            organizationRepository,

            passwordHasher,

            emailService,

            organizationSettingsRepository

        ),

    verifyInvitation:

        new VerifyInvitationUseCase(

            invitationRepository,

            userRepository,

            organizationRepository,

            auditContainer.createAuditLog

        ),

    acceptInvitation:

        new AcceptInvitationUseCase(

            invitationRepository,

            userRepository,

            passwordHasher,

            auditContainer.createAuditLog,

            organizationSettingsRepository

        ),

    resendInvitation:

        new ResendInvitationUseCase(

            invitationRepository,

            organizationRepository,

            emailService,

            organizationSettingsRepository

        ),

    revokeInvitation:

        new RevokeInvitationUseCase(

            invitationRepository

        ),

    getOrganizationInvitations:

        new GetOrganizationInvitationsUseCase(

            invitationRepository

        ),

    adminUnlockUser:

        new AdminUnlockUserUseCase(

            userRepository

        ),

    updateUserStatus:

        new UpdateUserStatusUseCase(

            userRepository

        ),

    getMySessions:

        new GetMySessionsUseCase(

            sessionRepository

        ),

    revokeSession:

        new RevokeSessionUseCase(

            sessionRepository

        ),

    logout:

        new LogoutUseCase(

            sessionRepository

        ),

    logoutAllDevices:

        new LogoutAllDevicesUseCase(

            sessionRepository

        )

};
