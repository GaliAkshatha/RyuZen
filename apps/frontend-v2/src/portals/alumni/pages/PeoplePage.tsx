import { Users, UserPlus, Clock, Check } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Card, CardContent } from "@/shared/ui/Card";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { usePeople } from "@/domains/connections/hooks/usePeople";
import { useSendConnectionRequest } from "@/domains/connections/hooks/useSendConnectionRequest";

export function PeoplePage() {
  const { data: people, isLoading, isError, error, refetch } = usePeople();
  const { mutate: sendRequest, isPending, variables } = useSendConnectionRequest();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Find People</h1>
        <p className="text-sm text-muted-foreground">Connect with students, faculty, and fellow alumni.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : !people || people.length === 0 ? (
        <EmptyState icon={Users} title="No one to connect with yet" />
      ) : (
        <div className="flex flex-col gap-2">
          {people.map((person) => {
            const isSendingThis = isPending && variables?.toUserId === person.id;
            return (
              <Card key={person.id}>
                <CardContent className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-foreground">{person.name}</p>
                    <p className="text-xs text-muted-foreground">{person.role}</p>
                  </div>
                  {person.connectionStatus === "ACCEPTED" ? (
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      Connected
                    </span>
                  ) : person.connectionStatus === "PENDING_SENT" ? (
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      Request sent
                    </span>
                  ) : person.connectionStatus === "PENDING_RECEIVED" ? (
                    <span className="text-xs text-muted-foreground">Check your requests</span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isSendingThis}
                      className="flex items-center gap-1.5"
                      onClick={() => sendRequest({ toUserId: person.id })}
                    >
                      <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
                      {isSendingThis ? "Sending…" : "Connect"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
