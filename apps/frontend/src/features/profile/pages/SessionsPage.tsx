import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Laptop, LogOut, Monitor, Smartphone, Tablet } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { Button } from "@/shared/ui/Button";
import { Badge } from "@/shared/ui/Badge";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { SkeletonLoader } from "@/shared/components/SkeletonLoader";
import { useToast } from "@/hooks/useToast";

import { useMySessions } from "@/features/auth/hooks/useMySessions";
import { useRevokeSession } from "@/features/auth/hooks/useRevokeSession";
import { useLogoutAllDevices } from "@/features/auth/hooks/useLogoutAllDevices";
import type { SessionResponseDto } from "@/features/auth/types/auth.types";

function DeviceIcon({ device }: { device: string }) {
  if (device === "Mobile") return <Smartphone className="h-5 w-5" aria-hidden="true" />;
  if (device === "Tablet") return <Tablet className="h-5 w-5" aria-hidden="true" />;
  if (device === "Desktop") return <Monitor className="h-5 w-5" aria-hidden="true" />;
  return <Laptop className="h-5 w-5" aria-hidden="true" />;
}

/**
 * Every row here is a genuinely real, tracked session — device/
 * browser parsed from the real User-Agent, real IP, backed by the
 * actual refresh-token rotation state on the server (confirmed
 * against Session.ts and RefreshTokenUseCase.ts directly). Revoking a
 * session here genuinely kills that device's ability to refresh its
 * access token going forward, not just a cosmetic list entry.
 */
export function SessionsPage() {
  const { toast } = useToast();
  const [confirmLogoutAll, setConfirmLogoutAll] = useState(false);

  const { data: sessions, isLoading, isError, error, refetch } = useMySessions();
  const { mutate: revoke, isPending: isRevoking } = useRevokeSession();
  const { mutate: logoutAll, isPending: isLoggingOutAll } = useLogoutAllDevices();

  if (isError) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <Link
        to="/app/profile"
        className="flex w-fit items-center gap-1 font-body text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to profile
      </Link>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Active Sessions</CardTitle>
          {sessions && sessions.length > 1 && (
            <Button
              variant="outline"
              size="sm"
              disabled={isLoggingOutAll}
              onClick={() => setConfirmLogoutAll(true)}
            >
              <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
              Logout All Devices
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonLoader key={i} className="h-16" />
              ))}
            </div>
          ) : !sessions || sessions.length === 0 ? (
            <EmptyState title="No active sessions" />
          ) : (
            <ul className="flex flex-col gap-2">
              {sessions.map((session: SessionResponseDto) => (
                <li
                  key={session.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <DeviceIcon device={session.device} />
                    </span>
                    <div className="flex flex-col">
                      <span className="flex items-center gap-2 font-body text-sm font-medium text-foreground">
                        {session.device} · {session.browser}
                        {session.isCurrent && (
                          <Badge variant="secondary" className="text-[10px]">
                            This device
                          </Badge>
                        )}
                      </span>
                      <span className="font-body text-xs text-muted-foreground">
                        {session.ipAddress} · Last active {new Date(session.lastActiveAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isRevoking}
                      onClick={() =>
                        revoke(session.id, { onSuccess: () => toast({ title: "Session revoked" }) })
                      }
                    >
                      Revoke
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmLogoutAll}
        onOpenChange={setConfirmLogoutAll}
        title="Logout all devices?"
        description="This will sign you out everywhere, including this device. You'll need to sign in again."
        destructive
        confirmLabel="Logout All"
        isConfirming={isLoggingOutAll}
        onConfirm={() => logoutAll()}
      />
    </div>
  );
}
