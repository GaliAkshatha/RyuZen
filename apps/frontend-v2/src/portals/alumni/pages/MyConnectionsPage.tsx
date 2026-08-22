import { UserCheck } from "lucide-react";

import { Card, CardContent } from "@/shared/ui/Card";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { useMyConnections } from "@/domains/connections/hooks/useMyConnections";

export function MyConnectionsPage() {
  const { data: connections, isLoading, isError, error, refetch } = useMyConnections();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">My Connections</h1>
        <p className="text-sm text-muted-foreground">People you're connected with.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : !connections || connections.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="No connections yet"
          description="Find people and send a request to start building your network."
        />
      ) : (
        <div className="flex flex-col gap-2">
          {connections.map((c) => (
            <Card key={c.connectionRequestId}>
              <CardContent className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.role}</p>
                </div>
                {c.connectedSince && (
                  <p className="text-xs text-muted-foreground">
                    Connected {new Date(c.connectedSince).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
