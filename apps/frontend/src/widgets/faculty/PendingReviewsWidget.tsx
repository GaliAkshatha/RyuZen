import { Link } from "react-router-dom";
import { FileCheck } from "lucide-react";

import { WidgetCard } from "@/widgets/shared/WidgetCard";
import { Spinner } from "@/shared/components/Spinner";

import { useSubmissions } from "@/features/submissions/hooks/useSubmissions";
import { SubmissionStatus } from "@/types/enums";

/**
 * Wired in AC2. Shows organization-wide pending submissions, not
 * "assigned to me" — submissions have no per-reviewer ownership concept
 * on the backend at all (confirmed this milestone: no facultyId/
 * reviewerId scoping exists anywhere on submission.routes.ts), so
 * unlike Mentorship's genuine self-scoping gap, there is nothing to
 * filter to here even in principle. Every reviewer sees the same
 * organization-wide queue.
 */
export function PendingReviewsWidget() {
  const { data: pending, isLoading } = useSubmissions({ status: SubmissionStatus.PENDING });
  const { data: resubmitted } = useSubmissions({ status: SubmissionStatus.RESUBMITTED });

  const total = (pending?.length ?? 0) + (resubmitted?.length ?? 0);

  return (
    <WidgetCard title="Pending Reviews" icon={FileCheck} wired>
      {isLoading ? (
        <Spinner size="sm" />
      ) : (
        <div className="flex flex-col gap-2">
          <p className="font-display text-2xl font-semibold text-foreground">{total}</p>
          <p className="font-body text-sm text-muted-foreground">
            {total === 1 ? "submission awaits" : "submissions await"} review across your
            organization.
          </p>
          <Link
            to="/app/submissions"
            className="font-body text-sm text-primary underline underline-offset-4"
          >
            Review submissions
          </Link>
        </div>
      )}
    </WidgetCard>
  );
}
