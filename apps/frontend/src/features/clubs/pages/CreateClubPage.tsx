import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";

import { useCreateClub } from "@/features/clubs/hooks/useCreateClub";
import { ClubForm } from "@/features/clubs/components/ClubForm";
import type { CreateClubFormValues } from "@/features/clubs/schemas/club.schemas";

export function CreateClubPage() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useCreateClub();

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <Link
        to="/app/clubs"
        className="flex w-fit items-center gap-1 font-body text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Clubs
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>New Club</CardTitle>
        </CardHeader>
        <CardContent>
          <ClubForm
            isSubmitting={isPending}
            error={error}
            onSubmit={(values) =>
              mutate(values as CreateClubFormValues, {
                onSuccess: (created) => navigate(`/app/clubs/${created.id}`, { replace: true }),
              })
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
