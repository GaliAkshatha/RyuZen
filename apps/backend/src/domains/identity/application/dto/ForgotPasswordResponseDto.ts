/**
 * Deliberately empty in every case (whether the account exists or
 * not) - the reset token is emailed directly to the account's own
 * address, never returned in this response. See ForgotPasswordUseCase's
 * doc comment for the security issue this fixes.
 */
export type ForgotPasswordResponseDto = Record<string, never>;
