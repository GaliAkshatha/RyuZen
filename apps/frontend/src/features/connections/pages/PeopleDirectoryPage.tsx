import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, MessageCircle, Clock, Check } from "lucide-react";

import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { Card, CardContent } from "@/shared/components/Card";
import { Spinner } from "@/shared/components/Spinner";
import { ErrorState } from "@/shared/components/ErrorState";
import { EmptyState } from "@/shared/components/EmptyState";
import { useToast } from "@/hooks/useToast";

import { usePeople } from "@/features/connections/hooks/usePeople";
import { useSendConnectionRequest } from "@/features/connections/hooks/useSendConnectionRequest";
import { useCreateChat } from "@/features/chat/hooks/useCreateChat";

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function PeopleDirectoryPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");

  const { data: people, isLoading, isError, error, refetch } = usePeople();
  const { mutate: sendRequest, isPending: sending } = useSendConnectionRequest();
  const { mutate: createChat, isPending: startingChat } = useCreateChat();

  const filtered = (people ?? []).filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Search people…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No people found" description="Try a different search." />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((person) => (
            <Card key={person.id}>
              <CardContent className="flex items-center gap-3 py-4">
                <Link
                  to={`/app/portfolio/${person.id}`}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-body text-sm font-semibold text-primary"
                >
                  {initialsOf(person.name)}
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/app/portfolio/${person.id}`}
                    className="truncate font-body text-sm font-medium text-foreground hover:text-primary hover:underline"
                  >
                    {person.name}
                  </Link>
                  <p className="font-body text-xs capitalize text-muted-foreground">
                    {person.role.toLowerCase().replace(/_/g, " ")}
                  </p>
                </div>
                {person.connectionStatus === "ACCEPTED" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={startingChat}
                    onClick={() =>
                      createChat(
                        { participantIds: [person.id] },
                        { onSuccess: (chat) => navigate(`/app/chat/${chat.id}`) },
                      )
                    }
                  >
                    <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                ) : person.connectionStatus === "PENDING_SENT" ? (
                  <Button size="sm" variant="ghost" disabled>
                    <Clock className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                    Pending
                  </Button>
                ) : person.connectionStatus === "PENDING_RECEIVED" ? (
                  <Button size="sm" variant="outline" disabled>
                    <Check className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                    Respond
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    disabled={sending}
                    onClick={() =>
                      sendRequest(
                        { toUserId: person.id },
                        { onSuccess: () => toast({ title: "Connection request sent" }) },
                      )
                    }
                  >
                    <UserPlus className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                    Connect
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
