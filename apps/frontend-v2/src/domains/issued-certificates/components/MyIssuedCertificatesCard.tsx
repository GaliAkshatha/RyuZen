import { GraduationCap, ExternalLink } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { useMyIssuedCertificates } from "@/domains/issued-certificates/hooks/useMyIssuedCertificates";

/**
 * Real gap filled: a student had no way to see platform-issued
 * certificates (Faculty/Org Admin recognition for a real activity or
 * event) anywhere in the app - genuinely distinct from the
 * self-reported external certifications already shown elsewhere on
 * the Portfolio page.
 */
export function MyIssuedCertificatesCard() {
  const { data: certificates, isLoading } = useMyIssuedCertificates();

  if (isLoading) {
    return <Skeleton className="h-24 w-full" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-primary" aria-hidden="true" />
          Issued certificates
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!certificates || certificates.length === 0 ? (
          <EmptyState icon={GraduationCap} title="No certificates issued yet" />
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {certificates.map((c) => (
              <div key={c.id} className="flex items-center justify-between py-2.5 text-sm">
                <p className="text-xs text-muted-foreground">Issued {new Date(c.issuedAt).toLocaleDateString()}</p>
                <a
                  href={c.certificateUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80"
                >
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  View
                </a>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
