import { useState } from "react";
import { useParams } from "react-router-dom";
import { Send, AlertCircle, CheckCircle2, XCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Skeleton } from "@/shared/components/Skeleton";
import { ErrorState } from "@/shared/components/ErrorState";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { usePlacementDrive } from "@/domains/placement-drives/hooks/usePlacementDrive";
import { useMyEligibility } from "@/domains/placement-drives/hooks/useMyEligibility";
import { useCompanies } from "@/domains/companies/hooks/useCompanies";
import { useMyApplications } from "@/domains/job-applications/hooks/useMyApplications";
import { useApplyToPlacement } from "@/domains/job-applications/hooks/useApplyToPlacement";
import type { AppApiError } from "@/shared/types/api.types";

/**
 * Real eligibility signal, closing the previously-confirmed
 * "no student-facing eligibility check" backend gap - GET
 * /placements/:id/my-eligibility reuses the exact same
 * isStudentEligibleForDrive() logic the backend uses to gate the
 * actual apply action, so what's shown here is guaranteed to match
 * what happens on submit, not a separate, potentially-drifting
 * client-side approximation. The final backend check on apply
 * remains authoritative regardless - this is a genuine improvement
 * to the student's information, not a replacement for that check.
 */
export function DriveDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: drive, isLoading, isError, error, refetch } = usePlacementDrive(id ?? "");
  const { data: eligibility } = useMyEligibility(id ?? "");
  const { data: companies } = useCompanies();
  const { data: myApplications } = useMyApplications();
  const { mutate: apply, isPending } = useApplyToPlacement(id ?? "");
  const [applyError, setApplyError] = useState<AppApiError | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !drive) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const company = companies?.find((c) => c.id === drive.companyId);
  const existingApplication = myApplications?.find((a) => a.placementId === drive.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{drive.title}</h1>
          <p className="text-sm text-muted-foreground">
            {company?.name ?? "Company"}
            {drive.package && ` · ${drive.package}`}
            {drive.location && ` · ${drive.location}`}
          </p>
        </div>
        {existingApplication ? (
          <StatusBadge status={existingApplication.status} />
        ) : (
          <Button
            size="sm"
            disabled={isPending}
            className="flex items-center gap-2"
            onClick={() => {
              setApplyError(null);
              apply({}, { onError: (err) => setApplyError(err) });
            }}
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            {isPending ? "Applying…" : "Apply"}
          </Button>
        )}
      </div>

      {applyError && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{applyError.message}</span>
        </div>
      )}

      {!existingApplication && eligibility && (
        <div
          className={
            eligibility.eligible
              ? "flex items-start gap-2 rounded-md border border-success/30 bg-success/5 p-3 text-sm text-success"
              : "flex items-start gap-2 rounded-md border border-warning/30 bg-warning/5 p-3 text-sm text-warning"
          }
        >
          {eligibility.eligible ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          ) : (
            <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          )}
          <div>
            <p className="font-medium">{eligibility.eligible ? "You're eligible for this drive." : "You may not meet all criteria for this drive."}</p>
            {eligibility.reasons.length > 0 && (
              <ul className="mt-1 list-disc pl-4">
                {eligibility.reasons.map((reason, i) => (
                  <li key={i}>{reason}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground">{drive.description || "No description provided."}</p>
        </CardContent>
      </Card>

      {drive.eligibility && (
        <Card>
          <CardHeader>
            <CardTitle>Eligibility</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground">{drive.eligibility}</p>
          </CardContent>
        </Card>
      )}

      {drive.deadline && (
        <p className="text-sm text-muted-foreground">
          Apply by {new Date(drive.deadline).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
