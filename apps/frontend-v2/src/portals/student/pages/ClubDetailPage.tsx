import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users2, Calendar, Trophy, Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { useClub } from "@/domains/clubs/hooks/useClub";
import { useClubMembers } from "@/domains/clubs/hooks/useClubMembers";
import { useFacultyMember } from "@/domains/faculty/hooks/useFacultyMember";
import { useEvents } from "@/domains/events/hooks/useEvents";
import { EventStatus } from "@/domains/events/event.types";

/**
 * Real linked events, not invented "achievements" - filtered from
 * the same real events list every other event page uses, by this
 * club's real id (Event.clubId, confirmed to exist on the backend
 * entity). Upcoming/published events are "what's going on";
 * completed ones are "what they've done" - both genuinely earned
 * from real event status/dates, not a separate fabricated field.
 */
export function ClubDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: club, isLoading } = useClub(id ?? "");
  const { data: members } = useClubMembers(id ?? "");
  const { data: advisor } = useFacultyMember(club?.facultyAdvisorId ?? "");
  const { data: allEvents } = useEvents();

  const clubEvents = (allEvents ?? []).filter((e) => e.clubId === id);
  const upcomingEvents = clubEvents.filter(
    (e) => e.status === EventStatus.PUBLISHED || e.status === EventStatus.DRAFT,
  );
  const pastEvents = clubEvents.filter((e) => e.status === EventStatus.COMPLETED);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!club) {
    return <EmptyState title="Club not found" />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link to="/student/clubs" className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-base font-bold text-primary">
            {club.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{club.name}</h1>
            <p className="text-xs text-muted-foreground">{club.code}</p>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          {club.description && <p className="text-sm text-foreground">{club.description}</p>}
          <div className="flex flex-wrap gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Users2 className="h-3.5 w-3.5" aria-hidden="true" />
              {members?.length ?? 0} member{members?.length === 1 ? "" : "s"}
            </span>
            {advisor && (
              <span>
                Faculty Advisor: {advisor.designation} ({advisor.employeeId})
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
            What's going on
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length === 0 ? (
            <EmptyState icon={Calendar} title="No upcoming activity right now" />
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="py-2.5 text-sm">
                  <p className="font-medium text-foreground">{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.startDate).toLocaleDateString()} {event.venue && `· ${event.venue}`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-success" aria-hidden="true" />
            What they've done
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pastEvents.length === 0 ? (
            <EmptyState icon={Trophy} title="No completed events yet" />
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {pastEvents.map((event) => (
                <div key={event.id} className="py-2.5 text-sm">
                  <p className="font-medium text-foreground">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{new Date(event.startDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
