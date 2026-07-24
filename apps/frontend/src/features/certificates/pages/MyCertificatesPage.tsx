import { ExternalLink, FileBadge } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";
import { ScrollReveal } from "@/shared/components/ScrollReveal";

import { useMyCertificates } from "@/features/certificates/hooks/useMyCertificates";

export function MyCertificatesPage() {
  const { data: certificates, isLoading, isError, error, refetch } = useMyCertificates();

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="relative flex flex-col gap-6">
      <PageAtmosphere variant="glow" />

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
          {certificates.map((certificate, i) => (
            <ScrollReveal key={certificate.id} delay={i * 60}>
              <Card className="group border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_28px_-10px_hsl(var(--primary)/0.45)]">
                <CardHeader className="flex-row items-center gap-3 space-y-0">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                    <FileBadge className="h-5 w-5" aria-hidden="true" />
                  </span>
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
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}
