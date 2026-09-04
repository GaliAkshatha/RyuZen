import { Award } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { useMyBadges } from "@/domains/badges/hooks/useMyBadges";

/** Real gap filled: a student had no way to see badges awarded to them anywhere in the app. */
export function MyBadgesCard() {
  const { data: badges, isLoading } = useMyBadges();

  if (isLoading) {
    return <Skeleton className="h-24 w-full" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-4 w-4 text-primary" aria-hidden="true" />
          Badges
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!badges || badges.length === 0 ? (
          <EmptyState icon={Award} title="No badges earned yet" />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {badges.map((sb) => (
              <div key={sb.id} className="flex flex-col items-center gap-1.5 rounded-lg border border-border p-3 text-center">
                <Award className="h-6 w-6 text-warning" aria-hidden="true" />
                <p className="text-xs font-semibold text-foreground">{sb.badge?.name ?? "Badge"}</p>
                {sb.badge?.points !== undefined && <p className="text-[11px] text-muted-foreground">{sb.badge.points} pts</p>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
