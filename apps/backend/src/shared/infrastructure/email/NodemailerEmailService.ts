import nodemailer, { type Transporter } from "nodemailer";

import { env } from "../../../config/env.js";
import { Logger } from "../logger/logger.js";

import { EmailMessage, IEmailService } from "./IEmailService.js";

/**
 * Real SMTP-based email delivery - works with any SMTP provider
 * (Gmail, SendGrid/SES/Mailgun's SMTP relays, a self-hosted MTA, or a
 * local dev catcher like MailHog/Mailpit) since it's configured purely
 * through generic SMTP env vars, never a provider-specific SDK. No
 * business logic anywhere talks to Nodemailer directly - only this
 * file does.
 *
 * If SMTP isn't configured (no SMTP_HOST), this logs a clear warning
 * and returns without throwing - a missing mail configuration should
 * never crash a real business action like "an admin invited a
 * student". The invitation/reset token itself is still generated and
 * stored correctly either way; only the notification email is
 * skipped, and that's logged loudly so it's not silently lost in a
 * real deployment.
 */
export class NodemailerEmailService implements IEmailService {

    private transporter: Transporter | null = null;

    private getTransporter(): Transporter | null {
        if (!env.SMTP_HOST) {
            return null;
        }

        this.transporter ??= nodemailer.createTransport({
            host: env.SMTP_HOST,
            port: env.SMTP_PORT,
            secure: env.SMTP_SECURE,
            auth: env.SMTP_USER
                ? { user: env.SMTP_USER, pass: env.SMTP_PASSWORD }
                : undefined
        });

        return this.transporter;
    }

    async send(message: EmailMessage): Promise<void> {
        const transporter = this.getTransporter();

        if (!transporter) {
            Logger.warn(
                `NodemailerEmailService: SMTP_HOST is not configured - skipping email to ${message.to} ("${message.subject}"). Set SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASSWORD to enable real delivery.`
            );
            return;
        }

        try {
            await transporter.sendMail({
                from: env.EMAIL_FROM,
                to: message.to,
                subject: message.subject,
                html: message.html
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            Logger.error(
                `NodemailerEmailService: failed to send email to ${message.to} - ${errorMessage}`
            );
            // Deliberately does not re-throw - a transient email
            // failure should not fail the underlying business action
            // (the invitation/reset record is already saved). The
            // caller can offer a real "resend" action instead.
        }
    }

}
