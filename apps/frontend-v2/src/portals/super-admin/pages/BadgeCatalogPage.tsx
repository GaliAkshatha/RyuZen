import { useState } from "react";
import { useForm } from "react-hook-form";
import { Award, Plus, Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Label } from "@/shared/ui/Label";
import { Skeleton } from "@/shared/components/Skeleton";
import { ErrorState } from "@/shared/components/ErrorState";
import { EmptyState } from "@/shared/components/EmptyState";
import { useBadges } from "@/domains/badges/hooks/useBadges";
import { useCreateBadge, useDeleteBadge } from "@/domains/badges/hooks/useBadgeMutations";
import type { CreateBadgeRequest } from "@/domains/badges/badge.types";
import type { AppApiError } from "@/shared/types/api.types";

/**
 * Real gap filled: the entire badge domain (global catalog CRUD +
 * per-student awarding) existed on the backend with zero frontend
 * anywhere. This is the catalog half - SUPER_ADMIN only, matching the
 * real backend restriction exactly. Awarding a catalog badge to a
 * specific student is a separate action, built on Faculty's "My
 * Students" page (AwardBadgeButton), since that's real Faculty/Org
 * Admin territory, not Super Admin's.
 */
export function BadgeCatalogPage() {
  const { data: badges, isLoading, isError, error, refetch } = useBadges();
  const { mutate: createBadge, isPending: isCreating, error: createError } = useCreateBadge();
  const { mutate: deleteBadge, isPending: isDeleting, variables: deletingId } = useDeleteBadge();
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset } = useForm<{ name: string; description: string; criteria: string; points: string }>();

  function onSubmit(values: { name: string; description: string; criteria: string; points: string }) {
    const payload: CreateBadgeRequest = {
      name: values.name,
      description: values.description || undefined,
      criteria: values.criteria || undefined,
      points: values.points ? Number(values.points) : undefined,
    };
    createBadge(payload, {
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
          <h1 className="text-2xl font-semibold text-foreground">Badge catalog</h1>
          <p className="text-sm text-muted-foreground">The platform-wide badges Faculty and Org Admins can award to students.</p>
        </div>
        <Button size="sm" onClick={() => setShowForm((v) => !v)} className="flex items-center gap-1.5">
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          {showForm ? "Cancel" : "New badge"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>New badge</CardTitle>
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
                  <Label htmlFor="badge-name">Name</Label>
                  <Input id="badge-name" placeholder="Top Contributor" {...register("name", { required: true })} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="badge-points">Points</Label>
                  <Input id="badge-points" type="number" min={0} {...register("points")} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="badge-description">Description</Label>
                <Input id="badge-description" {...register("description")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="badge-criteria">Criteria</Label>
                <Input id="badge-criteria" placeholder="What earns this badge" {...register("criteria")} />
              </div>
              <Button type="submit" size="sm" disabled={isCreating} className="w-fit">
                {isCreating ? "Creating…" : "Create badge"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All badges ({badges?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {!badges || badges.length === 0 ? (
            <EmptyState icon={Award} title="No badges created yet" />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {badges.map((badge) => (
                <div key={badge.id} className="flex items-start justify-between gap-3 rounded-lg border border-border p-3">
                  <div>
                    <p className="font-medium text-foreground">{badge.name}</p>
                    {badge.description && <p className="mt-1 text-xs text-muted-foreground">{badge.description}</p>}
                    <p className="mt-1 text-xs font-medium text-primary">{badge.points} pts</p>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete "${badge.name}"? This cannot be undone.`)) {
                        deleteBadge(badge.id);
                      }
                    }}
                    disabled={isDeleting && deletingId === badge.id}
                    aria-label={`Delete ${badge.name}`}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
