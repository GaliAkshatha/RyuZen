import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Users, UserPlus, Clock, Check, X, UserCheck, Inbox, MessageCircle } from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/Tabs";
import { Button } from "@/shared/ui/Button";
import { Card, CardContent } from "@/shared/ui/Card";
import { Skeleton } from "@/shared/components/Skeleton";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { usePeople } from "@/domains/connections/hooks/usePeople";
import { useMyConnections } from "@/domains/connections/hooks/useMyConnections";
import { usePendingRequests } from "@/domains/connections/hooks/usePendingRequests";
import { useSendConnectionRequest } from "@/domains/connections/hooks/useSendConnectionRequest";
import { useRespondToConnectionRequest } from "@/domains/connections/hooks/useRespondToConnectionRequest";
import { useChats } from "@/domains/chat/hooks/useChats";
import { useCreateChat } from "@/domains/chat/hooks/useCreateChat";
import { ChatListPanel } from "@/domains/chat/components/ChatListPanel";
import { ChatWindow } from "@/domains/chat/components/ChatWindow";

/**
 * One real page, per explicit product direction - People, My
 * Connections, Requests, and Messages consolidated into a single
 * "Connect" experience with internal tabs, rather than four separate
 * sidebar entries pointing at what is fundamentally one social
 * feature. Shared verbatim across every role that has real backend
 * access to it (Student, Alumni - both confirmed identical real
 * capability).
 */
export function ConnectPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") ?? "people";
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const { data: people, isLoading: loadingPeople, isError: peopleError, error: peopleErr, refetch: refetchPeople } = usePeople();
  const { mutate: sendRequest, isPending: sending, variables } = useSendConnectionRequest();

  const { data: connections, isLoading: loadingConnections } = useMyConnections();

  const { data: requests, isLoading: loadingRequests } = usePendingRequests();
  const { mutate: respond, isPending: responding, variables: respondVars } = useRespondToConnectionRequest();

  const { data: chats } = useChats();
  const { mutate: createChat } = useCreateChat();

  function handleMessage(userId: string) {
    const existing = chats?.find((c) => c.participants.includes(userId));
    if (existing) {
      setActiveChatId(existing.id);
      setSearchParams({ tab: "messages" });
      return;
    }
    createChat(
      { participantIds: [userId] },
      { onSuccess: (chat) => { setActiveChatId(chat.id); setSearchParams({ tab: "messages" }); } },
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Connect</h1>
        <p className="text-sm text-muted-foreground">Find people, manage your network, and message your connections.</p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setSearchParams({ tab: v })}>
        <TabsList>
          <TabsTrigger value="people" className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />People</TabsTrigger>
          <TabsTrigger value="connections" className="flex items-center gap-1.5"><UserCheck className="h-3.5 w-3.5" />Connections</TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-1.5">
            <Inbox className="h-3.5 w-3.5" />Requests
            {(requests?.length ?? 0) > 0 && <span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">{requests?.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-1.5"><MessageCircle className="h-3.5 w-3.5" />Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="people">
          {loadingPeople ? (
            <div className="flex flex-col gap-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
          ) : peopleError ? (
            <ErrorState error={peopleErr} onRetry={() => refetchPeople()} />
          ) : !people || people.length === 0 ? (
            <EmptyState icon={Users} title="No one to connect with yet" />
          ) : (
            <div className="flex flex-col gap-2">
              {people.map((person) => {
                const isSendingThis = sending && variables?.toUserId === person.id;
                return (
                  <Card key={person.id}>
                    <CardContent className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-foreground">{person.name}</p>
                        <p className="text-xs text-muted-foreground">{person.role}</p>
                      </div>
                      {person.connectionStatus === "ACCEPTED" ? (
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Check className="h-3.5 w-3.5" />Connected</span>
                          <Button size="sm" variant="outline" onClick={() => handleMessage(person.id)}>Message</Button>
                        </div>
                      ) : person.connectionStatus === "PENDING_SENT" ? (
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" />Request sent</span>
                      ) : person.connectionStatus === "PENDING_RECEIVED" ? (
                        <span className="text-xs text-muted-foreground">Check requests</span>
                      ) : (
                        <Button size="sm" variant="outline" disabled={isSendingThis} className="flex items-center gap-1.5" onClick={() => sendRequest({ toUserId: person.id })}>
                          <UserPlus className="h-3.5 w-3.5" />{isSendingThis ? "Sending…" : "Connect"}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="connections">
          {loadingConnections ? (
            <div className="flex flex-col gap-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
          ) : !connections || connections.length === 0 ? (
            <EmptyState icon={UserCheck} title="No connections yet" description="Find people and send a request to start building your network." />
          ) : (
            <div className="flex flex-col gap-2">
              {connections.map((c) => (
                <Card key={c.connectionRequestId}>
                  <CardContent className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-foreground">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.role}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleMessage(c.userId)}>Message</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests">
          {loadingRequests ? (
            <div className="flex flex-col gap-2">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
          ) : !requests || requests.length === 0 ? (
            <EmptyState icon={Inbox} title="No pending requests" />
          ) : (
            <div className="flex flex-col gap-2">
              {requests.map((req) => {
                const isRespondingThis = responding && respondVars?.id === req.id;
                return (
                  <Card key={req.id}>
                    <CardContent className="flex items-center justify-between py-3">
                      <p className="font-medium text-foreground">{req.fromUserName}</p>
                      <div className="flex gap-2">
                        <Button size="sm" disabled={isRespondingThis} className="flex items-center gap-1.5" onClick={() => respond({ id: req.id, payload: { accept: true } })}>
                          <Check className="h-3.5 w-3.5" />Accept
                        </Button>
                        <Button size="sm" variant="outline" disabled={isRespondingThis} className="flex items-center gap-1.5" onClick={() => respond({ id: req.id, payload: { accept: false } })}>
                          <X className="h-3.5 w-3.5" />Decline
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="messages">
          <div className="grid grid-cols-[220px_1fr] gap-0 overflow-hidden rounded-lg border border-border" style={{ height: "520px" }}>
            <div className="border-r border-border">
              <ChatListPanel activeChatId={activeChatId} onSelect={setActiveChatId} />
            </div>
            <div>
              {activeChatId ? (
                <ChatWindow chatId={activeChatId} />
              ) : (
                <EmptyState icon={MessageCircle} title="Select a conversation" className="h-full justify-center" />
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
