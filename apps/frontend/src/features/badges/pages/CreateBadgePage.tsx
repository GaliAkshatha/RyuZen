import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";

import { useCreateBadge } from "@/features/badges/hooks/useCreateBadge";
import { BadgeForm } from "@/features/badges/components/BadgeForm";
import type { CreateBadgeFormValues } from "@/features/badges/schemas/badge.schemas";

export function CreateBadgePage() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useCreateBadge();

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <Link
        to="/app/badges"
        className="flex w-fit items-center gap-1 font-body text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Badges
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>New Badge</CardTitle>
        </CardHeader>
        <CardContent>
          <BadgeForm
            isSubmitting={isPending}
            error={error}
            onSubmit={(values) =>
              mutate(values as CreateBadgeFormValues, {
                onSuccess: (created) => navigate(`/app/badges/${created.id}`, { replace: true }),
              })
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
