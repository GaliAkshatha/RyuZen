/**
 * One shared, simple HTML shell every email template renders inside -
 * so a password-reset email, an invitation email, and a verification
 * email all look like they came from the same product, without each
 * use case building its own HTML from scratch.
 */
function renderEmailShell(bodyHtml: string): string {
    return `
<div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a;">
  <p style="font-size: 20px; font-weight: 700; margin: 0 0 24px;">RyuZen</p>
  ${bodyHtml}
  <p style="font-size: 12px; color: #888; margin-top: 32px;">If you didn't expect this email, you can safely ignore it.</p>
</div>`.trim();
}

function renderButton(url: string, label: string): string {
    return `<p style="margin: 24px 0;"><a href="${url}" style="background: #1a1a1a; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">${label}</a></p>`;
}

export function buildPasswordResetEmail(resetUrl: string): { subject: string; html: string } {
    return {
        subject: "Reset your RyuZen password",
        html: renderEmailShell(`
            <p>We received a request to reset your password.</p>
            ${renderButton(resetUrl, "Reset Password")}
            <p style="font-size: 13px; color: #666;">This link expires in 1 hour. If you didn't request this, your password is still safe.</p>
        `)
    };
}

export function buildInvitationEmail(params: {
    inviteeName: string;
    organizationName: string;
    role: string;
    acceptUrl: string;
}): { subject: string; html: string } {
    return {
        subject: `You've been invited to join ${params.organizationName} on RyuZen`,
        html: renderEmailShell(`
            <p>Hi ${params.inviteeName},</p>
            <p>You've been invited to join <strong>${params.organizationName}</strong> on RyuZen as a <strong>${params.role}</strong>.</p>
            ${renderButton(params.acceptUrl, "Accept Invitation")}
            <p style="font-size: 13px; color: #666;">This invitation expires in 7 days. You'll set your own password after clicking the link above.</p>
        `)
    };
}
