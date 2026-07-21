import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MapPin } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";
import { useAuth } from "@/contexts/AuthContext";

import { useEvents } from "@/features/events/hooks/useEvents";
import { canManageEvents } from "@/features/events/utils/eventPermissions";

export function EventListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: events, isLoading, isError, error, refetch } = useEvents();
  const [search, setSearch] = useState("");

  const filtered = (events ?? []).filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()),
  );

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-foreground">Events</h1>
        {canManageEvents(user?.role) && (
          <Button onClick={() => navigate("/app/events/new")}>
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            New Event
          </Button>
        )}
      </div>

      <Input
        placeholder="Search events…"
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
          title="No events yet"
          description={
            canManageEvents(user?.role)
              ? "Create your first event to get started."
              : "No events are available right now. Check back later."
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((event) => (
            <Card
              key={event.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/app/events/${event.id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") navigate(`/app/events/${event.id}`);
              }}
            >
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <CardTitle className="text-base">{event.title}</CardTitle>
                <StatusBadge status={event.status} />
              </CardHeader>
              <CardContent className="flex flex-col gap-1 font-body text-sm text-muted-foreground">
                <span>{new Date(event.startDate).toLocaleDateString()}</span>
                {event.venue && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    {event.venue}
                  </span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
