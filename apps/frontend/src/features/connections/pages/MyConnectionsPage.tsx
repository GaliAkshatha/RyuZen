import { useNavigate, Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";

import { Card, CardContent } from "@/shared/components/Card";
import { Button } from "@/shared/ui/Button";
import { Spinner } from "@/shared/components/Spinner";
import { ErrorState } from "@/shared/components/ErrorState";
import { EmptyState } from "@/shared/components/EmptyState";

import { useMyConnections } from "@/features/connections/hooks/useMyConnections";
import { useCreateChat } from "@/features/chat/hooks/useCreateChat";

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function MyConnectionsPage() {
  const navigate = useNavigate();
  const { data: connections, isLoading, isError, error, refetch } = useMyConnections();
  const { mutate: createChat, isPending } = useCreateChat();

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

  if (!connections || connections.length === 0) {
    return (
      <EmptyState
        title="No connections yet"
        description="Connect with people from the People tab to see them here."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {connections.map((connection) => (
        <Card key={connection.connectionRequestId}>
          <CardContent className="flex items-center gap-3 py-4">
            <Link
              to={`/app/portfolio/${connection.userId}`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-body text-sm font-semibold text-primary"
            >
              {initialsOf(connection.name)}
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                to={`/app/portfolio/${connection.userId}`}
                className="truncate font-body text-sm font-medium text-foreground hover:text-primary hover:underline"
              >
                {connection.name}
              </Link>
              <p className="font-body text-xs capitalize text-muted-foreground">
                {connection.role.toLowerCase().replace(/_/g, " ")}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={() =>
                createChat(
                  { participantIds: [connection.userId] },
                  { onSuccess: (chat) => navigate(`/app/chat/${chat.id}`) },
                )
              }
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
