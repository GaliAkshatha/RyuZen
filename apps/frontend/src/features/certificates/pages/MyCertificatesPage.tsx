import { ExternalLink, FileBadge } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";

import { useMyCertificates } from "@/features/certificates/hooks/useMyCertificates";

export function MyCertificatesPage() {
  const { data: certificates, isLoading, isError, error, refetch } = useMyCertificates();

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
        <FileBadge className="h-6 w-6 text-primary" aria-hidden="true" />
        My Certificates
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonLoader key={i} className="h-20" />
          ))}
        </div>
      ) : !certificates || certificates.length === 0 ? (
        <EmptyState
          title="No certificates yet"
          description="Certificates issued for your activities and events will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {certificates.map((certificate) => (
            <Card key={certificate.id}>
              <CardHeader>
                <CardTitle className="text-base">
                  Issued {new Date(certificate.issuedAt).toLocaleDateString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={certificate.certificateUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 font-body text-sm text-primary underline underline-offset-4"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  View certificate
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
