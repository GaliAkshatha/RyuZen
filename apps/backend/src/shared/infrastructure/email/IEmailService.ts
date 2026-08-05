export interface EmailMessage {

    to: string;

    subject: string;

    html: string;

}

/**
 * The one abstraction every use case that needs to send an email
 * depends on - ForgotPasswordUseCase, the future invitation/email-
 * verification use cases, bulk import, etc. Business logic never talks
 * to Nodemailer (or any provider) directly, matching the same
 * port/adapter pattern already established for AI providers
 * (AIProviderFactory) and the point ledger.
 */
export interface IEmailService {

    send(message: EmailMessage): Promise<void>;

}
