import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { ActivityCard } from "@/shared/components/ActivityCard";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";
import { PageAtmosphere } from "@/shared/components/PageAtmosphere";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { useAuth } from "@/contexts/AuthContext";

import { useActivities } from "@/features/activities/hooks/useActivities";
import { canManageActivities } from "@/features/activities/utils/activityPermissions";

export function ActivityListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: activities, isLoading, isError, error, refetch } = useActivities();
  const [search, setSearch] = useState("");

  const filtered = (activities ?? []).filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()),
  );

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="relative flex flex-col gap-6">
      <PageAtmosphere variant="particles" />

      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-foreground">Activities</h1>
        {canManageActivities(user?.role) && (
          <Button onClick={() => navigate("/app/activities/new")}>
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            New Activity
          </Button>
        )}
      </div>

      <Input
        placeholder="Search activities…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonLoader key={i} className="h-32" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No activities yet"
          description={
            canManageActivities(user?.role)
              ? "Create your first activity to get started."
              : "No activities are available right now. Check back later."
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((activity, i) => (
            <ScrollReveal key={activity.id} delay={Math.min(i, 8) * 50}>
              <ActivityCard
                title={activity.title}
                type={activity.type}
                status={activity.status}
                points={activity.points}
                endDate={new Date(activity.endDate).toLocaleDateString()}
                onClick={() => navigate(`/app/activities/${activity.id}`)}
              />
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}
