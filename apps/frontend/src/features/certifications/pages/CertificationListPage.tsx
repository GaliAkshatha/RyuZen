import { useState } from "react";
import { BadgeCheck, ExternalLink } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";
import { useToast } from "@/hooks/useToast";

import { useMyCertifications } from "@/features/certifications/hooks/useMyCertifications";
import { useCreateCertification } from "@/features/certifications/hooks/useCreateCertification";
import { useUpdateCertification } from "@/features/certifications/hooks/useUpdateCertification";
import { CertificationForm } from "@/features/certifications/components/CertificationForm";
import { DeleteCertificationAction } from "@/features/certifications/components/DeleteCertificationAction";
import type { CertificationResponseDto } from "@/features/certifications/types/certification.types";
import type {
  CreateCertificationFormValues,
  UpdateCertificationFormValues,
} from "@/features/certifications/schemas/certification.schemas";

function CertificationRow({ certification }: { certification: CertificationResponseDto }) {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const {
    mutate: updateCertification,
    isPending,
    error,
  } = useUpdateCertification(certification.id);

  if (editing) {
    return (
      <li className="rounded-md border border-border p-3">
        <CertificationForm
          certification={certification}
          isSubmitting={isPending}
          error={error}
          onCancel={() => setEditing(false)}
          onSubmit={(values) => {
            const { issueDate, expiryDate, ...rest } = values as UpdateCertificationFormValues;
            updateCertification(
              {
                ...rest,
                issueDate: issueDate?.toISOString(),
                expiryDate: expiryDate?.toISOString(),
              },
              {
                onSuccess: () => {
                  toast({ title: "Certification updated" });
                  setEditing(false);
                },
              },
            );
          }}
        />
      </li>
    );
  }

  return (
    <li className="flex items-start justify-between gap-2 rounded-md border border-border p-3">
      <div className="flex flex-col gap-1">
        <span className="flex items-center gap-1.5 font-body text-sm font-medium text-foreground">
          <BadgeCheck className="h-4 w-4 text-success" aria-hidden="true" />
          {certification.title} — {certification.issuer}
        </span>
        <span className="font-body text-xs text-muted-foreground">
          Issued {new Date(certification.issueDate).toLocaleDateString()}
          {certification.expiryDate &&
            ` · Expires ${new Date(certification.expiryDate).toLocaleDateString()}`}
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
        {certification.skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {certification.skills.map((skill) => (
              <Badge key={skill} variant="outline">
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
          Edit
        </Button>
        <DeleteCertificationAction certificationId={certification.id} />
      </div>
    </li>
  );
}

export function CertificationListPage() {
  const { data: certifications, isLoading, isError, error, refetch } = useMyCertifications();
  const {
    mutate: createCertification,
    isPending: isCreating,
    error: createError,
  } = useCreateCertification();
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
        <BadgeCheck className="h-6 w-6 text-primary" aria-hidden="true" />
        My Certifications
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Add a Certification</CardTitle>
        </CardHeader>
        <CardContent>
          {showAddForm ? (
            <CertificationForm
              isSubmitting={isCreating}
              error={createError}
              onCancel={() => setShowAddForm(false)}
              onSubmit={(values) => {
                const { issueDate, expiryDate, ...rest } = values as CreateCertificationFormValues;
                createCertification(
                  {
                    ...rest,
                    issueDate: issueDate.toISOString(),
                    expiryDate: expiryDate?.toISOString(),
                  },
                  {
                    onSuccess: () => {
                      toast({ title: "Certification added" });
                      setShowAddForm(false);
                    },
                  },
                );
              }}
            />
          ) : (
            <Button size="sm" onClick={() => setShowAddForm(true)}>
              Add certification
            </Button>
          )}
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonLoader key={i} className="h-20" />
          ))}
        </div>
      ) : !certifications || certifications.length === 0 ? (
        <EmptyState
          title="No certifications yet"
          description="Add your professional certifications to build your profile."
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {certifications.map((certification) => (
            <CertificationRow key={certification.id} certification={certification} />
          ))}
        </ul>
      )}
    </div>
  );
}
