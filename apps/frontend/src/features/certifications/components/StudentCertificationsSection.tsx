import { BadgeCheck, ExternalLink } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";

import { useUserCertifications } from "@/features/certifications/hooks/useUserCertifications";

/**
 * Embedded in StudentDetailPage (A2). View-only — a viewer here
 * doesn't own the student's certifications (Edit/Delete enforce real
 * ownership server-side, "You can only update your own
 * certifications."). userId is the Student's own `userId` field.
 */
export function StudentCertificationsSection({ userId }: { userId: string }) {
  const { data: certifications } = useUserCertifications(userId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Certifications</CardTitle>
      </CardHeader>
      <CardContent>
        {!certifications || certifications.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground">No certifications listed yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {certifications.map((certification) => (
              <li key={certification.id} className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 font-body text-sm text-foreground">
                  <BadgeCheck className="h-4 w-4 text-success" aria-hidden="true" />
                  {certification.title} — {certification.issuer}
                </span>
                {certification.credentialUrl && (
                  <a
                    href={certification.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 font-body text-xs text-primary underline underline-offset-4"
                  >
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                    View credential
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
