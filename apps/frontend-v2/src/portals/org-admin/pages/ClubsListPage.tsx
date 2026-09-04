import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Users2, Plus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { Skeleton } from "@/shared/components/Skeleton";
import { ErrorState } from "@/shared/components/ErrorState";
import { EmptyState } from "@/shared/components/EmptyState";
import { useClubs } from "@/domains/clubs/hooks/useClubs";
import { useCreateClub } from "@/domains/clubs/hooks/useClubMutations";
import type { CreateClubRequest } from "@/domains/clubs/club.types";
import type { AppApiError } from "@/shared/types/api.types";

/**
 * Real gap filled: the entire clubs domain (catalog CRUD, advisor
 * assignment, admin-managed membership) existed on the backend with
 * zero frontend anywhere. Create/list here, member/advisor management
 * on the detail page - membership is deliberately admin-managed
 * (ORG_ADMIN adds/removes members), not students self-joining,
 * matching the real backend restriction exactly.
 */
export function ClubsListPage() {
  const { data: clubs, isLoading, isError, error, refetch } = useClubs();
  const { mutate: createClub, isPending: isCreating, error: createError } = useCreateClub();
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset } = useForm<{ name: string; code: string; description: string }>();

  function onSubmit(values: { name: string; code: string; description: string }) {
    const payload: CreateClubRequest = { name: values.name, code: values.code, description: values.description || undefined };
    createClub(payload, {
      onSuccess: () => {
        reset();
        setShowForm(false);
      },
    });
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Clubs</h1>
          <p className="text-sm text-muted-foreground">Student clubs and their advisors.</p>
        </div>
        <Button size="sm" onClick={() => setShowForm((v) => !v)} className="flex items-center gap-1.5">
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          {showForm ? "Cancel" : "New club"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>New club</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
              {createError && (
                <p className="rounded-md border border-destructive/30 bg-destructive/5 p-2.5 text-xs text-destructive">
                  {(createError as AppApiError).message}
                </p>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="club-name">Name</Label>
                  <Input id="club-name" placeholder="Robotics Club" {...register("name", { required: true })} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="club-code">Code</Label>
                  <Input id="club-code" placeholder="ROBO" {...register("code", { required: true })} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="club-description">Description</Label>
                <Input id="club-description" {...register("description")} />
              </div>
              <Button type="submit" size="sm" disabled={isCreating} className="w-fit">
                {isCreating ? "Creating…" : "Create club"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All clubs ({clubs?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {!clubs || clubs.length === 0 ? (
            <EmptyState icon={Users2} title="No clubs created yet" />
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {clubs.map((club) => (
                <Link
                  key={club.id}
                  to={`/organization/clubs/${club.id}`}
                  className="flex items-center justify-between py-2.5 text-sm hover:text-primary"
                >
                  <div>
                    <p className="font-medium text-foreground">{club.name}</p>
                    <p className="text-xs text-muted-foreground">{club.code}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${club.status === "ACTIVE" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                    {club.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
