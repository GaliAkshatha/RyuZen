import ms from "ms";

import { LoginDto } from "../dto/LoginDto.js";
import { AuthResponseDto } from "../dto/AuthResponseDto.js";

import { IUserRepository } from "../../infrastructure/repositories/IUserRepository.js";
import { ISessionRepository } from "../../infrastructure/repositories/ISessionRepository.js";

import {
    IOrganizationSettingsRepository,
} from "../../../organizations/infrastructure/repositories/IOrganizationSettingsRepository.js";

import { IPasswordHasher } from "../ports/IPasswordHasher.js";
import { ITokenProvider } from "../ports/ITokenProvider.js";

import { UserStatus } from "../../domain/constants/UserStatus.js";
import { Session } from "../../domain/entities/Session.js";

import { parseUserAgent } from "../../../../shared/infrastructure/http/parseUserAgent.js";

import { hashToken } from "../../../../shared/infrastructure/security/hashToken.js";

import { CreateAuditLogUseCase } from "../../../platform/audit/application/use-cases/CreateAuditLogUseCase.js";

import { env } from "../../../../config/env.js";

import { ApiError } from "../../../../shared/core/http/ApiError.js";
import { HttpStatus } from "../../../../shared/core/http/HttpStatus.js";

/**
 * STATUS ENFORCEMENT: previously, `status` was stored on every User
 * but never actually checked here — a SUSPENDED or not-yet-activated
 * account could log in with zero restriction, confirmed by reading
 * this file before making any change. Now genuinely enforced, per the
 * lifecycle's real business rules (UserStatus.ts): INVITED and
 * EMAIL_VERIFIED accounts haven't finished setup and cannot log in yet
 * (they need the password-setup flow, not this one), SUSPENDED and
 * ARCHIVED are both denied outright.
 *
 * ACCOUNT LOCKOUT: the lock check happens FIRST, before password
 * verification — once locked, ALL attempts are denied uniformly
 * (right password or wrong), otherwise the lock would only protect
 * against wrong-password guesses and do nothing once an attacker
 * eventually got the password right. A wrong-password attempt against
 * a locked account still gets the lock message, not the generic one —
 * this is a deliberate exception to the "don't leak status" rule
 * below, because the lock message reveals nothing an attacker doesn't
 * already know (they just tried and got denied either way) and it's
 * genuinely useful for the real account owner to see.
 *
 * The status check (separately) happens AFTER password verification,
 * not before — a wrong-password attempt always gets the same generic
 * "Invalid email or password" regardless of the account's real status
 * (no information leak to someone who doesn't actually have the
 * password), while someone who does know the password gets a
 * specific, honest reason.
 *
 * SESSION: a successful login creates a real Session record before
 * issuing the refresh token — the token's `sessionId` claim points at
 * it, which is what makes real rotation-with-reuse-detection possible
 * in RefreshTokenUseCase (a stateless JWT alone can't support that).
 */
export class LoginUserUseCase {

    constructor(

        private readonly userRepository: IUserRepository,

        private readonly sessionRepository: ISessionRepository,

        private readonly passwordHasher: IPasswordHasher,

        private readonly tokenProvider: ITokenProvider,

        private readonly createAuditLog: CreateAuditLogUseCase,

        private readonly organizationSettingsRepository: IOrganizationSettingsRepository

    ) {}

    /**
     * Real audit logging for both success and every failure branch
     * except "no such user" - that case has no organizationId to
     * attribute the event to (AuditLog requires one), and fabricating
     * one would misattribute a real security event to the wrong
     * organization. Every failure where a real user WAS found
     * (wrong password, locked, not yet activated, suspended, archived)
     * logs against that user's real organization, with the specific
     * reason captured in metadata rather than inventing a new action
     * name per case - the brief names exactly "Login Success" and
     * "Login Failure", not five different failure-reason events.
     */
    private async logAttempt(

        outcome: "LOGIN_SUCCESS" | "LOGIN_FAILURE",

        user: { id?: string; organizationId: string },

        ipAddress: string,

        userAgent: string,

        reason?: string

    ): Promise<void> {

        await this.createAuditLog.execute({

            organizationId: user.organizationId,

            userId: user.id,

            action: outcome,

            entityType: "User",

            entityId: user.id,

            method: "POST",

            path: "/api/v1/auth/login",

            statusCode: outcome === "LOGIN_SUCCESS" ? 200 : 401,

            ipAddress,

            userAgent,

            metadata: reason ? { reason } : undefined

        }).catch(() => {
            // Audit logging must never break a real login attempt.
        });

    }

