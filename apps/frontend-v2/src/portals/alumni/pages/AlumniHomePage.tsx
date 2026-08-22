import { Users, UserCheck, Inbox } from "lucide-react";

import { StatCard } from "@/shared/components/StatCard";
import { useAuth } from "@/domains/auth/AuthContext";
import { usePeople } from "@/domains/connections/hooks/usePeople";
import { useMyConnections } from "@/domains/connections/hooks/useMyConnections";
import { usePendingRequests } from "@/domains/connections/hooks/usePendingRequests";

/** Real Alumni home - counts from the real Connections domain, the only substantive backend capability this role has today. */
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
        <StatCard icon={Users} value={people?.length ?? 0} label="People to connect with" tone="primary" />
        <StatCard icon={UserCheck} value={connections?.length ?? 0} label="My connections" tone="success" />
        <StatCard icon={Inbox} value={pendingRequests?.length ?? 0} label="Pending requests" tone="warning" />
      </div>
    </div>
  );
}
