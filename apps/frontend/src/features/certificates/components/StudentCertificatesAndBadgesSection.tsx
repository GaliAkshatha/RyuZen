import { Award, ExternalLink } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { useToast } from "@/hooks/useToast";

import { useStudentBadges } from "@/features/badges/hooks/useStudentBadges";

import { useStudentCertificates } from "@/features/certificates/hooks/useStudentCertificates";
import { useIssueCertificate } from "@/features/certificates/hooks/useIssueCertificate";
import { IssueCertificateForm } from "@/features/certificates/components/IssueCertificateForm";

/**
 * Embedded in StudentDetailPage (A2), which is SUPER_ADMIN/ORG_ADMIN
 * only. FACULTY genuinely has backend permission to issue certificates
 * (canIssueCertificates()), but this milestone doesn't build a
 * Faculty-reachable entry point for it — StudentDetailPage is the only
 * natural "issue a certificate for this student" context that exists,
 * and it's admin-only. A known integration-scope limitation, not a
 * backend gap.
 */
export function StudentCertificatesAndBadgesSection({ studentId }: { studentId: string }) {
  const { data: badges } = useStudentBadges(studentId);
  const { data: certificates } = useStudentCertificates(studentId);
  const { mutate: issueCertificate, isPending, error } = useIssueCertificate(studentId);
  const { toast } = useToast();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
        </CardHeader>
        <CardContent>
          {!badges || badges.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground">No badges earned yet.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {badges.map((studentBadge) => (
                <li key={studentBadge.id} className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-warning" aria-hidden="true" />
                  <span className="font-body text-sm text-foreground">
                    {studentBadge.badge?.name ?? studentBadge.badgeId}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Certificates</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {!certificates || certificates.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground">No certificates issued yet.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {certificates.map((certificate) => (
                <li key={certificate.id}>
                  <a
                    href={certificate.certificateUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 font-body text-sm text-primary underline underline-offset-4"
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    {new Date(certificate.issuedAt).toLocaleDateString()}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <IssueCertificateForm
            studentId={studentId}
            isSubmitting={isPending}
            error={error}
            onSubmit={(values) =>
              issueCertificate(values, { onSuccess: () => toast({ title: "Certificate issued" }) })
            }
          />
        </CardContent>
      </Card>
    </>
  );
}
