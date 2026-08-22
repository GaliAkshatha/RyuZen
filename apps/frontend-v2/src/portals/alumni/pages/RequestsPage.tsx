import { Inbox, Check, X } from "lucide-react";

import { Button } from "@/shared/ui/Button";
import { Card, CardContent } from "@/shared/ui/Card";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { usePendingRequests } from "@/domains/connections/hooks/usePendingRequests";
import { useRespondToConnectionRequest } from "@/domains/connections/hooks/useRespondToConnectionRequest";

export function RequestsPage() {
  const { data: requests, isLoading, isError, error, refetch } = usePendingRequests();
  const { mutate: respond, isPending, variables } = useRespondToConnectionRequest();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Connection Requests</h1>
        <p className="text-sm text-muted-foreground">People who want to connect with you.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : !requests || requests.length === 0 ? (
        <EmptyState icon={Inbox} title="No pending requests" />
      ) : (
        <div className="flex flex-col gap-2">
          {requests.map((req) => {
            const isRespondingThis = isPending && variables?.id === req.id;
            return (
              <Card key={req.id}>
                <CardContent className="flex items-center justify-between py-3">
                  <p className="font-medium text-foreground">{req.fromUserName}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      disabled={isRespondingThis}
                      className="flex items-center gap-1.5"
                      onClick={() => respond({ id: req.id, payload: { accept: true } })}
                    >
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isRespondingThis}
                      className="flex items-center gap-1.5"
                      onClick={() => respond({ id: req.id, payload: { accept: false } })}
                    >
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                      Decline
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
