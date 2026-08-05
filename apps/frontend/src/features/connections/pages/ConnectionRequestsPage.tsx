import { Check, X } from "lucide-react";

import { Card, CardContent } from "@/shared/components/Card";
import { Button } from "@/shared/ui/Button";
import { Spinner } from "@/shared/components/Spinner";
import { ErrorState } from "@/shared/components/ErrorState";
import { EmptyState } from "@/shared/components/EmptyState";
import { useToast } from "@/hooks/useToast";

import { usePendingConnectionRequests } from "@/features/connections/hooks/usePendingConnectionRequests";
import { useRespondToConnectionRequest } from "@/features/connections/hooks/useRespondToConnectionRequest";

export function ConnectionRequestsPage() {
  const { toast } = useToast();
  const { data: requests, isLoading, isError, error, refetch } = usePendingConnectionRequests();
  const { mutate: respond, isPending } = useRespondToConnectionRequest();

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <EmptyState
        title="No pending requests"
        description="Connection requests sent to you will appear here."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {requests.map((request) => (
        <Card key={request.id}>
          <CardContent className="flex items-center justify-between gap-3 py-4">
            <p className="font-body text-sm font-medium text-foreground">
              {request.fromUserName} wants to connect
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                disabled={isPending}
                onClick={() =>
                  respond(
                    { requestId: request.id, payload: { accept: true } },
                    { onSuccess: () => toast({ title: "Connection accepted" }) },
                  )
                }
              >
                <Check className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() =>
                  respond(
                    { requestId: request.id, payload: { accept: false } },
                    { onSuccess: () => toast({ title: "Request declined" }) },
                  )
                }
              >
                <X className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                Decline
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