    async execute(

        dto: LoginDto,

        ipAddress: string,

        userAgent: string

    ): Promise<AuthResponseDto> {

        const user =
            await this.userRepository.findByEmail(
                dto.email,
                {
                    includePassword: true
                }
            );

        if (!user) {

            throw new ApiError(

                "Invalid email or password.",

                HttpStatus.UNAUTHORIZED

            );

        }

        if (user.auth.lockedUntil && user.auth.lockedUntil.getTime() > Date.now()) {

            const minutesLeft =
                Math.ceil((user.auth.lockedUntil.getTime() - Date.now()) / 60000);

            await this.logAttempt("LOGIN_FAILURE", user, ipAddress, userAgent, "account_locked");

            throw new ApiError(

                `Too many failed attempts. Try again in ${minutesLeft} minute${minutesLeft === 1 ? "" : "s"}, or contact your organization administrator.`,

                HttpStatus.FORBIDDEN

            );

        }

        const valid =
            await this.passwordHasher.compare(

                dto.password,

                user.auth.passwordHash

            );

        if (!valid) {

            const newAttemptCount =
                await this.userRepository.incrementFailedAttempts(
                    user.id!
                );

            const orgSettings =
                await this.organizationSettingsRepository.findByOrganizationId(
                    user.organizationId
                );

            const lockThreshold =
                orgSettings?.security.loginAttemptLimit ?? env.ACCOUNT_LOCK_THRESHOLD;

            const lockDurationMs =
                orgSettings
                    ? orgSettings.security.accountLockDurationMinutes * 60 * 1000
                    : env.ACCOUNT_LOCK_DURATION_MS;

            if (newAttemptCount >= lockThreshold) {

                const lockedUntil =
                    new Date(Date.now() + lockDurationMs);

                await this.userRepository.lockAccount(
                    user.id!,
                    lockedUntil
                );

                const minutes =
                    Math.ceil(lockDurationMs / 60000);

                await this.logAttempt("LOGIN_FAILURE", user, ipAddress, userAgent, "wrong_password_now_locked");

                throw new ApiError(

                    `Too many failed attempts. Your account is locked for ${minutes} minutes.`,

                    HttpStatus.FORBIDDEN

                );

            }

            await this.logAttempt("LOGIN_FAILURE", user, ipAddress, userAgent, "wrong_password");

            throw new ApiError(

                "Invalid email or password.",

                HttpStatus.UNAUTHORIZED

            );

        }

        if (user.status === UserStatus.INVITED || user.status === UserStatus.EMAIL_VERIFIED) {

            await this.logAttempt("LOGIN_FAILURE", user, ipAddress, userAgent, "account_not_activated");

            throw new ApiError(

                "Your account setup isn't complete yet. Check your email for the invitation link to set your password.",

                HttpStatus.FORBIDDEN

            );

        }

        if (user.status === UserStatus.SUSPENDED) {

            await this.logAttempt("LOGIN_FAILURE", user, ipAddress, userAgent, "account_suspended");

            throw new ApiError(

                "Your account has been suspended. Contact your organization administrator.",

                HttpStatus.FORBIDDEN

            );

        }

        if (user.status === UserStatus.ARCHIVED) {

            await this.logAttempt("LOGIN_FAILURE", user, ipAddress, userAgent, "account_archived");

            throw new ApiError(

                "Invalid email or password.",

                HttpStatus.UNAUTHORIZED

            );

        }

        await this.userRepository.resetFailedAttempts(
            user.id!
        );

        await this.userRepository.updateLastLogin(
            user.id!
        );

        await this.logAttempt("LOGIN_SUCCESS", user, ipAddress, userAgent);

        const { device, browser } =
            parseUserAgent(userAgent);

        const refreshTokenTtlMs =
            ms(env.REFRESH_TOKEN_EXPIRES_IN as ms.StringValue);

        // A real Session must exist before either token is generated,
        // since both embed this session's real id (the access token's
        // sessionId is what lets an authenticated request identify
        // "this device's session" for logout/session-listing later).
        // The token's own raw value can't be hashed into
        // refreshTokenHash until after it's generated, so this is
        // created with a placeholder hash and immediately updated
        // once the real token exists (two writes, not one, but both
        // happen before this use case returns).
        const session =
            await this.sessionRepository.create(

                Session.create({

                    userId: user.id!,

                    organizationId: user.organizationId,

                    device,

                    browser,

                    ipAddress,

                    userAgent: userAgent || "Unknown",

                    refreshTokenHash: "",

                    lastActiveAt: new Date(),

                    expiresAt: new Date(Date.now() + refreshTokenTtlMs),

                    revoked: false

                })

            );

        const accessToken =
            await this.tokenProvider.generateAccessToken(
                user,
                session.id!
            );

        const refreshToken =
            await this.tokenProvider.generateRefreshToken(
                user,
                session.id!
            );

        const refreshTokenHash =
            hashToken(refreshToken);

        session.rotate(
            refreshTokenHash,
            new Date(Date.now() + refreshTokenTtlMs)
        );

        await this.sessionRepository.save(
            session
        );

        return {

            accessToken,

            refreshToken,

            user: {

                id: user.id!,

                organizationId: user.organizationId,

                name: user.name,

                email: user.email,

                role: user.role

            }

        };

    }

}