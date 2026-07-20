import { useParams } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonCard } from "@/shared/components/SkeletonLoader";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { useToast } from "@/hooks/useToast";

import { useAlumniMember } from "@/features/alumni/hooks/useAlumniMember";
import { useUpdateAlumni } from "@/features/alumni/hooks/useUpdateAlumni";
import { AlumniForm } from "@/features/alumni/components/AlumniForm";
import { VerifyAlumniAction } from "@/features/alumni/components/VerifyAlumniAction";

export function AlumniDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const { data: alumnus, isLoading, isError, error, refetch } = useAlumniMember(id ?? "");
  const { mutate: updateAlumni, isPending, error: updateError } = useUpdateAlumni(id ?? "");

  if (isLoading) {
    return <SkeletonCard className="max-w-xl" />;
  }

  if (isError || !alumnus) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            {alumnus.name ?? alumnus.email}
          </h1>
          <div className="mt-1 flex items-center gap-2">
            <StatusBadge status={alumnus.status} />
            <span className="font-body text-sm text-muted-foreground">{alumnus.email}</span>
          </div>
        </div>
        <VerifyAlumniAction alumnus={alumnus} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Alumni Record</CardTitle>
        </CardHeader>
        <CardContent>
          <AlumniForm
            alumnus={alumnus}
            isSubmitting={isPending}
            error={updateError}
            onSubmit={(values) =>
              updateAlumni(values, { onSuccess: () => toast({ title: "Alumni record updated" }) })
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
