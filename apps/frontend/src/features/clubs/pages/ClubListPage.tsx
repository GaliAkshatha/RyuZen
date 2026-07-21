import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";
import { useAuth } from "@/contexts/AuthContext";

import { useClubs } from "@/features/clubs/hooks/useClubs";
import { canManageClubs } from "@/features/clubs/utils/clubPermissions";

export function ClubListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: clubs, isLoading, isError, error, refetch } = useClubs();
  const [search, setSearch] = useState("");

  const filtered = (clubs ?? []).filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-foreground">Clubs</h1>
        {canManageClubs(user?.role) && (
          <Button onClick={() => navigate("/app/clubs/new")}>
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            New Club
          </Button>
        )}
      </div>

      <Input
        placeholder="Search clubs…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonLoader key={i} className="h-28" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No clubs yet"
          description={
            canManageClubs(user?.role)
              ? "Create your first club to get started."
              : "No clubs are available right now. Check back later."
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((club) => (
            <Card
              key={club.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/app/clubs/${club.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") navigate(`/app/clubs/${club.id}`);
              }}
            >
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <CardTitle className="text-base">{club.name}</CardTitle>
                <StatusBadge status={club.status} />
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 font-body text-sm text-muted-foreground">
                  {club.description || "No description provided."}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
