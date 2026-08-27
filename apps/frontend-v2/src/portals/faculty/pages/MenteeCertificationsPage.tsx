import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, ShieldAlert, ExternalLink } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Skeleton } from "@/shared/components/Skeleton";
import { ErrorState } from "@/shared/components/ErrorState";
import { EmptyState } from "@/shared/components/EmptyState";
import { usePortfolioForUser } from "@/domains/portfolio/hooks/usePortfolioForUser";
import { useVerifyCertification } from "@/domains/portfolio/hooks/usePortfolioMutations";

/**
 * The certificate verify UI - a confirmed real gap: the backend
 * (VerifyCertificationUseCase, real cross-org protection) and the
 * hook (useVerifyCertification) both already existed, but there was
 * no Faculty-facing page to put a Verify button on at all. Reuses
 * the real usePortfolioForUser hook already proven on
 * CandidateProfilePage - same real data source, just a different
 * viewer role and a Verify action recruiters don't get.
 */
export function MenteeCertificationsPage() {
  const { userId } = useParams<{ userId: string }>();
  const { data: portfolio, isLoading, isError, error, refetch } = usePortfolioForUser(userId ?? "");
  const { mutate: verify, isPending: isVerifying, variables: verifyingId } = useVerifyCertification();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !portfolio) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link to="/faculty/students" className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-foreground">{portfolio.name}'s certifications</h1>
          <p className="text-sm text-muted-foreground">Confirm each certification is legitimate.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Certifications</CardTitle>
        </CardHeader>
        <CardContent>
          {portfolio.certifications.length === 0 ? (
            <EmptyState title="No certifications yet" />
          ) : (
            <div className="flex flex-col gap-3">
              {portfolio.certifications.map((cert) => (
                <div key={cert.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                  <div>
                    <p className="flex items-center gap-1.5 font-medium text-foreground">
                      {cert.title}
                      {cert.verified && (
                        <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
                          <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                          Verified
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {cert.issuer} · {new Date(cert.issueDate).getFullYear()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {cert.fileUrl && (
                      <a
                        href={cert.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary/80"
                      >
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        View file
                      </a>
                    )}
                    {!cert.verified && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isVerifying && verifyingId === cert.id}
                        onClick={() => verify(cert.id)}
                        className="flex items-center gap-1.5"
                      >
                        <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
                        {isVerifying && verifyingId === cert.id ? "Verifying…" : "Verify"}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
