import { Link } from "react-router-dom";
import { Users, UserCheck, Inbox, ChevronRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/Card";
import { StatCard } from "@/shared/components/StatCard";
import { useAuth } from "@/domains/auth/AuthContext";
import { usePeople } from "@/domains/connections/hooks/usePeople";
import { useMyConnections } from "@/domains/connections/hooks/useMyConnections";
import { usePendingRequests } from "@/domains/connections/hooks/usePendingRequests";

/**
 * Real Alumni home - counts from the real Connections domain, the
 * only substantive backend capability this role has today (confirmed
 * directly - Career Score/Resume/AI Interview/Leaderboard are all
 * genuinely STUDENT-scoped or explicitly limited to Student+Faculty
 * per product direction, not applicable to Alumni). Every stat card
 * and the connections preview link to their real destination.
 */
export function AlumniHomePage() {
  const { user } = useAuth();
  const { data: people } = usePeople();
  const { data: connections } = useMyConnections();
  const { data: pendingRequests } = usePendingRequests();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Welcome back, {user?.name?.split(" ")[0]}</h1>
        <p className="text-sm text-muted-foreground">Stay connected with your campus network.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard icon={Users} value={people?.length ?? 0} label="People to connect with" tone="primary" to="/alumni/connect" />
        <StatCard icon={UserCheck} value={connections?.length ?? 0} label="My connections" tone="success" to="/alumni/connect?tab=connections" />
        <StatCard icon={Inbox} value={pendingRequests?.length ?? 0} label="Pending requests" tone="warning" to="/alumni/connect?tab=requests" />
      </div>

      {connections && connections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent connections
              <Link to="/alumni/connect?tab=connections" className="text-xs font-medium text-primary">
                View all
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col divide-y divide-border">
            {connections.slice(0, 5).map((connection) => (
              <div key={connection.connectionRequestId} className="flex items-center justify-between py-2.5 text-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {connection.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{connection.name}</p>
                    <p className="text-xs text-muted-foreground">{connection.role}</p>
                  </div>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
