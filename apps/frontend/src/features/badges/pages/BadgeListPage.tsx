import { useNavigate } from "react-router-dom";
import { Plus, Award } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";
import { useAuth } from "@/contexts/AuthContext";

import { useBadges } from "@/features/badges/hooks/useBadges";
import { canManageBadgeCatalog } from "@/features/badges/utils/badgePermissions";

export function BadgeListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: badges, isLoading, isError, error, refetch } = useBadges();

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-foreground">Badges</h1>
        {canManageBadgeCatalog(user?.role) && (
          <Button onClick={() => navigate("/app/badges/new")}>
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            New Badge
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonLoader key={i} className="h-28" />
          ))}
        </div>
      ) : !badges || badges.length === 0 ? (
        <EmptyState
          title="No badges yet"
          description={
            canManageBadgeCatalog(user?.role)
              ? "Create the first badge in the catalog."
              : "No badges are available right now."
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {badges.map((badge) => (
            <Card
              key={badge.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/app/badges/${badge.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") navigate(`/app/badges/${badge.id}`);
              }}
            >
              <CardHeader className="flex-row items-center gap-2 space-y-0">
                <Award className="h-5 w-5 text-warning" aria-hidden="true" />
                <CardTitle className="text-base">{badge.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-1">
                <p className="line-clamp-2 font-body text-sm text-muted-foreground">
                  {badge.description || "No description provided."}
                </p>
                <p className="font-body text-xs text-muted-foreground">{badge.points} pts</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
