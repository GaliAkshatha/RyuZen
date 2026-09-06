import { Link } from "react-router-dom";
import { Users2 } from "lucide-react";

import { Card, CardContent } from "@/shared/ui/Card";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { useClubs } from "@/domains/clubs/hooks/useClubs";
import { ClubStatus } from "@/domains/clubs/club.types";

/**
 * Real gap filled: clubs existed (backend + org-admin management UI)
 * with no way for a student to ever actually browse or view one -
 * membership is admin-managed, but a student should still be able to
 * see what clubs exist and what they're doing. Read-only by design;
 * joining/leaving isn't self-service (confirmed real - AddClubMember
 * is ORG_ADMIN/SUPER_ADMIN only), matching the backend's own rule.
 */
export function ClubsListPage() {
  const { data: clubs, isLoading } = useClubs();

  const activeClubs = (clubs ?? []).filter((c) => c.status === ClubStatus.ACTIVE);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Clubs</h1>
        <p className="text-sm text-muted-foreground">Campus clubs and what they're up to.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : activeClubs.length === 0 ? (
        <EmptyState icon={Users2} title="No clubs yet" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeClubs.map((club) => (
            <Link key={club.id} to={`/student/clubs/${club.id}`}>
              <Card className="h-full transition-colors hover:border-primary/40">
                <CardContent className="flex flex-col gap-2 pt-6">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                      {club.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{club.name}</p>
                      <p className="text-xs text-muted-foreground">{club.code}</p>
                    </div>
                  </div>
                  {club.description && <p className="line-clamp-2 text-xs text-muted-foreground">{club.description}</p>}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
